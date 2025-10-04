import { getEventsByUser } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs/server'
import { getUserByClerkId } from '@/lib/actions/user.actions'
import Link from 'next/link'
import Image from 'next/image'
import CategoryFilter from '@/components/shared/CategoryFilter'
import Search from '@/components/shared/Search'
import Collection from '@/components/shared/Collection'
import { SearchParamProps } from '@/types'
import { Button } from '@/components/ui/button'

export default async function BlankPage({ searchParams }: SearchParamProps) {
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="wrapper flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">UComp</h1>
            <Button asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to UComp</h2>
            <p>Please login to see your events.</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} UComp. All rights reserved.
        </footer>
      </div>
    )
  }

  const userFromDB = await getUserByClerkId(userId)

  if (!userFromDB) {
    return <div>Loading...</div>
  }

  // Fetch events created by admin (organizer)
  const eventsData = await getEventsByUser({ userId: userFromDB.clerkId, page: 1, limit: 10 })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="wrapper flex justify-between items-center py-4">
          <h1 className="text-xl font-bold">UComp</h1>
          <Button asChild>
            <Link href="/sign-in">Logout</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow wrapper py-8">
        <h2 className="text-2xl font-semibold mb-6">Events Created by Admin</h2>

        <div className="flex flex-col gap-6">
          {eventsData?.data && eventsData.data.length > 0 ? (
            eventsData.data.map((event: any) => (
              <div key={event._id} className="border rounded p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={event.imageUrl || '/assets/images/placeholder.png'}
                    alt={event.title}
                    width={100}
                    height={70}
                    className="object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Event Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
