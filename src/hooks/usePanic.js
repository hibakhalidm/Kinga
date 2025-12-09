import { useEffect, useRef } from 'react';

const usePanic = () => {
  const lastEscPress = useRef(0);

  useEffect(() => {
    // Desktop: Double ESC Listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscPress.current < 500) {
          triggerPanic();
        }
        lastEscPress.current = now;
      }
    };

    // Mobile: Shake Listener
    // Acceleration threshold in m/s²
    const SHAKE_THRESHOLD = 25; 
    
    const handleMotion = (e) => {
      if (!e.acceleration) return;
      
      const { x, y, z } = e.acceleration;
      const xVal = Math.abs(x || 0);
      const yVal = Math.abs(y || 0);
      const zVal = Math.abs(z || 0);
      
      if (xVal > SHAKE_THRESHOLD || yVal > SHAKE_THRESHOLD || zVal > SHAKE_THRESHOLD) {
        triggerPanic();
      }
    };

    const triggerPanic = () => {
      // Immediate redirect to a safe, neutral site
      window.location.href = 'https://www.google.com/search?q=weather';
    };

    // Attach Event Listeners
    window.addEventListener('keydown', handleKeyDown);
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion);
    }

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);
};

export default usePanic;
