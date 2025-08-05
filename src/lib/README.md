# Supabase Client Setup

This directory contains the environment variable-based Supabase client configuration.

## Files

- `supabaseClient.js` - JavaScript version of the Supabase client
- `supabaseClient.ts` - TypeScript version with proper typing
- `supabaseExample.ts` - Example usage functions
- `README.md` - This documentation file

## Environment Variables

Make sure your `.env.local` file contains the following variables:

```env
VITE_SUPABASE_URL=https://vsvhkkalfziuyttwityc.supabase.co
VITE_SUPABASE_KEY=your_supabase_anon_key_here
```

## Usage

### JavaScript
```javascript
import { supabase } from './lib/supabaseClient'

// Example signup
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    console.error('Signup error:', error.message)
    return
  }

  console.log('Signed up:', data)
}
```

### TypeScript
```typescript
import { supabase } from './lib/supabaseClient'

// Example signin
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Signin error:', error.message)
    return { error }
  }

  console.log('Signed in:', data)
  return { data, error: null }
}
```

### Using Example Functions
```typescript
import { signUp, signIn, signInWithGoogle, signOut } from './lib/supabaseExample'

// Use the pre-built functions
const result = await signUp('user@example.com', 'password123')
```

## Features

- ✅ Environment variable configuration
- ✅ TypeScript support with proper typing
- ✅ Error handling
- ✅ Authentication functions
- ✅ Database operations
- ✅ Real-time subscriptions

## Testing

Run the test script to verify the setup:

```bash
node scripts/test-env-supabase.js
```

## Migration from Hardcoded Client

If you're migrating from the hardcoded client in `src/integrations/supabase/client.ts`, you can:

1. Replace imports:
   ```typescript
   // Old
   import { supabase } from '@/integrations/supabase/client'
   
   // New
   import { supabase } from '@/lib/supabaseClient'
   ```

2. The API remains the same, so no code changes are needed beyond the import.

## Security Notes

- The `VITE_SUPABASE_KEY` should be the **anon/public** key, not the service role key
- Environment variables prefixed with `VITE_` are exposed to the client
- Never commit sensitive keys to version control
- Use `.env.local` for local development and Vercel environment variables for production 