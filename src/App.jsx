import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import Stepper from './components/Stepper'
import RejectionScreen from './screens/RejectionScreen'
import EntryScreen from './screens/EntryScreen'
import BookFDScreen from './screens/BookFDScreen'
import KYCScreen from './screens/KYCScreen'
import FDReviewScreen from './screens/FDReviewScreen'
import PaymentScreen from './screens/PaymentScreen'
import CardEligibilityScreen from './screens/CardEligibilityScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import './App.css'

const STEPS = ['FD Setup', 'KYC', 'Book FD', 'Card', 'Done']
const STEP_TO_STEPPER = { 2: 1, 3: 2, 4: 3, 5: 3, 7: 4, 8: 5 }

const RATES = {
  Karnataka: { 6: 6.60, 12: 7.00, 18: 7.25, 24: 7.35, 36: 7.40, 60: 7.10 },
  Allahabad: { 6: 6.50, 12: 6.80, 18: 7.00, 24: 7.10, 36: 7.25, 60: 6.80 },
  SIB:       { 6: 6.75, 12: 7.10, 18: 7.25, 24: 7.40, 36: 7.50, 60: 7.20 },
  KVB:       { 6: 6.70, 12: 7.00, 18: 7.20, 24: 7.35, 36: 7.45, 60: 7.15 },
  UCO:       { 6: 6.50, 12: 6.85, 18: 7.05, 24: 7.15, 36: 7.25, 60: 6.90 },
}

export const CARD_VARIANTS = {
  unnati: {
    id: 'unnati',
    name: 'SBI Card Unnati',
    tag: 'Starter',
    shortName: 'Simple',
    image: null,
    annualFee: '₹499 (waived 4 yrs)',
    rewardRate: '1 pt / ₹100',
    minFD: 0,
    benefits: [
      { emoji: '🏷️', title: 'Zero Fee Card', desc: 'Annual fee of ₹499 waived for first 4 years.' },
      { emoji: '🎁', title: 'Rewards on Spends', desc: 'Get 1 Reward Point per ₹100 spent. Redeem against gifts from the Rewards Catalogue.' },
      { emoji: '🏆', title: 'Milestone Rewards', desc: 'Receive ₹500 Cashback on achieving annual spends of ₹50,000 or more.' },
      { emoji: '⛽', title: 'Complete Fuel Freedom', desc: '1% fuel surcharge waiver for transactions between ₹500 & ₹3000 (excl. GST).' },
      { emoji: '💳', title: 'Build Credit Score', desc: 'Use responsibly to build your CIBIL score. Ideal for first-time credit users.' },
    ],
    tc: [
      'I agree to the SBI Card Unnati Terms & Conditions and the Most Important Terms & Conditions (MITC).',
      'I authorize SBI Card to place a lien on my Fixed Deposit for the credit limit sanctioned.',
      'I understand that the credit limit will be up to 80% of the FD amount and is subject to change.',
      'I agree to receive communications from SBI Card via SMS, Email and WhatsApp.',
      'I confirm that the information provided is true and accurate. Misrepresentation may lead to cancellation.',
      'I have read and understood the Schedule of Charges including interest rates and late payment fees.',
    ],
  },
  prime: {
    id: 'prime',
    name: 'SBI Card Prime',
    tag: 'Premium',
    shortName: 'Prime',
    image: null,
    annualFee: '₹2,999/yr',
    rewardRate: '10X on premium',
    minFD: 500000,
    benefits: [
      { emoji: '✈️', title: 'Airport Lounge Access', desc: '8 complimentary domestic lounge visits per year, plus 2 international visits.' },
      { emoji: '🎁', title: '10X Reward Points', desc: 'Earn 10X Reward Points on dining, movies, departmental stores & international spends.' },
      { emoji: '🛡️', title: 'Air Accident Cover', desc: 'Complimentary air accident insurance cover of ₹50 Lakh.' },
      { emoji: '⛳', title: 'Golf Privileges', desc: '2 complimentary rounds of golf per month at select courses across India.' },
      { emoji: '🎂', title: 'Birthday Bonus', desc: 'Earn 20 Reward Points per ₹100 spent on your birthday.' },
    ],
    tc: [
      'I agree to the SBI Card Prime Terms & Conditions and the Most Important Terms & Conditions (MITC).',
      'I authorize SBI Card to place a lien on my Fixed Deposit of ₹5,00,000 or more for the credit limit sanctioned.',
      'I understand that the credit limit will be up to 80% of the FD amount and is subject to change.',
      'I agree to receive communications from SBI Card via SMS, Email and WhatsApp.',
      'I confirm that the information provided is true and accurate. Misrepresentation may lead to cancellation.',
      'I have read and understood the Schedule of Charges including the annual fee of ₹2,999 applicable from year 2 onwards.',
    ],
  },
}

export function getCardVariant(amount) {
  return amount >= 500000 ? CARD_VARIANTS.prime : CARD_VARIANTS.unnati
}

export default function App() {
  // Step 0 = rejection, 1 = landing, 2-7 = flow
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [fdConfig, setFdConfig] = useState({
    bank: 'Karnataka',
    amount: 100000,
    tenure: 24,
  })
  const [selectedCard, setSelectedCard] = useState(null)

  const goTo = useCallback((s) => {
    if (s < 0 || s > 8) return
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const next = useCallback(() => {
    if (step === 5) goTo(7)
    else goTo(step + 1)
  }, [step, goTo])

  const back = useCallback(() => {
    if (step === 7) goTo(5)
    else goTo(step - 1)
  }, [step, goTo])

  const rate = (RATES[fdConfig.bank] || RATES.Karnataka)[fdConfig.tenure]
  const creditLimit = Math.round(fdConfig.amount * 0.8)
  const maturity = Math.round(fdConfig.amount * Math.pow(1 + rate / 100, fdConfig.tenure / 12))
  const eligibleVariant = getCardVariant(fdConfig.amount)
  const availableVariants = fdConfig.amount >= 500000
    ? [CARD_VARIANTS.prime, CARD_VARIANTS.unnati]
    : [CARD_VARIANTS.unnati]

  const stepperCurrent = STEP_TO_STEPPER[step] || 0
  const showStepper = step > 1

  const screens = {
    0: <RejectionScreen key="rejection" direction={direction} onNext={next} />,
    1: <EntryScreen key="entry" direction={direction} onNext={next} />,
    2: <BookFDScreen key="fd-config" direction={direction} fdConfig={fdConfig} setFdConfig={setFdConfig}
         rate={rate} creditLimit={creditLimit} maturity={maturity} cardVariant={eligibleVariant}
         onNext={next} onBack={back} />,
    3: <KYCScreen key="kyc" direction={direction} onNext={next} onBack={back} />,
    4: <FDReviewScreen key="fd-review" direction={direction} fdConfig={fdConfig}
         rate={rate} creditLimit={creditLimit} maturity={maturity}
         onNext={next} onBack={back} onEdit={() => goTo(2)} />,
    5: <PaymentScreen key="pay" direction={direction} fdConfig={fdConfig} rate={rate}
         creditLimit={creditLimit} maturity={maturity} onNext={next} onBack={back} />,
    7: <CardEligibilityScreen key="card" direction={direction} creditLimit={creditLimit}
         variants={availableVariants} onSelect={setSelectedCard} onNext={next} onBack={back} />,
    8: <ConfirmationScreen key="confirm" direction={direction} fdConfig={fdConfig} rate={rate} goTo={() => goTo(0)} />,
  }

  // Hide header + stepper on rejection screen
  const showHeader = step > 0

  return (
    <div className="app-wrapper">
      <PhoneFrame
        stepper={showStepper ? <Stepper steps={STEPS} current={stepperCurrent} /> : null}
        showHeader={showHeader}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {screens[step]}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}
