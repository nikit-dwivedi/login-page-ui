"use client"

import { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { 
  BarChart,
  CalendarMonth,
  Chat,
  Person,
  Settings,
  Notifications,
  ContactMail,
  CloudSync,
  Groups,
  Dashboard,
  InsertChart,
  Mail,
  Description
} from '@mui/icons-material'

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create an array of icon components
  const iconComponents = [
    <Mail key="mail" />,
    <Description key="desc" />,
    <CalendarMonth key="cal" />,
    <BarChart key="chart" />,
    <Chat key="chat" />,
    <Groups key="groups" />,
    <Settings key="settings" />,
    <Person key="person" />,
    <Dashboard key="dash" />,
    <ContactMail key="contact" />,
    <InsertChart key="insert" />,
    <Notifications key="notif" />,
    <CloudSync key="cloud" />
  ];
  
  // Generate well-spaced positions for background icons
  const numIcons = 20; // Moderate number of icons
  const positions = [];
  const gridSize = Math.ceil(Math.sqrt(numIcons));
    
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Add some randomness to grid positions, but maintain spacing
      const baseX = (j / gridSize) * 100;
      const baseY = (i / gridSize) * 100;
      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 30;
      
      positions.push({
        left: `${Math.max(0, Math.min(100, baseX + jitterX))}%`,
        top: `${Math.max(0, Math.min(100, baseY + jitterY))}%`
      });
    }
  }
  
  // Shuffle positions array to randomize which position gets which icon
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  const [iconPositions, setIconPositions] = useState(positions.slice(0, numIcons));
  
  // Function to swap multiple icons occasionally
  useEffect(() => {
    const swapInterval = setInterval(() => {
      setIconPositions(prevPositions => {
        const newPositions = [...prevPositions];
        
        // Number of pairs to swap (3 pairs = 6 icons changing place)
        const numPairsToSwap = 3;
        
        // Create a temporary array of indices to pick from
        const availableIndices = Array.from({ length: newPositions.length }, (_, i) => i);
        
        // Shuffle the available indices
        for (let i = availableIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
        
        // Take the first 2*numPairsToSwap indices and pair them
        for (let i = 0; i < numPairsToSwap; i++) {
          if (availableIndices.length >= 2) {
            const idx1 = availableIndices.pop();
            const idx2 = availableIndices.pop();
            
            // Swap the positions
            [newPositions[idx1], newPositions[idx2]] = [newPositions[idx2], newPositions[idx1]];
          }
        }
        
        return newPositions;
      });
    }, 4000); // Swap every 4 seconds
    
    return () => clearInterval(swapInterval);
  }, []);
  
  // Slice to the number of icons we want and assign icons
  const backgroundIcons = iconPositions.map((pos, index) => ({
    icon: iconComponents[index % iconComponents.length],
    ...pos
  }))

  // Generate bold colors with higher opacity for icons
  const iconColors = [
    'rgba(26, 117, 203, 0.8)',   // Blue
    'rgba(212, 166, 80, 0.8)',   // Gold
    'rgba(92, 124, 208, 0.8)',   // Light blue
    'rgba(64, 100, 173, 0.8)',   // Darker blue
    'rgba(94, 94, 94, 0.6)',     // Gray
    'rgba(89, 84, 158, 0.8)',    // Purple
    'rgba(203, 52, 52, 0.7)',    // Red
    'rgba(46, 204, 113, 0.8)',   // Green
    'rgba(155, 89, 182, 0.8)',   // Violet
    'rgba(52, 152, 219, 0.8)'    // Bright blue
  ];

  if (!mounted) return null

  return (
    <>
      {/* Custom animated gradient background */}
      <Box
        className="animated-bg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(45deg, #ffffff 0%, #f0f2f5 100%)',
          overflow: 'hidden',
        }}
      />
      
      {/* Add subtle wave-like shapes */}
      <svg 
        className="wave-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          zIndex: 0,
          opacity: 0.7,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
          </filter>
        </defs>
        
        {/* First top wave - highest */}
        <motion.path
          d="M0,300 C320,450 420,200 640,300 C880,450 1200,200 1440,300 L1440,900 L0,900 Z"
          fill="rgba(100, 150, 230, 0.02)"
          animate={{
            d: [
              "M0,300 C320,450 420,200 640,300 C880,450 1200,200 1440,300 L1440,900 L0,900 Z",
              "M0,300 C320,200 420,450 640,300 C880,200 1200,450 1440,300 L1440,900 L0,900 Z",
              "M0,300 C320,450 420,200 640,300 C880,450 1200,200 1440,300 L1440,900 L0,900 Z"
            ]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Second wave - middle */}
        <motion.path
          d="M0,450 C320,600 420,350 640,450 C880,600 1200,350 1440,450 L1440,900 L0,900 Z"
          fill="rgba(100, 150, 230, 0.1)"
          animate={{
            d: [
              "M0,450 C320,600 420,350 640,450 C880,600 1200,350 1440,450 L1440,900 L0,900 Z",
              "M0,450 C320,350 420,600 640,450 C880,350 1200,600 1440,450 L1440,900 L0,900 Z",
              "M0,450 C320,600 420,350 640,450 C880,600 1200,350 1440,450 L1440,900 L0,900 Z"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Third wave - lower */}
        <motion.path
          d="M0,600 C320,750 420,550 640,600 C880,750 1200,550 1440,600 L1440,900 L0,900 Z"
          fill="rgba(100, 150, 230, 0.05)"
          animate={{
            d: [
              "M0,600 C320,750 420,550 640,600 C880,750 1200,550 1440,600 L1440,900 L0,900 Z",
              "M0,600 C320,550 420,750 640,600 C880,550 1200,750 1440,600 L1440,900 L0,900 Z",
              "M0,600 C320,750 420,550 640,600 C880,750 1200,550 1440,600 L1440,900 L0,900 Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Fourth wave - bottom */}
        <motion.path
          d="M0,750 C320,850 520,700 740,750 C960,800 1200,680 1440,750 L1440,900 L0,900 Z"
          fill="rgba(100, 150, 230, 0.02)"
          animate={{
            d: [
              "M0,750 C320,850 520,700 740,750 C960,800 1200,680 1440,750 L1440,900 L0,900 Z",
              "M0,750 C320,700 520,800 740,750 C960,700 1200,800 1440,750 L1440,900 L0,900 Z",
              "M0,750 C320,850 520,700 740,750 C960,800 1200,680 1440,750 L1440,900 L0,900 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* Background icons */}
      {backgroundIcons.map((item, index) => (
        <motion.div
          key={`icon-${index}`}
          className="background-icon"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.8,  // Slightly transparent for better effect
            y: [0, -15, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 8, 0, -8, 0],
            scale: [1, 1.1, 1, 0.95, 1]
          }}
          transition={{ 
            opacity: { duration: 1, delay: index * 0.05 },
            y: {
              duration: 5 + Math.random() * 5, // Faster animation
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
            x: {
              duration: 7 + Math.random() * 5, // Faster animation
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
            rotate: {
              duration: 6 + Math.random() * 4, // Faster animation
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
            scale: {
              duration: 8 + Math.random() * 4, // Faster animation
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }
          }}
          style={{
            position: 'absolute',
            color: iconColors[index % iconColors.length], // Assign color from the array
            fontSize: Math.random() * 30 + 40, // Larger icons (40-70px)
            filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.25))', // Stronger shadow for floating effect
            zIndex: 1, // Icons above background but below login card
            ...item,
            transition: 'all 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)' // Smoother transition for position swapping
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </>
  )
}

export default AnimatedBackground