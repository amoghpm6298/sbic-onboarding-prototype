import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './BookFDScreen.css'

const BANKS = [
  { id: 'Karnataka', name: 'Karnataka Bank',    logo: '/karbank.jpeg',                        abbr: 'KB',  color: '#7c3aed', rate: '7.35%' },
  { id: 'Allahabad', name: 'Allahabad Bank',    logo: '/allahbank.jpg',                       abbr: 'AB',  color: '#1d4ed8', rate: '7.10%' },
  { id: 'SIB',       name: 'South Indian Bank', logo: '/southindian.jpeg',                    abbr: 'SIB', color: '#b91c1c', rate: '7.40%' },
  { id: 'KVB',       name: 'Karur Vysya Bank',  logo: '/officialkarurvysyabank_logo.jpeg',    abbr: 'KVB', color: '#15803d', rate: '7.35%' },
  { id: 'UCO',       name: 'UCO Bank',          logo: '/uco.png',                             abbr: 'UCO', color: '#1e40af', rate: '7.15%' },
]

const QUICK_AMOUNTS = [50000, 100000, 300000, 500000]
const TENURES = [
  { months: 6,  label: '6M',  display: '6 Months',  popular: false },
  { months: 12, label: '1Y',  display: '1 Year',     popular: false },
  { months: 18, label: '18M', display: '18 Months',  popular: false },
  { months: 24, label: '2Y',  display: '2 Years',    popular: true  },
  { months: 36, label: '3Y',  display: '3 Years',    popular: false },
  { months: 60, label: '5Y',  display: '5 Years',    popular: false },
]

function fmtINR(n) {
  return '\u20B9' + n.toLocaleString('en-IN')
}

function fmtTenure(months) {
  if (months < 12) return `${months} months`
  if (months % 12 === 0) return `${months / 12} ${months / 12 === 1 ? 'year' : 'years'}`
  return `${Math.floor(months / 12)}y ${months % 12}m`
}

function BankLogo({ bank, size = 40 }) {
  const [err, setErr] = useState(false)
  if (!bank.logo || err) {
    return (
      <div className="bank-logo-ph" style={{ background: bank.color, width: size, height: size }}>
        {bank.abbr}
      </div>
    )
  }
  return <img className="bank-logo" src={bank.logo} alt={bank.name} style={{ width: size, height: size }} onError={() => setErr(true)} />
}

export default function BookFDScreen({ direction, fdConfig, setFdConfig, rate, creditLimit, maturity, cardVariant, bankLocked = false, onNext, onBack }) {
  const [showBankSheet, setShowBankSheet] = useState(false)
  const [showNomineeSheet, setShowNomineeSheet] = useState(false)
  const [nominee, setNominee] = useState({ name: 'Priya Sharma', relation: 'Spouse', dob: '1994-08-22' })
  const [nomineeDraft, setNomineeDraft] = useState(null)
  const update = (key, val) => setFdConfig(prev => ({ ...prev, [key]: val }))
  const tenureIdx = Math.max(0, TENURES.findIndex(t => t.months === fdConfig.tenure))

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
      <h1>{bankLocked ? 'Review Your FD' : 'Configure Your FD'}</h1>
      <p className="helper-text">{bankLocked ? 'You can still adjust amount and tenure.' : 'Your credit limit will be 80% of the FD amount.'}</p>

      {/* Chosen plan card */}
      <div
        className={`chosen-plan-card${bankLocked ? ' locked' : ''}`}
        onClick={bankLocked ? undefined : () => setShowBankSheet(true)}
      >
        <div className="chosen-plan-row">
          <div className="chosen-bank">
            <BankLogo bank={selectedBank} size={36} />
            <div className="chosen-bank-info">
              <span className="chosen-bank-name">{selectedBank.name}</span>
              {bankLocked ? (
                <span className="bank-kyc-verified">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="#16a34a"/>
                    <path d="M2.5 5L4 6.5L7.5 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  KYC verified
                </span>
              ) : (
                <span className="chosen-change">Tap to change bank</span>
              )}
            </div>
          </div>
          <div className="chosen-right">
            <div className="chosen-rate">
              <span className="chosen-rate-val">{rate.toFixed(2)}%</span>
              <span className="chosen-rate-label">p.a. for {fmtTenure(fdConfig.tenure)}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Deposit Amount */}
      <div className="section-title">Deposit Amount</div>
      <div className="fd-amount-input-wrap">
        <span className="fd-amt-prefix">₹</span>
        <input
          className="fd-amount-input"
          type="number"
          inputMode="numeric"
          value={fdConfig.amount}
          min={10000}
          onChange={e => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v) && v > 0) update('amount', v)
          }}
        />
      </div>
      <div className="fd-quick-amounts">
        {QUICK_AMOUNTS.map(amt => (
          <button
            key={amt}
            className={`fqa-chip ${fdConfig.amount === amt ? 'active' : ''}`}
            onClick={() => update('amount', amt)}
          >
            {amt >= 100000 ? `₹${amt / 100000}L` : `₹${amt / 1000}K`}
            {amt === 100000 && <span className="fqa-popular">popular</span>}
          </button>
        ))}
      </div>

      {/* Tenure */}
      <div className="section-title">Tenure</div>
      <div className="tenure-slider-wrap">
        <div className="tenure-current">
          <span className="tc-label">{TENURES[tenureIdx].display}</span>
          {TENURES[tenureIdx].popular && <span className="tc-popular">POPULAR</span>}
        </div>
        <input
          type="range"
          className="tenure-range"
          min={0}
          max={5}
          step={1}
          value={tenureIdx}
          style={{ '--fill': `${(tenureIdx / 5) * 100}%` }}
          onChange={e => update('tenure', TENURES[parseInt(e.target.value, 10)].months)}
        />
        <div className="tenure-tick-row">
          {TENURES.map((t, i) => (
            <button
              key={t.months}
              className={`tt ${fdConfig.tenure === t.months ? 'tt-active' : ''}`}
              onClick={() => update('tenure', t.months)}
            >
              {t.label}
              {t.popular && <span className="tt-dot" />}
            </button>
          ))}
        </div>
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
        <span className="cl-label">Probable Credit Limit</span>
        <span className="cl-value">{fmtINR(creditLimit)}</span>
      </div>

      {/* Card variants hint */}
      <div className="card-variants-hint">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9 4 11l.5-3.5L2 5l3.5-.5L7 1z" stroke="#7c3aed" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        </svg>
        <span>Higher deposits unlock more card variants</span>
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

      {/* Nominee card */}
      <div className="section-title">Nominee</div>
      <div className="nominee-card" onClick={() => { setNomineeDraft({ ...nominee }); setShowNomineeSheet(true); }}>
        <div className="nominee-info">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="9" cy="7" r="3.5" stroke="#1FA8E1" strokeWidth="1.3"/>
            <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <div className="nominee-details">
            <div className="nominee-name">{nominee.name}</div>
            <div className="nominee-relation">{nominee.relation}</div>
          </div>
        </div>
        <div className="nominee-edit">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10 2l2 2-7 7H3v-2l7-7z" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Edit</span>
        </div>
      </div>

      {/* Info note */}
      <div className="fd-info-note">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
          <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Your FD earns interest while serving as collateral for your credit card</span>
      </div>

      {/* FD lock warning */}
      <div className="fd-lock-warning">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <rect x="3" y="7" width="10" height="8" rx="2" stroke="#b91c1c" strokeWidth="1.3"/>
          <path d="M5 7V5a3 3 0 016 0v2" stroke="#b91c1c" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="1" fill="#b91c1c"/>
        </svg>
        <span>This FD will be <strong>locked for the lifetime of your card</strong>. Early closure is only possible by surrendering the card first.</span>
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

      {/* ── Nominee Bottom Sheet ── */}
      <AnimatePresence>
        {showNomineeSheet && nomineeDraft && (
          <>
            <motion.div
              className="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNomineeSheet(false)}
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
                <h2 className="sheet-title">Nominee Details</h2>
                <button className="sheet-close" onClick={() => setShowNomineeSheet(false)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="sheet-body nominee-sheet-body">
                <div className="nom-field">
                  <label className="nom-label">Nominee Name</label>
                  <input
                    className="nom-input"
                    type="text"
                    value={nomineeDraft.name}
                    onChange={e => setNomineeDraft({ ...nomineeDraft, name: e.target.value })}
                  />
                </div>
                <div className="nom-field">
                  <label className="nom-label">Relationship</label>
                  <select
                    className="nom-input nom-select"
                    value={nomineeDraft.relation}
                    onChange={e => setNomineeDraft({ ...nomineeDraft, relation: e.target.value })}
                  >
                    <option>Spouse</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Brother</option>
                    <option>Sister</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="nom-field">
                  <label className="nom-label">Date of Birth</label>
                  <input
                    className="nom-input"
                    type="date"
                    value={nomineeDraft.dob}
                    onChange={e => setNomineeDraft({ ...nomineeDraft, dob: e.target.value })}
                  />
                </div>
                <button
                  className="cta-btn cta-primary nom-save-btn"
                  onClick={() => { setNominee({ ...nomineeDraft }); setShowNomineeSheet(false); }}
                >
                  Save Nominee
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  )
}
