"use client"

import { useState, useEffect } from 'react'
import { Box } from '@mui/material'

const ThunderEffect = ({ show, onComplete }) => {
  const [active, setActive] = useState(false)
  
  useEffect(() => {
    if (show) {
      setActive(true)
      
      // Auto hide after animation completes
      const timer = setTimeout(() => {
        setActive(false)
        if (onComplete) onComplete()
      }, 1000) // Match this with total animation duration
      
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])
  
  if (!show && !active) return null
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* Multiple lightning flashes with different animations */}
      <Box
        className="thunder-flash"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
          opacity: 0,
          animation: 'thunderFlash 1s ease-out',
          '@keyframes thunderFlash': {
            '0%': { opacity: 0, transform: 'translateX(-100%)' },
            '5%': { opacity: 0.9, transform: 'translateX(0%)' },
            '15%': { opacity: 0, transform: 'translateX(100%)' },
            '25%': { opacity: 0 },
            '30%': { opacity: 0.6, transform: 'translateX(-20%)' },
            '35%': { opacity: 0, transform: 'translateX(20%)' },
            '100%': { opacity: 0 }
          }
        }}
      />
      
      {/* Second flash with different timing */}
      <Box
        className="thunder-flash-secondary"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(80,140,255,0) 0%, rgba(80,140,255,0.6) 50%, rgba(80,140,255,0) 100%)',
          opacity: 0,
          animation: 'thunderFlashSecondary 1s ease-out',
          '@keyframes thunderFlashSecondary': {
            '0%': { opacity: 0 },
            '15%': { opacity: 0 },
            '20%': { opacity: 0.8, transform: 'translateX(20%)' },
            '25%': { opacity: 0, transform: 'translateX(-20%)' },
            '40%': { opacity: 0.5 },
            '42%': { opacity: 0 },
            '100%': { opacity: 0 }
          }
        }}
      />
      
      {/* Lightning bolts */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          animation: 'thunderBolt 1s ease-out'
        }}
      >
        <path 
          d="M50,0 L45,30 L60,35 L40,100 L45,70 L30,65 Z" 
          fill="rgba(255,255,255,0.9)"
          style={{
            filter: 'drop-shadow(0 0 10px #4E7CFF)',
            transformOrigin: 'center center',
            animation: 'thunderPath 0.8s ease-out'
          }}
        />
      </svg>
      
      {/* Full screen color overlay for brief flash */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(120, 170, 255, 0.2)',
          opacity: 0,
          animation: 'thunderOverlay 1s ease-out',
          '@keyframes thunderOverlay': {
            '0%': { opacity: 0 },
            '5%': { opacity: 0.2 },
            '10%': { opacity: 0 },
            '15%': { opacity: 0 },
            '20%': { opacity: 0.3 },
            '25%': { opacity: 0 },
            '100%': { opacity: 0 }
          }
        }}
      />

      <style jsx global>{`
        @keyframes thunderBolt {
          0% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0; }
          20% { opacity: 0.7; }
          25% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        @keyframes thunderPath {
          0% { transform: scale(0.8) translateY(-10%); }
          10% { transform: scale(1.2) translateY(0); }
          20% { transform: scale(0.9) translateY(5%); }
          30% { transform: scale(1) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }
      `}</style>
    </Box>
  )
}

export default ThunderEffect