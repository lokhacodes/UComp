"use client";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [paynetData, setPaynetData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const handlePayment = async () => {
    try {
      const { data } = await axios.post("/api/make-payment", paynetData);
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
  return (
    <div className="w-screen h-screen flex p-10">
      <div className="w-1/3 h-full flex justify-center items-center">
        
      </div>
      <div className="w-2/3 h-full flex flex-col justify-center items-center gap-5">
        <div className="w-2/3 h-auto flex flex-col gap-3">
          <h1 className="text-3xl font-bold">Bkash Payment Integration</h1>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3">
          <div className="w-80 h-auto flex flex-col justify-center items-center gap-3">
            <input onChange={(d) => setPaynetData({ ...paynetData, name: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Name" />
            <input onChange={(d) => setPaynetData({ ...paynetData, email: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Email" />
            <input onChange={(d) => setPaynetData({ ...paynetData, phone: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Phone Number" />
            <button onClick={() => handlePayment()} className="w-full h-10 rounded-lg bg-blue-500 text-white font-bold">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}