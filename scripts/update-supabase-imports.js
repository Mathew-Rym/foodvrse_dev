#!/usr/bin/env node

/**
 * Update Supabase Client Imports
 * Replaces all hardcoded client imports with environment-based client
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { glob } from 'glob';

console.log('🔄 Updating Supabase client imports...\n');

// Files to update (excluding the client file itself)
const filesToUpdate = [
  'src/pages/Discover.tsx',
  'src/hooks/useRealTimeMetrics.ts',
  'src/components/GoogleOAuthHandler.tsx',
  'src/components/AddItemModal.tsx',
  'src/components/Analytics.tsx',
  'src/components/GoogleMapsLocationPicker.tsx',
  'src/components/ListingCard.tsx',
  'src/components/GameSection.tsx',
  'src/pages/Favorites.tsx',
  'src/components/MysteryBagDetailPopup.tsx',
  'src/components/ListingsGrid.tsx',
  'src/pages/BusinessDashboard.tsx',
  'src/components/OrderManager.tsx'
];

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(filePath => {
  try {
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = readFileSync(filePath, 'utf8');
    
    // Check if file contains the old import
    if (content.includes('@/integrations/supabase/client')) {
      // Replace the import
      const updatedContent = content.replace(
        /import\s+\{\s*supabase\s*\}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g,
        "import { supabase } from '@/lib/supabaseClient';"
      );
      
      // Write the updated content
      writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      updatedCount++;
    } else {
      console.log(`ℹ️  No update needed: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error updating ${filePath}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n🎉 Update complete!`);
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Test the application to ensure all imports work`);
console.log(`   2. Verify environment variables are loaded correctly`);
console.log(`   3. Check authentication flow`); 