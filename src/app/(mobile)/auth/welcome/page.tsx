import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-[#2EC4B6] flex flex-col items-center justify-center px-6 py-10 overflow-hidden">
      {/* Decorative illustrations */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
        <div className="w-full h-full bg-[#2EC4B6] rounded-full blur-2xl" style={{ filter: 'brightness(1.2)' }}></div>
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-30">
        <div className="w-full h-full bg-[#2EC4B6] rounded-full blur-2xl" style={{ filter: 'brightness(1.2)' }}></div>
      </div>

      {/* Centered Logo and Text */}
      <div className="flex flex-col items-center justify-center flex-1 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="relative w-10 h-10">
            {/* White R icon with play button */}
            <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#2EC4B6] text-2xl font-bold">R</span>
            </div>
            {/* Play button overlay in negative space */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#2EC4B6] rounded-sm"></div>
          </div>
          <h1 
            className="text-2xl font-semibold text-white" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ReelWork
          </h1>
        </div>

        {/* Tagline */}
        <p 
          className="text-white text-center max-w-xs"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '0%'
          }}
        >
          Reel people. Reel fast. Reel work.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3 z-10 pb-8">
        <Link href="/auth/phone" className="block">
          <button 
            className="w-full bg-white text-[#FF6B35] font-semibold py-3 rounded-lg transition-all active:scale-[0.98]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            Get Started
          </button>
        </Link>
        
        <Link href="/auth/login" className="block">
          <button 
            className="w-full bg-[#2EC4B6] text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98]"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}

