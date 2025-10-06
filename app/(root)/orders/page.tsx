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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clerkId: user.id }),
        })
        const userData = await response.json()

        if (!userData || userData.role !== 'admin') {
          router.push('/')
          return
        }

        // Fetch registrations
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto p-6">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto p-6">
          <div className="text-center">No data available</div>
        </main>
      </div>
    )
  }

  const { registrations, total, totalPages } = data

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Registrations</h1>
        <p className="text-lg mb-6 text-indigo-600">Total Participants: <span className="font-bold">{total}</span></p>
        
        <div className="space-y-6">
          {registrations?.map((reg: any) => (
            <div key={reg._id} className="bg-white shadow-md rounded-lg p-6 border border-indigo-200 hover:shadow-lg transition-shadow">
              {/* Event Image */}
              {reg.event.imageUrl && (
                <div className="mb-4">
                  <Image
                    src={reg.event.imageUrl}
                    alt={reg.event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-indigo-900 font-semibold text-lg mb-2"><strong>Event:</strong> {reg.event.title}</p>
              <p className="text-indigo-800 mb-1"><strong>User:</strong> {reg.user.firstName} {reg.user.lastName} ({reg.user.email})</p>
              <p className="text-indigo-700 mb-1"><strong>ID:</strong> {reg.additionalInfo?.id}</p>
              <p className="text-indigo-700 mb-1"><strong>University:</strong> {reg.additionalInfo?.university}</p>
              <p className="text-indigo-700 mb-1"><strong>Department:</strong> {reg.additionalInfo?.department}</p>
              <p className="text-indigo-700 mb-1"><strong>Year:</strong> {reg.additionalInfo?.year}</p>
              <p className="text-indigo-600 text-sm"><strong>Registered At:</strong> {new Date(reg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-indigo-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-indigo-700">
              Page {currentPage} of {totalPages}
            </span>
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
