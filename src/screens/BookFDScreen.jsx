import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './BookFDScreen.css'

const BANKS = [
  { id: 'SBI', name: 'State Bank of India', logo: '/sbi-card-logo.png', tenure: '2Y', rate: '7.10%' },
  { id: 'HDFC', name: 'HDFC Bank', logo: '/HDFC-LOGO.png', tenure: '2Y', rate: '7.25%' },
  { id: 'ICICI', name: 'ICICI Bank', logo: '/icici.jpg', tenure: '2Y', rate: '7.10%' },
  { id: 'Kotak', name: 'Kotak Mahindra Bank', logo: '/kotak.png', tenure: '2Y', rate: '7.40%' },
  { id: 'Axis', name: 'Axis Bank', logo: '/axi.png', tenure: '2Y', rate: '7.25%' },
  { id: 'PNB', name: 'Punjab National Bank', logo: '/pnb.avif', tenure: '2Y', rate: '7.05%' },
  { id: 'BOB', name: 'Bank of Baroda', logo: '/bob.png', tenure: '2Y', rate: '7.10%' },
  { id: 'Canara', name: 'Canara Bank', logo: '/canara.png', tenure: '2Y', rate: '7.15%' },
]

const AMOUNTS = [25000, 50000, 100000, 200000]
const TENURES = [1, 2, 3, 5]

function fmtINR(n) {
  return '\u20B9' + n.toLocaleString('en-IN')
}

function BankLogo({ bank, size = 40 }) {
  return <img className="bank-logo" src={bank.logo} alt={bank.name} style={{ width: size, height: size }} />
}

export default function BookFDScreen({ direction, fdConfig, setFdConfig, rate, creditLimit, maturity, onNext, onBack }) {
  const [showBankSheet, setShowBankSheet] = useState(false)
  const update = (key, val) => setFdConfig(prev => ({ ...prev, [key]: val }))

  const handleBankSelect = (bankId) => {
    update('bank', bankId)
    setShowBankSheet(false)
  }

  const selectedBank = BANKS.find(b => b.id === fdConfig.bank) || BANKS[0]
  const interestGains = maturity - fdConfig.amount

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
        <div className="chosen-plan-row">
          <div className="chosen-bank" onClick={() => setShowBankSheet(true)}>
            <BankLogo bank={selectedBank} size={36} />
            <div className="chosen-bank-info">
              <span className="chosen-bank-name">{selectedBank.name}</span>
              <span className="chosen-change">Change bank</span>
            </div>
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

      {/* Maturity option */}
      <div className="section-title">On Maturity</div>
      <div className="maturity-toggle">
        <button
          className={`maturity-opt ${fdConfig.maturityAction === 'reinvest' || !fdConfig.maturityAction ? 'active' : ''}`}
          onClick={() => update('maturityAction', 'reinvest')}
        >
          <span className="mat-title">Reinvest</span>
          <span className="mat-desc">Auto-renew FD</span>
        </button>
        <button
          className={`maturity-opt ${fdConfig.maturityAction === 'payout' ? 'active' : ''}`}
          onClick={() => update('maturityAction', 'payout')}
        >
          <span className="mat-title">Pay to Account</span>
          <span className="mat-desc">Credit to bank</span>
        </button>
      </div>

      {/* Nominee note */}
      <div className="nominee-note">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="6" r="3" stroke="#1FA8E1" strokeWidth="1.2"/>
          <path d="M3 14c0-3 2.2-5 5-5s5 2 5 5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>Nominee details will be carried from your existing profile</span>
      </div>

      {/* Info note */}
      <div className="fd-info-note">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
          <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Your FD earns interest while serving as collateral for your credit card</span>
      </div>

      {/* ── Bottom Sheet ── */}
      <AnimatePresence>
        {showBankSheet && (
          <>
            <motion.div
              className="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBankSheet(false)}
            />
            <motion.div
              className="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Select Bank</h2>
                <button className="sheet-close" onClick={() => setShowBankSheet(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="sheet-body">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    className={`bank-option ${fdConfig.bank === bank.id ? 'active' : ''}`}
                    onClick={() => handleBankSelect(bank.id)}
                  >
                    <BankLogo bank={bank} />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  )
}
