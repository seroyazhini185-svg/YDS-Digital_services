import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../config.js'

const services = [
  'Data Entry & Excel',
  'Typing & Documentation',
  'E-commerce & Content',
  'Social Media',
  'Software Testing',
  'Web Development',
]

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    project_details: '',
    deadline: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitted(true)
    } catch (err) {
      setError("Something went wrong sending your inquiry. Please try again, or reach out directly using the details below.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-success">
        Thanks — your inquiry has been noted. I'll get back to you shortly.
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Service
        <select name="service" value={form.service} onChange={handleChange} required>
          <option value="" disabled>Select Service</option>
          {services.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </label>

      <label>
        Phone
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" />
      </label>

      <label>
        Project Details
        <textarea name="project_details" rows={5} value={form.project_details} onChange={handleChange} required />
      </label>

      <label>
        Deadline
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
      </label>

      {error && (
        <div className="form-fallback">
          <p className="form-error">{error}</p>
          <a
            className="btn btn-outline"
            href={whatsappLink(
              `New enquiry from the website\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || '-'}\nService: ${form.service}\nDeadline: ${form.deadline || '-'}\nDetails: ${form.project_details}`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> Send these details on WhatsApp instead
          </a>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  )
}
