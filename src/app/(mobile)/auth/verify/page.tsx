"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCodes = [...codes];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCodes[i] = char;
    });
    setCodes(newCodes);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const allFilled = codes.every(code => code !== "");

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/auth/phone" className="inline-block mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
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
          className="text-2xl font-bold text-[#1A1A1A] text-center mb-4"
          style={{ fontFamily: 'Inter' }}
        >
          Enter Verification Code
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
          We have sent a code to +9233737732
        </p>

        {/* Code Input Fields */}
        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-white border border-gray-200 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20"
              style={{ fontFamily: 'Inter' }}
            />
          ))}
        </div>

        <div className="mb-auto">
          <p className="text-gray-600 text-center">
            <span style={{ fontFamily: 'Inter', fontSize: '14px' }}>Didn't get a code? </span>
            <button className="text-[#2EC4B6] font-medium" style={{ fontFamily: 'Inter', fontSize: '14px' }}>
              Resend Code
            </button>
          </p>
        </div>
      </div>

      {/* Verify Button */}
      <div className="w-full max-w-sm mx-auto pb-8">
        <Link href="/auth/profile/step1" className="block">
          <button 
            className="w-full bg-[#B3B2B2] text-[#1A1A1A] font-semibold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
            disabled={!allFilled}
            style={{ 
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            Verify & Continue
          </button>
        </Link>
      </div>
    </div>
  );
}


