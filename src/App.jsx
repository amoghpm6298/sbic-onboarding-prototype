import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import Stepper from './components/Stepper'
import RejectionScreen from './screens/RejectionScreen'
import EntryScreen from './screens/EntryScreen'
import LandingScreen from './screens/LandingScreen'
import PersonalDetailsScreen from './screens/PersonalDetailsScreen'
import AddressDetailsScreen from './screens/AddressDetailsScreen'
import BookFDScreen from './screens/BookFDScreen'
import KYCScreen from './screens/KYCScreen'
import FDReviewScreen from './screens/FDReviewScreen'
import PaymentScreen from './screens/PaymentScreen'
import ProcessingScreen from './screens/ProcessingScreen'
import CardEligibilityScreen from './screens/CardEligibilityScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import { EXISTING_FDS } from './data/existingFds'
import { getBankName } from './data/banks'
import './App.css'

const STEPS = ['FD Setup', 'KYC', 'Book FD', 'Card', 'Done']
const STEP_TO_STEPPER = { 2: 1, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 5 }

const DEFAULT_FD_CONFIG = { bank: 'SBI', amount: 100000, tenure: 24, mode: 'existing', existingFds: [] }

const EXISTING_CUSTOMER = {
  name: 'Rahul Sharma', phone: '98XXX XXXX32', email: 'rah***@gmail.com',
  dob: '1992-03-15', pan: 'XXXXX1234X',
  addressLine1: 'B-42, Sector 15', addressLine2: '', pincode: '122001', city: 'Gurugram', state: 'Haryana',
  source: 'existing',
}
const BLANK_CUSTOMER = {
  name: '', phone: '', email: '', dob: '', pan: '',
  addressLine1: '', addressLine2: '', pincode: '', city: '', state: '',
  source: 'ntb',
}

const RATES = {
  SBI: { 6: 6.60, 12: 6.80, 18: 7.00, 24: 7.10, 36: 7.25, 60: 6.50 },
  KVB: { 6: 6.70, 12: 7.00, 18: 7.20, 24: 7.35, 36: 7.45, 60: 7.15 },
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
  // Step 0 = rejection, 1 = entry (existing-applicant persona)
  // Step 9 = landing, 10 = personal details (general/NTB persona) — converges on step 2
  // NTB is the default entry point — most visitors have no prior SBI relationship.
  const [step, setStep] = useState(9)
  const [direction, setDirection] = useState(1)
  const [entryPoint, setEntryPoint] = useState('ntb') // 'rejected' | 'ntb'
  const [fdConfig, setFdConfig] = useState(DEFAULT_FD_CONFIG)
  const [customer, setCustomer] = useState(BLANK_CUSTOMER)
  const [selectedCard, setSelectedCard] = useState(null)
  const isNtb = entryPoint === 'ntb'

  const goTo = useCallback((s) => {
    if (s < 0 || s > 11) return
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const resetEntry = useCallback((point) => {
    setEntryPoint(point)
    setFdConfig({ ...DEFAULT_FD_CONFIG })
    setCustomer(point === 'ntb' ? BLANK_CUSTOMER : EXISTING_CUSTOMER)
    setDirection(1)
    setStep(point === 'ntb' ? 9 : 0)
  }, [])

  // KYC is tied to the customer's relationship with the bank, not to any one FD/product —
  // RBI KYC Master Directions 2016 permit reliance on due diligence already performed, and
  // banks in practice (e.g. Axis, IDFC FIRST secured-card flows) skip re-KYC for existing customers.
  // A general/NTB visitor has no such relationship with any bank yet, regardless of mock data.
  const hasBankRelationship = !isNtb && (EXISTING_FDS[fdConfig.bank] || []).length > 0

  // Existing-FD path skips partner KYC, the FD review step, and Payment (the FD is already
  // funded) — straight to card eligibility. A brand-new FD with a bank you're already KYC'd
  // with only skips KYC — FDReview + Payment still run since it's genuinely new money.
  const next = useCallback(() => {
    if (step === 11) { goTo(2); return }
    if (step === 2 && fdConfig.mode === 'existing') { goTo(6); return }
    if (step === 2 && fdConfig.mode === 'new' && hasBankRelationship) { goTo(4); return }
    if (step === 6) { goTo(7); return }
    if (step === 5) { goTo(7); return }
    goTo(step + 1)
  }, [step, goTo, fdConfig.mode, hasBankRelationship])

  const back = useCallback(() => {
    if (step === 2 && isNtb) { goTo(11); return }
    if (step === 7 && fdConfig.mode === 'existing') { goTo(2); return }
    if (step === 7) { goTo(5); return }
    if (step === 4 && fdConfig.mode === 'new' && hasBankRelationship) { goTo(2); return }
    goTo(step - 1)
  }, [step, goTo, fdConfig.mode, hasBankRelationship, isNtb])

  const rate = fdConfig.mode === 'existing'
    ? (fdConfig.existingFds.length
        ? fdConfig.existingFds.reduce((sum, fd) => sum + fd.rate * fd.amount, 0) / fdConfig.amount
        : (RATES[fdConfig.bank] || RATES.SBI)[fdConfig.tenure])
    : (RATES[fdConfig.bank] || RATES.SBI)[fdConfig.tenure]
  const creditLimit = Math.round(fdConfig.amount * 0.8)
  const maturity = fdConfig.mode === 'existing'
    ? fdConfig.existingFds.reduce((sum, fd) => sum + fd.maturityAmount, 0)
    : Math.round(fdConfig.amount * Math.pow(1 + rate / 100, fdConfig.tenure / 12))
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
         isNtb={isNtb} onNext={next} onBack={back} />,
    3: <KYCScreen key="kyc" direction={direction} customer={customer} bank={fdConfig.bank} onNext={next} onBack={back} />,
    4: <FDReviewScreen key="fd-review" direction={direction} fdConfig={fdConfig}
         rate={rate} creditLimit={creditLimit} maturity={maturity}
         onNext={next} onBack={back} onEdit={() => goTo(2)} />,
    5: <PaymentScreen key="pay" direction={direction} fdConfig={fdConfig} rate={rate}
         creditLimit={creditLimit} maturity={maturity} onNext={next} onBack={back} />,
    6: <ProcessingScreen key="processing" direction={direction} bankName={getBankName(fdConfig.bank)} onNext={next} />,
    7: <CardEligibilityScreen key="card" direction={direction} creditLimit={creditLimit}
         variants={availableVariants} bankName={getBankName(fdConfig.bank)} customer={customer}
         kycSkipped={fdConfig.mode === 'existing'} onSelect={setSelectedCard} onNext={next} onBack={back} />,
    8: <ConfirmationScreen key="confirm" direction={direction} fdConfig={fdConfig} rate={rate} goTo={() => goTo(0)} />,
    9: <LandingScreen key="landing" direction={direction} onNext={next} />,
    10: <PersonalDetailsScreen key="details" direction={direction} customer={customer} setCustomer={setCustomer} onNext={next} onBack={back} />,
    11: <AddressDetailsScreen key="address" direction={direction} customer={customer} setCustomer={setCustomer} onNext={next} onBack={back} />,
  }

  // Hide header on rejection screen only; hide stepper on the pre-FD screens (entry/landing/details/address)
  const showHeader = step > 0
  const showStepperFinal = showStepper && step !== 9 && step !== 10 && step !== 11

  return (
    <div className="app-wrapper">
      <div className="demo-entry-switcher">
        <div className="demo-entry-switcher-inner">
          <button className={entryPoint === 'rejected' ? 'active' : ''} onClick={() => resetEntry('rejected')}>Rejected</button>
          <button className={entryPoint === 'ntb' ? 'active' : ''} onClick={() => resetEntry('ntb')}>New (NTB)</button>
        </div>
      </div>
      <PhoneFrame
        stepper={showStepperFinal ? <Stepper steps={STEPS} current={stepperCurrent} /> : null}
        showHeader={showHeader}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {screens[step]}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}
