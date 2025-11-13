"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoPage() {
  const [hasVideo, setHasVideo] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col px-6 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/auth/profile/step3" className="inline-block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold text-[#1A1A1A] mb-2 text-center"
          style={{ fontFamily: 'Inter' }}
        >
          Show your personality
        </h1>
        <p 
          className="text-gray-600 text-center"
          style={{ 
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px'
          }}
        >
          A short video helps employers see the real you.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="flex-1 mb-6">
        <div className="w-full h-[400px] bg-[#E0F7FA] rounded-lg flex flex-col items-center justify-center">
          {!hasVideo ? (
            <>
              <div className="w-16 h-16 border-4 border-[#2EC4B6] rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L19.553 7.276C19.83 7.107 20.179 7 20.5 7C21.328 7 22 7.672 22 8.5V15.5C22 16.328 21.328 17 20.5 17C20.179 17 19.83 16.893 19.553 16.724L15 14V10Z" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="2" y="4" width="13" height="16" rx="2" stroke="#2EC4B6" strokeWidth="2"/>
                </svg>
              </div>
              <p 
                className="text-gray-500"
                style={{ 
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400
                }}
              >
                No video yet
              </p>
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg"></div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Link href="/auth/video/record" className="flex-1">
          <button 
            className="w-full bg-[#2EC4B6] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ 
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 6.66667V13.3333L13.3333 10L8.33333 6.66667Z" fill="white"/>
            </svg>
            Record Now
          </button>
        </Link>
        
        <button 
          className="flex-1 bg-white text-[#2EC4B6] font-semibold py-3 rounded-lg border-2 border-[#2EC4B6] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ 
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13.3333V6.66667M6.66667 10H13.3333" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16.6667 13.3333C16.6667 14.4384 15.7716 15.3333 14.6667 15.3333H5.33333C4.22827 15.3333 3.33333 14.4384 3.33333 13.3333V6.66667C3.33333 5.5616 4.22827 4.66667 5.33333 4.66667H14.6667C15.7716 4.66667 16.6667 5.5616 16.6667 6.66667V13.3333Z" stroke="#2EC4B6" strokeWidth="1.5"/>
          </svg>
          Upload Video
        </button>
      </div>

      {/* Tips Section */}
      <div className="bg-[#FFF4E6] border border-[#FFB84D] rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-[#FFB84D] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="flex-1">
            <p 
              className="font-semibold text-[#1A1A1A] mb-2"
              style={{ 
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              Keep it short and real — 30-45s max.
            </p>
            <p 
              className="text-[#1A1A1A] mb-2"
              style={{ 
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              Try answering:
            </p>
            <ul className="space-y-1 text-[#1A1A1A]" style={{ fontFamily: 'Inter', fontSize: '14px' }}>
              <li>👋 Hey there! Start with your name and what role you are after.</li>
              <li>😊 Smile and share why you love hospitality — show us your energy!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


