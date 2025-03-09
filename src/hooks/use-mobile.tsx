
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set up listener for window resize
    mql.addEventListener("change", onChange)
    
    // Clean up
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
