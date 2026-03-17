import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './CardEligibilityScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const benefits = [
  { emoji: '🏷️', title: 'Zero Fee Card', desc: 'SBI Card Unnati is free for first 4 years. Annual fee of ₹499 waived off.' },
  { emoji: '🎁', title: 'Rewards on Spends', desc: 'Get 1 Reward Point per ₹100 spent. Redeem against gifts from the Rewards Catalogue.' },
  { emoji: '🏆', title: 'Milestone Rewards', desc: 'Receive ₹500 Cashback within 15 days of achieving annual spends of ₹50,000 or more.' },
  { emoji: '⛽', title: 'Complete Fuel Freedom', desc: '1% fuel surcharge waiver for transactions between ₹500 & ₹3000 (excl. GST).' },
  { emoji: '💳', title: 'Secured Card', desc: 'Issued with a lien on cardholder\'s Fixed Deposit of ₹25,000 or more. Build your credit score.' },
]

const TC_ITEMS = [
  'I agree to the SBI Card Unnati Terms & Conditions and the Most Important Terms & Conditions (MITC).',
  'I authorize SBI Card to place a lien on my Fixed Deposit for the credit limit sanctioned.',
  'I understand that the credit limit will be up to 80% of the FD amount and is subject to change.',
  'I agree to receive communications from SBI Card regarding my account via SMS, Email and WhatsApp.',
  'I confirm that the information provided is true and accurate. Any misrepresentation may lead to cancellation.',
  'I have read and understood the Schedule of Charges including interest rates, late payment fees and other applicable charges.',
]

export default function CardEligibilityScreen({ direction, creditLimit, onNext }) {
  const [sheet, setSheet] = useState(null) // null | 'tc' | 'otp'
  const [tcAgreed, setTcAgreed] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const otpRefs = useRef([])

  const handleAvailCard = () => setSheet('tc')

  const handleTcAccept = () => {
    setSheet('otp')
    setOtp(['', '', '', '', '', ''])
    setOtpError(false)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError(false)

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpVerify = () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setOtpError(true)
      return
    }
    setVerifying(true)
    setTimeout(() => {
      setSheet(null)
      onNext()
    }, 1500)
  }

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every(d => d !== '') && sheet === 'otp' && !verifying) {
      handleOtpVerify()
    }
  }, [otp, sheet])

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={handleAvailCard}>Avail Card</CtaButton>}
    >
      {/* Dark hero section */}
      <div className="card-hero">
        <motion.h1 className="congrats-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Congratulations!
        </motion.h1>
        <p className="congrats-sub">Your SBI Card Unnati is ready!<br />Review your card details below.</p>
        <motion.div className="card-image-wrap" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}>
          <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="card-image" />
        </motion.div>
      </div>

      {/* White details section */}
      <div className="card-details-section">
        <div className="detail-grid">
          <div className="detail-item"><div className="detail-label">Card Type</div><div className="detail-value">SBI Card Unnati</div></div>
          <div className="detail-item"><div className="detail-label">Credit Limit</div><div className="detail-value blue">{fmtINR(creditLimit)}</div></div>
          <div className="detail-item"><div className="detail-label">Annual Fee</div><div className="detail-value green">₹499 (waived 4 yrs)</div></div>
          <div className="detail-item"><div className="detail-label">Reward Points</div><div className="detail-value">1 / ₹100</div></div>
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>Privileges on SBI Card Unnati</div>
        {benefits.map((b, i) => (
          <motion.div className="privilege-row" key={b.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
            <div className="privilege-emoji">{b.emoji}</div>
            <div className="privilege-text">
              <div className="privilege-title">{b.title}</div>
              <div className="privilege-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── T&C Bottom Sheet ── */}
      <AnimatePresence>
        {sheet === 'tc' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
            <motion.div className="sheet sheet-tall" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Terms & Conditions</h2>
                <button className="sheet-close" onClick={() => setSheet(null)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="sheet-body tc-body">
                <div className="tc-list">
                  {TC_ITEMS.map((item, i) => (
                    <div className="tc-item" key={i}>
                      <div className="tc-num">{i + 1}.</div>
                      <p className="tc-text">{item}</p>
                    </div>
                  ))}
                </div>

                <label className="tc-checkbox-row" onClick={() => setTcAgreed(!tcAgreed)}>
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
      </AnimatePresence>

      {/* ── OTP Bottom Sheet ── */}
      <AnimatePresence>
        {sheet === 'otp' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Verify with OTP</h2>
                <button className="sheet-close" onClick={() => { setSheet(null); setVerifying(false); }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="sheet-body otp-body">
                <p className="otp-desc">
                  We've sent a 6-digit OTP to your registered mobile number <strong>98XXX XXXX32</strong>
                </p>

                <div className="otp-inputs">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      className={`otp-box ${digit ? 'filled' : ''} ${otpError ? 'error' : ''}`}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {otpError && <p className="otp-error">Please enter all 6 digits</p>}

                <div className="otp-resend">
                  Didn't receive OTP? <button className="otp-resend-btn">Resend</button>
                </div>

                {verifying && (
                  <motion.div
                    className="otp-verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
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
      </AnimatePresence>
    </ScreenWrapper>
  )
}
