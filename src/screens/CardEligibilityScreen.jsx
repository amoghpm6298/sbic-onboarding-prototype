import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './CardEligibilityScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const benefits = [
  {
    emoji: '🏷️',
    title: 'Zero Fee Card',
    desc: 'SBI Card Unnati is free for first 4 years. Annual fee of ₹499 waived off.',
  },
  {
    emoji: '🎁',
    title: 'Rewards on Spends',
    desc: 'Get 1 Reward Point per ₹100 spent. Redeem against gifts from the Rewards Catalogue.',
  },
  {
    emoji: '🏆',
    title: 'Milestone Rewards',
    desc: 'Receive ₹500 Cashback within 15 days of achieving annual spends of ₹50,000 or more.',
  },
  {
    emoji: '⛽',
    title: 'Complete Fuel Freedom',
    desc: '1% fuel surcharge waiver for transactions between ₹500 & ₹3000 (excl. GST).',
  },
  {
    emoji: '💳',
    title: 'Secured Card',
    desc: 'Issued with a lien on cardholder\'s Fixed Deposit of ₹25,000 or more. Build your credit score.',
  },
]

export default function CardEligibilityScreen({ direction, creditLimit, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Avail Card</CtaButton>}
    >
      {/* Dark hero section */}
      <div className="card-hero">
        <motion.h1
          className="congrats-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Congratulations!
        </motion.h1>
        <p className="congrats-sub">Your SBI Card Unnati is ready!<br />Review your card details below.</p>

        <motion.div
          className="card-image-wrap"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        >
          <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="card-image" />
        </motion.div>
      </div>

      {/* White details section */}
      <div className="card-details-section">
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Card Type</div>
            <div className="detail-value">SBI Card Unnati</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Credit Limit</div>
            <div className="detail-value blue">{fmtINR(creditLimit)}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Annual Fee</div>
            <div className="detail-value green">₹499 (waived 4 yrs)</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Reward Points</div>
            <div className="detail-value">1 / ₹100</div>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>Privileges on SBI Card Unnati</div>

        {benefits.map((b, i) => (
          <motion.div
            className="privilege-row"
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <div className="privilege-emoji">{b.emoji}</div>
            <div className="privilege-text">
              <div className="privilege-title">{b.title}</div>
              <div className="privilege-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenWrapper>
  )
}
