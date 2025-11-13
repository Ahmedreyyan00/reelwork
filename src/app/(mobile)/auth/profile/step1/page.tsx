"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileStep1Page() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    suburb: "",
    postCode: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.suburb && formData.postCode;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button and Progress */}
      <div className="mb-6">
        <Link href="/auth/verify" className="inline-block mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div className="bg-[#2EC4B6] h-1 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>0%</span>
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
        {/* Personal Information */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            Personal Information
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            Location
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Suburb"
              value={formData.suburb}
              onChange={(e) => handleChange("suburb", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
            <input
              type="text"
              placeholder="Post Code"
              value={formData.postCode}
              onChange={(e) => handleChange("postCode", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 placeholder:text-gray-400"
              style={{ fontFamily: 'Inter', fontSize: '16px' }}
            />
            <p 
              className="text-gray-500 text-sm"
              style={{ 
                fontFamily: 'Inter',
                fontSize: '12px',
                lineHeight: '16px'
              }}
            >
              Used only to match local jobs, not shared publicly
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full pb-8">
        <Link href="/auth/profile/step2" className="block">
          <button 
            className="w-full bg-[#B3B2B2] text-[#1A1A1A] font-semibold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
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


