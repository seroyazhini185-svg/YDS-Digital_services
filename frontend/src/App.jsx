import { Routes, Route } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageBackground from './components/PageBackground.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Contact from './pages/Contact.jsx'
import Portfolio from './pages/Portfolio.jsx'
import DemoViewer from './pages/DemoViewer.jsx'
import Admin from './pages/Admin.jsx'
import { whatsappLink } from './config.js'

export default function App() {
  return (
    <div className="site">
      <PageBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/demo/:demoTitle" element={<DemoViewer />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <a
        className="whatsapp-float"
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  )
}
