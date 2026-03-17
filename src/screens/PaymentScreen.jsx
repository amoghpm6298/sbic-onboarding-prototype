import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './PaymentScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', color: '#4285F4', icon: 'G' },
  { id: 'phonepe', name: 'PhonePe', color: '#5f259f', icon: 'P' },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2', icon: 'P' },
  { id: 'bhim', name: 'BHIM', color: '#00796B', icon: 'B' },
]

export default function PaymentScreen({ direction, fdConfig, rate, creditLimit, maturity, onNext, onBack }) {
  const [phase, setPhase] = useState('select') // select | processing | success
  const [method, setMethod] = useState('upi')
  const [selectedApp, setSelectedApp] = useState('gpay')

  useEffect(() => {
    if (phase !== 'processing') return
    const timer = setTimeout(() => setPhase('success'), 3000)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'success') return
    const timer = setTimeout(() => onNext(), 2500)
    return () => clearTimeout(timer)
  }, [phase, onNext])

  // Payment selection
  if (phase === 'select') {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={() => setPhase('processing')}>
              Pay {fmtINR(fdConfig.amount)}
            </CtaButton>
          </>
        }
      >
        <h1>Book Your Fixed Deposit</h1>
        <p className="helper-text">Complete payment to book your FD and get your secured credit card.</p>

        <div className="pay-summary-card">
          <div className="pay-sum-row">
            <span className="psl">FD Amount</span>
            <span className="psv">{fmtINR(fdConfig.amount)}</span>
          </div>
          <div className="pay-sum-row">
            <span className="psl">Bank</span>
            <span className="psv">{fdConfig.bank}</span>
          </div>
          <div className="pay-sum-row">
            <span className="psl">Tenure</span>
            <span className="psv">{fdConfig.tenure} {fdConfig.tenure === 1 ? 'Year' : 'Years'}</span>
          </div>
          <div className="pay-sum-row">
            <span className="psl">Interest Rate</span>
            <span className="psv">{rate.toFixed(2)}% p.a.</span>
          </div>
          <div className="pay-sum-row highlight">
            <span className="psl">Credit Limit</span>
            <span className="psv">{fmtINR(creditLimit)}</span>
          </div>
        </div>

        <div className="section-title">Payment Method</div>

        <div className="method-tabs">
          <button
            className={`method-tab ${method === 'upi' ? 'active' : ''}`}
            onClick={() => setMethod('upi')}
          >
            UPI
          </button>
          <button
            className={`method-tab ${method === 'netbanking' ? 'active' : ''}`}
            onClick={() => setMethod('netbanking')}
          >
            Net Banking
          </button>
          <button
            className={`method-tab ${method === 'card' ? 'active' : ''}`}
            onClick={() => setMethod('card')}
          >
            Debit Card
          </button>
        </div>

        {method === 'upi' && (
          <div className="upi-apps">
            {UPI_APPS.map((app) => (
              <button
                key={app.id}
                className={`upi-app ${selectedApp === app.id ? 'active' : ''}`}
                onClick={() => setSelectedApp(app.id)}
              >
                <div className="upi-app-icon" style={{ background: app.color }}>
                  {app.icon}
                </div>
                <span className="upi-app-name">{app.name}</span>
                <div className="upi-radio">
                  {selectedApp === app.id && <div className="upi-radio-dot" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {method === 'netbanking' && (
          <div className="nb-info">
            <div className="nb-bank-row">
              <span className="nb-icon">🏦</span>
              <span>You will be redirected to {fdConfig.bank}'s net banking portal to complete the payment.</span>
            </div>
          </div>
        )}

        {method === 'card' && (
          <div className="card-form">
            <div className="form-field">
              <label className="ff-label">Card Number</label>
              <input className="ff-input" type="text" placeholder="XXXX XXXX XXXX XXXX" readOnly value="4321 XXXX XXXX 8901" />
            </div>
            <div className="card-form-row">
              <div className="form-field">
                <label className="ff-label">Expiry</label>
                <input className="ff-input" type="text" placeholder="MM/YY" readOnly value="09/28" />
              </div>
              <div className="form-field">
                <label className="ff-label">CVV</label>
                <input className="ff-input" type="text" placeholder="***" readOnly value="•••" />
              </div>
            </div>
          </div>
        )}

        <div className="secure-badge">
          🔒 256-bit SSL Encrypted. Your payment is secure.
        </div>
      </ScreenWrapper>
    )
  }

  // Processing
  if (phase === 'processing') {
    return (
      <ScreenWrapper direction={direction}>
        <div className="processing-screen">
          <motion.div
            className="processing-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 50 50" width="60" height="60">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#e8ebf0" strokeWidth="4" />
              <circle cx="25" cy="25" r="20" fill="none" stroke="#292075" strokeWidth="4"
                strokeDasharray="80" strokeDashoffset="60" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.h1
            style={{ textAlign: 'center', fontSize: 18, marginTop: 24 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Processing Payment...
          </motion.h1>
          <motion.p
            className="processing-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Booking FD of {fmtINR(fdConfig.amount)} with {fdConfig.bank}
          </motion.p>

          <motion.div
            className="processing-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <ProcessingStep label="Verifying payment..." delay={0} done={true} />
            <ProcessingStep label="Booking Fixed Deposit..." delay={1.2} done={false} />
            <ProcessingStep label="Generating card offer..." delay={2.2} done={false} />
          </motion.div>
        </div>
      </ScreenWrapper>
    )
  }

  // Success
  return (
    <ScreenWrapper direction={direction}>
      <div className="pay-success-screen">
        <motion.div
          className="pay-success-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="50" height="50">
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

        <motion.h1
          style={{ textAlign: 'center', fontSize: 20 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          FD Booked Successfully!
        </motion.h1>

        <motion.p
          style={{ textAlign: 'center', fontSize: 13, color: '#999', marginBottom: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {fmtINR(fdConfig.amount)} @ {rate.toFixed(2)}% p.a. for {fdConfig.tenure} {fdConfig.tenure === 1 ? 'year' : 'years'}
        </motion.p>

        <motion.div
          className="pay-success-tag"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          Loading your card details...
        </motion.div>
      </div>
    </ScreenWrapper>
  )
}

function ProcessingStep({ label, delay, done }) {
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('active'), delay * 1000)
    const t2 = setTimeout(() => setStatus('done'), (delay + 1) * 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])

  return (
    <div className={`proc-step ${status}`}>
      <div className="proc-icon">
        {status === 'done' ? '✓' : status === 'active' ? '⏳' : '○'}
      </div>
      <span>{label}</span>
    </div>
  )
}
