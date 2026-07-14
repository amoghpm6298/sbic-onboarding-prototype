import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './PersonalDetailsScreen.css'

const PINCODE_RE = /^[1-9]\d{5}$/

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

export default function AddressDetailsScreen({ direction, customer, setCustomer, onNext, onBack }) {
  const update = (key, val) => setCustomer(prev => ({ ...prev, [key]: val }))

  const isValid =
    customer.addressLine1.trim().length > 4 &&
    PINCODE_RE.test(customer.pincode) &&
    customer.city.trim().length > 1 &&
    !!customer.state

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
      <h1>Where do you live?</h1>
      <p className="helper-text">We'll use this as your registered address for the card and FD statements.</p>

      <div className="pd-field">
        <label className="pd-label">Address Line 1</label>
        <input
          className="pd-input"
          type="text"
          placeholder="Flat/House no., Building, Street"
          value={customer.addressLine1}
          onChange={e => update('addressLine1', e.target.value)}
        />
      </div>

      <div className="pd-field">
        <label className="pd-label">Address Line 2 (optional)</label>
        <input
          className="pd-input"
          type="text"
          placeholder="Landmark, Area"
          value={customer.addressLine2}
          onChange={e => update('addressLine2', e.target.value)}
        />
      </div>

      <div className="pd-row">
        <div className="pd-field">
          <label className="pd-label">Pincode</label>
          <input
            className="pd-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit pincode"
            value={customer.pincode}
            onChange={e => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </div>
        <div className="pd-field">
          <label className="pd-label">City</label>
          <input
            className="pd-input"
            type="text"
            placeholder="Your current city"
            value={customer.city}
            onChange={e => update('city', e.target.value)}
          />
        </div>
      </div>

      <div className="pd-field">
        <label className="pd-label">State</label>
        <select
          className="pd-input"
          value={customer.state}
          onChange={e => update('state', e.target.value)}
        >
          <option value="">Select state</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="pd-info-note">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
          <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Your address will be formally verified by your chosen bank during KYC.</span>
      </div>
    </ScreenWrapper>
  )
}
