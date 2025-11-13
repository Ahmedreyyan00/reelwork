"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PhonePage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button and Progress */}
      <div className="mb-8">
        <Link href="/auth/welcome" className="inline-block mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div className="bg-[#2EC4B6] h-1 rounded-full" style={{ width: '10%' }}></div>
        </div>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-10 h-10 bg-[#2EC4B6] rounded-lg flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
        <h1 className="text-xl font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Inter' }}>ReelWork</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        <h2 
          className="text-2xl font-bold text-[#1A1A1A] text-center mb-2"
          style={{ fontFamily: 'Inter' }}
        >
          Sign In With Your Phone Number
        </h2>
        
        <p 
          className="text-gray-600 text-center mb-8"
          style={{ 
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px'
          }}
        >
          We'll send you a code to verify
        </p>

        {/* Phone Input */}
        <div className="w-full max-w-sm mb-4">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs">🇦🇺</div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 outline-none text-[#1A1A1A] placeholder:text-gray-400"
              style={{ 
                fontFamily: 'Inter',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <p 
          className="text-gray-500 text-center text-sm mb-auto"
          style={{ 
            fontFamily: 'Inter',
            fontSize: '12px',
            lineHeight: '16px'
          }}
        >
          Your number won't be shared publicly
        </p>
      </div>

      {/* Send Code Button */}
      <div className="w-full max-w-sm mx-auto pb-8">
        <Link href="/auth/verify" className="block">
          <button 
            className="w-full bg-[#B3B2B2] text-[#1A1A1A] font-semibold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
            disabled={!phone}
            style={{ 
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            Send Code
          </button>
        </Link>
      </div>
    </div>
  );
}


