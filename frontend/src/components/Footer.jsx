import { Mail, MessageSquare, MessageCircle } from 'lucide-react'
import { BUSINESS, emailLink, smsLink, whatsappLink } from '../config.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href={emailLink()} aria-label="Email">
          <Mail size={18} />
        </a>
        <a href={smsLink()} aria-label="SMS">
          <MessageSquare size={18} />
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
      </div>
      <p>
        © {year} {BUSINESS.brandFull}. {BUSINESS.location}.
      </p>
    </footer>
  )
}
