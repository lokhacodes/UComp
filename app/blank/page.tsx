import CategoryFilter from '@/components/shared/CategoryFilter'
import Collection from '@/components/shared/CollectionU'
import Search from '@/components/shared/Search'
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/actions/user.actions'
import Link from 'next/link'
import Image from 'next/image'
import { SearchParamProps } from '@/types'

export default async function BlankPage({ searchParams }: SearchParamProps) {
  const { userId } = await auth()

  // Redirect if not logged in
  if (!userId) {
    redirect('/sign-in')
  }

  const userFromDB = await getUserByClerkId(userId)

  if (!userFromDB) {
    return <div>Loading...</div>
  }

  // (optional) Only allow "user" roles here
  if (userFromDB.role === 'admin') {
    redirect('/')
  }

  const resolvedParams = await searchParams
  const page = Number(resolvedParams?.page) || 1
  const searchText = (resolvedParams?.query as string) || ''
  const category = (resolvedParams?.category as string) || ''

  // Fetch events
  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow">
        <div className="wrapper flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">UComp</Link>
          <Link href="/blank/my-registrations" className="font-bold text-primary-500 hover:text-primary-700 hover:ring-2 hover:ring-primary-500 hover:ring-opacity-50 transition-all duration-200">My Registrations</Link>
          <Button asChild>
            <Link href="/sign-out">Logout</Link>
          </Button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow">
        <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
          <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
            <div className="flex flex-col justify-center gap-8">
              <h1 className="h1-bold">
                Explore and Join Competitions Worldwide
              </h1>
              <p className="p-regular-20 md:p-regular-24">
                Discover events that match your skills and interests — just for you.
              </p>
              <Button size="lg" asChild className="button w-full sm:w-fit">
                <Link href="#events">Explore Now</Link>
              </Button>
            </div>

            <Image
              src="/assets/images/hero.png"
              alt="hero"
              width={1000}
              height={1000}
              className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
            />
          </div>
        </section>

        <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
          <h2 className="h2-bold">All Events</h2>

          <div className="flex w-full flex-col gap-5 md:flex-row">
            <Search />
            <CategoryFilter />
          </div>

          <Collection
            data={events?.data}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={events?.totalPages}
          />
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  )
}
