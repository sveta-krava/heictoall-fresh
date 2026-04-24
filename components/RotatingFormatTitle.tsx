'use client';

import { useEffect, useState } from 'react';

const FORMATS = ['JPG', 'PNG', 'PDF'];

export default function RotatingFormatTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % FORMATS.length);
    }, 1000); // ← 1 second

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
      <span>Convert HEIC to </span>

      <span className="inline-block w-[4ch] text-left">
        <span className="transition-all duration-200">
          {FORMATS[index]}
        </span>
      </span>

      <span className="sr-only"> JPG, PNG, PDF</span>
    </h1>
  );
}