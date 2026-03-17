import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import Stepper from './components/Stepper'
import EntryScreen from './screens/EntryScreen'
import BookFDScreen from './screens/BookFDScreen'
import KYCScreen from './screens/KYCScreen'
import CardEligibilityScreen from './screens/CardEligibilityScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import './App.css'

const STEPS = ['Start', 'Book FD', 'Video KYC', 'Card', 'Done']

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

export default function App() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [fdConfig, setFdConfig] = useState({
    bank: 'SBI',
    amount: 50000,
    tenure: 2,
  })

  const goTo = useCallback((s) => {
    if (s < 1 || s > 5) return
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const next = useCallback(() => goTo(step + 1), [step, goTo])
  const back = useCallback(() => goTo(step - 1), [step, goTo])

  const rate = (RATES[fdConfig.bank] || RATES.SBI)[fdConfig.tenure]
  const creditLimit = Math.round(fdConfig.amount * 0.8)
  const maturity = Math.round(fdConfig.amount * Math.pow(1 + rate / 100, fdConfig.tenure))

  const screens = {
    1: <EntryScreen key="entry" direction={direction} onNext={next} />,
    2: <BookFDScreen key="fd" direction={direction} fdConfig={fdConfig} setFdConfig={setFdConfig}
         rate={rate} creditLimit={creditLimit} maturity={maturity} onNext={next} onBack={back} />,
    3: <KYCScreen key="kyc" direction={direction} onNext={next} onBack={back} />,
    4: <CardEligibilityScreen key="card" direction={direction} creditLimit={creditLimit} onNext={next} onBack={back} />,
    5: <ConfirmationScreen key="confirm" direction={direction} fdConfig={fdConfig} rate={rate} goTo={goTo} />,
  }

  return (
    <div className="app-wrapper">
      <div className="watermark">Prototype — For Demo Purposes Only</div>
      <PhoneFrame stepper={<Stepper steps={STEPS} current={step} />}>
        <AnimatePresence mode="wait" custom={direction}>
          {screens[step]}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}
