import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './ConfirmationScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

export default function ConfirmationScreen({ direction, fdConfig, rate, goTo }) {
  const timeline = [
    { status: 'done', icon: '✓', title: 'FD Booked', detail: `${fmtINR(fdConfig.amount)} with ${fdConfig.bank} @ ${rate.toFixed(2)}%` },
    { status: 'done', icon: '✓', title: 'KYC Completed', detail: 'Identity verified successfully' },
    { status: 'done', icon: '✓', title: 'Application Submitted', detail: '17 Mar 2026, 9:41 AM' },
    { status: 'pend', icon: '⏲', title: 'Card Approval', detail: 'Within 24 hours' },
    { status: 'future', icon: '📦', title: 'Card Delivery', detail: '5–7 business days' },
  ]

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={() => goTo(1)}>Back to Home</CtaButton>}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          className="big-check"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="40" height="40">
            <motion.path
              d="M14 27 L22 35 L38 16"
              stroke="#16a34a" strokeWidth="3" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 className="confirm-title">Application Submitted!</h1>
        <p className="confirm-sub">We're processing your application</p>
        <div className="app-tag">SBIC-2026-78432</div>
      </div>

      <div className="info-card" style={{ textAlign: 'left' }}>
        <div className="timeline">
          {timeline.map((item) => (
            <div className="tl-item" key={item.title}>
              <div className={`tl-dot ${item.status}`}>{item.icon}</div>
              <strong>{item.title}</strong>
              <div className="tl-detail">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="vcard-teaser">
        💳 Your virtual card will be available instantly upon approval
      </div>
    </ScreenWrapper>
  )
}
