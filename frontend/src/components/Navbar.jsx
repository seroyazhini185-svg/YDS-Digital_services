import { useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BUSINESS } from '../config.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
  { to: '/portfolio', label: 'Portfolio' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <button
            type="button"
            className="brand-logo-btn"
            aria-label="View full logo"
            onClick={() => setShowLogo(true)}
          >
            <img src="/logo.png" alt={`${BUSINESS.brand} logo`} className="brand-logo" />
          </button>
          <NavLink to="/" className="brand-text" onClick={() => setOpen(false)}>
            <span className="brand-mark">{BUSINESS.brand}</span>
            <span className="brand-sub">Digital Services</span>
          </NavLink>
        </div>

        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* full logo pop-up is rendered on <body> */}

      {showLogo &&
        createPortal(
          <div className="logo-modal-backdrop" onClick={() => setShowLogo(false)}>
            <div className="logo-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="logo-modal-close"
                aria-label="Close"
                onClick={() => setShowLogo(false)}
              >
                <X size={22} />
              </button>
              <img src="/logo-full.png" alt={`${BUSINESS.brandFull} full logo`} />
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
