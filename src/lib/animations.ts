
import { useEffect, useState } from 'react';

export function useDelayedAppear(delay: number = 100) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
}

export function useSmoothCounter(targetValue: number, duration: number = 1000, startValue: number = 0) {
  const [currentValue, setCurrentValue] = useState(startValue);
  
  useEffect(() => {
    let startTime: number;
    const initialValue = currentValue;
    const valueToAdd = targetValue - initialValue;
    
    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      setCurrentValue(initialValue + valueToAdd * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
    
    return () => {
      // Cleanup if needed
    };
  }, [targetValue, duration]);
  
  return Math.round(currentValue);
}

// Easing function: quadratic ease-out
function easeOutQuad(t: number): number {
  return t * (2 - t);
}
