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
    <div className="min-h-screen flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow">
        <div className="wrapper flex justify-between items-center py-4">
          <a href="/" className="text-xl font-bold">UComp</a>
          <Button asChild>
            <a href="/sign-out">Logout</a>
          </Button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Register for Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
