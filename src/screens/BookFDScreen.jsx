import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './BookFDScreen.css'

const BANKS = [
  { id: 'SBI', name: 'State Bank of India', logo: '/sbi-card-logo.png' },
  { id: 'HDFC', name: 'HDFC Bank', logo: '/HDFC-LOGO.png' },
  { id: 'ICICI', name: 'ICICI Bank', logo: '/icici.jpg' },
  { id: 'Kotak', name: 'Kotak Mahindra Bank', logo: '/kotak.png' },
  { id: 'Axis', name: 'Axis Bank', color: '#800020', initials: 'AX' },
  { id: 'PNB', name: 'Punjab National Bank', color: '#6b2fa0', initials: 'PNB' },
  { id: 'BOB', name: 'Bank of Baroda', color: '#f58220', initials: 'BoB' },
  { id: 'Canara', name: 'Canara Bank', color: '#0066b3', initials: 'CB' },
]

const AMOUNTS = [25000, 50000, 100000, 200000]
const TENURES = [1, 2, 3, 5]

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

export default function BookFDScreen({ direction, fdConfig, setFdConfig, rate, creditLimit, maturity, onNext, onBack }) {
  const update = (key, val) => setFdConfig(prev => ({ ...prev, [key]: val }))

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton onClick={onNext}>Continue</CtaButton>
        </>
      }
    >
      <h1>Select FD Details</h1>
      <p className="helper-text">Your credit limit will be 80% of the FD amount.</p>

      <div className="section-title">Select Bank</div>
      <div className="bank-list">
        {BANKS.map((bank) => (
          <button
            key={bank.id}
            className={`bank-option ${fdConfig.bank === bank.id ? 'active' : ''}`}
            onClick={() => update('bank', bank.id)}
          >
            {bank.logo ? (
              <img className="bank-logo" src={bank.logo} alt={bank.name} />
            ) : (
              <div className="bank-logo-ph" style={{ background: bank.color }}>
                {bank.initials}
              </div>
            )}
            <span className="bank-name">{bank.name}</span>
            <div className="bank-radio">
              {fdConfig.bank === bank.id && <div className="bank-radio-dot" />}
            </div>
          </button>
        ))}
      </div>

      <div className="section-title">FD Amount</div>
      <div className="amount-grid">
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            className={`amount-card ${fdConfig.amount === amt ? 'active' : ''}`}
            onClick={() => update('amount', amt)}
          >
            <div className="amt">{fmtINR(amt)}</div>
            <div className="cl">Credit Limit: {fmtINR(Math.round(amt * 0.8))}</div>
          </button>
        ))}
      </div>

      <div className="section-title">Tenure</div>
      <div className="pill-group">
        {TENURES.map((t) => (
          <button
            key={t}
            className={`pill ${fdConfig.tenure === t ? 'active' : ''}`}
            onClick={() => update('tenure', t)}
          >
            {t} {t === 1 ? 'Year' : 'Years'}
          </button>
        ))}
      </div>

      <div className="summary-strip">
        <div className="summary-row">
          <span className="sl">FD Amount</span>
          <span className="sv">{fmtINR(fdConfig.amount)}</span>
        </div>
        <div className="summary-row">
          <span className="sl">Interest Rate</span>
          <span className="sv">{rate.toFixed(2)}% p.a.</span>
        </div>
        <div className="summary-row">
          <span className="sl">Maturity Amount</span>
          <span className="sv">{fmtINR(maturity)}</span>
        </div>
        <div className="summary-row highlight">
          <span className="sl">Credit Limit</span>
          <span className="sv">{fmtINR(creditLimit)}</span>
        </div>
      </div>
    </ScreenWrapper>
  )
}
