import ContactForm from '../components/ContactForm.jsx'
import ContactInfo from '../components/ContactInfo.jsx'

export default function Contact() {
  return (
    <div className="page contact">
      <section className="section contact-section-content">
        <h1>Let's Work Together</h1>
        <p className="section-intro">
          Have a project in mind? Send me the details and I'll get back to you.
        </p>

        <ContactForm />

        <ContactInfo />
      </section>
    </div>
  )
}
