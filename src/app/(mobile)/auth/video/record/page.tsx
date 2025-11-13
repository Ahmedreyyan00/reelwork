"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoRecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRecording(false);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setTimeRemaining(45);
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
        <div className="w-6 h-6 bg-[#2EC4B6] rounded-full flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5"/>
            <circle cx="6" cy="6" r="2" fill="white"/>
            <rect x="7" y="2" width="2" height="1" fill="white"/>
          </svg>
        </div>
        <p 
          className="text-[#1A1A1A]"
          style={{ 
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px'
          }}
        >
          30-45 seconds. Portrait video. Be friendly and clear.
        </p>
      </div>

      {/* Video Preview Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Placeholder for video feed */}
        <div className="w-full max-w-sm aspect-[9/16] bg-gray-900 rounded-lg flex items-center justify-center">
          {!isRecording ? (
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-white/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
              <p className="text-white/60" style={{ fontFamily: 'Inter', fontSize: '14px' }}>
                Camera preview will appear here
              </p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
                  {timeRemaining}s
                </p>
                <p className="text-white/60" style={{ fontFamily: 'Inter', fontSize: '12px' }}>
                  Recording...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="w-20 h-20 bg-[#2EC4B6] rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-[#2EC4B6] rounded-full"></div>
            </div>
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            <div className="w-8 h-8 bg-white rounded"></div>
          </button>
        )}
      </div>

      {/* Back Button */}
      <Link 
        href="/auth/video" 
        className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}


