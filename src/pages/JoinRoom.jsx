import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { joinRoom, addMember } from '../lib/rooms'
import { useAuth } from '../hooks/useAuth'
 
export default function JoinRoom() {
  const nav = useNavigate()
  const { code: urlCode } = useParams()
  const user = useAuth()
  const [code, setCode] = useState(urlCode || '')
  const [name, setName] = useState(sessionStorage.getItem('userName') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
 
  const handleJoin = async () => {
    if (!name.trim()) return setError('Enter your name')
    if (code.trim().length < 6) return setError('Enter the 6-character room code')
    if (!user) return setError('Auth loading, try again')
    setLoading(true)
    try {
      await joinRoom(code.trim())
      await addMember(code.trim(), user.uid, name.trim())
      sessionStorage.setItem('userName', name.trim())
      nav(`/room/${code.trim().toUpperCase()}`)
    } catch (e) { setError(e.message); setLoading(false) }
  }
 
  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100%' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <button className="btn btn-ghost" style={{ width: 'auto', marginBottom: 24 }} onClick={() => nav('/')}>← Back</button>
        <div className="fade-up">
          <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Join a Room</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.9rem' }}>Enter the code your friend shared with you.</p>
        </div>
        <div className="card fade-up-delay" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Room code</label>
            <input className="input"
              style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '1.3rem', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700 }}
              placeholder="ABC123" value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
              maxLength={6} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your name</label>
            <input className="input" placeholder="e.g. Jordan" value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={20} />
          </div>
          {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{error}</p>}
          <button className="btn btn-primary" onClick={handleJoin} disabled={loading || !name.trim() || code.length < 6}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : '→ Join Room'}
          </button>
        </div>
      </div>
    </div>
  )
}