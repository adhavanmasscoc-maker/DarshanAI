import React from 'react';

const DarshanLogo = ({ size = 38, className = "" }) => {
  return (
    <div className={`d-inline-flex align-items-center justify-content-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Gopuram Silhouette / Arch */}
        <path 
          d="M50 8 L78 36 V90 H22 V36 L50 8 Z" 
          fill="#4A0E17" 
          stroke="#C59B27" 
          strokeWidth="3"
        />
        
        {/* Tiered Gopuram Roof Accent */}
        <path d="M30 36 H70" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M35 24 H65" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 15 H58" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>

        {/* AI Circuit Nodes & Traces */}
        <circle cx="50" cy="52" r="7" fill="#FF6F00" stroke="#FFFFFF" strokeWidth="1.5"/>
        
        {/* Circuit Traces */}
        <path d="M50 45 V36" stroke="#D4AF37" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M43 52 H32 V64" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M57 52 H68 V64" stroke="#D4AF37" strokeWidth="2"/>
        <path d="M50 59 V74" stroke="#D4AF37" strokeWidth="2"/>

        {/* AI Nodes */}
        <circle cx="32" cy="64" r="3.5" fill="#D4AF37"/>
        <circle cx="68" cy="64" r="3.5" fill="#D4AF37"/>
        <circle cx="50" cy="74" r="4" fill="#FF6F00"/>

        {/* Sanctum Entrance Gate */}
        <path d="M42 90 V76 C42 72 58 72 58 76 V90 H42 Z" fill="#FDFBF7" stroke="#C59B27" strokeWidth="1.5"/>
        
        {/* Glowing Flame Accent Peak */}
        <path d="M50 2 C52 5 53 7 50 10 C47 7 48 5 50 2 Z" fill="#FF6F00"/>
      </svg>
    </div>
  );
};

export default DarshanLogo;
