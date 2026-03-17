import { motion } from 'framer-motion'
import './RejectionScreen.css'

export default function RejectionScreen({ direction, onNext }) {
  return (
    <motion.div
      className="rejection-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Confetti dots */}
      <div className="rej-dots">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="rej-dot"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 60 + '%',
              width: (2 + Math.random() * 4) + 'px',
              height: (2 + Math.random() * 4) + 'px',
              opacity: 0.3 + Math.random() * 0.5,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      <div className="rej-content">
        <motion.h1
          className="rej-greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Dear Rahul,<br />thank you for your request
        </motion.h1>

        <motion.p
          className="rej-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          currently we are unable to process your request
        </motion.p>

        {/* Illustration */}
        <motion.div
          className="rej-illustration"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
        >
          <div className="rej-stop-sign">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M22 4h20l14 14v20L42 52H22L8 38V18L22 4z" fill="#F97316" stroke="#EA580C" strokeWidth="2"/>
              <path d="M26 24v-2a6 6 0 0112 0v2M24 24h16v12a4 4 0 01-4 4h-8a4 4 0 01-4-4V24z" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5"/>
              <circle cx="32" cy="18" r="2" fill="#EA580C"/>
            </svg>
          </div>
          <div className="rej-excl rej-excl-1">!</div>
          <div className="rej-excl rej-excl-2">!</div>
        </motion.div>

        <motion.p
          className="rej-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          We regret to inform you that we are unable to process your card application currently due to internal policies.
        </motion.p>
      </div>

      {/* Don't worry section */}
      <motion.div
        className="rej-hope"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="rej-hope-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1FA8E1" opacity="0.15"/>
            <path d="M8 12l3 3 5-6" stroke="#1FA8E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="rej-hope-text">
          <p className="rej-hope-title">Don't worry, you can still get a Credit Card!</p>
          <p className="rej-hope-desc">Apply for an FD-backed Secured Credit Card. Book a Fixed Deposit and get an SBI Card instantly.</p>
        </div>
      </motion.div>

      {/* CTAs */}
      <div className="rej-ctas">
        <motion.button
          className="rej-cta-primary"
          onClick={onNext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          Apply for Secured Credit Card
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 6 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        <motion.button
          className="rej-cta-exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Exit
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4 }}>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}
