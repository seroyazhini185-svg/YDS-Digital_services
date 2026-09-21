import { Mail, MessageSquare, MessageCircle } from 'lucide-react'
import { BUSINESS, emailLink, smsLink, whatsappLink } from '../config.js'

export default function ContactInfo() {
  return (
    <div className="contact-info">
      <a className="contact-info-item" href={emailLink()}>
        <Mail size={20} />
        <div>
          <h3>Email</h3>
          <p>{BUSINESS.email}</p>
        </div>
      </a>
      <a className="contact-info-item" href={smsLink()}>
        <MessageSquare size={20} />
        <div>
          <h3>SMS</h3>
          <p>+91 {BUSINESS.phoneDisplay}</p>
        </div>
      </a>
      <a
        className="contact-info-item"
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={20} />
        <div>
          <h3>WhatsApp</h3>
          <p>+91 {BUSINESS.phoneDisplay}</p>
        </div>
      </a>
    </div>
  )
}
