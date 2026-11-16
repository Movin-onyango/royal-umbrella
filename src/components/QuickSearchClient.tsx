'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickSearchClient({ 
  initialStart, 
  initialEnd, 
  initialCounty 
}: { 
  initialStart?: string, 
  initialEnd?: string, 
  initialCounty?: string 
}) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  
  const [start, setStart] = useState(initialStart || '')
  const [end, setEnd] = useState(initialEnd || '')
  const [county, setCounty] = useState(initialCounty || 'all')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    // Build URL with parameters
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    if (county && county !== 'all') params.set('county', county)
    
    const query = params.toString()
    router.push(query ? `/fleet?${query}` : '/fleet')
  }

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 p-4 rounded-lg mb-12">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
        
        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Location</label>
          <select 
            value={county} 
            onChange={e => setCounty(e.target.value)}
            className="w-full bg-transparent border border-stone-300 dark:border-stone-700 text-[#1B3B2F] dark:text-white p-3 rounded text-sm focus:outline-none focus:border-[#9C6B4E]"
          >
            <option value="all">Any Location</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
            <option value="eldoret">Eldoret</option>
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Pickup Date</label>
          <input 
            type="date" 
            min={today}
            value={start}
            onChange={e => setStart(e.target.value)}
            className="w-full bg-transparent border border-stone-300 dark:border-stone-700 text-[#1B3B2F] dark:text-white p-3 rounded text-sm focus:outline-none focus:border-[#9C6B4E]"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Return Date</label>
          <input 
            type="date" 
            min={start || today}
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="w-full bg-transparent border border-stone-300 dark:border-stone-700 text-[#1B3B2F] dark:text-white p-3 rounded text-sm focus:outline-none focus:border-[#9C6B4E]"
          />
        </div>

        <button 
          type="submit"
          className="w-full md:w-auto bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] font-medium px-8 py-3 rounded hover:bg-[#9C6B4E] transition text-sm h-[46px]"
        >
          Update Search
        </button>
      </form>
    </div>
  )
}