import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper from '../components/ScreenWrapper'
import './ProcessingScreen.css'

const STEPS = [
  'Confirming your FD selection',
  'Placing lien with your bank',
  'Checking card eligibility',
]

export default function ProcessingScreen({ direction, bankName, onNext }) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])

  useEffect(() => {
    const timers = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setDoneSteps(d => [...d, i]), 650 * (i + 1)))
      timers.push(setTimeout(() => setActiveStep(i + 1), 650 * (i + 1)))
    })
    timers.push(setTimeout(onNext, 650 * STEPS.length + 400))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenWrapper direction={direction}>
      <div className="processing-screen">
        <div className="processing-spinner" />
        <h1 className="processing-title">Setting up your card</h1>
        <p className="processing-subtitle">
          {bankName ? `Talking to ${bankName} to confirm your FD...` : 'This will just take a moment...'}
        </p>

        <div className="processing-steps">
          {STEPS.map((label, i) => {
            const isDone = doneSteps.includes(i)
            const isActive = activeStep === i && !isDone
            return (
              <div key={label} className={`proc-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                <div className="proc-step-icon">
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.svg key="check" width="14" height="14" viewBox="0 0 14 14" fill="none"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <circle cx="7" cy="7" r="7" fill="#16a34a" />
                        <path d="M4 7L6 9.5L10 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    ) : isActive ? (
                      <motion.div key="spin" className="proc-step-spin" />
                    ) : (
                      <div key="pending" className="proc-step-dot" />
                    )}
                  </AnimatePresence>
                </div>
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </ScreenWrapper>
  )
}
