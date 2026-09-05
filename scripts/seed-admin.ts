import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const ADMIN_EMAIL = 'abhaysinghrajput1685@gmail.com'

async function seedAdmin() {
  console.log(`Checking if user ${ADMIN_EMAIL} exists...`)

  // 1. Check auth.users
  const { data: users, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error("Error listing users:", listError)
    process.exit(1)
  }

  let user = users.users.find(u => u.email === ADMIN_EMAIL)

  if (!user) {
    console.log(`Creating user in auth.users...`)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      email_confirm: true, // Auto confirm
      user_metadata: { full_name: 'Super Admin' }
    })

    if (createError) {
      console.error("Error creating auth user:", createError)
      process.exit(1)
    }

    if (!newUser.user) {
      console.error("Failed to create user.")
      process.exit(1)
    }
    user = newUser.user
    console.log(`Created auth user with ID: ${user.id}`)
  } else {
    console.log(`Auth user exists with ID: ${user.id}`)
  }

  // 2. Upsert into profiles table
  console.log(`Ensuring profile has SUPER_ADMIN role...`)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      auth_user_id: user.id,
      email: ADMIN_EMAIL,
      full_name: 'Super Admin',
      platform_role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' })
    .select()
    .single()

  if (profileError) {
    console.error("Error updating profile:", profileError)
    process.exit(1)
  }

  console.log(`Successfully seeded/updated Super Admin profile!`)
  console.log(profile)
}

seedAdmin().catch(console.error)
