import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use this ONLY in Server Components or API Routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function getProfileByUsername(username) {
  if (!username) return null;

  // 1. Try to match the email prefix
  const { data: byEmail } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .ilike('user_email', `${username}@%`)
    .limit(1)
    .maybeSingle()

  if (byEmail) return byEmail

  // 2. Try to match exact user_name
  const { data: byName } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .ilike('user_name', username)
    .limit(1)
    .maybeSingle()
    
  if (byName) return byName
  
  // 3. Try to match user_name where spaces in DB are hyphens in URL
  const unhyphenated = username.replace(/-/g, ' ')
  const { data: byHyphenatedName } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .ilike('user_name', unhyphenated)
    .limit(1)
    .maybeSingle()
    
  if (byHyphenatedName) return byHyphenatedName
  
  // 4. Try matching user_name with spaces removed
  const { data: allProfiles } = await supabaseAdmin
    .from('profiles')
    .select('*')
    
  if (allProfiles) {
    const matched = allProfiles.find(p => p.user_name && p.user_name.toLowerCase().replace(/\s+/g, '') === username.toLowerCase())
    if (matched) return matched
  }
  
  return null
}
