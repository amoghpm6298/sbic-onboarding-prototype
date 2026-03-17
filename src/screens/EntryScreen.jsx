import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './EntryScreen.css'

const benefits = [
  { emoji: '💰', text: 'Earn FD interest while using your card' },
  { emoji: '📈', text: 'Build credit history from day one' },
  { emoji: '🌟', text: 'Annual fee of ₹499 waived for first 4 years' },
  { emoji: '🌐', text: 'Accepted everywhere Visa is accepted' },
]

export default function EntryScreen({ direction, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Get Started</CtaButton>}
    >
      <div className="entry-hero">
        <div className="hero-emoji">💳🏦</div>
      </div>

      <div className="entry-content">
        <h1 style={{ textAlign: 'center', fontSize: 22 }}>Unlock a Secured Credit Card</h1>
        <p className="entry-subtitle">
          You're pre-approved for an SBI Card backed by a Fixed Deposit.
          Build your credit score while earning FD interest!
        </p>
      </div>

      <div className="info-card">
        <div className="info-row">
          <span className="label">Name</span>
          <span className="val">Rahul Sharma</span>
        </div>
        <div className="info-row">
          <span className="label">Phone</span>
          <span className="val">98XXX XXXX32</span>
        </div>
        <div className="info-row">
          <span className="label">Email</span>
          <span className="val">rah***@gmail.com</span>
        </div>
      </div>

      <div className="section-title">Why a Secured Credit Card?</div>
      <div className="benefits-list">
        {benefits.map((b) => (
          <div className="benefit-item" key={b.text}>
            <span className="benefit-emoji">{b.emoji}</span>
            <span className="benefit-text">{b.text}</span>
          </div>
        ))}
      </div>

      <p className="prefill-note">Your details are pre-filled from your previous application</p>
    </ScreenWrapper>
  )
}
