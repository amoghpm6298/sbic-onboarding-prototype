import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './EntryScreen.css'

const cardBenefits = [
  { icon: 'fee', title: 'Zero Fee Card', desc: 'Annual fee of ₹499 waived for first 4 years' },
  { icon: 'reward', title: 'Rewards on Spends', desc: '1 Reward Point per ₹100 spent on all purchases' },
  { icon: 'fuel', title: 'Fuel Surcharge Waiver', desc: '1% surcharge waiver on fuel transactions' },
  { icon: 'milestone', title: 'Milestone Cashback', desc: '₹500 cashback on annual spends of ₹50,000+' },
  { icon: 'credit', title: 'Build Credit Score', desc: 'Regular usage builds your CIBIL score for future upgrades' },
]

function BenefitIcon({ type }) {
  const icons = {
    fee: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#1FA8E1" strokeWidth="1.3"/><path d="M6 9h6M9 6v6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    reward: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l2.2 4.5 5 .7-3.6 3.5.8 5L9 13.5 4.6 15.7l.8-5-3.6-3.5 5-.7L9 2z" stroke="#1FA8E1" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
    fuel: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="8" height="12" rx="1.5" stroke="#1FA8E1" strokeWidth="1.3"/><path d="M11 7l2.5-2M13.5 5v5c0 1.1.9 2 2 2" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="5.5" width="4" height="3" rx="0.8" stroke="#1FA8E1" strokeWidth="1"/></svg>,
    milestone: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="5" stroke="#1FA8E1" strokeWidth="1.3"/><path d="M6.5 12.5L5 17l4-2 4 2-1.5-4.5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 7l1.5 1.5L11 5.5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    credit: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14V5a2 2 0 012-2h6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/><path d="M6 14l3-4 3 2 3-5" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="15" cy="7" r="0.8" fill="#1FA8E1"/></svg>,
  }
  return <div className="ben-icon-wrap">{icons[type]}</div>
}

export default function LandingScreen({ direction, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Get Started</CtaButton>}
    >
      {/* Hero */}
      <div className="hero-section">
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="hero-cards-pair">
            <motion.div
              className="entry-card entry-card-simple"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="ec-brand">SBI Card</div>
              <div className="ec-chip" />
              <div className="ec-footer">
                <span className="ec-name">Simple</span>
                <span className="ec-tag ec-tag-simple">Any FD</span>
              </div>
            </motion.div>
            <motion.div
              className="entry-card entry-card-premium"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              <div className="ec-brand ec-brand-gold">SBI Card</div>
              <div className="ec-chip ec-chip-gold" />
              <div className="ec-footer">
                <span className="ec-name ec-name-gold">Prime</span>
                <span className="ec-tag ec-tag-premium">₹5L+ FD</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-fd-badge"
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 180 }}
          >
            <div className="fd-badge-rate">7.10%</div>
            <div className="fd-badge-label">FD Interest p.a.</div>
          </motion.div>

          <motion.div
            className="hero-cl-badge"
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 180 }}
          >
            <div className="cl-badge-val">₹40,000</div>
            <div className="cl-badge-label">Credit Limit</div>
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
          Book an FD with any bank. Get an SBI Card instantly. Build your credit while earning interest — no prior SBI relationship needed.
        </motion.p>
      </div>

      {/* Card Benefits */}
      <div className="section-title">Card Benefits</div>
      <div className="card-benefits">
        {cardBenefits.map((b, i) => (
          <motion.div
            className="card-ben-row"
            key={b.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <BenefitIcon type={b.icon} />
            <div className="card-ben-text">
              <div className="card-ben-title">{b.title}</div>
              <div className="card-ben-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="section-title">How it works</div>
      <div className="steps-visual">
        {[
          { num: '1', title: 'Tell us about you', desc: 'A few quick personal & address details' },
          { num: '2', title: 'Choose your FD', desc: 'Pick a bank, amount & tenure — or link an FD you already have' },
          { num: '3', title: 'Complete KYC', desc: 'Verify your identity with the bank (skipped if you already have an FD with them)' },
          { num: '4', title: 'Get your Card', desc: 'SBI Card issued instantly' },
        ].map((step, i) => (
          <motion.div
            className="step-row"
            key={step.num}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.08 }}
          >
            <div className="step-num">{step.num}</div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3.5V6.5C2 9.8 4.1 12.6 7 13C9.9 12.6 12 9.8 12 6.5V3.5L7 1Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M5 7L6.5 8.5L9.5 5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>DICGC Insured</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#16a34a" strokeWidth="1" fill="#f0fdf4"/>
            <path d="M1 5.5h12" stroke="#16a34a" strokeWidth="1"/>
          </svg>
          <span>Zero Annual Fee*</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M7 4v3l2 1.5" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Instant Card</span>
        </div>
      </div>

      <div className="trust-note">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="6" cy="6" r="5" stroke="#ccc" strokeWidth="1"/>
          <path d="M6 3.5v2.5M6 8h.01" stroke="#ccc" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span>New to SBI Card? We'll just need a few details to get started.</span>
      </div>
    </ScreenWrapper>
  )
}
