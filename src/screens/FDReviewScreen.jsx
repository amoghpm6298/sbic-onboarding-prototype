import { useState } from 'react'
import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import { BANKS as BANK_LIST } from '../data/banks'
import './FDReviewScreen.css'

const BANKS = Object.fromEntries(BANK_LIST.map(b => [b.id, b]))

function BankLogo({ bank }) {
  const [err, setErr] = useState(false)
  if (!err) {
    return (
      <img
        src={bank.logo}
        alt={bank.name}
        className="fdr-bank-logo-img"
        onError={() => setErr(true)}
      />
    )
  }
  return (
    <div className="fdr-bank-abbr" style={{ background: bank.color }}>{bank.abbr}</div>
  )
}

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function fmtTenure(months) {
  if (months < 12) return `${months} Months`
  if (months === 12) return '1 Year'
  if (months % 12 === 0) return `${months / 12} Years`
  return `${months} Months`
}

export default function FDReviewScreen({ direction, fdConfig, rate, creditLimit, maturity, onNext, onBack, onEdit }) {
  const bank = BANKS[fdConfig.bank] || BANKS.Karnataka

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton onClick={onNext}>Pay &amp; Book FD</CtaButton>
        </>
      }
    >
      <div className="fdr-header-row">
        <div>
          <h1 className="fdr-title">Your FD is set</h1>
          <p className="fdr-sub">Review the details before payment</p>
        </div>
        <button className="fdr-edit-btn" onClick={onEdit}>Edit</button>
      </div>

      {/* Bank chip */}
      <div className="fdr-bank-chip">
        <BankLogo bank={bank} />
        <span className="fdr-bank-name">{bank.name}</span>
        <div className="fdr-kyc-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#16a34a"/>
            <path d="M2.5 5L4.2 6.8L7.5 3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          KYC Verified
        </div>
      </div>

      {/* Summary card */}
      <motion.div
        className="fdr-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
      >
        {/* Top two-column highlight */}
        <div className="fdr-top-row">
          <div className="fdr-top-item">
            <div className="fdr-top-label">Credit Limit</div>
            <div className="fdr-top-value blue">{fmtINR(creditLimit)}</div>
          </div>
          <div className="fdr-divider-v" />
          <div className="fdr-top-item">
            <div className="fdr-top-label">FD Amount</div>
            <div className="fdr-top-value">{fmtINR(fdConfig.amount)}</div>
          </div>
        </div>

        <div className="fdr-divider-h" />

        {/* Detail rows */}
        <div className="fdr-row">
          <span className="fdr-row-label">Tenure</span>
          <span className="fdr-row-value">{fmtTenure(fdConfig.tenure)}</span>
        </div>
        <div className="fdr-divider-h dashed" />
        <div className="fdr-row">
          <span className="fdr-row-label">Rate of Interest</span>
          <span className="fdr-row-value accent">{rate}% p.a.</span>
        </div>
        <div className="fdr-divider-h dashed" />
        <div className="fdr-row">
          <span className="fdr-row-label">Maturity Amount</span>
          <span className="fdr-row-value">{fmtINR(maturity)}</span>
        </div>
      </motion.div>

      {/* Auto-renew note */}
      <div className="fdr-renew-row">
        <span style={{ color: '#1FA8E1', fontSize: 15, flexShrink: 0, lineHeight: 1 }}>↻</span>
        <span>FD auto-renews at prevailing rate on maturity</span>
      </div>

      {/* Credit limit note */}
      <div className="fdr-note">
        Credit limit is 80% of FD principal and subject to SBI Card's final approval.
      </div>
    </ScreenWrapper>
  )
}
