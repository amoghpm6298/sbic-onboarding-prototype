import './PhoneFrame.css'

export default function PhoneFrame({ stepper, children }) {
  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">
          <img src="/sbi-card-logo.png" alt="SBI Card" />
        </div>
        <div className="powered-by">
          Powered by <span className="hf-logo">HYPERFACE</span>
        </div>
      </div>
      {stepper}
      <div className="screen-area">
        {children}
      </div>
    </div>
  )
}
