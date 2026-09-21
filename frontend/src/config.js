// Central place for your business details.
// Update this file when your contact info, brand name, or tagline changes —
// every page pulls from here instead of hardcoding values separately.

export const BUSINESS = {
  name: 'Yazhini S',
  brand: 'YDS',
  brandFull: 'YDS Digital Services',
  tagline: 'Digital Services for Businesses & Individuals',
  email: 'yds.digitalservice185@gmail.com',
  phone: '8148607243', // used for tel: links, no spaces
  phoneDisplay: '81486 07243', // used for on-screen display
  whatsapp: '8148607243', // used for wa.me links, no spaces
  location: 'Chennai, India',
}

// ---- One-tap contact links (email app / SMS app / WhatsApp) ----
const GREETING = 'Hi YDS Digital Services, I would like to discuss a project.'

// Opens the visitor's default email app with To / Subject / Body filled in.
export const emailLink = () =>
  `mailto:${BUSINESS.email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(GREETING)}`

// Opens the visitor's messaging app. "?&body=" works on both Android and iPhone.
export const smsLink = () => `sms:+91${BUSINESS.phone}?&body=${encodeURIComponent(GREETING)}`

// Opens WhatsApp (app or WhatsApp Web) with a chat to your number.
export const whatsappLink = (text = GREETING) =>
  `https://wa.me/91${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`
