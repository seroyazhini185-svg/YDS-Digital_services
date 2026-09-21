import { Link } from 'react-router-dom'
import {
  Atom, Braces, Terminal, Zap, Coffee, Database, Code2, Github,
  FileSpreadsheet, Keyboard, ShoppingCart, Share2, Laptop,
} from 'lucide-react'
import { BUSINESS } from '../config.js'

const commitments = [
  'Quality-checked, accurate work',
  'Clear, timely communication',
  'Confidential handling of client data',
  'Delivery within agreed timelines',
]

const technicalSkills = [
  { name: 'React', icon: Atom },
  { name: 'JavaScript', icon: Braces },
  { name: 'Python', icon: Terminal },
  { name: 'FastAPI', icon: Zap },
  { name: 'Java', icon: Coffee },
  { name: 'PostgreSQL', icon: Database },
  { name: 'HTML/CSS', icon: Code2 },
  { name: 'Git/GitHub', icon: Github },
]

const professionalSkills = [
  'Communication',
  'Data management',
  'Documentation',
  'Problem solving',
  'Quality checking',
  'Project coordination',
  'Time management',
]

const initials = BUSINESS.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .toUpperCase()

const services = [
  {
    icon: FileSpreadsheet,
    color: '34, 197, 140',
    title: 'Data Entry & Excel',
    items: ['Data entry', 'Excel', 'Google Sheets', 'Data cleaning', 'Web research', 'Forms', 'Data formatting'],
  },
  {
    icon: Keyboard,
    color: '139, 92, 246',
    title: 'Typing & Documentation',
    items: ['PDF to Word', 'Copy typing', 'Transcription', 'Document formatting', 'Data conversion'],
  },
  {
    icon: ShoppingCart,
    color: '249, 115, 22',
    title: 'E-commerce & Content',
    items: ['Product listing', 'Product uploading', 'Product descriptions', 'Image uploading', 'Catalog management', 'Website content'],
  },
  {
    icon: Share2,
    color: '236, 72, 153',
    title: 'Social Media',
    items: ['Canva posts', 'Captions', 'Content calendars', 'Post scheduling', 'Comment replies', 'Customer messages'],
  },
  {
    icon: Code2,
    color: '56, 160, 248',
    title: 'Software Testing',
    items: ['Website testing', 'Mobile app testing', 'Manual testing', 'Functional testing', 'UI testing', 'Bug reporting', 'API testing'],
  },
  {
    icon: Laptop,
    color: '168, 85, 247',
    title: 'Web Development',
    items: ['React', 'JavaScript', 'Python', 'FastAPI', 'Java', 'PostgreSQL', 'API development'],
  },
]

const whyUs = [
  'Quality-focused work',
  'Multiple service categories',
  'Clear communication',
  'Flexible project support',
]

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <span className="hero-eyebrow">{BUSINESS.brandFull}</span>
        <h1>{BUSINESS.tagline}</h1>
        <p className="hero-tags">
          Data Entry • Typing • E-commerce • Social Media • Software Testing • Web Development
        </p>
      </section>

      <section className="section services-section">
        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div className="service-tile" key={service.title} style={{ '--c': service.color }}>
                <div className="service-tile-head">
                  <span className="service-tile-icon"><Icon size={26} /></span>
                  <h3>{service.title}</h3>
                </div>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section section-alt why-us-section">
        <h2>Why Choose Us</h2>
        <ul className="check-list">
          {whyUs.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </section>

      {/* About — same content as the standalone /about page */}
      <section className="section" id="about">
        <div className="about-header">
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

      {/* Skills — same content as the standalone /skills page */}
      <section className="section" id="skills">
        <h1>Skills</h1>

        <h2>Technical Skills</h2>
        <div className="skill-tools">
          {technicalSkills.map((skill) => {
            const Icon = skill.icon
            return (
              <div className="skill-tool" key={skill.name}>
                <Icon size={28} className="skill-tool-icon" />
                <span className="skill-tool-name">{skill.name}</span>
              </div>
            )
          })}
        </div>

        <h2>Professional Skills</h2>
        <ul className="check-list">
          {professionalSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Have a Project? — last section on the page */}
      <section className="section cta-section">
        <h2>Have a Project?</h2>
        <p>Tell us what you need.</p>
        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
      </section>
    </div>
  )
}