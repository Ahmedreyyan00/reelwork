// import { Button } from '@/components/ui/button'
// import React from 'react'

// const page = () => {
//   return (
//     <div className='bg-[#F7F8FA] w-full h-full'>

//          <div   className='flex  flex-col items-center justify-center '>

        
//         <img src="/reelwork.png" alt="bg" className='absolute  w-80 h-80 left-0 top-0  object-cover' />
//         <p className='[font-family:"Inter"] text-[14px] leading-5 font-medium tracking-[0]'>
//           Reel people. Reel fast. Reel work.
//         </p>
//          </div>
//       <Button variant='signup' className='absolute left-4 top-[751px]'>
//         Get Started
//       </Button>
//     </div>
//   )
// }

// export default page

import React from "react";

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-[#F7F8FA] px-6 py-10">
      {/* Centered Logo and Text */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <img
          src="/reelwork.png"
          alt="ReelWork Logo"
          className="w-24 h-24 mb-4 object-contain"
        />

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">ReelWork</h1>

        {/* Tagline */}
        <p className="text-gray-600 text-sm mt-2 text-center">
          Reel people. Reel fast. Reel work.
        </p>
      </div>

      {/* Get Started Button */}
      <button className="w-full bg-gray-300 text-gray-800 font-medium py-3 rounded-lg active:scale-[0.98] transition-all">
        Get Started
      </button>
    </div>
  );
};

export default SplashScreen;
