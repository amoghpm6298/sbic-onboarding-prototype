import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import './ScreenWrapper.css'

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '30%' : '-30%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-15%' : '15%', opacity: 0 }),
}

export default function ScreenWrapper({ direction, dark, children, bottomBar }) {
  const scrollRef = useRef(null)

  // Reset scroll to top when screen mounts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [])

  return (
    <motion.div
      className={`screen ${dark ? 'screen--dark' : ''}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="screen-scroll" ref={scrollRef}>
        {children}
      </div>
      {bottomBar && (
        <div className="bottom-bar">
          {bottomBar}
        </div>
      )}
    </motion.div>
  )
}

export function CtaButton({ children, onClick, variant = 'primary', className = '' }) {
  return (
    <button
      className={`cta-btn cta-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function BackButton({ onClick }) {
  return (
    <button className="cta-btn cta-back" onClick={onClick}>
      ←
    </button>
  )
}
