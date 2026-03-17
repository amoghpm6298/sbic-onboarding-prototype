import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './KYCScreen.css'

const requirements = [
  { icon: '📷', text: 'Working camera & microphone' },
  { icon: '💡', text: 'Good lighting' },
  { icon: '💳', text: 'Original PAN card' },
  { icon: '📶', text: 'Stable internet connection' },
]

const vSteps = [
  { id: 1, pending: 'Verifying face...', done: 'Face verified' },
  { id: 2, pending: 'Checking PAN card...', done: 'PAN verified' },
  { id: 3, pending: 'Confirming details...', done: 'Details confirmed' },
]

export default function KYCScreen({ direction, onNext, onBack }) {
  const [phase, setPhase] = useState('prep') // prep | video | success
  const [connected, setConnected] = useState(false)
  const [activeStep, setActiveStep] = useState(0) // 0 = none, 1-3 in progress, 4 = all done
  const [doneSteps, setDoneSteps] = useState([])

  const startVkyc = useCallback(() => {
    setPhase('video')
    setConnected(false)
    setActiveStep(0)
    setDoneSteps([])
  }, [])

  useEffect(() => {
    if (phase !== 'video') return
    const timers = []

    timers.push(setTimeout(() => setConnected(true), 2000))
    timers.push(setTimeout(() => setActiveStep(1), 2500))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 1]); setActiveStep(2); }, 4000))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 2]); setActiveStep(3); }, 5500))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 3]); setActiveStep(4); }, 7000))
    timers.push(setTimeout(() => setPhase('success'), 8000))

    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Prep phase
  if (phase === 'prep') {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={startVkyc}>Start Video KYC</CtaButton>
          </>
        }
      >
        <h1>Verify Your Identity</h1>
        <p className="helper-text">Complete a quick Video KYC. This is a mandatory step.</p>

        <div className="kyc-req-card">
          <div className="section-title" style={{ marginTop: 0 }}>What You'll Need</div>
          {requirements.map((r) => (
            <div className="req-row" key={r.text}>
              <div className="req-icon">{r.icon}</div>
              <span>{r.text}</span>
            </div>
          ))}
        </div>

        <div className="info-card">
          <div className="info-row"><span className="label">Name</span><span className="val">Rahul Sharma</span></div>
          <div className="info-row"><span className="label">PAN</span><span className="val">XXXXX1234X</span></div>
          <div className="info-row"><span className="label">Aadhaar</span><span className="val">XXXX XXXX 4523</span></div>
        </div>

        <div className="warn-banner">
          <span className="warn-icon">⚠️</span>
          <span>A live agent will verify your identity via video call. The process takes approximately 3–5 minutes.</span>
        </div>
      </ScreenWrapper>
    )
  }

  // Video phase
  if (phase === 'video') {
    return (
      <ScreenWrapper direction={direction}>
        <div className="vkyc-video">
          <div className="viewfinder">
            <motion.div
              className="vf-ring"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="vf-icon">👤</span>
          </div>

          <motion.div
            className="v-status"
            animate={{ color: connected ? '#5ee8a0' : '#ffffff' }}
          >
            {connected ? 'Connected' : 'Connecting to KYC Agent...'}
          </motion.div>

          <AnimatePresence>
            {connected && (
              <motion.div
                className="v-agent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                KYC Agent: Priya M.
              </motion.div>
            )}
          </AnimatePresence>

          {connected && (
            <div className="v-indicators">
              <div className="v-ind on"><div className="vdot" /> Camera</div>
              <div className="v-ind on"><div className="vdot" /> Audio</div>
            </div>
          )}

          <div className="v-steps-list">
            {vSteps.map((s) => {
              const isDone = doneSteps.includes(s.id)
              const isActive = activeStep === s.id
              return (
                <motion.div
                  key={s.id}
                  className={`v-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  animate={{ opacity: isActive || isDone ? 1 : 0.4 }}
                >
                  <div className="v-step-icon">
                    {isDone ? '✓' : isActive ? '⏳' : s.id}
                  </div>
                  <span>{isDone ? s.done : s.pending}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </ScreenWrapper>
    )
  }

  // Success phase
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Continue</CtaButton>}
    >
      <div className="kyc-success">
        <motion.div
          className="success-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="40" height="40">
            <motion.path
              d="M14 27 L22 35 L38 16"
              stroke="#1a8a4a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 style={{ textAlign: 'center', fontSize: 18 }}>Video KYC Completed!</h1>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginBottom: 20 }}>
          Your identity has been verified successfully
        </p>
      </div>

      <div className="info-card" style={{ border: '1.5px solid #d4f5e2' }}>
        <div className="ok-list">
          {['Identity Verified', 'Face Match Confirmed', 'PAN Verified', 'Address Confirmed'].map((item) => (
            <div className="ok-item" key={item}>
              <div className="ok-check">✓</div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card">
        <div className="section-title" style={{ marginTop: 0 }}>Verified Details</div>
        <div className="info-row"><span className="label">Full Name</span><span className="val">Rahul Sharma</span></div>
        <div className="info-row"><span className="label">Date of Birth</span><span className="val">15 Mar 1992</span></div>
        <div className="info-row"><span className="label">Address</span><span className="val">Sector 15, Gurugram</span></div>
      </div>
    </ScreenWrapper>
  )
}
