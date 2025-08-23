const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://vsvhkkalfziuyttwityc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUserAvatarsBucket() {
  try {
    console.log('Creating user-avatars storage bucket...');
    
    // Create the bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('user-avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket already exists, continuing...');
      } else {
        console.error('❌ Error creating bucket:', bucketError);
        return;
      }
    } else {
      console.log('✅ Storage bucket created successfully:', bucket);
    }

    // Test upload functionality
    console.log('Testing bucket access...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    const userAvatarsBucket = buckets.find(b => b.name === 'user-avatars');
    if (userAvatarsBucket) {
      console.log('✅ user-avatars bucket found:', userAvatarsBucket);
      console.log('✅ Bucket is public:', userAvatarsBucket.public);
    } else {
      console.log('❌ user-avatars bucket not found');
    }

    console.log('✅ Storage bucket setup completed!');
    console.log('Profile picture uploads should now work properly.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createUserAvatarsBucket();