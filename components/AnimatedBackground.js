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
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    setMounted(true)
    
    // We need to dynamically import vanta to avoid SSR issues
    const loadVanta = async () => {
      const THREE = await import('three')
      const WAVES = await import('vanta/dist/vanta.waves.min')
      
      if (!vantaEffect && vantaRef.current) {
        setVantaEffect(
          WAVES.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd0d0d0, // Light gray color for waves
            shininess: 5.00,
            waveHeight: 4.00,
            waveSpeed: 0.30,
            zoom: 1
          })
        )
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

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
  const numIcons = 20;
  const positions = [];
  const gridSize = Math.ceil(Math.sqrt(numIcons));
    
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Add some randomness to grid positions, but maintain spacing
      const baseX = (j / gridSize) * 100;
      const baseY = (i / gridSize) * 100;
      const jitterX = (Math.random() - 0.5) * 15;
      const jitterY = (Math.random() - 0.5) * 15;
      
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
  
  // Slice to the number of icons we want and assign icons
  const backgroundIcons = positions.slice(0, numIcons).map((pos, index) => ({
    icon: iconComponents[index % iconComponents.length],
    ...pos
  }))

  // Generate bold colors with higher opacity for icons
  const iconColors = [
    'rgba(26, 117, 203, 0.7)',  // Blue
    'rgba(212, 166, 80, 0.7)',  // Gold
    'rgba(92, 124, 208, 0.7)',  // Light blue
    'rgba(64, 100, 173, 0.7)',  // Darker blue
    'rgba(94, 94, 94, 0.5)',    // Gray
    'rgba(89, 84, 158, 0.7)',   // Purple
    'rgba(203, 52, 52, 0.5)'    // Red
  ];

  if (!mounted) return null

  return (
    <>
      <Box
        ref={vantaRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundColor: '#d6d6d6', // Light gray background
        }}
      />
      
      {/* Overlay gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'radial-gradient(circle at 50% 50%, rgba(210, 210, 210, 0) 0%, rgba(195, 195, 195, 0.6) 100%)',
        }}
      />

      {/* Background icons */}
      {backgroundIcons.map((item, index) => (
        <motion.div
          key={`icon-${index}`}
          className="background-icon"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,  // Full opacity
            y: [0, -15, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, 8, 0, -8, 0],
            scale: [1, 1.1, 1, 0.95, 1]
          }}
          transition={{ 
            opacity: { duration: 1, delay: index * 0.05 },
            y: {
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            },
            rotate: {
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 18 + Math.random() * 7,
              repeat: Infinity,
              ease: "linear",
            }
          }}
          style={{
            position: 'absolute',
            color: iconColors[index % iconColors.length], // Assign color from the array
            fontSize: Math.random() * 25 + 50, // Even larger icons (50-75px)
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))', // Add slight shadow
            ...item,
            transition: 'all 1.5s ease-in-out'
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </>
  )
}

export default AnimatedBackground