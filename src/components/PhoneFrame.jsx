import './PhoneFrame.css'

export default function PhoneFrame({ stepper, children }) {
  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="status-bar">
        <span className="time">9:41</span>
        <div className="status-icons">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="1" fill="#1a1a2e" opacity=".3"/><rect x="4.5" y="2" width="3" height="10" rx="1" fill="#1a1a2e" opacity=".5"/><rect x="9" y="0" width="3" height="12" rx="1" fill="#1a1a2e" opacity=".8"/><rect x="13" y="0" width="3" height="12" rx="1" fill="#1a1a2e"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2C5.5 2 3.2 3 1.5 4.7L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2l-1.5 1.5C12.8 3 10.5 2 8 2z" fill="#1a1a2e"/><path d="M8 6c-1.7 0-3.2.7-4.3 1.8L2.2 6.3C3.7 4.9 5.7 4 8 4s4.3.9 5.8 2.3l-1.5 1.5C11.2 6.7 9.7 6 8 6z" fill="#1a1a2e"/><circle cx="8" cy="10" r="2" fill="#1a1a2e"/></svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0" y="1" width="20" height="10" rx="2" stroke="#1a1a2e" strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="15" height="7" rx="1" fill="#1a1a2e"/><rect x="21" y="4" width="2" height="4" rx="1" fill="#1a1a2e" opacity=".4"/></svg>
        </div>
      </div>
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
