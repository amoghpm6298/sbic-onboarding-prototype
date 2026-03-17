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

export default function CardEligibilityScreen({ direction, creditLimit, onNext, onBack }) {
  return (
    <ScreenWrapper
      direction={direction}
      dark
      bottomBar={
        <CtaButton onClick={onNext}>Avail Card</CtaButton>
      }
    >
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

      <div className="dark-detail-grid">
        <div className="dark-detail-item">
          <div className="ddl">Card Type</div>
          <div className="ddv">SBI Card Unnati</div>
        </div>
        <div className="dark-detail-item">
          <div className="ddl">Credit Limit</div>
          <div className="ddv">{fmtINR(creditLimit)}</div>
        </div>
        <div className="dark-detail-item">
          <div className="ddl">Annual Fee</div>
          <div className="ddv green">₹499 (waived 4 yrs)</div>
        </div>
        <div className="dark-detail-item">
          <div className="ddl">Reward Points</div>
          <div className="ddv">1 / ₹100</div>
        </div>
      </div>

      <h2 className="privileges-title">Privileges on SBI Card Unnati</h2>

      {benefits.map((b, i) => (
        <motion.div
          className="benefit-row"
          key={b.title}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        >
          <div className="benefit-emoji">{b.emoji}</div>
          <div className="benefit-text-wrap">
            <div className="bt-title">{b.title}</div>
            <div className="bt-desc">{b.desc}</div>
          </div>
        </motion.div>
      ))}
    </ScreenWrapper>
  )
}
