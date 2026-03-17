import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './EntryScreen.css'

export default function EntryScreen({ direction, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Get Started</CtaButton>}
    >
      {/* Hero illustration */}
      <div className="hero-section">
        <motion.div
          className="hero-card-stack"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* FD visual */}
          <motion.div
            className="hero-fd"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="hero-fd-label">Fixed Deposit</div>
            <div className="hero-fd-rate">7.10% <span>p.a.</span></div>
            <div className="hero-fd-bar">
              <motion.div
                className="hero-fd-fill"
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="hero-fd-hint">Your FD grows while you spend</div>
          </motion.div>

          {/* Card visual */}
          <motion.div
            className="hero-credit-card"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="hero-card-img" />
          </motion.div>

          {/* Floating badges */}
          <motion.div
            className="hero-badge hero-badge-shield"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L2 3.5V7C2 11 4.7 14 8 14.5C11.3 14 14 11 14 7V3.5L8 1Z" fill="#1FA8E1" opacity="0.15"/>
              <path d="M8 1L2 3.5V7C2 11 4.7 14 8 14.5C11.3 14 14 11 14 7V3.5L8 1Z" stroke="#1FA8E1" strokeWidth="1"/>
              <path d="M5.5 8L7.5 10L11 6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Secured</span>
          </motion.div>

          <motion.div
            className="hero-badge hero-badge-interest"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          >
            <span className="badge-green">+₹7,352</span>
            <span>interest earned</span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="entry-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your FD. Your Card.<br />Your Credit Score.
        </motion.h1>
        <motion.p
          className="entry-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Book an FD with any bank. Get an SBI Card instantly. Build your credit while earning interest.
        </motion.p>
      </div>

      {/* Pre-filled user card */}
      <div className="info-card">
        <div className="info-row"><span className="label">Name</span><span className="val">Rahul Sharma</span></div>
        <div className="info-row"><span className="label">Phone</span><span className="val">98XXX XXXX32</span></div>
        <div className="info-row"><span className="label">Email</span><span className="val">rah***@gmail.com</span></div>
      </div>

      {/* How it works */}
      <div className="section-title">How it works</div>
      <div className="steps-visual">
        {[
          { num: '1', title: 'Choose your FD', desc: 'Pick a bank, amount & tenure' },
          { num: '2', title: 'Quick Video KYC', desc: 'Verify identity in 3 minutes' },
          { num: '3', title: 'Pay & Book FD', desc: 'UPI, Net Banking or Debit Card' },
          { num: '4', title: 'Get your Card', desc: 'SBI Card Unnati, instantly' },
        ].map((step, i) => (
          <motion.div
            className="step-row"
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="step-num">{step.num}</div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust signals */}
      <div className="trust-strip">
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L2 3.5V7C2 11 4.7 14 8 14.5C11.3 14 14 11 14 7V3.5L8 1Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M5.5 8L7 9.5L10.5 5.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>DICGC Insured</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="#16a34a" strokeWidth="1" fill="#f0fdf4"/>
            <path d="M1 6h14" stroke="#16a34a" strokeWidth="1"/>
          </svg>
          <span>Zero Annual Fee*</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M8 5v3l2 1.5" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Instant Approval</span>
        </div>
      </div>

      <div className="trust-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6" stroke="#ccc" strokeWidth="1"/>
          <path d="M7 4v3M7 9h.01" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>Your details are pre-filled from your previous application</span>
      </div>
    </ScreenWrapper>
  )
}
