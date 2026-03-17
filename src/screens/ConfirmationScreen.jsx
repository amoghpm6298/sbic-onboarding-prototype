import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './ConfirmationScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const CONFETTI_COLORS = ['#1FA8E1', '#292075', '#0095D9', '#5ee8a0', '#ffc107', '#ff6b6b', '#a855f7']

export default function ConfirmationScreen({ direction, fdConfig, rate, goTo }) {
  const confettiRef = useRef(null)

  useEffect(() => {
    const container = confettiRef.current
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div')
      el.className = 'confetti-bit'
      el.style.left = Math.random() * 100 + '%'
      el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      el.style.animationDelay = Math.random() * 1.5 + 's'
      el.style.width = (4 + Math.random() * 6) + 'px'
      el.style.height = (4 + Math.random() * 6) + 'px'
      container.appendChild(el)
    }
  }, [])

  const timeline = [
    { status: 'done', icon: '✓', title: 'FD Booked', detail: `${fmtINR(fdConfig.amount)} with ${fdConfig.bank} @ ${rate.toFixed(2)}%` },
    { status: 'done', icon: '✓', title: 'Video KYC Completed', detail: 'Identity verified via video call' },
    { status: 'done', icon: '✓', title: 'Application Submitted', detail: '17 Mar 2026, 9:41 AM' },
    { status: 'pend', icon: '⏲', title: 'Card Approval', detail: 'Within 24 hours' },
    { status: 'future', icon: '📦', title: 'Card Delivery', detail: '5–7 business days' },
  ]

  return (
    <ScreenWrapper direction={direction}>
      <div className="confirm-wrap">
        <div className="confetti-box" ref={confettiRef} />

        <motion.div
          className="big-check"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="45" height="45">
            <motion.path
              d="M14 27 L22 35 L38 16"
              stroke="#1a8a4a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 className="confirm-title">Application Submitted!</h1>
        <p className="confirm-sub">We're processing your application</p>
        <div className="app-tag">SBIC-2026-78432</div>

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

        <div className="dual-cta">
          <CtaButton variant="primary" className="small-cta">Track Application</CtaButton>
          <CtaButton variant="outline" className="small-cta" onClick={() => goTo(1)}>Home</CtaButton>
        </div>
      </div>
    </ScreenWrapper>
  )
}
