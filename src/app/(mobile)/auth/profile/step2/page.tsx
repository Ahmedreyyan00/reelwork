"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const roles = [
  "Wait Staff",
  "Kitchen Hand",
  "Retail Assistant",
  "Bartender",
  "Chef",
  "Barista",
  "Manager",
  "Team Member"
];

const experienceOptions = [
  "None",
  "0-1 years",
  "1-3 years",
  "3+ years"
];

export default function ProfileStep2Page() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>("");

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const isFormValid = selectedRoles.length > 0 && selectedExperience !== "";

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button and Progress */}
      <div className="mb-6">
        <Link href="/auth/profile/step1" className="inline-block mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div className="bg-[#2EC4B6] h-1 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>40%</span>
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
      <div className="flex-1 space-y-8 mb-8">
        {/* Roles */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            Roles (select all that apply)
          </h2>
          <div className="flex flex-wrap gap-3">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedRoles.includes(role)
                    ? "bg-[#2EC4B6] text-white border-[#2EC4B6]"
                    : "bg-white text-[#1A1A1A] border-gray-200"
                }`}
                style={{ 
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h2 
            className="text-lg font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Inter' }}
          >
            How much experience do you have?
          </h2>
          <div className="space-y-3">
            {experienceOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedExperience(option)}
                className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 text-left"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedExperience === option 
                    ? "border-[#2EC4B6]" 
                    : "border-gray-300"
                }`}>
                  {selectedExperience === option && (
                    <div className="w-3 h-3 bg-[#2EC4B6] rounded-full"></div>
                  )}
                </div>
                <span 
                  className="text-[#1A1A1A]"
                  style={{ 
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 400
                  }}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full pb-8">
        <Link href="/auth/profile/step3" className="block">
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


