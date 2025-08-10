import Footer from "@/components/Shared/Footer"
import Header from "@/components/Shared/Header"
//import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
