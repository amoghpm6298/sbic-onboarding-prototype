import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './EntryScreen.css'

const benefits = [
  { icon: '/', text: 'Earn FD interest while using your card' },
  { icon: '/', text: 'Build credit history from day one' },
  { icon: '/', text: 'Annual fee of ₹499 waived for first 4 years' },
  { icon: '/', text: 'Accepted everywhere Visa is accepted' },
]

export default function EntryScreen({ direction, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Get Started</CtaButton>}
    >
      <div className="entry-hero-text">
        <h1 className="entry-title">Secured Credit Card</h1>
        <p className="entry-tagline">
          Build your credit score with a card backed by your Fixed Deposit. Earn interest while you spend.
        </p>
      </div>

      <div className="info-card">
        <div className="info-row"><span className="label">Name</span><span className="val">Rahul Sharma</span></div>
        <div className="info-row"><span className="label">Phone</span><span className="val">98XXX XXXX32</span></div>
        <div className="info-row"><span className="label">Email</span><span className="val">rah***@gmail.com</span></div>
      </div>

      <div className="section-title">Why a Secured Credit Card?</div>
      <div className="benefits-list">
        {benefits.map((b) => (
          <div className="benefit-item" key={b.text}>
            <div className="benefit-icon-circle">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L6 11L12 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="benefit-text">{b.text}</span>
          </div>
        ))}
      </div>

      <div className="trust-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6" stroke="#999" strokeWidth="1.2"/>
          <path d="M7 4v3M7 9h.01" stroke="#999" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>Your details are pre-filled from your previous application</span>
      </div>
    </ScreenWrapper>
  )
}
