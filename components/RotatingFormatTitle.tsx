'use client';

import { useEffect, useState } from 'react';

const FORMATS = ['JPG', 'PNG', 'PDF'];

export default function RotatingFormatTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % FORMATS.length);
    }, 1600);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
      Convert HEIC to{' '}
      <span className="inline-block min-w-[3.5ch] text-gray-950 transition-all duration-300">
        {FORMATS[index]}
      </span>
      <span className="sr-only">, PNG, PDF</span>
    </h1>
  );
}