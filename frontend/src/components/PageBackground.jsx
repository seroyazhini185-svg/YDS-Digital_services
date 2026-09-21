import { useLocation } from 'react-router-dom'

// Full-page background image for each page. Fixed behind the content, so it
// stays put while the page scrolls. Image files live in /public/backgrounds.
const BACKGROUNDS = {
  '/': '/backgrounds/home.webp',
  '/about': '/backgrounds/about.webp',
  '/skills': '/backgrounds/skills.webp',
  '/contact': '/backgrounds/contact.webp',
  '/portfolio': '/backgrounds/portfolio.webp',
  '/admin': '/backgrounds/contact.webp',
}

export default function PageBackground() {
  const { pathname } = useLocation()
  const key = '/' + (pathname.split('/')[1] || '')
  const image = BACKGROUNDS[key]

  return (
    <div className={`page-bg page-bg-${key === '/' ? 'home' : key.slice(1)}`} aria-hidden="true">
      {image && (
        <div className="page-bg-image" style={{ backgroundImage: `url(${image})` }} />
      )}
      <div className="page-bg-shade" />
    </div>
  )
}
