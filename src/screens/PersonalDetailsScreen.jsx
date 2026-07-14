import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './PersonalDetailsScreen.css'

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const MOBILE_RE = /^[6-9]\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function PersonalDetailsScreen({ direction, customer, setCustomer, onNext, onBack }) {
  const update = (key, val) => setCustomer(prev => ({ ...prev, [key]: val }))

  const isValid =
    customer.name.trim().length > 2 &&
    MOBILE_RE.test(customer.phone) &&
    EMAIL_RE.test(customer.email) &&
    !!customer.dob &&
    PAN_RE.test(customer.pan.toUpperCase())

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton
            onClick={isValid ? onNext : undefined}
            className={!isValid ? 'disabled' : ''}
          >
            Continue
          </CtaButton>
        </>
      }
    >
      <h1>Tell us about you</h1>
      <p className="helper-text">We'll use these details to set up your application. Your identity will be verified separately during KYC.</p>

      <div className="pd-field">
        <label className="pd-label">Full Name</label>
        <input
          className="pd-input"
          type="text"
          placeholder="As per your PAN card"
          value={customer.name}
          onChange={e => update('name', e.target.value)}
        />
      </div>

      <div className="pd-field">
        <label className="pd-label">Mobile Number</label>
        <div className="pd-input-prefix-wrap">
          <span className="pd-prefix">+91</span>
          <input
            className="pd-input pd-input-prefixed"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={customer.phone}
            onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </div>
      </div>

      <div className="pd-field">
        <label className="pd-label">Email Address</label>
        <input
          className="pd-input"
          type="email"
          placeholder="you@example.com"
          value={customer.email}
          onChange={e => update('email', e.target.value)}
        />
      </div>

      <div className="pd-row">
        <div className="pd-field">
          <label className="pd-label">Date of Birth</label>
          <input
            className="pd-input"
            type="date"
            value={customer.dob}
            onChange={e => update('dob', e.target.value)}
          />
        </div>
        <div className="pd-field">
          <label className="pd-label">PAN</label>
          <input
            className="pd-input"
            type="text"
            maxLength={10}
            placeholder="ABCDE1234F"
            style={{ textTransform: 'uppercase' }}
            value={customer.pan}
            onChange={e => update('pan', e.target.value.toUpperCase().slice(0, 10))}
          />
        </div>
      </div>

      <div className="pd-info-note">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
          <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Your PAN and identity will be formally verified by your chosen bank during KYC — this is just to get your application started.</span>
      </div>
    </ScreenWrapper>
  )
}
