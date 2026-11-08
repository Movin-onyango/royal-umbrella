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

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Verify the user actually has the 'admin' role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Access denied. You do not have administrator privileges.')
      setLoading(false)
      return
    }

    // 3. Send them to the dashboard
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#1B3B2F] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#F7F5F2] p-10">
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

          {error && <p className="text-sm text-red-600 bg-red-50 p-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3B2F] text-white py-4 text-sm hover:bg-[#9C6B4E] transition"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}