import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      'https://vsvhkkalfziuyttwityc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdmhra2FsZnppdXl0dHdpdHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODcwMTYsImV4cCI6MjA2Nzc2MzAxNn0.p-fJO01t2--lAGT3KIXghVHA_IWp5L7XiK5D2XeV0C0'
    );

    console.log('Starting weekly challenge reset...');

    // Get current week start date
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1); // Monday
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Sunday

    // Get all users who don't have a current week challenge entry
    const { data: existingChallenges, error: fetchError } = await supabase
      .from('user_challenges')
      .select('user_id')
      .eq('challenge_type', 'weekly_rescue')
      .eq('week_start_date', currentWeekStart.toISOString().split('T')[0]);

    if (fetchError) {
      console.error('Error fetching existing challenges:', fetchError);
      throw fetchError;
    }

    const existingUserIds = existingChallenges?.map(c => c.user_id) || [];

    // Get all authenticated users (we'll need to create a profiles table or use auth metadata)
    // For now, we'll reset existing challenges and create new ones for users who have completed orders
    const { data: usersWithOrders, error: usersError } = await supabase
      .from('orders')
      .select('user_id')
      .not('user_id', 'in', `(${existingUserIds.map(id => `'${id}'`).join(',')})`);

    if (usersError) {
      console.error('Error fetching users with orders:', usersError);
    }

    const uniqueUserIds = [...new Set(usersWithOrders?.map(o => o.user_id) || [])];

    // Create new weekly challenge entries for users
    if (uniqueUserIds.length > 0) {
      const newChallenges = uniqueUserIds.map(userId => ({
        user_id: userId,
        challenge_type: 'weekly_rescue',
        current_count: 0,
        week_start_date: currentWeekStart.toISOString().split('T')[0],
        week_end_date: currentWeekEnd.toISOString().split('T')[0],
        completed: false,
        badge_awarded: false
      }));

      const { error: insertError } = await supabase
        .from('user_challenges')
        .insert(newChallenges);

      if (insertError) {
        console.error('Error creating new weekly challenges:', insertError);
        throw insertError;
      }

      console.log(`Created ${newChallenges.length} new weekly challenge entries`);
    }

    // Clean up old completed challenges (older than 4 weeks)
    const fourWeeksAgo = new Date(currentWeekStart);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const { error: cleanupError } = await supabase
      .from('user_challenges')
      .delete()
      .lt('week_start_date', fourWeeksAgo.toISOString().split('T')[0])
      .eq('completed', true);

    if (cleanupError) {
      console.error('Error cleaning up old challenges:', cleanupError);
      // Don't throw here, cleanup is not critical
    }

    console.log('Weekly challenge reset completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Weekly challenge reset completed',
        newChallenges: uniqueUserIds.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in weekly challenge reset:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});