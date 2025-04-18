"use client"

import { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'

const AnimatedBackgroundSimple = () => {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  // UI-matching colors
  const brandColors = {
    primaryBlue: '#1a75cb',
    secondaryBlue: '#4E7CFF',
    accentBlue: '#627fff',
    darkBlue: '#1e293b',
    gold: '#d4a650',
    lightBlue: '#9dc1e8',
    backgroundDark: '#00142d'
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Network animation state
  const networkState = useRef({
    phase: 'growing',  // 'growing' or 'shrinking'
    size: 0,           // Current size factor (0-1)
    maxSize: 1,        // Maximum size factor
    minSize: 0.3,      // Minimum size factor
    growSpeed: 0.005,  // Speed of growth
    shrinkSpeed: 0.003 // Speed of shrinking
  })
  
  // Connection creation cycle control
  const connectionCycle = useRef({
    timer: 0,                  // Current timer value
    createInterval: 15,       // Create connections every X frames
    burstSize: 10,             // How many connections to create at once
    removeInterval: 200,       // Remove connections every X frames
    removeBurstSize: 3,       // How many connections to remove at once
    phase: 'create',          // Current phase ('create' or 'remove')
    createDuration: 1000,      // How many frames to stay in create phase
    removeDuration: 10,      // How many frames to stay in remove phase
    phaseTimer: 0             // Timer for current phase
  })
  
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set initial dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Increased particle count for more clusters
    const maxParticles = 200;
    const maxConnections = 1000; // Increased max connections
    const connectionDistance = 300; // Slightly increased connection distance

    // Particles and connections
    let particles = [];
    let connections = [];

    // Initialize particles in clusters
    const initializeParticles = () => {
      particles = [];
      connections = [];

      // Create clusters
      const numClusters = 60;
      const clusters = [];

      for (let i = 0; i < numClusters; i++) {
        clusters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 80 + 80,
          color: getRandomColor(),
        });
      }

      // Add particles to clusters
      for (let i = 0; i < maxParticles; i++) {
        const clusterIndex = Math.floor(Math.random() * numClusters);
        const cluster = clusters[clusterIndex];

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * cluster.radius;
        const x = cluster.x + Math.cos(angle) * distance;
        const y = cluster.y + Math.sin(angle) * distance;

        particles.push({
          x,
          y,
          size: Math.random() * 2 + 1.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          clusterIndex,
          color: cluster.color,
        });
      }

      // Create initial connections
      createInitialConnections();

      // Add some cross-cluster connections for a more interconnected network
      createCrossClusterConnections();
    };

    // Create cross-cluster connections for a more interconnected network
    const createCrossClusterConnections = () => {
      // Number of cross-cluster connections to create
      const numCrossConnections = Math.min(
        maxConnections - connections.length,
        200
      );

      for (let i = 0; i < numCrossConnections; i++) {
        // Get two random particles from different clusters
        if (particles.length < 2) break;

        // Select first particle
        const particleA =
          particles[Math.floor(Math.random() * particles.length)];

        // Find particles in different clusters within extended distance
        const potentialParticles = particles.filter((p) => {
          // Must be from different cluster
          if (p.clusterIndex === particleA.clusterIndex) return false;

          // Check distance
          const dx = p.x - particleA.x;
          const dy = p.y - particleA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Use a slightly larger distance for cross-cluster
          return distance < connectionDistance * 1.5;
        });

        if (potentialParticles.length === 0) continue;

        // Select second particle
        const particleB =
          potentialParticles[
            Math.floor(Math.random() * potentialParticles.length)
          ];

        // Check if connection already exists
        const connectionExists = connections.some(
          (conn) =>
            (conn.from === particleA && conn.to === particleB) ||
            (conn.from === particleB && conn.to === particleA)
        );

        if (!connectionExists) {
          // Create connection with slightly thinner lines for cross-cluster
          connections.push({
            from: particleA,
            to: particleB,
            // Blend the colors of both particles for cross-cluster connections
            color: blendColors(particleA.color, particleB.color),
            width: Math.random() * 0.4 + 0.2, // Thinner than in-cluster connections
            isCrossCluster: true,
            highlight: 1.0, // Start with full highlight
            highlightFade: 0.01, // Slower fade for cross-cluster highlights
          });
        }
      }
    };
    
    // Blend two colors with simple averaging (for cross-cluster connections)
    const blendColors = (color1, color2) => {
      try {
        // Simple implementation - just use one of the colors
        return Math.random() < 0.5 ? color1 : color2;
      } catch (e) {
        return brandColors.primaryBlue; // Fallback
      }
    };
    
    // Create some initial connections
    const createInitialConnections = () => {
      // Group particles by cluster
      const clusterGroups = {};

      particles.forEach((particle) => {
        if (!clusterGroups[particle.clusterIndex]) {
          clusterGroups[particle.clusterIndex] = [];
        }
        clusterGroups[particle.clusterIndex].push(particle);
      });

      // Create connections within clusters
      Object.values(clusterGroups).forEach((clusterParticles) => {
        for (let i = 0; i < clusterParticles.length; i++) {
          const particleA = clusterParticles[i];

          // Connect to 2-4 other particles in same cluster
          const connectCount = Math.floor(Math.random() * 3) + 4;

          for (let j = 0; j < connectCount; j++) {
            if (connections.length >= maxConnections) break;

            // Find a random particle in the same cluster
            const availableParticles = clusterParticles.filter((p, index) => {
              if (index === i) return false; // Skip self

              // Check if already connected
              const alreadyConnected = connections.some(
                (conn) =>
                  (conn.from === particleA && conn.to === p) ||
                  (conn.from === p && conn.to === particleA)
              );

              if (alreadyConnected) return false;

              // Check distance
              const dx = p.x - particleA.x;
              const dy = p.y - particleA.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              return distance < connectionDistance;
            });

            if (availableParticles.length > 0) {
              const particleB =
                availableParticles[
                  Math.floor(Math.random() * availableParticles.length)
                ];

              connections.push({
                from: particleA,
                to: particleB,
                color: particleA.color,
                width: Math.random() * 0.8 + 0.3,
                highlight: 1.0, // Start with full highlight
                highlightFade: 0.02, // Fade speed per frame
              });
            }
          }
        }
      });
    };

    // Get random brand color matching UI
    const getRandomColor = () => {
      const colors = [
        brandColors.primaryBlue,
        brandColors.secondaryBlue,
        brandColors.accentBlue,
        brandColors.lightBlue,
        brandColors.gold,
      ];
      // Weighted distribution: more blues, less gold
      const weights = [0.25, 0.25, 0.25, 0.15, 0.1]; // 90% blues, 10% gold
      
      // Generate random number
      const random = Math.random();
      let sum = 0;
      
      // Select color based on weight
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) {
          return colors[i];
        }
      }
      
      return colors[0]; // Fallback
    };

    // Function to create a random connection
    const createRandomConnection = (sizeFactor) => {
      if (particles.length < 2) return false;
      
      // Find two random particles to connect
      const particleA = particles[Math.floor(Math.random() * particles.length)];
      
      // Find particles within connection distance
      const potentialParticles = particles.filter(p => {
        if (p === particleA) return false;
        
        // Check if already connected
        const alreadyConnected = connections.some(conn => 
          (conn.from === particleA && conn.to === p) || 
          (conn.from === p && conn.to === particleA)
        );
        
        if (alreadyConnected) return false;
        
        // Check distance
        const dx = p.x - particleA.x;
        const dy = p.y - particleA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Use current network size to determine connection distance
        const currentDist = connectionDistance * sizeFactor;
        
        // 30% chance to create cross-cluster connections (longer range)
        const isCrossCluster = p.clusterIndex !== particleA.clusterIndex;
        const distanceFactor = isCrossCluster ? 1.5 : 1.0;
        
        return distance < currentDist * distanceFactor;
      });
      
      if (potentialParticles.length === 0) return false;
      
      // Select second particle
      const particleB = potentialParticles[Math.floor(Math.random() * potentialParticles.length)];
      
      // Create the connection
      const isCrossCluster = particleA.clusterIndex !== particleB.clusterIndex;
      connections.push({
        from: particleA,
        to: particleB,
        color: isCrossCluster
          ? blendColors(particleA.color, particleB.color)
          : particleA.color,
        width:
          Math.random() * (isCrossCluster ? 0.4 : 0.7) +
          (isCrossCluster ? 0.2 : 0.3),
        isCrossCluster: isCrossCluster,
        highlight: 1.0, // Start with full highlight
        highlightFade: 0.02, // Fade speed per frame
      });
      
      return true;
    };

    // Animation loop with growing/shrinking effect
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Schedule next frame first
      animationRef.current = requestAnimationFrame(animate);
      
      // Update network size based on current phase
      const network = networkState.current;
      if (network.phase === 'growing') {
        network.size += network.growSpeed;
        
        if (network.size >= network.maxSize) {
          network.size = network.maxSize;
          network.phase = 'shrinking';
        }
      } else { // shrinking
        network.size -= network.shrinkSpeed;
                
        if (network.size <= network.minSize) {
          network.size = network.minSize;
          network.phase = 'growing';
        }
      }
      
      // Handle connection creation/removal cycle
      const cycle = connectionCycle.current;
      cycle.timer++;
      cycle.phaseTimer++;
      
      // Check if we need to switch phases
      if (cycle.phase === 'create' && cycle.phaseTimer >= cycle.createDuration) {
        cycle.phase = 'remove';
        cycle.phaseTimer = 0;
      } else if (cycle.phase === 'remove' && cycle.phaseTimer >= cycle.removeDuration) {
        cycle.phase = 'create';
        cycle.phaseTimer = 0;
      }
      
      // Create connections in bursts during create phase
      if (cycle.phase === 'create' && cycle.timer % cycle.createInterval === 0) {
        // Create a burst of connections
        for (let i = 0; i < cycle.burstSize && connections.length < maxConnections; i++) {
          createRandomConnection(network.size);
        }
      }
      
      // Remove connections in bursts during remove phase
      if (cycle.phase === 'remove' && cycle.timer % cycle.removeInterval === 0) {
        // Remove a burst of connections
        for (let i = 0; i < cycle.removeBurstSize && connections.length > 0; i++) {
          const connectionIndex = Math.floor(Math.random() * connections.length);
          connections.splice(connectionIndex, 1);
        }
      }
      
      // Calculate current connection distance based on network size
      const currentConnectionDistance = connectionDistance * network.size;

      // Update particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Boundary check with bounce instead of wrap (more efficient)
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }

        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle (simple circle, no gradients)
        const displaySize = particle.size * (0.8 + network.size * 0.4); // Size varies with network
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, displaySize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw only connections within the current distance threshold
      connections.forEach((connection) => {
        const fromX = connection.from.x;
        const fromY = connection.from.y;
        const toX = connection.to.x;
        const toY = connection.to.y;
        
        // Calculate actual distance between points
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw connection if within current threshold
        if (distance <= currentConnectionDistance) {
          // Calculate opacity based on distance and network size
          const distanceFactor = 1 - distance / currentConnectionDistance;
          const opacityFactor = distanceFactor * network.size * 0.7;

          // Simple straight line connections
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.strokeStyle = connection.color;
          ctx.lineWidth = connection.width * (0.5 + network.size * 0.8); // Line width varies with network
          ctx.globalAlpha = Math.max(0.1, Math.min(0.6, opacityFactor)); // Keep opacity between 0.1-0.6
          ctx.stroke();

          // Draw highlight effect on new connections
          if (connection.highlight > 0) {
            // Draw a gold/bright highlight over the connection
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.strokeStyle = brandColors.gold; // Use gold color for highlight
            ctx.lineWidth =
              connection.width *
              (0.5 + network.size * 0.8) *
              (1 + connection.highlight);
            ctx.globalAlpha = connection.highlight * 0.7;
            ctx.stroke();

            // Reduce highlight for next frame
            connection.highlight -= connection.highlightFade;
          }

          ctx.globalAlpha = 1;
        }
      });
    };

    // Basic resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Initialize and start animation
    initializeParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
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
          background: brandColors.backgroundDark,
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