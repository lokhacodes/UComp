import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/actions/user.actions'
import { getRegistrationsByUser } from '@/lib/actions/registration.actions'

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
          <a href="/" className="text-xl font-bold text-indigo-600">UComp</a>
          <a href="/sign-out" className="text-primary-500 hover:text-primary-700 transition-colors">Logout</a>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">My Registrations</h1>
        <div className="space-y-6">
          {registrations?.map((reg: any) => (
            <div key={reg._id} className="bg-white shadow-md rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition-all duration-300">
              <p className="text-indigo-900 font-semibold text-lg mb-3"><strong>Event:</strong> {reg.event.title}</p>
              <p className="text-indigo-700 mb-2"><strong>ID:</strong> {reg.additionalInfo?.id}</p>
              <p className="text-indigo-700 mb-2"><strong>University:</strong> {reg.additionalInfo?.university}</p>
              <p className="text-indigo-700 mb-2"><strong>Department:</strong> {reg.additionalInfo?.department}</p>
              <p className="text-indigo-700 mb-2"><strong>Year:</strong> {reg.additionalInfo?.year}</p>
              <p className="text-indigo-600 text-sm"><strong>Registered At:</strong> {new Date(reg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow-lg rounded-t-lg py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
