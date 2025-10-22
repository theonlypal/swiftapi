'use client';

import Image from 'next/image';

export function HeroDemo() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-200">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <p className="text-gray-600 font-mono text-sm">
              Demo placeholder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
