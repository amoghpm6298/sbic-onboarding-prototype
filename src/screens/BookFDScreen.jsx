import { useState } from 'react'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './BookFDScreen.css'

const BANKS = [
  { id: 'SBI', name: 'State Bank of India', logo: '/sbi-card-logo.png', tenure: '2Y', rate: '7.10%' },
  { id: 'HDFC', name: 'HDFC Bank', logo: '/HDFC-LOGO.png', tenure: '2Y', rate: '7.25%' },
  { id: 'ICICI', name: 'ICICI Bank', logo: '/icici.jpg', tenure: '2Y', rate: '7.10%' },
  { id: 'Kotak', name: 'Kotak Mahindra Bank', logo: '/kotak.png', tenure: '2Y', rate: '7.40%' },
  { id: 'Axis', name: 'Axis Bank', color: '#800020', initials: 'AX', tenure: '2Y', rate: '7.25%' },
  { id: 'PNB', name: 'Punjab National Bank', color: '#6b2fa0', initials: 'PNB', tenure: '2Y', rate: '7.05%' },
  { id: 'BOB', name: 'Bank of Baroda', color: '#f58220', initials: 'BoB', tenure: '2Y', rate: '7.10%' },
  { id: 'Canara', name: 'Canara Bank', color: '#0066b3', initials: 'CB', tenure: '2Y', rate: '7.15%' },
]

const AMOUNTS = [25000, 50000, 100000, 200000]
const TENURES = [1, 2, 3, 5]

function fmtINR(n) {
  return '\u20B9' + n.toLocaleString('en-IN')
}

export default function BookFDScreen({ direction, fdConfig, setFdConfig, rate, creditLimit, maturity, onNext, onBack }) {
  const [bankSelected, setBankSelected] = useState(!!fdConfig.bank)
  const update = (key, val) => setFdConfig(prev => ({ ...prev, [key]: val }))

  const handleBankSelect = (bankId) => {
    update('bank', bankId)
    setBankSelected(true)
  }

  const interestGains = maturity - fdConfig.amount

  if (!bankSelected) {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
          </>
        }
      >
        <h1>Select Your Bank</h1>
        <p className="helper-text">Choose a bank for your Fixed Deposit</p>

        <div className="bank-list">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              className={`bank-option ${fdConfig.bank === bank.id ? 'active' : ''}`}
              onClick={() => handleBankSelect(bank.id)}
            >
              {bank.logo ? (
                <img className="bank-logo" src={bank.logo} alt={bank.name} />
              ) : (
                <div className="bank-logo-ph" style={{ background: bank.color }}>
                  {bank.initials}
                </div>
              )}
              <span className="bank-name">{bank.name}</span>
              <div className="bank-right">
                <span className="bank-rate">{bank.rate}</span>
                <span className="bank-tenure">{bank.tenure}</span>
              </div>
              {fdConfig.bank === bank.id ? (
                <div className="bank-check">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <div className="bank-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </ScreenWrapper>
    )
  }

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
      <h1>Configure Your FD</h1>
      <p className="helper-text">Your credit limit will be 80% of the FD amount.</p>

      {/* Chosen plan card */}
      <div className="chosen-plan-card">
        <div className="chosen-plan-label">Your chosen plan</div>
        <div className="chosen-plan-row">
          <div className="chosen-bank" onClick={() => setBankSelected(false)}>
            {(() => {
              const bank = BANKS.find(b => b.id === fdConfig.bank)
              return bank?.logo ? (
                <img className="chosen-bank-logo" src={bank.logo} alt={bank.name} />
              ) : (
                <div className="chosen-bank-dot" style={{ background: bank?.color }}>{bank?.initials}</div>
              )
            })()}
            <span className="chosen-bank-name">{fdConfig.bank}</span>
            <span className="chosen-change">Change</span>
          </div>
          <div className="chosen-rate">
            <span className="chosen-rate-val">{rate.toFixed(2)}%</span>
            <span className="chosen-rate-label">p.a. for {fdConfig.tenure}Y</span>
          </div>
        </div>
      </div>

      {/* Investment Amount */}
      <div className="section-title">Investment Amount</div>
      <div className="amount-display-wrap">
        <div className="amount-display">{fmtINR(fdConfig.amount)}</div>
      </div>

      <div className="amount-pills">
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            className={`amount-pill ${fdConfig.amount === amt ? 'active' : ''}`}
            onClick={() => update('amount', amt)}
          >
            {amt === 50000 && <span className="popular-tag">POPULAR</span>}
            {fmtINR(amt)}
          </button>
        ))}
      </div>

      {/* Tenure */}
      <div className="section-title">Tenure</div>
      <div className="tenure-pills">
        {TENURES.map((t) => (
          <button
            key={t}
            className={`tenure-pill ${fdConfig.tenure === t ? 'active' : ''}`}
            onClick={() => update('tenure', t)}
          >
            {t}Y
          </button>
        ))}
      </div>

      {/* Results card */}
      <div className="results-card">
        <div className="results-col">
          <div className="results-label">Maturity Amount</div>
          <div className="results-value">{fmtINR(maturity)}</div>
        </div>
        <div className="results-divider" />
        <div className="results-col">
          <div className="results-label">Interest Gains</div>
          <div className="results-value green">+{fmtINR(interestGains)}</div>
        </div>
      </div>

      {/* Credit limit banner */}
      <div className="credit-limit-banner">
        <span className="cl-label">Credit Limit</span>
        <span className="cl-value">{fmtINR(creditLimit)}</span>
      </div>

      {/* Info note */}
      <div className="fd-info-note">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
          <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Your FD earns interest while serving as collateral for your credit card</span>
      </div>
    </ScreenWrapper>
  )
}
