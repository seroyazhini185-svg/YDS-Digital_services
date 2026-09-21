import { useCallback, useEffect, useState } from 'react'
import { LogOut, RefreshCw } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const STATUSES = ['new', 'in_progress', 'completed', 'closed']

// Private inbox for the site owner. Not linked anywhere on the site.
// Visitors cannot read enquiries: the API only returns them when the
// X-Admin-Key header matches ADMIN_API_KEY in backend/.env.
export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem('yds-admin-key') || '')
  const [input, setInput] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Inbox'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
      document.title = 'YDS Digital Services | Yazhini S'
    }
  }, [])

  const load = useCallback(async (k, silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/enquiries`, { headers: { 'X-Admin-Key': k } })
      if (res.status === 401) {
        sessionStorage.removeItem('yds-admin-key')
        setKey('')
        throw new Error('Wrong key.')
      }
      if (!res.ok) throw new Error('Could not load messages.')
      setItems(await res.json())
      sessionStorage.setItem('yds-admin-key', k)
      setKey(k)
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the server. Make sure the backend is running.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (key) load(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check for new messages every 30 seconds while this page is open
  useEffect(() => {
    if (!key) return undefined
    const id = setInterval(() => load(key, true), 30000)
    return () => clearInterval(id)
  }, [key, load])

  const newCount = items.filter((m) => m.status === 'new').length
  useEffect(() => {
    document.title = newCount > 0 ? `(${newCount}) New messages` : 'Inbox'
  }, [newCount])

  const setStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
  }

  const logout = () => {
    sessionStorage.removeItem('yds-admin-key')
    setKey('')
    setItems([])
  }

  if (!key) {
    return (
      <div className="page admin">
        <section className="section">
          <h1>Private inbox</h1>
          <form
            className="contact-form admin-login"
            onSubmit={(e) => {
              e.preventDefault()
              load(input.trim())
            }}
          >
            <label>
              Admin key
              <input type="password" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="current-password" required />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Checking…' : 'Open inbox'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  return (
    <div className="page admin">
      <section className="section">
        <div className="admin-head">
          <h1>Messages ({items.length}){newCount > 0 ? ` · ${newCount} new` : ''}</h1>
          <div className="admin-actions">
            <button className="btn btn-outline btn-small" onClick={() => load(key)} disabled={loading}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-outline btn-small" onClick={logout}>
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        {items.length === 0 && !loading && <p>No messages yet.</p>}

        <div className="admin-list">
          {items.map((m) => (
            <article className={`admin-msg admin-msg-${m.status}`} key={m.id}>
              <div className="admin-msg-top">
                <div>
                  <h3>{m.name}</h3>
                  <span className="admin-time">{new Date(m.created_at + 'Z').toLocaleString()}</span>
                </div>
                <select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} aria-label="Status">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <p className="admin-service">{m.service}</p>
              <p className="admin-body">{m.project_details}</p>
              <div className="admin-meta">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.phone && <a href={`tel:${m.phone}`}>{m.phone}</a>}
                {m.deadline && <span>Deadline: {m.deadline}</span>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
