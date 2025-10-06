import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/actions/user.actions'
import { getAllRegistrations } from '@/lib/actions/registration.actions'

export default async function OrdersPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const userFromDB = await getUserByClerkId(userId)

  if (!userFromDB || userFromDB.role !== 'admin') {
    redirect('/')
  }

  const registrations = await getAllRegistrations()

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow">
        <div className="wrapper flex justify-between items-center py-4">
          <a href="/" className="text-xl font-bold">UComp</a>
          <a href="/sign-out" className="text-primary-500">Logout</a>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Registrations</h1>
        <div className="space-y-4">
          {registrations?.map((reg: any) => (
            <div key={reg._id} className="border p-4 rounded">
              <p><strong>Event:</strong> {reg.event.title}</p>
              <p><strong>User:</strong> {reg.user.firstName} {reg.user.lastName} ({reg.user.email})</p>
              <p><strong>ID:</strong> {reg.additionalInfo?.id}</p>
              <p><strong>University:</strong> {reg.additionalInfo?.university}</p>
              <p><strong>Department:</strong> {reg.additionalInfo?.department}</p>
              <p><strong>Year:</strong> {reg.additionalInfo?.year}</p>
              <p><strong>Registered At:</strong> {new Date(reg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
