'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CustomerLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/account')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone }
        }
      })
      if (error) setError(error.message)
      else {
        setMessage('Account created! Please check your email to verify your account, or just log in.')
        setIsLogin(true)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-[#1A1A1A] border border-stone-800 p-10 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">
            {isLogin ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-stone-400">
            {isLogin ? 'Welcome back to Royal Umbrella.' : 'Booked with us before? Use the same email to activate your account.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#222222] border border-stone-700 text-white p-4 rounded-md text-sm focus:outline-none focus:border-[#E5C38A]"
              />
              <input
                type="tel"
                placeholder="Phone (e.g. +254...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-[#222222] border border-stone-700 text-white p-4 rounded-md text-sm focus:outline-none focus:border-[#E5C38A]"
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#222222] border border-stone-700 text-white p-4 rounded-md text-sm focus:outline-none focus:border-[#E5C38A]"
          />
          
          <input
            type="password"
            placeholder={isLogin ? "Password" : "Password (min. 6 characters)"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#222222] border border-stone-700 text-white p-4 rounded-md text-sm focus:outline-none focus:border-[#E5C38A]"
          />

          {error && <p className="text-red-500 text-sm text-center bg-red-900/20 p-3 rounded">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center bg-green-900/20 p-3 rounded">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E5C38A] text-[#111111] font-medium py-4 rounded-md text-sm hover:bg-[#D4B37A] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-400">
          {isLogin ? "No account yet? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            className="text-[#E5C38A] hover:underline"
          >
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  )
}