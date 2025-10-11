'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getAllRegistrations } from '@/lib/actions/registration.actions'
import Image from 'next/image'

export default function OrdersPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
      return
    }

    const checkAdminAndFetch = async () => {
      if (!user) return

      try {
        // Check if user is admin
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId: user.id }),
        })
        const userData = await response.json()

        if (!userData || userData.role !== 'admin') {
          router.push('/')
          return
        }

        // Fetch all registrations
        setLoading(true)
        const result = await getAllRegistrations(currentPage, limit)
        setData(result)
      } catch (error) {
        console.error(error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      checkAdminAndFetch()
    }
  }, [currentPage, user, isLoaded, router])

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (!data || !data.registrations || data.registrations.length === 0) return <div className="text-center mt-10">No registrations available</div>

  const { registrations, totalPages } = data

  // Group registrations by event
  const registrationsByEvent: Record<string, any[]> = {}
  registrations.forEach((reg: any) => {
    const eventId = reg.event._id
    if (!registrationsByEvent[eventId]) registrationsByEvent[eventId] = []
    registrationsByEvent[eventId].push(reg)
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Event Registrations</h1>

        {Object.values(registrationsByEvent).map((eventRegs: any[]) => {
          const event = eventRegs[0].event
          return (
            <div key={event._id} className="bg-white shadow-md rounded-lg p-4 mb-8 border border-indigo-200">
              <div className="flex items-center mb-4">
                {event.imageUrl && (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={150}
                    height={100}
                    className="object-cover rounded-lg mr-4"
                  />
                )}
                <div>
                  <p className="text-indigo-900 font-bold text-xl">{event.title}</p>
                  <p className="text-indigo-800 mt-1">Participants: {eventRegs.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-indigo-200">
                  <thead>
                    <tr className="bg-indigo-100 text-indigo-900">
                      <th className="px-3 py-2 border border-indigo-200 text-left">Name</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">Email</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">ID</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">University</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">Department</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">Year</th>
                      <th className="px-3 py-2 border border-indigo-200 text-left">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegs.map((reg: any) => (
                      <tr key={reg._id} className="hover:bg-indigo-50">
                        <td className="px-3 py-2 border border-indigo-200">{reg.user.firstName} {reg.user.lastName}</td>
                        <td className="px-3 py-2 border border-indigo-200">{reg.user.email}</td>
                        <td className="px-3 py-2 border border-indigo-200">{reg.additionalInfo?.id}</td>
                        <td className="px-3 py-2 border border-indigo-200">{reg.additionalInfo?.university}</td>
                        <td className="px-3 py-2 border border-indigo-200">{reg.additionalInfo?.department}</td>
                        <td className="px-3 py-2 border border-indigo-200">{reg.additionalInfo?.year}</td>
                        <td className="px-3 py-2 border border-indigo-200">{new Date(reg.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-indigo-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
