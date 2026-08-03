import React from 'react';

// Banned 3D/R3F/Three.js elements completely bypassed
export default function ThreeScene() {
  return <div className="absolute inset-0 pointer-events-none -z-10 bg-[#F8F8F5]" />;
}
