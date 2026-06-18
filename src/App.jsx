import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import Stepper from './components/Stepper'
import RejectionScreen from './screens/RejectionScreen'
import EntryScreen from './screens/EntryScreen'
import BookFDScreen from './screens/BookFDScreen'
import KYCScreen from './screens/KYCScreen'
import PaymentScreen from './screens/PaymentScreen'
import CardEligibilityScreen from './screens/CardEligibilityScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import './App.css'

const STEPS = ['KYC', 'FD Details', 'Book FD', 'Card', 'Done']

const RATES = {
  SBI: { 1: 6.80, 2: 7.10, 3: 7.25, 5: 6.50 },
  HDFC: { 1: 7.00, 2: 7.25, 3: 7.40, 5: 7.00 },
  ICICI: { 1: 6.90, 2: 7.10, 3: 7.25, 5: 6.90 },
  Kotak: { 1: 7.20, 2: 7.40, 3: 7.50, 5: 7.10 },
  Axis: { 1: 7.10, 2: 7.25, 3: 7.30, 5: 7.00 },
  PNB: { 1: 6.90, 2: 7.05, 3: 7.15, 5: 6.80 },
  BOB: { 1: 6.85, 2: 7.10, 3: 7.20, 5: 6.75 },
  Canara: { 1: 6.90, 2: 7.15, 3: 7.30, 5: 6.85 },
}

export const CARD_VARIANTS = {
  unnati: {
    id: 'unnati',
    name: 'SBI Card Unnati',
    tag: 'Starter',
    image: '/sbic-unnati-card.webp',
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
    bank: 'SBI',
    amount: 50000,
    tenure: 2,
  })

  const goTo = useCallback((s) => {
    if (s < 0 || s > 7) return
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const next = useCallback(() => goTo(step + 1), [step, goTo])
  const back = useCallback(() => goTo(step - 1), [step, goTo])

  const rate = (RATES[fdConfig.bank] || RATES.SBI)[fdConfig.tenure]
  const creditLimit = Math.round(fdConfig.amount * 0.8)
  const maturity = Math.round(fdConfig.amount * Math.pow(1 + rate / 100, fdConfig.tenure))
  const cardVariant = getCardVariant(fdConfig.amount)

  // Stepper: step 0,1 = no stepper, steps 2-7 map to STEPS[0-4]
  const stepperCurrent = step - 1
  const showStepper = step > 1

  const screens = {
    0: <RejectionScreen key="rejection" direction={direction} onNext={next} />,
    1: <EntryScreen key="entry" direction={direction} onNext={next} />,
    2: <KYCScreen key="kyc" direction={direction} onNext={next} onBack={back} />,
    3: <BookFDScreen key="fd" direction={direction} fdConfig={fdConfig} setFdConfig={setFdConfig}
         rate={rate} creditLimit={creditLimit} maturity={maturity} cardVariant={cardVariant} onNext={next} onBack={back} />,
    4: <PaymentScreen key="pay" direction={direction} fdConfig={fdConfig} rate={rate}
         creditLimit={creditLimit} maturity={maturity} onNext={next} onBack={back} />,
    5: <CardEligibilityScreen key="card" direction={direction} creditLimit={creditLimit} cardVariant={cardVariant} onNext={next} />,
    6: <ConfirmationScreen key="confirm" direction={direction} fdConfig={fdConfig} rate={rate} goTo={() => goTo(0)} />,
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
