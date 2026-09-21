import { BUSINESS } from '../config.js'

const commitments = [
  'Quality-checked, accurate work',
  'Clear, timely communication',
  'Confidential handling of client data',
  'Delivery within agreed timelines',
]

const initials = BUSINESS.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .toUpperCase()

export default function About() {
  return (
    <div className="page about">
      <section className="section">
        <div className="about-header">
          {/* Replace this initials circle with an <img> tag once you have a profile photo */}
          <div className="avatar-placeholder" aria-hidden="true">{initials}</div>
          <div>
            <h1>About {BUSINESS.brandFull}</h1>
            <p className="about-name">{BUSINESS.tagline}</p>
          </div>
        </div>
        <p>
          {BUSINESS.brandFull} delivers accurate, well-organized digital support
          across data management, documentation, e-commerce operations, social
          media, software testing and web development.
        </p>
        <p>
          Every engagement starts with a clear understanding of the requirement,
          followed by careful execution and a final review before delivery — so
          the work you receive is accurate, on-brief, and ready to use.
        </p>
      </section>

      <section className="section section-alt commitment-section">
        <h2>Our Commitment</h2>
        <ul className="commitment-list">
          {commitments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
