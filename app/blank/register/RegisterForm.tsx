'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRegistration } from '@/lib/actions/registration.actions'
import { useUser } from '@clerk/nextjs'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const { user } = useUser()

  const [formData, setFormData] = useState({
    id: '',
    university: '',
    department: '',
    year: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !eventId) return

    setLoading(true)
    try {
      // First get the user from DB using Clerk ID
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkId: user.id }),
      })
      const userData = await response.json()

      if (userData._id) {
        await createRegistration({
          userId: userData._id,
          eventId,
          additionalInfo: formData,
        })
        router.push('/my-registrations')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!eventId) return <div>Invalid event</div>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-100">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-lg rounded-b-lg">
        <div className="wrapper flex justify-between items-center py-4">
          <a href="/" className="text-xl font-bold text-purple-600">UComp</a>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2">
            <a href="/sign-out">Logout</a>
          </Button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">Register for Event</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 max-w-md mx-auto space-y-6 border border-purple-200">
          <div>
            <Label htmlFor="id" className="text-purple-700 font-semibold">ID</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="university" className="text-purple-700 font-semibold">University</Label>
            <Input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
              className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="department" className="text-purple-700 font-semibold">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="year" className="text-purple-700 font-semibold">Year</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-semibold transition-colors">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow-lg rounded-t-lg py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
