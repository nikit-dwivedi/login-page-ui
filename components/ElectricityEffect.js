"use client"

import { useState, useEffect, useRef } from 'react'
import { Box } from '@mui/material'

const ElectricityEffect = ({ targetRef, show, onComplete }) => {
  const [active, setActive] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const lightningBranchesRef = useRef([])
  
  // Get button position and dimensions
  const getButtonRect = () => {
    if (!targetRef || !targetRef.current) return { top: 0, left: 0, width: 0, height: 0 }
    const rect = targetRef.current.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  }
  
  // Electricity animation logic
  useEffect(() => {
    if (!show || !canvasRef.current || !targetRef || !targetRef.current) return
    
    setActive(true)
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas to full window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Get button position
    const buttonRect = getButtonRect()
    
    // Clear canvas
    const clearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    // Create initial lightning branches
    const createLightningBranches = () => {
      const branches = []
      
      // Number of initial branches
      const numBranches = 6
      
      // Create branches evenly spaced around the button
      for (let i = 0; i < numBranches; i++) {
        // Start from center of button
        const centerX = buttonRect.left + buttonRect.width / 2
        const centerY = buttonRect.top + buttonRect.height / 2
        
        // Calculate angle based on position
        const angle = (i / numBranches) * Math.PI * 2
        
        // Create branch
        branches.push({
          points: [{ x: centerX, y: centerY }],
          angle: angle,
          width: Math.random() * 2 + 2,
          alpha: 0.9,
          color: '#4E7CFF',
          velocity: Math.random() * 3 + 5,
          lifetime: 0,
          maxLifetime: 30 + Math.random() * 10
        })
      }
      
      return branches
    }
    
    // Helper function to create lightning segments
    const createLightningSegment = (startX, startY, angle, length) => {
      const endX = startX + Math.cos(angle) * length
      const endY = startY + Math.sin(angle) * length
      return { x: endX, y: endY }
    }
    
    // Update lightning branches
    const updateLightningBranches = () => {
      const newBranches = []
      
      lightningBranchesRef.current.forEach(branch => {
        // If show is true, we want to keep the animation going
        // Don't check lifetime if show is true
        if (!show && branch.lifetime >= branch.maxLifetime) return
        
        // Increase lifetime
        branch.lifetime++
        
        // Get last point
        const lastPoint = branch.points[branch.points.length - 1]
        
        // Small random angle change
        branch.angle += (Math.random() - 0.5) * 0.5
        
        // Create new point
        const newPoint = createLightningSegment(
          lastPoint.x, lastPoint.y, 
          branch.angle, 
          branch.velocity
        )
        
        // Add point to branch
        branch.points.push(newPoint)
        
        // Reduce alpha slightly
        branch.alpha *= 0.98
        
        // Reduce width slightly
        branch.width *= 0.98
        
        // Only add branch if it still has life or if show is true
        if (show || branch.lifetime < branch.maxLifetime) {
          newBranches.push(branch)
        }
        
        // Random chance to create sub-branch
        if (Math.random() < 0.1 && branch.width > 1) {
          newBranches.push({
            points: [...branch.points],
            angle: branch.angle + (Math.random() - 0.5) * 1.5,
            width: branch.width * 0.7,
            alpha: branch.alpha * 0.8,
            color: branch.color,
            velocity: branch.velocity * 0.8,
            lifetime: 0,
            maxLifetime: 20 + Math.random() * 10
          })
        }
      })
      
      lightningBranchesRef.current = newBranches
      
      // Add new branches periodically while effect is active
      if (show && Math.random() < 0.3 || Math.random() < 0.2 && lightningBranchesRef.current.length < 20) {
        const centerX = buttonRect.left + buttonRect.width / 2
        const centerY = buttonRect.top + buttonRect.height / 2
        
        lightningBranchesRef.current.push({
          points: [{ x: centerX, y: centerY }],
          angle: Math.random() * Math.PI * 2,
          width: Math.random() * 2 + 2,
          alpha: 0.9,
          color: Math.random() > 0.5 ? '#4E7CFF' : '#FFFFFF',
          velocity: Math.random() * 3 + 5,
          lifetime: 0,
          maxLifetime: 30 + Math.random() * 10
        })
      }
      
      return lightningBranchesRef.current.length > 0
    }
    
    // Draw lightning
    const drawLightning = () => {
      clearCanvas()
      
      lightningBranchesRef.current.forEach(branch => {
        if (branch.points.length < 2) return
        
        // Draw main line
        ctx.beginPath()
        ctx.moveTo(branch.points[0].x, branch.points[0].y)
        
        // Draw line through points
        for (let i = 1; i < branch.points.length; i++) {
          // Add some randomness to make it look like electricity
          if (i > 1) {
            const jitter = branch.width * 0.5
            ctx.lineTo(
              branch.points[i].x + (Math.random() - 0.5) * jitter,
              branch.points[i].y + (Math.random() - 0.5) * jitter
            )
          } else {
            ctx.lineTo(branch.points[i].x, branch.points[i].y)
          }
        }
        
        // Set line style
        ctx.strokeStyle = branch.color
        ctx.lineWidth = branch.width
        ctx.globalAlpha = branch.alpha
        ctx.shadowColor = branch.color
        ctx.shadowBlur = 15
        ctx.stroke()
        
        // Reset shadow for better performance
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })
      
      // Draw glow around button
      ctx.beginPath()
      ctx.rect(
        buttonRect.left - 5, 
        buttonRect.top - 5,
        buttonRect.width + 10,
        buttonRect.height + 10
      )
      const gradient = ctx.createLinearGradient(
        buttonRect.left, 
        buttonRect.top, 
        buttonRect.left + buttonRect.width, 
        buttonRect.top + buttonRect.height
      )
      gradient.addColorStop(0, 'rgba(78, 124, 255, 0)')
      gradient.addColorStop(0.5, 'rgba(78, 124, 255, 0.2)')
      gradient.addColorStop(1, 'rgba(78, 124, 255, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 5
      ctx.shadowColor = '#4E7CFF'
      ctx.shadowBlur = 15
      ctx.stroke()
      
      // Draw energy particles around the button
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = buttonRect.width / 2 + 10 + Math.random() * 20
        const x = buttonRect.left + buttonRect.width / 2 + Math.cos(angle) * radius
        const y = buttonRect.top + buttonRect.height / 2 + Math.sin(angle) * radius
        
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.globalAlpha = Math.random() * 0.7
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }
    
    // Animation loop
    const animate = () => {
      const hasActiveBranches = updateLightningBranches()
      
      // Continue animation if show is true or if there are active branches
      if (show || hasActiveBranches) {
        drawLightning()
        animationRef.current = requestAnimationFrame(animate)
      } else {
        clearCanvas()
        setActive(false)
        if (onComplete) onComplete()
      }
    }
    
    // Setup initial branches and start animation
    lightningBranchesRef.current = createLightningBranches()
    animate()
    
    // Clean up on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [show, targetRef, onComplete])
  
  if (!show && !active) return null
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}

export default ElectricityEffect