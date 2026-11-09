'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function inviteAdmin(email: string, password: string) {
  // 1. Verify the person making the request is a super_admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    return { error: 'Only the Super Admin can invite new admins.' }
  }

  // 2. Use the admin client to create the user
  const adminClient = createAdminClient()
  
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm them so they can log in immediately
  })

  if (createError) return { error: createError.message }

  // 3. Update their profile role to 'admin'
  const { error: profileError } = await adminClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', newUser.user.id)

  if (profileError) return { error: profileError.message }

  return { success: true }
}

export async function removeAdmin(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    return { error: 'Only the Super Admin can remove admins.' }
  }

  const adminClient = createAdminClient()
  
  // Deleting the user from Auth automatically deletes their profile due to the cascading foreign key we set up earlier.
  const { error } = await adminClient.auth.admin.deleteUser(id)

  if (error) return { error: error.message }
  return { success: true }
}