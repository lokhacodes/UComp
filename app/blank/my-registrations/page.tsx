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
                <Link href="/sign-in">
                  Login
                </Link>
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
          <div className="space-y-6 flex flex-wrap justify-center gap-6">
            {registrations?.map((reg: any) => (
              <div key={reg._id} className="bg-white shadow-md rounded-xl p-4 border border-indigo-200 hover:shadow-lg transition-all duration-300 max-w-[400px] w-full sm:w-[48%] md:w-[32%]">
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

                <h2 className="text-xl font-semibold text-indigo-900 mb-2">{reg.event.title}</h2>
                {reg.event.description && (
                  <p className="text-indigo-700 mb-2">{reg.event.description}</p>
                )}
                {reg.event.location && (
                  <p className="text-indigo-700 mb-2"><strong>Location:</strong> {reg.event.location}</p>
                )}
                <p className="text-indigo-700 mb-2">
                  <strong>Start:</strong> {new Date(reg.event.startDateTime).toLocaleString()}
                </p>
                <p className="text-indigo-700 mb-2">
                  <strong>End:</strong> {new Date(reg.event.endDateTime).toLocaleString()}
                </p>
                <p className="text-indigo-700 mb-2">
                  <strong>Price:</strong> {reg.event.isFree ? 'Free' : `$${reg.event.price}`}
                </p>
                <p className="text-indigo-600 text-sm">
                  <strong>Registered At:</strong> {new Date(reg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
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
