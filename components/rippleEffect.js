// Ripple effect utility for enhanced visual effects

export const createRippleEffect = (canvas, ctx, x, y, color) => {
  const ripple = {
    x,
    y,
    radius: 0,
    maxRadius: 100 + Math.random() * 50,
    opacity: 0.6,
    color: color || '#4E7CFF',
    speed: 2 + Math.random() * 2
  };
  
  // Add the ripple to a global array
  if (!window.rippleEffects) {
    window.rippleEffects = [];
  }
  
  window.rippleEffects.push(ripple);
  
  // Limit number of simultaneous ripples
  if (window.rippleEffects.length > 5) {
    window.rippleEffects.shift();
  }
  
  return ripple;
};

export const updateRipples = (ctx) => {
  if (!window.rippleEffects) return;
  
  // Update and draw all ripples
  for (let i = window.rippleEffects.length - 1; i >= 0; i--) {
    const ripple = window.rippleEffects[i];
    
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
      window.rippleEffects.splice(i, 1);
    }
  }
};

export const clearRipples = () => {
  if (window.rippleEffects) {
    window.rippleEffects = [];
  }
};
