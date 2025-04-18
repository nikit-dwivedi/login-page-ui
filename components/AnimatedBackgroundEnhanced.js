"use client"

import { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'
import { motion } from 'framer-motion'

const AnimatedBackgroundEnhanced = () => {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  // Track mouse position for interactive effects
  const mouseRef = useRef({ x: 0, y: 0 })
  const [interactionStrength, setInteractionStrength] = useState(0)
  const interactionTimeout = useRef(null)
  
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
    
    // Add mouse move event listener for interactive effects
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setInteractionStrength(0.8) // Set strong interaction on mouse move
      
      // Reset interaction strength after delay
      clearTimeout(interactionTimeout.current)
      interactionTimeout.current = setTimeout(() => {
        setInteractionStrength(prev => Math.max(0, prev - 0.2))
      }, 100)
    }
    
    // Add click event for ripple effect
    const handleClick = (e) => {
      if (typeof createRippleEffect === 'function') {
        createRippleEffect(e.clientX, e.clientY)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    
    if (typeof window !== 'undefined') {
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleClick)
        clearTimeout(interactionTimeout.current)
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [])
  
  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Particle & network properties - significantly reduced numbers for smoother performance
    let particles = []
    let connections = []
    let orbs = []
    let rippleEffects = [] // Array to store ripple effects
    const maxParticles = 45        // Reduced from 85 for better performance
    const maxConnections = 25      // Reduced from 60 for better performance
    const maxOrbs = 4              // Reduced from 8 for better performance
    const connectionThreshold = 150 // Reduced from 200 for less processing
    const connectionLifespan = 180  // Keep longer connection lifespan
    const meshNetworkSize = 3       // Reduced from 5 for simpler mesh calculations
    
    // Initialize particles and network
    const initializeParticlesAndNetwork = () => {
      // Create particles
      particles = []
      
      // Create clusters of particles for blob-like formations
      // First, determine cluster centers - reduced number of clusters for better performance
      const numClusters = 4 // Reduced from 6 for better performance
      const clusterCenters = []
      
      for (let i = 0; i < numClusters; i++) {
        clusterCenters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 100 + 100, // Cluster radius between 100-200 pixels
          velocityX: (Math.random() - 0.5) * 0.05, // Very slow drift
          velocityY: (Math.random() - 0.5) * 0.05,
          color: getRandomColor() // Each cluster has a primary color
        })
      }
      
      // Create particles with different types, positioned around cluster centers
      for (let i = 0; i < maxParticles; i++) {
        // Select which cluster this particle belongs to
        const clusterIndex = Math.floor(Math.random() * numClusters)
        const cluster = clusterCenters[clusterIndex]
        
        // Position particle with random offset from cluster center
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * cluster.radius
        const posX = cluster.x + Math.cos(angle) * distance
        const posY = cluster.y + Math.sin(angle) * distance
        
        const type = Math.random() < 0.7 ? 'normal' : (Math.random() < 0.5 ? 'fast' : 'slow')
        
        // Different speeds and sizes based on particle type
        let speed, size, opacity
        
        switch(type) {
          case 'fast':
            speed = 0.8
            size = 2
            opacity = 0.6
            break
          case 'slow':
            speed = 0.3
            size = 3.5
            opacity = 0.8
            break
          default: // normal
            speed = 0.5
            size = 2.5
            opacity = 0.5
        }
        
        particles.push({
          x: posX,
          y: posY,
          originalX: posX, // Store original position relative to cluster center
          originalY: posY,
          size: Math.random() * 1.5 + size,
          baseSize: Math.random() * 1.5 + size, // Store original size for reference
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          baseSpeed: speed, // Store original speed for reference
          opacity: Math.random() * 0.3 + opacity,
          color: cluster.color, // Use cluster's color with variation
          baseColor: getRandomColor(), // Store original color for influence effects
          type: type,
          maxConnections: type === 'normal' ? 5 : (type === 'fast' ? 3 : 8), // Increase max connections
          pulse: Math.random() * 2 * Math.PI, // For size pulsing effect
          pulseSpeed: 0.05 + Math.random() * 0.05,
          connections: 0,
          nearbyParticles: [], // Track nearby particles
          influenceColor: null, // Color influenced by neighbors
          influenceSize: 0, // Size influence from neighbors
          influenceSpeed: 0, // Speed influence from neighbors
          clusterIndex: clusterIndex, // Store which cluster this particle belongs to
          angle: angle, // Store the angle from cluster center
          distanceFromCenter: distance, // Store distance from cluster center
          interactionFactor: 0 // For mouse interaction effects
        })
      }
      
      // Create orbs
      orbs = []
      for (let i = 0; i < maxOrbs; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 80 + 50,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.15 + 0.05,
          gradient: createOrbGradient(i)
        })
      }
      
      // Initialize connections
      connections = []
      
      // Create initial connections between nearby particles within same cluster
      connectParticlesInClusters()
    }
    
    // Connect particles within their clusters
    const connectParticlesInClusters = () => {
      // Group particles by their cluster
      const clusterGroups = {};
      
      // Initialize empty arrays for each cluster
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const clusterIndex = particle.clusterIndex;
        
        if (!clusterGroups[clusterIndex]) {
          clusterGroups[clusterIndex] = [];
        }
        
        clusterGroups[clusterIndex].push(particle);
      }
      
      // Connect particles within each cluster
      Object.values(clusterGroups).forEach(clusterParticles => {
        // For each particle in the cluster
        clusterParticles.forEach(particle => {
          // If this particle already has enough connections, skip it
          if (particle.connections >= Math.min(3, particle.maxConnections)) {
            return;
          }
          
          // Find nearest particles in same cluster
          const nearbyParticles = clusterParticles
            .filter(otherParticle => {
              // Skip self
              if (otherParticle === particle) return false;
              
              // Skip if other particle has max connections
              if (otherParticle.connections >= otherParticle.maxConnections) return false;
              
              // Check if connection already exists
              const alreadyConnected = connections.some(conn => 
                (conn.from === particle && conn.to === otherParticle) || 
                (conn.from === otherParticle && conn.to === particle)
              );
              
              if (alreadyConnected) return false;
              
              // Calculate distance
              const dx = otherParticle.x - particle.x;
              const dy = otherParticle.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Only consider particles within a shorter threshold (for tighter clusters)
              return distance < connectionThreshold * 0.6;
            })
            .map(otherParticle => {
              const dx = otherParticle.x - particle.x;
              const dy = otherParticle.y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              return {
                particle: otherParticle,
                distance: distance
              };
            });
          
          // Sort by distance
          nearbyParticles.sort((a, b) => a.distance - b.distance);
          
          // Connect to 1-3 nearest particles
          const connectionsToMake = Math.min(
            Math.floor(Math.random() * 2) + 1, // 1-2 connections
            nearbyParticles.length,
            particle.maxConnections - particle.connections
          );
          
          for (let i = 0; i < connectionsToMake; i++) {
            addConnection(particle, nearbyParticles[i].particle);
          }
        });
      });
    }
    
    // Create gradient for orbs
    const createOrbGradient = (index) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      const gradientColors = [
        [brandColors.primaryBlue, brandColors.secondaryPurple],
        [brandColors.secondaryPurple, brandColors.lightBlue],
        [brandColors.primaryBlue, brandColors.gold],
        [brandColors.gold, brandColors.secondaryPurple]
      ]
      
      const colorPair = gradientColors[index % gradientColors.length]
      return { colorStart: colorPair[0], colorEnd: colorPair[1] }
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
    
    // Shift a color by a certain amount
    const shiftColor = (hex, amount) => {
      // Convert hex to rgb
      let r = parseInt(hex.slice(1, 3), 16)
      let g = parseInt(hex.slice(3, 5), 16)
      let b = parseInt(hex.slice(5, 7), 16)
      
      // Shift values
      r = Math.max(0, Math.min(255, r + amount))
      g = Math.max(0, Math.min(255, g + amount))
      b = Math.max(0, Math.min(255, b + amount))
      
      // Convert back to hex
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
    
    // Create a ripple effect at specified position
    const createRippleEffect = (x, y) => {
      rippleEffects.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 100 + Math.random() * 50,
        opacity: 0.6,
        color: getRandomColor(),
        speed: 2 + Math.random() * 2
      });
      
      // Limit number of simultaneous ripples
      if (rippleEffects.length > 5) {
        rippleEffects.shift();
      }
    }
    
    // Update and draw ripple effects
    const updateRipples = () => {
      // Update and draw all ripples
      for (let i = rippleEffects.length - 1; i >= 0; i--) {
        const ripple = rippleEffects[i];
        
        // Expand radius
        ripple.radius += ripple.speed;
        
        // Reduce opacity as radius increases
        ripple.opacity = Math.max(0, 0.6 * (1 - ripple.radius / ripple.maxRadius));
        
        // Draw ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color + Math.floor(ripple.opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Remove ripple when it reaches max radius or becomes invisible
        if (ripple.radius >= ripple.maxRadius || ripple.opacity <= 0.02) {
          rippleEffects.splice(i, 1);
        }
      }
    }
    
    // Add mouse interaction to particle movement
    const applyMouseInteraction = () => {
      if (!mouseRef.current || interactionStrength <= 0) return;
      
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const interactionRadius = 150; // Radius of influence around mouse
      
      particles.forEach(particle => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only affect particles within interaction radius
        if (distance < interactionRadius) {
          // Calculate interaction strength based on distance
          const force = interactionStrength * (1 - distance / interactionRadius);
          
          // Push particle away from cursor
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
          
          // Increase particle interactionFactor for visual effects
          particle.interactionFactor = force;
        } else {
          // Gradually reduce interaction factor
          particle.interactionFactor *= 0.95;
        }
      });
    }
    
    // Optimized update function that doesn't create new arrays every frame
    const updateParticleInfluences = () => {
      // Only update a subset of particles each frame for better performance
      const particlesToUpdate = Math.floor(particles.length * 0.2) // Only update 20% of particles each frame
      
      // Pick random particles to update
      for (let i = 0; i < particlesToUpdate; i++) {
        const particleIndex = Math.floor(Math.random() * particles.length)
        const particle = particles[particleIndex]
        
        // Skip if this particle was recently updated
        if (particle.lastInfluenceUpdate && performance.now() - particle.lastInfluenceUpdate < 500) {
          continue
        }
        
        // Find up to 2 nearby particles from the same cluster for influence
        let nearbyCount = 0
        let totalColorInfluence = {r: 0, g: 0, b: 0}
        let totalSizeInfluence = 0
        let totalInfluenceWeight = 0
        
        // Only check particles in the same cluster for efficiency
        for (let j = 0; j < particles.length; j++) {
          if (nearbyCount >= 2) break // Limit checks to 2 particles max
          
          const otherParticle = particles[j]
          if (particle === otherParticle) continue
          if (particle.clusterIndex !== otherParticle.clusterIndex) continue
          
          const dx = otherParticle.x - particle.x
          const dy = otherParticle.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Consider only very close particles
          if (distance < connectionThreshold * 0.4) {
            const influence = 1 - (distance / (connectionThreshold * 0.4))
            totalInfluenceWeight += influence
            nearbyCount++
            
            // Simple color influence
            try {
              const otherColor = hexToRgb(otherParticle.color)
              if (otherColor) {
                totalColorInfluence.r += otherColor.r * influence
                totalColorInfluence.g += otherColor.g * influence
                totalColorInfluence.b += otherColor.b * influence
              }
            } catch (error) {}
            
            // Simple size influence
            totalSizeInfluence += (otherParticle.size / particle.baseSize - 1) * influence * 0.2
          }
        }
        
        // Apply influences if we found nearby particles
        if (totalInfluenceWeight > 0) {
          // Apply color influence rarely to reduce processing
          if (Math.random() < 0.3) {
            try {
              const baseColor = hexToRgb(particle.baseColor)
              if (baseColor) {
                const blendedColor = {
                  r: Math.round(baseColor.r * 0.8 + (totalColorInfluence.r / totalInfluenceWeight) * 0.2),
                  g: Math.round(baseColor.g * 0.8 + (totalColorInfluence.g / totalInfluenceWeight) * 0.2),
                  b: Math.round(baseColor.b * 0.8 + (totalColorInfluence.b / totalInfluenceWeight) * 0.2)
                }
                particle.influenceColor = rgbToHex(blendedColor.r, blendedColor.g, blendedColor.b)
              }
            } catch (error) {}
          }
          
          // Apply size influence
          particle.influenceSize = particle.baseSize * (1 + totalSizeInfluence / totalInfluenceWeight)
        }
        
        // Track when this particle was last updated
        particle.lastInfluenceUpdate = performance.now()
      }
    }
    
    // Helper functions for color manipulation
    const hexToRgb = (hex) => {
      if (!hex || typeof hex !== 'string' || hex.length < 7) {
        return null;
      }
      try {
        const r = parseInt(hex.substring(1, 3), 16)
        const g = parseInt(hex.substring(3, 5), 16)
        const b = parseInt(hex.substring(5, 7), 16)
        return isNaN(r) || isNaN(g) || isNaN(b) ? null : {r, g, b}
      } catch (error) {
        return null;
      }
    }
    
    const rgbToHex = (r, g, b) => {
      try {
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
      } catch (error) {
        return '#4E7CFF'; // Default to primary blue if error
      }
    }
    
    // Create random connections between particles
    const createConnection = () => {
      if (connections.length >= maxConnections) return
      
      // Select particles for connection based on different strategies
      const connectionType = Math.random()
      
      if (connectionType < 0.6) {
        // Regular connection between two particles
        createRegularConnection()
      } else if (connectionType < 0.8) {
        // Create a hub-and-spoke pattern with one particle connected to multiple others
        createHubConnection()
      } else {
        // Create a mesh network of multiple interconnected particles
        createMeshNetwork()
      }
    }
    
    // Create a regular connection between two particles
    const createRegularConnection = () => {
      // Select two random particles within threshold distance
      const availableParticles = particles.filter(p => p.connections < p.maxConnections)
      if (availableParticles.length < 2) return
      
      const particleA = availableParticles[Math.floor(Math.random() * availableParticles.length)]
      const potentialParticles = availableParticles.filter(p => {
        if (p === particleA) return false
        
        // Prefer particles in the same cluster (75% chance to only consider same cluster)
        if (Math.random() < 0.75 && p.clusterIndex !== particleA.clusterIndex) return false
        
        const dx = p.x - particleA.x
        const dy = p.y - particleA.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Use shorter threshold for non-cluster particles to maintain local connectivity
        const threshold = p.clusterIndex === particleA.clusterIndex ? 
          connectionThreshold * 0.6 : connectionThreshold * 0.3
        
        return distance < threshold
      })
      
      if (potentialParticles.length === 0) return
      
      const particleB = potentialParticles[Math.floor(Math.random() * potentialParticles.length)]
      
      addConnection(particleA, particleB)
    }
    
    // Create a hub with multiple connections from one particle
    const createHubConnection = () => {
      // Find particles with few connections to be the hub
      const hubCandidates = particles.filter(p => p.type === 'slow' && p.connections <= 1)
      if (hubCandidates.length === 0) return
      
      const hub = hubCandidates[Math.floor(Math.random() * hubCandidates.length)]
      
      // Find particles close to the hub and in the same cluster
      const nearbyParticles = particles.filter(p => {
        if (p === hub) return false
        
        // Only connect to particles in the same cluster for hubs
        if (p.clusterIndex !== hub.clusterIndex) return false
        
        const dx = p.x - hub.x
        const dy = p.y - hub.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Use a tighter radius for hub connections
        return distance < connectionThreshold * 0.5 && p.connections < p.maxConnections
      })
      
      if (nearbyParticles.length < 2) return
      
      // Connect the hub to multiple particles (2-4)
      const numConnections = Math.min(Math.floor(Math.random() * 3) + 2, nearbyParticles.length)
      
      for (let i = 0; i < numConnections; i++) {
        if (hub.connections >= hub.maxConnections) break
        
        // Pick a random nearby particle that's not already connected
        const index = Math.floor(Math.random() * nearbyParticles.length)
        const spoke = nearbyParticles[index]
        
        // Check if this connection already exists
        const exists = connections.some(c => 
          (c.from === hub && c.to === spoke) || (c.from === spoke && c.to === hub)
        )
        
        if (!exists) {
          addConnection(hub, spoke)
        }
        
        // Remove this particle from options
        nearbyParticles.splice(index, 1)
      }
    }
    
    // Create a mesh network of interconnected particles
    const createMeshNetwork = () => {
      // Find areas with multiple particles close to each other in the same cluster
      const seeds = particles.filter(p => p.connections < p.maxConnections)
      if (seeds.length === 0) return
      
      const seed = seeds[Math.floor(Math.random() * seeds.length)]
      const clusterIndex = seed.clusterIndex
      
      // Find particles close to the seed in the same cluster
      const closeParticles = particles.filter(p => {
        if (p === seed) return false
        
        // Only include particles from the same cluster
        if (p.clusterIndex !== clusterIndex) return false
        
        const dx = p.x - seed.x
        const dy = p.y - seed.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < connectionThreshold * 0.4 && p.connections < p.maxConnections
      })
      
      if (closeParticles.length < meshNetworkSize - 1) return
      
      // Select a subset of particles to form the mesh
      const meshParticles = [seed]
      for (let i = 0; i < meshNetworkSize - 1; i++) {
        if (closeParticles.length === 0) break
        
        const index = Math.floor(Math.random() * closeParticles.length)
        meshParticles.push(closeParticles[index])
        closeParticles.splice(index, 1)
      }
      
      // Connect particles in a mesh pattern (not all-to-all to avoid clutter)
      for (let i = 0; i < meshParticles.length; i++) {
        for (let j = i + 1; j < meshParticles.length; j++) {
          // Make connections with a higher probability for closer particles
          const p1 = meshParticles[i]
          const p2 = meshParticles[j]
          
          // Skip if either particle is at max connections
          if (p1.connections >= p1.maxConnections || p2.connections >= p2.maxConnections) {
            continue
          }
          
          // Check if this connection already exists
          const exists = connections.some(c => 
            (c.from === p1 && c.to === p2) || (c.from === p2 && c.to === p1)
          )
          
          if (!exists && Math.random() < 0.7) { // 70% chance to connect
            addConnection(p1, p2)
          }
        }
      }
    }
    
    // Helper function to add a connection between two particles
    const addConnection = (particleA, particleB) => {
      // Add connection with enhanced properties
      connections.push({
        from: particleA,
        to: particleB,
        life: connectionLifespan,
        maxLife: connectionLifespan,
        color: getRandomColor(),
        width: Math.random() * 1.5 + 0.5,
        // Add pulsing effect
        pulseRate: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        // Add data transfer effect
        hasDataTransfer: Math.random() < 0.4,  // 40% chance for data transfer
        dataPosition: 0,
        dataSpeed: Math.random() * 0.02 + 0.005,
        dataSize: Math.random() * 3 + 2,
        dataColor: getRandomColor()
      })
      
      // Update particle connection count
      particleA.connections = (particleA.connections || 0) + 1
      particleB.connections = (particleB.connections || 0) + 1
    }
    
    // Helper function to safely create a curved path
    const createCurvedPath = (ctx, fromX, fromY, toX, toY, offsetX, offsetY) => {
      // Check if values are valid
      if (!isFinite(fromX) || !isFinite(fromY) || !isFinite(toX) || !isFinite(toY) || 
          !isFinite(offsetX) || !isFinite(offsetY)) {
        return false;
      }
      
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      
      try {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, toX, toY);
        return true;
      } catch (error) {
        console.error("Error creating curved path:", error);
        return false;
      }
    }
    
    // Apply parallax effect to clusters
    const applyParallaxEffect = () => {
      if (!mouseRef.current) return;
      
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate normalized mouse position (-1 to 1 range)
      const normalizedX = (mouseX - centerX) / centerX;
      const normalizedY = (mouseY - centerY) / centerY;
      
      // Adjust particles based on their cluster and distance from center
      particles.forEach(particle => {
        // Calculate offset based on mouse position and particle's distance from cluster center
        const offsetFactor = 0.05 * (particle.distanceFromCenter / 100);
        
        // Move particle slightly in opposite direction of mouse (parallax effect)
        particle.x = particle.originalX - normalizedX * offsetFactor * 20;
        particle.y = particle.originalY - normalizedY * offsetFactor * 20;
      });
    }
    
    // Animate function with performance optimization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Schedule the next animation frame first to ensure continuous animation
      animationRef.current = requestAnimationFrame(animate)
      
      // Apply mouse interactions with reduced frequency
      if (Math.random() < 0.7) { // Only apply in 70% of frames to reduce CPU load
        applyMouseInteraction()
      }
      
      // Apply parallax effect with reduced frequency
      if (Math.random() < 0.5) { // Only apply in 50% of frames
        applyParallaxEffect()
      }
      
      // First update particle influences from nearby particles - reduce frequency
      if (Math.random() < 0.3) { // Only update influences occasionally
        updateParticleInfluences()
      }
      
      // Draw and update orbs
      drawOrbs()
      
      // Draw particles
      particles.forEach(particle => {
        // Update pulsing effect
        particle.pulse += particle.pulseSpeed
        const pulseFactor = 1 + Math.sin(particle.pulse) * 0.2
        
        // Use the influenced size if available, otherwise use baseSize
        const baseDisplaySize = particle.influenceSize > 0 ? particle.influenceSize : particle.size
        
        // Apply interaction boost to size for particles affected by mouse
        const interactionBoost = particle.interactionFactor * 3
        const displaySize = (baseDisplaySize + interactionBoost) * pulseFactor
        
        // Draw particle with glow effect for particles with many connections
        if (particle.connections > 2 || particle.interactionFactor > 0.2) {
          // Draw glow
          try {
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, displaySize * 3
            )
            
            // Use interaction factor to boost glow
            const glowOpacity = Math.min(0.4, 0.2 + particle.interactionFactor)
            
            gradient.addColorStop(0, (particle.influenceColor || particle.color) + 'A0') // 60% opacity
            gradient.addColorStop(1, (particle.influenceColor || particle.color) + '00') // 0% opacity
            
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, displaySize * 3, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.globalAlpha = glowOpacity
            ctx.fill()
          } catch (error) {
            // Skip glow if gradient fails
          }
          ctx.globalAlpha = 1
        }
        
        // Draw main particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2)
        
        // Use influenced color if available
        const particleColor = particle.influenceColor || particle.color
        
        // Add subtle gradient to particles
        try {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, displaySize
          )
          gradient.addColorStop(0, particleColor)
          gradient.addColorStop(1, shiftColor(particleColor, -20))
          
          ctx.fillStyle = gradient
        } catch (error) {
          // Fallback to solid color if gradient fails
          ctx.fillStyle = particleColor
        }
        
        // Boost opacity for interactive particles
        const opacityBoost = particle.interactionFactor * 0.3
        ctx.globalAlpha = Math.min(1, particle.opacity + opacityBoost)
        
        ctx.fill()
        
        // Add highlight for larger particles
        if (displaySize > 3.5) {
          ctx.beginPath()
          ctx.arc(particle.x - displaySize/3, particle.y - displaySize/3, displaySize/3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.fill()
        }
        
        ctx.globalAlpha = 1
        
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })
      
      // Draw and update connections
      updateConnections()
      
      // Draw ripple effects
      updateRipples()
      
      // Create new connections less frequently
      if (Math.random() < 0.02 && connections.length < maxConnections) {
        createConnection()
      }
      
      // Occasionally create a burst of connections once in a while
      if (Math.random() < 0.0005) {
        const burstSize = Math.floor(Math.random() * 3) + 2
        for (let i = 0; i < burstSize; i++) {
          if (connections.length < maxConnections) {
            createConnection()
          }
        }
      }
    }
    
    // Draw and update orbs
    const drawOrbs = () => {
      orbs.forEach(orb => {
        // Move orb
        orb.x += orb.speedX
        orb.y += orb.speedY
        
        // Boundary check with bounce
        if (orb.x - orb.radius < 0 || orb.x + orb.radius > canvas.width) {
          orb.speedX *= -1
        }
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > canvas.height) {
          orb.speedY *= -1
        }
        
        // Create gradient for orb - only if coordinates are valid
        if (isFinite(orb.x) && isFinite(orb.y) && isFinite(orb.radius)) {
          try {
            const gradient = ctx.createRadialGradient(
              orb.x, orb.y, 0,
              orb.x, orb.y, orb.radius
            )
            gradient.addColorStop(0, orb.gradient.colorStart + '80') // 50% opacity
            gradient.addColorStop(1, orb.gradient.colorEnd + '00') // 0% opacity
            
            // Draw orb
            ctx.beginPath()
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.globalAlpha = orb.opacity
            ctx.fill()
          } catch (error) {
            // Skip if gradient creation fails
          }
          ctx.globalAlpha = 1
        }
      })
    }
    
    // Update and draw connections
    const updateConnections = () => {
      // Update existing connections
      for (let i = connections.length - 1; i >= 0; i--) {
        const connection = connections[i]
        
        // Decrease connection lifespan
        connection.life--
        
        // Remove expired connections
        if (connection.life <= 0) {
          // Decrease connection count for connected particles
          if (connection.from) connection.from.connections--
          if (connection.to) connection.to.connections--
          connections.splice(i, 1)
          continue
        }
        
        // Calculate connection opacity based on remaining life
        const opacity = (connection.life / connection.maxLife) * 0.8
        
        // Update pulse effect
        connection.pulsePhase += connection.pulseRate
        const pulseEffect = 1 + Math.sin(connection.pulsePhase) * 0.3 // 30% width variation
        
        // Create curved line calculations outside the path creation
        if (!connection.from || !connection.to || 
            !isFinite(connection.from.x) || !isFinite(connection.from.y) || 
            !isFinite(connection.to.x) || !isFinite(connection.to.y)) {
          // Skip invalid connections
          continue;
        }
        
        const midX = (connection.from.x + connection.to.x) / 2
        const midY = (connection.from.y + connection.to.y) / 2
        
        // Add a slight curve based on distance
        const dx = connection.to.x - connection.from.x
        const dy = connection.to.y - connection.from.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Update data position for data transfer effect
        if (connection.hasDataTransfer) {
          connection.dataPosition += connection.dataSpeed
          if (connection.dataPosition > 1) connection.dataPosition = 0
          
          // Disable data transfer if distance is invalid
          if (!isFinite(distance) || distance < 0.001) {
            connection.hasDataTransfer = false
          }
        }
        
        // Safety check for distance
        let offsetX = 0, offsetY = 0, midOffsetX = 0, midOffsetY = 0
        if (isFinite(distance) && distance > 0.001) {
          const curveOffset = Math.min(30, distance * 0.2)
          offsetX = -dy / distance * curveOffset
          offsetY = dx / distance * curveOffset
          
          // For flow lines, use the midOffset if available
          midOffsetX = connection.isFlow && connection.midOffset ? connection.midOffset : offsetX
          midOffsetY = connection.isFlow && connection.midOffset ? connection.midOffset : offsetY
        }
        
        // Draw connection with safer path creation
        const pathCreated = createCurvedPath(
          ctx, 
          connection.from.x, 
          connection.from.y, 
          connection.to.x, 
          connection.to.y, 
          midOffsetX, 
          midOffsetY
        )
        
        // Only style and stroke if path was created successfully
        if (pathCreated) {
          // Draw line with pulsing effect
          ctx.strokeStyle = connection.color
          ctx.lineWidth = connection.width * pulseEffect * (connection.life / connection.maxLife + 0.5)
          ctx.globalAlpha = opacity
          ctx.stroke()
        }
        
        // Draw data transfer dot if this connection has data
        if (connection.hasDataTransfer) {
          try {
            // Calculate position along the curve
            const t = connection.dataPosition
            const dataX = (1-t)*(1-t)*connection.from.x + 2*(1-t)*t*(midX + midOffsetX) + t*t*connection.to.x
            const dataY = (1-t)*(1-t)*connection.from.y + 2*(1-t)*t*(midY + midOffsetY) + t*t*connection.to.y
            
            // Check for valid values before drawing
            if (isFinite(dataX) && isFinite(dataY) && isFinite(connection.dataSize)) {
              // Draw data dot
              ctx.beginPath()
              ctx.arc(dataX, dataY, connection.dataSize, 0, Math.PI * 2)
              ctx.fillStyle = connection.dataColor || '#ffffff'
              ctx.globalAlpha = 0.9
              ctx.fill()
              
              // Add glow to data point
              try {
                const glowSize = Math.min(20, connection.dataSize * 3); // Limit size to avoid issues
                const glowGradient = ctx.createRadialGradient(
                  dataX, dataY, 0,
                  dataX, dataY, glowSize
                )
                glowGradient.addColorStop(0, connection.dataColor + '80') // 50% opacity
                glowGradient.addColorStop(1, connection.dataColor + '00') // 0% opacity
                
                ctx.beginPath()
                ctx.arc(dataX, dataY, glowSize, 0, Math.PI * 2)
                ctx.fillStyle = glowGradient
                ctx.globalAlpha = 0.4
                ctx.fill()
              } catch (error) {
                // Skip glow if gradient fails
              }
            }
          } catch (error) {
            // Silently handle any gradient errors
            console.error("Error drawing data point:", error);
            connection.hasDataTransfer = false; // Disable problematic data transfer
          }
        }
        
        ctx.globalAlpha = 1
      }
    }
    
    // Create dynamic flow lines
    const createFlowLines = () => {
      // Calculate remaining space for flow lines
      const usedConnections = connections.length
      const availableFlows = maxConnections - usedConnections
      
      if (availableFlows <= 0) return
      
      // Create 1-2 flow lines per frame if space available
      const numFlows = Math.min(2, availableFlows)
      
      for (let i = 0; i < numFlows; i++) {
        if (Math.random() < 0.15) { // Only occasionally create flow lines (reduced chance)
          // Choose a random cluster for the flow line
          const clusterIndices = [...new Set(particles.map(p => p.clusterIndex))]
          const clusterIndex = clusterIndices[Math.floor(Math.random() * clusterIndices.length)]
          
          // Get particles from this cluster
          const clusterParticles = particles.filter(p => p.clusterIndex === clusterIndex)
          
          if (clusterParticles.length < 2) continue
          
          // Select two random particles from the cluster that are far enough apart
          let attempts = 0
          let startParticle, endParticle
          let distance = 0
          
          // Try to find two particles that are at least 50px apart
          while (distance < 50 && attempts < 10) {
            attempts++
            startParticle = clusterParticles[Math.floor(Math.random() * clusterParticles.length)]
            endParticle = clusterParticles[Math.floor(Math.random() * clusterParticles.length)]
            
            if (startParticle === endParticle) continue
            
            const dx = endParticle.x - startParticle.x
            const dy = endParticle.y - startParticle.y
            distance = Math.sqrt(dx * dx + dy * dy)
          }
          
          if (distance < 50) continue // Skip if we couldn't find distant enough particles
          
          // Add to connections with longer lifespan
          connections.push({
            from: startParticle,
            to: endParticle,
            life: 60 + Math.random() * 60,
            maxLife: 60 + Math.random() * 60,
            color: getRandomColor(),
            width: Math.random() * 2 + 1,
            isFlow: true,
            // Calculate a midpoint that keeps the curve within the cluster
            midOffset: Math.random() * 30 - 15
          })
        }
      }
    }
    
    // Set canvas dimensions with optimized resize handling
    const handleResize = () => {
      // Use a timeout to prevent multiple resize events
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout)
      }
      
      window.resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        // Reset the particles when canvas is resized
        initializeParticlesAndNetwork()
      }, 250) // Delay to batch resize events
    }
    
    // Set initial dimensions immediately without delay
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Initialize particles right away
    initializeParticlesAndNetwork()
    
    // Start animation immediately for continuous effect
    animate()
    
    // Create flow lines less frequently for better performance
    const flowInterval = setInterval(createFlowLines, 3000)
    
    // Add the resize listener after initial setup
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(flowInterval)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, interactionStrength])

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
      
      {/* Canvas for particles and flows */}
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
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  )
}

export default AnimatedBackgroundEnhanced