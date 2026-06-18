import { useState } from 'react'
import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import { CARD_VARIANTS } from '../App'
import './CardSelectionScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function CardVisual({ variantId }) {
  if (variantId === 'prime') {
    return (
      <div className="cs-card prime">
        <div className="cs-card-brand">SBI Card</div>
        <div className="cs-card-chip gold" />
        <div className="cs-card-name">PRIME</div>
        <div className="cs-card-shine" />
      </div>
    )
  }
  return (
    <div className="cs-card simple">
      <div className="cs-card-brand blue">SBI Card</div>
      <div className="cs-card-chip sky" />
      <div className="cs-card-name blue">SIMPLE</div>
      <div className="cs-card-shine" />
    </div>
  )
}

export default function CardSelectionScreen({ direction, fdConfig, creditLimit, selectedCard, onSelect, onNext, onBack }) {
  const [chosen, setChosen] = useState(selectedCard?.id || 'prime')

  const handleContinue = () => {
    onSelect(CARD_VARIANTS[chosen])
    onNext()
  }

  const variants = [CARD_VARIANTS.prime, CARD_VARIANTS.unnati]

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={
        <>
          <BackButton onClick={onBack} />
          <CtaButton onClick={handleContinue}>
            Continue with {chosen === 'prime' ? 'Prime' : 'Simple'}
          </CtaButton>
        </>
      }
    >
      <h1>Choose Your Card</h1>
      <p className="helper-text">
        Your {fmtINR(fdConfig.amount)} FD qualifies you for both cards. Pick one.
      </p>

      <div className="cs-options">
        {variants.map((variant, i) => (
          <motion.div
            key={variant.id}
            className={`cs-option ${chosen === variant.id ? 'selected' : ''}`}
            onClick={() => setChosen(variant.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {/* Selected check */}
            <div className={`cs-radio ${chosen === variant.id ? 'checked' : ''}`}>
              {chosen === variant.id && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Top row: tag + recommended */}
            <div className="cs-top-row">
              <span className={`cs-tag ${variant.id}`}>{variant.tag}</span>
              {variant.id === 'prime' && <span className="cs-recommended">RECOMMENDED</span>}
            </div>

            {/* Card visual */}
            <CardVisual variantId={variant.id} />

            {/* Details grid */}
            <div className="cs-detail-grid">
              <div className="cs-detail">
                <div className="cs-dl">Credit Limit</div>
                <div className="cs-dv blue">{fmtINR(creditLimit)}</div>
              </div>
              <div className="cs-detail">
                <div className="cs-dl">Annual Fee</div>
                <div className={`cs-dv ${variant.id === 'unnati' ? 'green' : ''}`}>{variant.annualFee}</div>
              </div>
              <div className="cs-detail">
                <div className="cs-dl">Rewards</div>
                <div className="cs-dv">{variant.rewardRate}</div>
              </div>
            </div>

            {/* Top benefit */}
            <div className="cs-benefit">
              <span className="cs-benefit-emoji">{variant.benefits[0].emoji}</span>
              <span className="cs-benefit-text">{variant.benefits[0].title}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenWrapper>
  )
}
