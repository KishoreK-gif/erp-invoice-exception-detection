import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#e3dcd1]/90 backdrop-blur-md border-b border-[#b3b7b3]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-start">
        <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#414540]">
          INVOICE EXCEPTION DETECTION
        </span>
      </div>
    </header>
  );
}
