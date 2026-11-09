'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { inviteAdmin, removeAdmin } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

type Profile = { id: string; full_name: string; role: string; email?: string }

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchAdmins() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setCurrentUserRole(myProfile?.role || '')
      }

      // Fetch all users who are admins or super_admins
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'super_admin'])
      
      if (data) setAdmins(data)
      setLoading(false)
    }
    fetchAdmins()
  }, [supabase])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setIsInviting(true)
    
    const result = await inviteAdmin(email, password)
    
    if (result.error) {
      alert(result.error)
    } else {
      alert('Admin added successfully!')
      setEmail('')
      setPassword('')
      router.refresh() // Refresh to show the new admin
      window.location.reload()
    }
    setIsInviting(false)
  }

  async function handleRemove(id: string) {
    if (!confirm('Are you sure you want to remove this admin? They will lose all access immediately.')) return
    const result = await removeAdmin(id)
    if (result.error) {
      alert(result.error)
    } else {
      setAdmins(admins.filter(a => a.id !== id))
    }
  }

  if (loading) return <div className="p-10 text-stone-500">Checking credentials...</div>

  // If the user is a normal admin, block them from seeing this page
  if (currentUserRole !== 'super_admin') {
    return (
      <div className="p-10 text-center bg-white border border-stone-200">
        <h2 className="text-2xl font-serif text-red-600 mb-2">Access Denied</h2>
        <p className="text-stone-500">Only the Super Admin can manage other administrators.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Manage Admins</h1>
        <p className="text-stone-500">Add a trusted partner to help manage the fleet, or remove them if needed.</p>
      </div>

      <form onSubmit={handleInvite} className="bg-white p-8 border border-stone-200 mb-12 space-y-4">
        <h2 className="font-serif text-2xl text-[#1B3B2F]">Invite New Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Temporary Password</label>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
        </div>
        <p className="text-xs text-stone-400">Share these credentials with the new admin. They can change their password later.</p>
        <button type="submit" disabled={isInviting} className="bg-[#1B3B2F] text-white px-8 py-3 text-sm hover:bg-[#9C6B4E] transition disabled:opacity-50">
          {isInviting ? 'Creating Admin...' : 'Add Admin'}
        </button>
      </form>

      <div className="bg-white border border-stone-200">
        <div className="p-6 border-b border-stone-200 bg-stone-50">
          <h2 className="font-serif text-xl text-[#1B3B2F]">Current Team</h2>
        </div>
        {admins.map(admin => (
          <div key={admin.id} className="flex justify-between items-center p-6 border-b border-stone-100 last:border-0">
            <div>
              <p className="font-medium text-[#1B3B2F]">{admin.full_name || 'Admin User'}</p>
              <p className="text-sm text-stone-500 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
            
            {/* Show the delete button ONLY for standard admins, never for the super_admin */}
            {admin.role === 'admin' && (
              <button onClick={() => handleRemove(admin.id)} className="text-red-600 text-sm hover:underline">
                Revoke Access
              </button>
            )}
            {admin.role === 'super_admin' && (
              <span className="text-xs bg-[#1B3B2F] text-white px-3 py-1 rounded-full">Owner</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}