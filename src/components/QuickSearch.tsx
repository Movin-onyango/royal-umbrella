'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickSearch() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [county, setCounty] = useState('nairobi')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!start || !end) return
    
    // Redirect to the fleet page with the search parameters in the URL
    router.push(`/fleet?start=${start}&end=${end}&county=${county}`)
  }

  return (
    <div className="w-full bg-[#1A1A1A] border-y border-stone-800 p-4 shadow-2xl">
      <form onSubmit={handleSearch} className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-4">
        
        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Pickup Location</label>
          <select 
            value={county} 
            onChange={e => setCounty(e.target.value)}
            className="w-full bg-[#111111] border border-stone-700 text-white p-3 rounded text-sm focus:outline-none focus:border-[#E5C38A]"
          >
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
            <option value="eldoret">Eldoret</option>
            <option value="all">Any Location</option>
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Pickup Date</label>
          <input 
            type="date" 
            min={today}
            value={start}
            onChange={e => setStart(e.target.value)}
            required
            className="w-full bg-[#111111] border border-stone-700 text-white p-3 rounded text-sm focus:outline-none focus:border-[#E5C38A]"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase tracking-wider text-stone-400 mb-1 block">Return Date</label>
          <input 
            type="date" 
            min={start || today}
            value={end}
            onChange={e => setEnd(e.target.value)}
            required
            className="w-full bg-[#111111] border border-stone-700 text-white p-3 rounded text-sm focus:outline-none focus:border-[#E5C38A]"
          />
        </div>

        <button 
          type="submit"
          className="w-full md:w-auto bg-[#E5C38A] text-[#111111] font-medium px-8 py-3 rounded hover:bg-[#D4B37A] transition text-sm h-[46px]"
        >
          Find My Ride
        </button>
      </form>
    </div>
  )
}