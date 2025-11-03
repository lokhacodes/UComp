"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="wrapper flex justify-between items-center py-4">
          <Link href="/" className="w-36">
            <Image
              src="/assets/images/logo.svg"
              width={100}
              height={25}
              alt="UComp logo"
            />
          </Link>

          <Link
            href="/blank/my-registrations"
            className="font-bold text-primary-500 hover:text-primary-700 hover:ring-2 hover:ring-primary-500 hover:ring-opacity-50 transition-all duration-200"
          >
            My Registrations
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

      {/* MAIN CONTENT */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10 flex-1">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          {/* LEFT SIDE - TEXT */}
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold text-green-600">Payment Successful!</h1>
            <p className="p-regular-20 md:p-regular-24 text-gray-700">
              Your payment has been processed successfully. Thank you for your
              purchase and trust in UComp!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="button w-full sm:w-fit">
                <Link href="/">Go Home</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="button w-full sm:w-fit"
              >
                <Link href="/blank/my-registrations">View Registrations</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE - IMAGE */}
          <Image
            src="/assets/images/hero.png"
            alt="Payment success illustration"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white shadow py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  );
}
