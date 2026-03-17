import { motion } from 'framer-motion'
import './ScreenWrapper.css'

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function ScreenWrapper({ direction, dark, children, bottomBar }) {
  return (
    <motion.div
      className={`screen ${dark ? 'screen--dark' : ''}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="screen-scroll">
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
