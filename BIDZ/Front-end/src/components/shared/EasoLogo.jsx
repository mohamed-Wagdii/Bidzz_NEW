import React from 'react';

export default function EasoLogo({ className = "", style = {} }) {
  return (
    <svg 
      className={className} 
      style={style}
      viewBox="0 0 200 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3D Isometric Cube Base */}
      <path d="M25 10 L10 18 L10 35 L25 43 L40 35 L40 18 Z" stroke="#103F46" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      
      {/* Internal lines forming 3D structure */}
      <path d="M10 18 L25 26 L40 18" stroke="#103F46" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M25 26 L25 43" stroke="#103F46" strokeWidth="3" strokeLinejoin="round"/>
      
      {/* "E" on left face (Dark Teal) */}
      <path d="M14 20 L21 24 L21 27 L16 24 L16 26 L20 28 L20 31 L14 27 Z" fill="#103F46"/>
      
      {/* "M" on right face (Mustard/Gold) */}
      <path d="M36 20 L29 24 L29 38 L32 36 L32 27 L34 29 L36 28 Z" fill="#D29944"/>
      <path d="M36 20 L36 34 L33 36 Z" fill="#D29944"/>

      {/* Text 'Easo-Manage' */}
      <text x="50" y="34" fontFamily="Inter, sans-serif" fontSize="24" fontWeight="800" fill="#103F46">
        Easo-Manage
      </text>
    </svg>
  );
}
