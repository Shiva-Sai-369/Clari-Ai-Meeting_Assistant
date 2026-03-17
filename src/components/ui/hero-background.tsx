import React from 'react';

// Collection of productivity app icons hosted locally in public/icons
const APP_ICONS = [
  "/icons/slack.svg",
  "/icons/google-calendar.svg",
  "/icons/google-meet.svg",
  "/icons/zoom.svg",
  "/icons/microsoft-teams.svg",
  "/icons/jira.svg",
  "/icons/trello.svg",
  "/icons/notion.svg",
  "/icons/linear.svg",
  "/icons/github.svg",
  "/icons/figma.svg",
  "/icons/discord.svg",
];

interface RingProps {
  radius: number;
  count: number;
  direction: 'spin-slow' | 'spin-slow-reverse';
  duration: string;
  size: number;
  opacity: number;
}

const AppRing = ({ radius, count, direction, duration, size, opacity }: RingProps) => {
  // Generate random assortment of icons for this ring
  const ringIcons = Array.from({ length: count }, () => APP_ICONS[Math.floor(Math.random() * APP_ICONS.length)]);

  return (
    <div className={`absolute inset-0 animate-${direction}`} style={{ animationDuration: duration, transformStyle: 'preserve-3d' }}>
      <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)", zIndex: 0, transformStyle: 'preserve-3d' }}>
        {ringIcons.map((icon, i) => {
          // Calculate angle for evenly spaced icons
          const angle = (i * (360 / count)) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              className="absolute glass-card flex items-center justify-center rounded-2xl shadow-xl transition-transform hover:scale-110"
              style={{
                width: size,
                height: size,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotateZ(${Math.random() * 30 - 15}deg)`,
                opacity: opacity,
              }}
            >
              <img src={icon} alt="App Integration" className="w-1/2 h-1/2 object-contain" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HeroBackground = () => {
  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse linear infinite;
        }
      `}</style>
      
      {/* Container simulating a deep 3D space */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden block">
        <div
          className="w-full h-full absolute"
          style={{
            top: '70%', // Adjust center to zoom in and fill space
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 1,
            zIndex: 0,
          }}
        >
          {/* Outer Ring */}
          <AppRing 
            radius={1100} 
            count={28} 
            direction="spin-slow" 
            duration="160s" 
            size={72} 
            opacity={0.3} 
          />
          
          {/* Middle Ring */}
          <AppRing 
            radius={850} 
            count={20} 
            direction="spin-slow-reverse" 
            duration="120s" 
            size={88} 
            opacity={0.5} 
          />
          
          {/* Inner Ring */}
          <AppRing 
            radius={550} 
            count={12} 
            direction="spin-slow" 
            duration="80s" 
            size={104} 
            opacity={0.8} 
          />
        </div>
      </div>

      {/* Radial Gradient overlay to fade edges into background */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none block" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 15%, hsl(var(--background)) 90%)'
        }}
      />

    </>
  );
};
