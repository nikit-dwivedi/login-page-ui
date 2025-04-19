"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Box } from '@mui/material'

const PeekingCharacter = () => {
  return (
    <motion.div
      initial={{ translateX: 50, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5
      }}
      style={{
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: '150px',
          height: '170px',
          position: 'relative',
        }}
      >
        {/* SVG character peeking - improved, more professional design */}
        <svg 
          width="150" 
          height="170" 
          viewBox="0 0 150 170" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))'
          }}
        >
          {/* Hair */}
          <motion.path 
            d="M63 22C52 22 43 28 42 49.5C41 71 49 86 59 91.5C69 97 78 96.5 81 96"
            fill="#35495E"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
          
          {/* Neck */}
          <motion.path 
            d="M62 96C62 96 65 102 67 111.5C69 121 68.5 130 68.5 130"
            fill="#FBD3B7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
          
          {/* Face */}
          <motion.path 
            d="M63 22C63 22 84 19 90 39.5C96 60 90 82 81 90.5C72 99 60 98 56 96"
            fill="#FFE0C2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {/* Ear */}
          <motion.path 
            d="M57 56C57 56 53 57 52 61C51 65 52 69 55 70C58 71 60 69 60.5 66C61 63 59.5 59 57 56Z"
            fill="#FFD2B3"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          />
          
          {/* Eyes with blinking */}
          <motion.g
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: "easeInOut",
            }}
          >
            {/* Left Eye */}
            <ellipse cx="68" cy="55" rx="3.5" ry="4" fill="#35495E" />
            {/* Right Eye */}
            <ellipse cx="82" cy="55" rx="3.5" ry="4" fill="#35495E" />
          </motion.g>
          
          {/* Eyebrows */}
          <motion.path
            d="M65 45C65 45 69 43 71 44"
            stroke="#35495E"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.path
            d="M79 44C79 44 82 43 85 45"
            stroke="#35495E"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          />
          
          {/* Smile with subtle animation */}
          <motion.path
            d="M70 72C70 72 73.5 76 80 72"
            stroke="#35495E"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
              d: [
                "M70 72C70 72 73.5 76 80 72", 
                "M70 73C70 73 74 77.5 80 73", 
                "M70 72C70 72 73.5 76 80 72"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          
          {/* Nose */}
          <motion.path
            d="M75 63C75 63 76 65 74 66"
            stroke="#E0A376"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
          
          {/* Collar */}
          <motion.path
            d="M58 111C58 111 60 115 75 117C90 119 95 115 95 115"
            fill="#5586E2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
          />
          
          {/* Shirt */}
          <motion.path
            d="M55 120C55 120 65 130 80 125C95 120 100 130 100 140C100 150 90 170 75 170C60 170 45 155 45 140C45 125 55 120 55 120Z"
            fill="#4E7CFF"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
          />
          
          {/* Hand waving */}
          <motion.g
            animate={{ 
              rotate: [-5, 10, -5],
              x: [0, 2, 0],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ 
              originX: "65%", 
              originY: "110%",
            }}
          >
            <path
              d="M90 100C90 100 100 95 110 103C120 111 120 115 119 119C118 123 112 125 109 122C106 119 103 113 90 100Z"
              fill="#FFE0C2"
              stroke="#E0A376"
              strokeWidth="0.5"
            />
            {/* Fingers */}
            <path
              d="M107 110C107 110 111 113 108 116C105 119 101 116 102 113C103 110 107 110 107 110Z"
              fill="#FFE0C2"
              stroke="#E0A376"
              strokeWidth="0.5"
            />
          </motion.g>
        </svg>
        
        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          style={{
            position: 'absolute',
            top: 5,
            right: -5,
            background: 'white',
            borderRadius: '12px',
            padding: '8px 12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: '12px',
            fontWeight: '600',
            color: '#37474F',
            whiteSpace: 'nowrap',
          }}
        >
          <Box sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-15px',
              right: '15px',
              width: '0',
              height: '0',
              border: '8px solid transparent',
              borderTop: '8px solid white',
            }
          }}>
            Welcome! 👋
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  )
}

export default PeekingCharacter