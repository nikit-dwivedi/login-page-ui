"use client"

import { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'

const AnimatedBackgroundSimple = () => {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  // Brand colors
  const brandColors = {
    primaryBlue: '#4E7CFF',
    secondaryPurple: '#7B61FF',
    deepBlue: '#0D1627',
    lightBlue: '#B4C9F9',
    gold: '#d4a650',
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set initial dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Significantly reduced particle count for performance
    const maxParticles = 40
    const maxConnections = 30
    const connectionDistance = 150
    
    // Particles and connections
    let particles = []
    let connections = []
    
    // Initialize particles in clusters
    const initializeParticles = () => {
      particles = []
      connections = []
      
      // Create clusters
      const numClusters = 4
      const clusters = []
      
      for (let i = 0; i < numClusters; i++) {
        clusters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 80 + 80,
          color: getRandomColor()
        })
      }
      
      // Add particles to clusters
      for (let i = 0; i < maxParticles; i++) {
        const clusterIndex = Math.floor(Math.random() * numClusters)
        const cluster = clusters[clusterIndex]
        
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * cluster.radius
        const x = cluster.x + Math.cos(angle) * distance
        const y = cluster.y + Math.sin(angle) * distance
        
        particles.push({
          x,
          y,
          size: Math.random() * 2 + 1.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          clusterIndex,
          color: cluster.color
        })
      }
      
      // Create initial connections
      createInitialConnections()
    }
    
    // Create some initial connections
    const createInitialConnections = () => {
      // Group particles by cluster
      const clusterGroups = {}
      
      particles.forEach(particle => {
        if (!clusterGroups[particle.clusterIndex]) {
          clusterGroups[particle.clusterIndex] = []
        }
        clusterGroups[particle.clusterIndex].push(particle)
      })
      
      // Create connections within clusters
      Object.values(clusterGroups).forEach(clusterParticles => {
        for (let i = 0; i < clusterParticles.length; i++) {
          const particleA = clusterParticles[i]
          
          // Connect to 1-2 other particles in same cluster
          const connectCount = Math.floor(Math.random() * 2) + 1
          
          for (let j = 0; j < connectCount; j++) {
            if (connections.length >= maxConnections) break
            
            // Find a random particle in the same cluster
            const availableParticles = clusterParticles.filter((p, index) => {
              if (index === i) return false // Skip self
              
              // Check if already connected
              const alreadyConnected = connections.some(conn => 
                (conn.from === particleA && conn.to === p) || 
                (conn.from === p && conn.to === particleA)
              )
              
              if (alreadyConnected) return false
              
              // Check distance
              const dx = p.x - particleA.x
              const dy = p.y - particleA.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              return distance < connectionDistance
            })
            
            if (availableParticles.length > 0) {
              const particleB = availableParticles[Math.floor(Math.random() * availableParticles.length)]
              
              connections.push({
                from: particleA,
                to: particleB,
                color: particleA.color,
                width: Math.random() * 0.8 + 0.3
              })
            }
          }
        }
      })
    }
    
    // Get random brand color
    const getRandomColor = () => {
      const colors = [
        brandColors.primaryBlue,
        brandColors.secondaryPurple,
        brandColors.lightBlue,
        brandColors.gold
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }
    
    // Animation loop - ultra simplified for performance
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Schedule next frame first
      animationRef.current = requestAnimationFrame(animate)
      
      // Update particles
      particles.forEach(particle => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Boundary check with bounce instead of wrap (more efficient)
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }
        
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        
        // Draw particle (simple circle, no gradients)
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
      
      // Draw connections
      connections.forEach(connection => {
        const fromX = connection.from.x
        const fromY = connection.from.y
        const toX = connection.to.x
        const toY = connection.to.y
        
        // Simple straight line connections
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.strokeStyle = connection.color
        ctx.lineWidth = connection.width
        ctx.globalAlpha = 0.5 // Reduced opacity
        ctx.stroke()
        ctx.globalAlpha = 1
      })
    }
    
    // Basic resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeParticles()
    }
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Initialize and start animation
    initializeParticles()
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted])

  return (
    <>
      {/* Base background */}
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
      
      {/* Canvas for particles and connections */}
      {mounted && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}

export default AnimatedBackgroundSimple