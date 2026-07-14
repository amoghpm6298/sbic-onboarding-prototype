import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import { EXISTING_FDS } from '../data/existingFds'
import { BANKS } from '../data/banks'
import './BookFDScreen.css'

const MIN_COLLATERAL = 25000
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

export default function BookFDScreen({ direction, fdConfig, setFdConfig, rate, creditLimit, maturity, cardVariant, bankLocked = false, isNtb = false, onNext, onBack }) {
  const [showBankSheet, setShowBankSheet] = useState(false)
  const [showNomineeSheet, setShowNomineeSheet] = useState(false)
  const [nominee, setNominee] = useState({ name: 'Priya Sharma', relation: 'Spouse', dob: '1994-08-22' })
  const [nomineeDraft, setNomineeDraft] = useState(null)
  const update = (key, val) => setFdConfig(prev => ({ ...prev, [key]: val }))
  const tenureIdx = Math.max(0, TENURES.findIndex(t => t.months === fdConfig.tenure))

  const selectedBank = BANKS.find(b => b.id === fdConfig.bank) || BANKS[0]
  // NTB customers can still already hold an FD with a bank (new to SBI Card, not new to the bank) —
  // same existing-FD linking flow applies to both personas.
  const bankFds = EXISTING_FDS[fdConfig.bank] || []
  const isExistingMode = fdConfig.mode === 'existing'
  const interestGains = maturity - fdConfig.amount

  // Default-select the top FD when landing on a bank that has existing deposits.
  useEffect(() => {
    if (fdConfig.mode === 'existing' && fdConfig.existingFds.length === 0 && bankFds.length > 0) {
      const top = bankFds[0]
      setFdConfig(prev => ({ ...prev, existingFds: [top], amount: top.amount, tenure: top.tenure }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fdConfig.mode, fdConfig.bank])

  const handleBankSelect = (bankId) => {
    const fds = EXISTING_FDS[bankId] || []
    setFdConfig(prev => ({
      ...prev,
      bank: bankId,
      mode: fds.length > 0 ? 'existing' : 'new',
      existingFds: [],
      amount: fds.length > 0 ? prev.amount : 100000,
      tenure: fds.length > 0 ? prev.tenure : 24,
    }))
    setShowBankSheet(false)
  }

  const switchToNewFd = () => {
    setFdConfig(prev => ({ ...prev, mode: 'new', existingFds: [], amount: 100000, tenure: 24 }))
  }

  const switchToExisting = () => {
    const top = bankFds[0]
    setFdConfig(prev => ({ ...prev, mode: 'existing', existingFds: top ? [top] : [], amount: top?.amount ?? prev.amount, tenure: top?.tenure ?? prev.tenure }))
  }

  const toggleFd = (fd) => {
    setFdConfig(prev => {
      const already = prev.existingFds.some(f => f.id === fd.id)
      const nextFds = already ? prev.existingFds.filter(f => f.id !== fd.id) : [...prev.existingFds, fd]
      const nextAmount = nextFds.reduce((s, f) => s + f.amount, 0)
      return { ...prev, existingFds: nextFds, amount: nextAmount }
    })
  }

  const allSelected = bankFds.length > 0 && bankFds.every(fd => fdConfig.existingFds.some(f => f.id === fd.id))
  const toggleSelectAll = () => {
    setFdConfig(prev => {
      const nextFds = allSelected ? [] : [...bankFds]
      const nextAmount = nextFds.reduce((s, f) => s + f.amount, 0)
      return { ...prev, existingFds: nextFds, amount: nextAmount }
    })
  }

  const totalSelected = fdConfig.existingFds.reduce((s, f) => s + f.amount, 0)
  const canProceed = isExistingMode ? totalSelected >= MIN_COLLATERAL : true

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton
            onClick={canProceed ? onNext : undefined}
            className={!canProceed ? 'disabled' : ''}
          >
            {isExistingMode ? 'Proceed' : 'Continue'}
          </CtaButton>
        </>
      }
    >
      <h1>{isExistingMode ? 'Select Your FDs' : bankLocked ? 'Review Your FD' : 'Configure Your FD'}</h1>
      <p className="helper-text">
        {isExistingMode
          ? 'The FDs you link will back your card as collateral — the higher the amount, the higher your limit.'
          : bankLocked ? 'You can still adjust amount and tenure.' : 'Your credit limit will be 80% of the FD amount.'}
      </p>

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
          {!isExistingMode && (
            <div className="chosen-right">
              <div className="chosen-rate">
                <span className="chosen-rate-val">{rate.toFixed(2)}%</span>
                <span className="chosen-rate-label">p.a. for {fmtTenure(fdConfig.tenure)}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {isExistingMode ? (
        <>
          <div className="select-all-row">
            <span className="select-all-label">Select all that apply</span>
            <button className="select-all-link" onClick={toggleSelectAll}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {bankFds.map((fd) => {
            const isSel = fdConfig.existingFds.some(f => f.id === fd.id)
            return (
              <button key={fd.id} className={`efd-select-card ${isSel ? 'selected' : ''}`} onClick={() => toggleFd(fd)}>
                <div className="efd-select-top">
                  <div>
                    <span className="efd-select-amount">{fmtINR(fd.amount)}</span>
                    <div className="efd-select-account">A/C {fd.accountNo}</div>
                  </div>
                  <div className={`efd-checkbox ${isSel ? 'checked' : ''}`}>
                    {isSel && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="efd-select-meta-row">
                  <div className="efd-meta-col">
                    <span className="efd-meta-label">Maturity Amount</span>
                    <span className="efd-meta-val">{fmtINR(fd.maturityAmount)}</span>
                  </div>
                  <div className="efd-meta-col">
                    <span className="efd-meta-label">Maturity Date</span>
                    <span className="efd-meta-val">{fd.maturityDate}</span>
                  </div>
                  <div className="efd-meta-col">
                    <span className="efd-meta-label">Interest Rate</span>
                    <span className="efd-meta-val">{fd.rate.toFixed(2)}%</span>
                  </div>
                </div>
              </button>
            )
          })}

          <button className="open-new-fd-btn" onClick={switchToNewFd}>
            + Open a New FD with {selectedBank.name}
          </button>

          <div className="total-deposit-card">
            <div>
              <div className="total-deposit-label">Total Deposit Amount</div>
              <div className="total-deposit-min">Min {fmtINR(MIN_COLLATERAL)} required</div>
            </div>
            <div className="total-deposit-value">{fmtINR(totalSelected)}</div>
          </div>

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

          <div className="credit-limit-banner">
            <span className="cl-label">Probable Credit Limit</span>
            <span className="cl-value">{fmtINR(creditLimit)}</span>
          </div>

          <div className="card-variants-hint">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9 4 11l.5-3.5L2 5l3.5-.5L7 1z" stroke="#7c3aed" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
            </svg>
            <span>Higher deposits unlock more card variants</span>
          </div>

          <div className="fd-info-note">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="9" cy="9" r="8" fill="#FEF9C3"/>
              <path d="M9 5v1M9 8v5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Since these FDs are already on file, no additional KYC is needed — we'll mark a lien and move straight to your card.</span>
          </div>
        </>
      ) : (
        <>
          {bankFds.length > 0 && (
            <>
              <button className="change-fd-link" onClick={switchToExisting}>Use an existing FD instead</button>
              {!isNtb && (
                <div className="kyc-skip-hint">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
                    <path d="M4.5 7L6 8.5L9.5 5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>You're already KYC verified with {selectedBank.name} — no need to redo it for this FD.</span>
                </div>
              )}
            </>
          )}

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
        </>
      )}

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
