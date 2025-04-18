"use client"

import { Box } from '@mui/material'
import LoginForm from '@/components/LoginForm'
import dynamic from 'next/dynamic'

// Dynamically import the animated background to avoid SSR issues
const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackgroundSimple'), {
  ssr: false,
})

export default function Home() {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      <LoginForm />
    </Box>
  )
}
