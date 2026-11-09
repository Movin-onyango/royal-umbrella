'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    // 1. Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Wait for the session to be fully established in the browser
    // This is the magic step that fixes the Cloudflare cookie delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 3. Now check the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    // 4. Verify Admin status
    if (profileError || (profile?.role !== 'admin' && profile?.role !== 'super_admin')) {
      await supabase.auth.signOut()
      setError('Access denied. You do not have administrator privileges.')
      setLoading(false)
      return
    }

    // 5. Success! Navigate to the dashboard and refresh server components
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#1B3B2F] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#F7F5F2] p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#1B3B2F] mb-2">Royal Umbrella</h1>
          <p className="text-xs uppercase tracking-widest text-stone-500">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 border-l-2 border-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3B2F] text-white py-4 text-sm hover:bg-[#9C6B4E] transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}