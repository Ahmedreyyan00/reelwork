"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const availabilityOptions = [
  "Weekdays",
  "Weeknights",
  "Weekends",
  "Weekend Nights"
];

export default function ProfileStep3Page() {
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("ASAP");
  const [shortTermOnly, setShortTermOnly] = useState(false);

  const toggleAvailability = (option: string) => {
    setSelectedAvailability(prev => 
      prev.includes(option) 
        ? prev.filter(a => a !== option)
        : [...prev, option]
    );
  };

  const isFormValid = selectedAvailability.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button and Progress */}
      <div className="mb-6">
        <Link href="/auth/profile/step2" className="inline-block mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div className="bg-[#2EC4B6] h-1 rounded-full" style={{ width: '90%' }}></div>
          </div>
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>90%</span>
        </div>
      </div>

      {/* Title */}
      <h1 
        className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center"
        style={{ fontFamily: 'Inter' }}
      >
        Complete your profile
      </h1>

      {/* Form */}
      <div className="flex-1 space-y-6 mb-8">
        {/* Availability */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            Availability
          </h2>
          <div className="flex flex-wrap gap-3">
            {availabilityOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleAvailability(option)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedAvailability.includes(option)
                    ? "bg-[#2EC4B6] text-white border-[#2EC4B6]"
                    : "bg-white text-[#1A1A1A] border-gray-200"
                }`}
                style={{ 
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* When Can You Start */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            When can you start?
          </h2>
          <div className="relative">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Short Term Only Checkbox */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShortTermOnly(!shortTermOnly)}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              shortTermOnly 
                ? "bg-[#2EC4B6] border-[#2EC4B6]" 
                : "bg-white border-gray-300"
            }`}
          >
            {shortTermOnly && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6667 3.5L5.25 9.91667L2.33334 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <label 
            className="text-[#1A1A1A] cursor-pointer"
            style={{ 
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 400
            }}
          >
            I'm open to short-term only.
          </label>
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full pb-8">
        <Link href="/auth/video" className="block">
          <button 
            className="w-full bg-[#2EC4B6] text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
            disabled={!isFormValid}
            style={{ 
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}


