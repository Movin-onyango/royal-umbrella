'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = { id: string; name: string; slug: string }
type Car = { 
  id: string; 
  name: string; 
  slug: string; 
  hero_image_url: string; 
  county: string; 
  price_per_day: number; 
  is_available: boolean; 
  categories: { name: string } | null;
  category_id: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  description: string;
}

export default function ManageCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [county, setCounty] = useState('nairobi')
  const [seats, setSeats] = useState('4')
  const [transmission, setTransmission] = useState('Automatic')
  const [fuelType, setFuelType] = useState('Petrol')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: carsData } = await supabase.from('cars').select('*, categories(name)').order('created_at', { ascending: false })
      const { data: catData } = await supabase.from('categories').select('*').order('display_order')
      
      if (carsData) setCars(carsData as unknown as Car[])
      if (catData && catData.length > 0) {
        setCategories(catData)
        if (!categoryId) setCategoryId(catData[0].id)
      }
      setLoading(false)
    }
    fetchData()
  }, [supabase, categoryId])

  async function refreshData() {
    const { data: carsData } = await supabase.from('cars').select('*, categories(name)').order('created_at', { ascending: false })
    if (carsData) setCars(carsData as unknown as Car[])
  }

  function resetForm() {
    setIsAdding(false)
    setEditingId(null)
    setName('')
    setPrice('')
    setDescription('')
    setFile(null)
    setSeats('4')
    setTransmission('Automatic')
    setFuelType('Petrol')
    setCounty('nairobi')
  }

  function handleEdit(car: Car) {
    setIsAdding(true)
    setEditingId(car.id)
    setName(car.name)
    setPrice(car.price_per_day.toString())
    setCategoryId(car.category_id)
    setCounty(car.county)
    setSeats(car.seats.toString())
    setTransmission(car.transmission)
    setFuelType(car.fuel_type)
    setDescription(car.description)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this vehicle? This cannot be undone.')) return
    const { error } = await supabase.from('cars').delete().eq('id', id)
    if (error) alert(error.message)
    else refreshData()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)

    let heroImageUrl = undefined

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('car-images').upload(fileName, file)
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message)
        setUploading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('car-images').getPublicUrl(fileName)
      heroImageUrl = urlData.publicUrl
    }

    // Removed 'any' and typed it properly
    const carData: Record<string, unknown> = {
      name,
      price_per_day: Number(price),
      category_id: categoryId,
      county,
      seats: Number(seats),
      transmission,
      fuel_type: fuelType,
      description,
    }
    
    if (heroImageUrl) carData.hero_image_url = heroImageUrl
    if (!editingId) {
      carData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      carData.is_available = true
    }

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('cars').update(carData).eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('cars').insert(carData)
      error = insertError
    }

    if (error) {
      alert('Error saving car: ' + error.message)
    } else {
      resetForm()
      refreshData()
    }
    setUploading(false)
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    await supabase.from('cars').update({ is_available: !currentStatus }).eq('id', id)
    refreshData()
  }

  if (loading) return <div className="p-10 text-stone-500">Loading vehicles...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Manage Cars</h1>
          <p className="text-stone-500">Add, edit, or remove vehicles.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="bg-[#1B3B2F] text-white px-6 py-3 text-sm hover:bg-[#9C6B4E] transition"
        >
          {isAdding ? 'Cancel' : '+ Add New Vehicle'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 border border-stone-200 mb-12">
          <h2 className="font-serif text-2xl text-[#1B3B2F] mb-6">{editingId ? 'Edit Vehicle' : 'Add a New Vehicle'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-stone-500">Car Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">Price per Day (KSh)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F] bg-white">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">County</label>
              <select value={county} onChange={e => setCounty(e.target.value)} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F] bg-white">
                <option value="nairobi">Nairobi</option>
                <option value="mombasa">Mombasa</option>
                <option value="kisumu">Kisumu</option>
                <option value="nakuru">Nakuru</option>
                <option value="eldoret">Eldoret</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">Seats</label>
              <input type="number" value={seats} onChange={e => setSeats(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">Transmission</label>
              <select value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F] bg-white">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500">Fuel Type</label>
              <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F] bg-white">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-stone-500">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider text-stone-500">Hero Image {editingId && '(Leave blank to keep current)'}</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-stone-300 p-3 mt-1 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#1B3B2F] file:text-white hover:file:bg-[#9C6B4E]" />
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={uploading} className="bg-[#1B3B2F] text-white px-8 py-3 text-sm hover:bg-[#9C6B4E] transition disabled:opacity-50 w-full md:w-auto">
                {uploading ? 'Saving...' : (editingId ? 'Update Vehicle' : 'Save Vehicle to Fleet')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-widest text-xs border-b border-stone-200">
            <tr>
              <th className="p-4 font-normal">Vehicle</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">County</th>
              <th className="p-4 font-normal">Price (KSh)</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-stone-50">
                <td className="p-4 flex items-center gap-4">
                  {car.hero_image_url ? (
                    <img src={car.hero_image_url} alt={car.name} className="w-16 h-12 object-cover" />
                  ) : (
                    <div className="w-16 h-12 bg-stone-200"></div>
                  )}
                  <span className="font-serif text-[#1B3B2F]">{car.name}</span>
                </td>
                <td className="p-4 text-stone-600">{car.categories?.name || 'Uncategorized'}</td>
                <td className="p-4 text-stone-600 capitalize">{car.county}</td>
                <td className="p-4 text-stone-600">{Number(car.price_per_day).toLocaleString()}</td>
                <td className="p-4">
                  <button onClick={() => toggleAvailability(car.id, car.is_available)} className={`px-3 py-1 text-xs rounded-full border transition ${car.is_available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {car.is_available ? 'Available' : 'Hidden'}
                  </button>
                </td>
                <td className="p-4 flex gap-4">
                  <button onClick={() => handleEdit(car)} className="text-[#1B3B2F] hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDelete(car.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}