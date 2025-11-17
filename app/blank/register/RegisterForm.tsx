'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createRegistration } from '@/lib/actions/registration.actions'
import { getEventById } from '@/lib/actions/event.actions'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Subevent } from '@/types'

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

  const [event, setEvent] = useState<any>(null)
  const [selectedSubevent, setSelectedSubevent] = useState<string>('')
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState<{ name: string; email: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(true)

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const eventData = await getEventById(eventId)
          setEvent(eventData)
        } catch (error) {
          console.error('Error fetching event:', error)
        } finally {
          setEventLoading(false)
        }
      }
    }
    fetchEvent()
  }, [eventId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...teamMembers]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setTeamMembers(updatedMembers)
  }

  const addTeamMember = () => {
    const selectedSubeventData = event?.subevents?.find((sub: any) => sub.name === selectedSubevent)
    const maxMembers = selectedSubeventData?.teamSize || 2
    if (teamMembers.length < maxMembers) { // -1 because the current user is also a member
      setTeamMembers([...teamMembers, {name: '', email: '' }])
    }
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
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
        const registrationData: any = {
          userId: userData._id,
          eventId,
          additionalInfo: formData,
        }

        if (selectedSubevent) {
          registrationData.subeventId = selectedSubevent
        }

        const selectedSubeventData = event?.subevents?.find((sub: any) => sub.name === selectedSubevent)
        if (selectedSubeventData?.competitionType === 'team') {
          registrationData.teamName = teamName
          registrationData.teamMembers = teamMembers
        }

        await createRegistration(registrationData)
        router.push('/blank/my-registrations')
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
          <Link href="/" className="w-36">
            <Image src="/assets/images/logo.svg" width={100} height={25} alt="UComp logo" />
          </Link>
          <div className="flex w-32 justify-end gap-3">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full" size="lg">
                <Link href="/sign-in"> Login </Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">Register for Event</h1>

        {eventLoading ? (
          <div className="text-center">Loading event details...</div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto space-y-6 border border-purple-200"
          >
            {/* Subevent Selection */}
            {event?.subevents && event.subevents.length > 0 && (
              <div>
                <Label htmlFor="subevent" className="text-purple-700 font-semibold">
                  Select Subevent
                </Label>
                <Select value={selectedSubevent} onValueChange={setSelectedSubevent}>
                  <SelectTrigger className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Choose a subevent" />
                  </SelectTrigger>
                  <SelectContent>
                    {event.subevents.map((subevent: any, index: number) => (
                      <SelectItem key={index} value={subevent.name}>
                        {subevent.name} ({subevent.competitionType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Team Name (only for team competitions) */}
            {selectedSubevent && event?.subevents?.find((sub: any) => sub.name === selectedSubevent)?.competitionType === 'team' && (
              <div>
                <Label htmlFor="teamName" className="text-purple-700 font-semibold">
                  Team Name
                </Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Team Members (only for team competitions) */}
            {selectedSubevent && event?.subevents?.find((sub: any) => sub.name === selectedSubevent)?.competitionType === 'team' && (
              <div>
                <Label className="text-purple-700 font-semibold">Team Members</Label>
                <div className="space-y-3 mt-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        
                        <Input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          required
                          className="rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Email"
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                          required
                          className="rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addTeamMember}
                    variant="outline"
                    className="w-full"
                  >
                    Add Team Member
                  </Button>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <Label htmlFor="id" className="text-purple-700 font-semibold">
                ID
              </Label>
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
              <Label htmlFor="university" className="text-purple-700 font-semibold">
                University
              </Label>
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
              <Label htmlFor="department" className="text-purple-700 font-semibold">
                Department
              </Label>
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
              <Label htmlFor="year" className="text-purple-700 font-semibold">
                Year
              </Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="mt-1 rounded-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-semibold transition-colors"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow-lg rounded-t-lg py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
