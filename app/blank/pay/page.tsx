"use client";

import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function PaymentPage() {
  const router = useRouter();

  const [paymentData, setPaymentData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      // Basic validation
      if (!paymentData.name || !paymentData.email || !paymentData.phone) {
        alert("Please fill in all fields before proceeding.");
        return;
      }

      setLoading(true);

      const { data } = await axios.post("/api/make-payment", paymentData);

      if (data?.url) {
        // Redirect to bKash payment page
        router.push(data.url);
      } else {
        alert(data?.message || "Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong while creating the payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
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

      {/* ================= PAYMENT SECTION ================= */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10 flex-grow">
        <div className="wrapper grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* LEFT SIDE: Form */}
          <div className="flex flex-col justify-center gap-6">
            <h1 className="h1-bold">Secure Payment Gateway</h1>
            <p className="p-regular-20 md:p-regular-24">
              Complete your registration with our secure bKash payment integration.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <Input
                value={paymentData.name}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, name: e.target.value })
                }
                type="text"
                placeholder="Full Name"
                className="input-field"
              />

              <Input
                value={paymentData.email}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, email: e.target.value })
                }
                type="email"
                placeholder="Email Address"
                className="input-field"
              />

              <Input
                value={paymentData.phone}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, phone: e.target.value })
                }
                type="tel"
                placeholder="Phone Number"
                className="input-field"
              />

              <Button
                onClick={handlePayment}
                className="button w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE: Illustration */}
          <div className="flex justify-center items-center">
            <Image
              src="/assets/images/pay.png"
              alt="Payment Illustration"
              width={600}
              height={600}
              className="max-h-[60vh] object-contain"
            />
          </div>
        </div>
      </section>

      <footer className="bg-white shadow w-full py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} UComp. All rights reserved.
      </footer>
    </div>
  );
}
