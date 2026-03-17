import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './PaymentScreen.css'

function fmtINR(n) {
  return '\u20B9' + n.toLocaleString('en-IN')
}

const UPI_APPS = [
  { id: 'phonepe', name: 'PhonePe', color: '#5f259f', icon: 'P' },
  { id: 'gpay', name: 'Google Pay', color: '#4285F4', icon: 'G' },
  { id: 'cred', name: 'CRED', color: '#1a1a2e', icon: 'C' },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2', icon: 'P' },
]

export default function PaymentScreen({ direction, fdConfig, rate, creditLimit, maturity, onNext, onBack }) {
  const [phase, setPhase] = useState('select') // select | processing
  const [selectedApp, setSelectedApp] = useState('gpay')
  const [processingDone, setProcessingDone] = useState(false)

  useEffect(() => {
    if (phase !== 'processing') return
    const t1 = setTimeout(() => setProcessingDone(true), 3000)
    const t2 = setTimeout(() => onNext(), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase, onNext])

  // Payment selection
  if (phase === 'select') {
    const isHighInterest = rate > 7

    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={() => setPhase('processing')}>Continue</CtaButton>
          </>
        }
      >
        <h1>Complete your payment</h1>
        <p className="helper-text">On maturity, you will receive your funds in the same account that you use for making your payment</p>

        {/* Summary card */}
        <div className="pay-summary-card">
          <div className="pay-label">Paying</div>
          <div className="pay-amount">{fmtINR(fdConfig.amount)}</div>
          <div className="pay-bank-row">
            <div className="pay-bank-dot" />
            <span className="pay-bank-name">{fdConfig.bank}</span>
          </div>

          <div className="pay-details-grid">
            <div className="pay-detail">
              <div className="pd-label">Tenure</div>
              <div className="pd-value">{fdConfig.tenure} {fdConfig.tenure === 1 ? 'Year' : 'Years'}</div>
            </div>
            <div className="pay-detail">
              <div className="pd-label">Interest</div>
              <div className="pd-value">
                {rate.toFixed(2)}%
                {isHighInterest && <span className="high-interest-badge">HIGH INTEREST</span>}
              </div>
            </div>
            <div className="pay-detail">
              <div className="pd-label">Credit Limit</div>
              <div className="pd-value">{fmtINR(creditLimit)}</div>
            </div>
          </div>
        </div>

        {/* UPI apps */}
        <div className="section-title">Pay via UPI</div>
        <div className="upi-apps-row">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              className={`upi-app-circle ${selectedApp === app.id ? 'active' : ''}`}
              onClick={() => setSelectedApp(app.id)}
            >
              <div className="upi-icon-circle" style={{ background: app.color }}>
                {app.icon}
              </div>
              <span className="upi-app-label">{app.name}</span>
            </button>
          ))}
        </div>

        <div className="secure-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <path d="M7 1L2 3.5V6.5C2 9.8 4.1 12.6 7 13C9.9 12.6 12 9.8 12 6.5V3.5L7 1Z" stroke="#999" strokeWidth="1" fill="none"/>
            <path d="M5 7L6.5 8.5L9 5.5" stroke="#999" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>256-bit SSL Encrypted. Your payment is secure.</span>
        </div>
      </ScreenWrapper>
    )
  }

  // Processing (with transition to success)
  return (
    <ScreenWrapper direction={direction}>
      <div className="processing-screen">
        {/* Concentric circles */}
        <div className="concentric-wrap">
          <motion.div
            className="concentric-circle c1"
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.05, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="concentric-circle c2"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.08, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div
            className="concentric-circle c3"
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.12, 0.25] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <motion.div
            className="concentric-circle c4"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />

          {/* Center dot / checkmark */}
          <AnimatePresence mode="wait">
            {!processingDone ? (
              <motion.div
                key="dot"
                className="center-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            ) : (
              <motion.div
                key="check"
                className="center-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <motion.path
                    d="M5 12L10 17L19 7"
                    stroke="#fff"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text */}
        <AnimatePresence mode="wait">
          {!processingDone ? (
            <motion.div
              key="connecting"
              className="proc-text-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="proc-title">Connecting you to {fdConfig.bank}</h2>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="proc-text-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="proc-title proc-title-success">FD Booked Successfully!</h2>
              <p className="proc-sub">{fmtINR(fdConfig.amount)} @ {rate.toFixed(2)}% p.a.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DICGC trust signal */}
        <motion.div
          className="dicgc-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="dicgc-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 1L3 4.5V9C3 13.5 5.8 17.3 10 18C14.2 17.3 17 13.5 17 9V4.5L10 1Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.2"/>
              <path d="M7 10L9 12L13 7.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="dicgc-text">
            <span className="dicgc-main">Up to &#8377;5 lakh is insured by DICGC</span>
            <span className="dicgc-sub">A wholly owned subsidiary of RBI</span>
          </div>
        </motion.div>
      </div>
    </ScreenWrapper>
  )
}
