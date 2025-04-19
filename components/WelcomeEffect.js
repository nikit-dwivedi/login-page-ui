"use client"

import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

const WelcomeEffect = ({ show, success, onComplete }) => {
  const [active, setActive] = useState(false)
  
  useEffect(() => {
    if (show) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [show])
  
  // Handle cleanup when effect is no longer visible
  useEffect(() => {
    if (!show && !active) {
      if (onComplete) onComplete()
    }
  }, [show, active, onComplete])
  
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
        overflow: 'hidden',
      }}
    >
      {/* Gentle pulsing background overlay */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut" 
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, #4E7CFF 0%, rgba(78, 124, 255, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Success animation that shows after loading */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut" 
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Success checkmark */}
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 80 80"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(78, 124, 255, 0.5))',
              }}
            >
              <motion.circle 
                cx="40" 
                cy="40" 
                r="36"
                fill="none"
                stroke="#4E7CFF"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  transition: { 
                    duration: 0.8, 
                    ease: "easeOut", 
                    delay: 0.2 
                  }
                }}
              />
              <motion.path 
                d="M25,40 L38,53 L55,28"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  transition: { 
                    duration: 0.5, 
                    ease: "easeOut", 
                    delay: 0.8 
                  }
                }}
              />
            </svg>
            
            {/* Welcome message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              style={{
                marginTop: 20,
                fontFamily: "Inter, sans-serif",
                color: "white",
                textAlign: "center",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "500" }}>
                Welcome Back
              </div>
              <div style={{ fontSize: "1rem", opacity: 0.8, marginTop: 5 }}>
                Logging you in...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle particle effects */}
      {show && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 15 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight - 200],
                opacity: [0, 0.3, 0],
                transition: {
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }
              }}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </div>
      )}
    </Box>
  )
}

export default WelcomeEffect