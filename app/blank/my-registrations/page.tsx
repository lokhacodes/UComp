import { auth } from '@clerk/nextjs/server'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/actions/user.actions'
import { getRegistrationsByUser } from '@/lib/actions/registration.actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MyRegistrationsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const userFromDB = await getUserByClerkId(userId)

  if (!userFromDB) {
    redirect('/')
  }

  const registrations = await getRegistrationsByUser(userFromDB._id)
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-lg rounded-b-lg">
        <div className="wrapper flex justify-between items-center py-4">
          <Link href="/" className="w-36">
            <Image 
              src="/assets/images/logo.svg" width={100} height={25}
              alt="UComp logo" 
            />
          </Link>
          <div className="flex w-32 justify-end gap-3">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full" size="lg">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">My Registered Events</h1>

        {registrations?.length === 0 ? (
          <p className="text-indigo-600">You have not registered for any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{registrations?.map((reg: any) => {
  // Use snapshot event data if original event is deleted (event field null)
  const eventTitle = reg.event?.title || reg.eventTitle || 'Event deleted'
  const eventImageUrl = reg.event?.imageUrl || reg.eventImageUrl
  const eventDescription = reg.event?.description || reg.eventDescription
  const eventLocation = reg.event?.location || reg.eventLocation
  const eventStartDateTime = reg.event?.startDateTime || reg.eventStartDateTime
  const eventEndDateTime = reg.event?.endDateTime || reg.eventEndDateTime
  const eventIsFree = reg.event?.isFree !== undefined ? reg.event.isFree : reg.eventIsFree
  const eventPrice = reg.event?.price || reg.eventPrice
  const eventId = reg.event?._id || ''

  return (
    <div
      key={reg._id}
      className="bg-white shadow-md rounded-xl p-4 border border-indigo-200 hover:shadow-lg transition-all duration-300
                 flex flex-col h-full"
    >
      {/* Event Image */}
      {eventImageUrl && (
        <div className="mb-4 h-48 relative">
          <Image
            src={eventImageUrl}
            alt={eventTitle}
            fill
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-indigo-900 mb-2">{eventTitle}</h2>
        {eventDescription && (
          <p className="text-indigo-700 mb-2 line-clamp-3">{eventDescription}</p>
        )}
        {eventLocation && (
          <p className="text-indigo-700 mb-2"><strong>Location:</strong> {eventLocation}</p>
        )}
        <p className="text-indigo-700 mb-2">
          <strong>Start:</strong> {new Date(eventStartDateTime).toLocaleString()}
        </p>
        <p className="text-indigo-700 mb-2">
          <strong>End:</strong> {new Date(eventEndDateTime).toLocaleString()}
        </p>
        <p className="text-indigo-700 mb-2">
          <strong>Price:</strong> {eventIsFree ? 'Free' : `$${eventPrice}`}
        </p>
        {!eventIsFree && eventId && (
          <div className="mt-4">
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href={`/blank/pay?eventId=${eventId}`}>
                Pay Now
              </Link>
            </Button>
          </div>
        )}
      </div>

      <p className="text-indigo-600 text-sm mt-4">
        <strong>Registered At:</strong> {new Date(reg.createdAt).toLocaleString()}
      </p>
    </div>
  )
})}
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow-lg rounded-t-lg py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
