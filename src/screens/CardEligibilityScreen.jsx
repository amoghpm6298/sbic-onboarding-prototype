import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './CardEligibilityScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function maskPhone(phone) {
  if (!phone) return '98XXX XXXX32'
  if (phone.includes('X')) return phone // already display-masked (existing-applicant demo data)
  return `${phone.slice(0, 2)}XXX XXXX${phone.slice(8)}`
}

function CardVisual({ id }) {
  if (id === 'prime') {
    return (
      <div className="prime-card-visual">
        <div className="prime-card-brand">SBI Card</div>
        <div className="prime-card-name">PRIME</div>
        <div className="prime-card-chip" />
        <div className="prime-card-shine" />
      </div>
    )
  }
  return (
    <div className="simple-card-visual">
      <div className="simple-card-brand">SBI Card</div>
      <div className="simple-card-chip" />
      <div className="simple-card-name">SIMPLE</div>
      <div className="simple-card-shine" />
    </div>
  )
}

export default function CardEligibilityScreen({ direction, creditLimit, variants, bankName, customer, kycSkipped, onSelect, onNext, onBack }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [swipeDir, setSwipeDir] = useState(1)
  const cardVariant = variants[activeIdx]
  const multiCard = variants.length > 1
  const tcItems = [
    ...cardVariant.tc.slice(0, 2),
    `I authorize ${bankName}'s KYC (CKYC) records to be shared with SBI Card for the purpose of credit card issuance.`,
    ...cardVariant.tc.slice(2),
  ]

  const [sheet, setSheet] = useState(null) // null | 'tc' | 'otp'
  const [tcAgreed, setTcAgreed] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const otpRefs = useRef([])

  useEffect(() => { setTcAgreed(false) }, [activeIdx])

  const handleDragEnd = (e, info) => {
    if (!multiCard) return
    if (info.offset.x < -50 && activeIdx < variants.length - 1) {
      setSwipeDir(1)
      setActiveIdx(i => i + 1)
    } else if (info.offset.x > 50 && activeIdx > 0) {
      setSwipeDir(-1)
      setActiveIdx(i => i - 1)
    }
  }

  const handleAvailCard = () => setSheet('tc')

  const handleTcAccept = () => {
    setSheet('otp')
    setOtp(['', '', '', '', '', ''])
    setOtpError(false)
  }

  const focusInput = (index) => {
    const el = otpRefs.current[index]
    if (!el) return
    setTimeout(() => {
      el.focus({ preventScroll: true })
      el.select()
    }, 10)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = [...otp]
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d })
      setOtp(newOtp)
      setOtpError(false)
      focusInput(Math.min(index + digits.length, 5))
      return
    }
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError(false)
    if (value && index < 5) focusInput(index + 1)
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      focusInput(index - 1)
    }
  }

  useEffect(() => {
    if (sheet === 'otp') {
      setTimeout(() => {
        const el = otpRefs.current[0]
        if (el) { el.focus({ preventScroll: true }); el.select() }
      }, 300)
    }
  }, [sheet])

  const handleOtpVerify = () => {
    const code = otp.join('')
    if (code.length !== 6) { setOtpError(true); return }
    if (document.activeElement) document.activeElement.blur()
    setVerifying(true)
    setTimeout(() => {
      setSheet(null)
      onSelect?.(cardVariant)
      setTimeout(() => onNext(), 100)
    }, 1500)
  }

  useEffect(() => {
    if (otp.every(d => d !== '') && sheet === 'otp' && !verifying) handleOtpVerify()
  }, [otp, sheet])

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton onClick={handleAvailCard}>
            Avail {cardVariant.shortName}
          </CtaButton>
        </>
      }
    >
      {/* Dark hero section */}
      <div className="card-hero">
        <motion.h1
          className="congrats-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Congratulations!
        </motion.h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={cardVariant.id + '-sub'}
            className="congrats-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            Your <strong>{cardVariant.name}</strong> is ready!<br />Review your card details below.
          </motion.p>
        </AnimatePresence>

        {/* Swipeable card */}
        <motion.div
          className="card-image-wrap"
          drag={multiCard ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ touchAction: 'pan-y', cursor: multiCard ? 'grab' : 'default' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        >
          <AnimatePresence mode="wait" custom={swipeDir}>
            <motion.div
              key={cardVariant.id}
              custom={swipeDir}
              initial={{ x: swipeDir * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -swipeDir * 60, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <CardVisual id={cardVariant.id} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dots + swipe hint */}
        {multiCard && (
          <div className="card-swipe-hint">
            <div className="card-dots">
              {variants.map((v, i) => (
                <div
                  key={v.id}
                  className={`card-dot ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => { setSwipeDir(i > activeIdx ? 1 : -1); setActiveIdx(i) }}
                />
              ))}
            </div>
            <p className="swipe-hint-text">Swipe to compare cards</p>
          </div>
        )}
      </div>

      {/* White details section — re-animates on card switch */}
      <div className="card-details-section" key={cardVariant.id}>
        <div className="detail-grid">
          <div className="detail-item"><div className="detail-label">Card Type</div><div className="detail-value">{cardVariant.name}</div></div>
          <div className="detail-item"><div className="detail-label">Credit Limit</div><div className="detail-value blue">{fmtINR(creditLimit)}</div></div>
          <div className="detail-item"><div className="detail-label">Annual Fee</div><div className="detail-value green">{cardVariant.annualFee}</div></div>
          <div className="detail-item"><div className="detail-label">Reward Points</div><div className="detail-value">{cardVariant.rewardRate}</div></div>
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>Privileges on {cardVariant.name}</div>
        {cardVariant.benefits.map((b, i) => (
          <motion.div
            className="privilege-row"
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
          >
            <div className="privilege-emoji">{b.emoji}</div>
            <div className="privilege-text">
              <div className="privilege-title">{b.title}</div>
              <div className="privilege-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* T&C sheet */}
      {createPortal(<AnimatePresence>
        {sheet === 'tc' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
            <motion.div className="tc-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Terms & Conditions</h2>
                <button className="sheet-close" onClick={() => setSheet(null)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="tc-scroll">
                {tcItems.map((item, i) => (
                  <div className="tc-item" key={i}>
                    <div className="tc-num">{i + 1}.</div>
                    <p className="tc-text">{item}</p>
                  </div>
                ))}
              </div>
              <div className="tc-fixed-footer">
                <label className="tc-checkbox-row" onClick={() => setTcAgreed(v => !v)}>
                  <div className={`tc-checkbox ${tcAgreed ? 'checked' : ''}`}>
                    {tcAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span>I have read and agree to all the Terms & Conditions</span>
                </label>
                <button
                  className={`cta-btn cta-primary tc-accept-btn ${!tcAgreed ? 'disabled' : ''}`}
                  onClick={tcAgreed ? handleTcAccept : undefined}
                  disabled={!tcAgreed}
                >
                  Accept & Continue
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}

      {/* OTP sheet */}
      {createPortal(<AnimatePresence>
        {sheet === 'otp' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">{kycSkipped ? 'Aadhaar-Linked OTP Verification' : 'Verify with OTP'}</h2>
                <button className="sheet-close" onClick={() => { setSheet(null); setVerifying(false) }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="sheet-body otp-body">
                {kycSkipped ? (
                  <>
                    <p className="otp-desc">
                      Since we're relying on the KYC already completed by {bankName} for your FD, please verify the OTP sent to your Aadhaar-linked mobile number <strong>{maskPhone(customer?.phone)}</strong> to confirm your identity before we issue your card.
                    </p>
                    <div className="kyc-skip-hint">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="7" cy="7" r="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
                        <path d="M4.5 7L6 8.5L9.5 5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>This replaces a full video KYC — your CKYC record already covers identity &amp; address verification.</span>
                    </div>
                  </>
                ) : (
                  <p className="otp-desc">
                    We've sent a 6-digit OTP to your registered mobile number <strong>{maskPhone(customer?.phone)}</strong>
                  </p>
                )}
                <div className="otp-inputs">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`otp-box ${digit ? 'filled' : ''} ${otpError ? 'error' : ''}`}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>
                {otpError && <p className="otp-error">Please enter all 6 digits</p>}
                <div className="otp-resend">
                  Didn't receive OTP? <button className="otp-resend-btn">Resend</button>
                </div>
                {verifying && (
                  <motion.div className="otp-verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="otp-spinner" />
                    <span>Verifying...</span>
                  </motion.div>
                )}
                {!verifying && (
                  <button className="cta-btn cta-primary otp-verify-btn" onClick={handleOtpVerify}>
                    Verify OTP
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}
    </ScreenWrapper>
  )
}
