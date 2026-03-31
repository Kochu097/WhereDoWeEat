import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom, addMember } from '../lib/rooms'
import { useAuth } from '../hooks/useAuth'
import AddDestination from '../components/AddDestination'

export default function CreateRoom() {
  const nav = useNavigate()
  const user = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])

  const handleCreate = async () => {
    if (!name.trim()) return setError('Enter your name first')
    if (destinations.length < 2) return setError('Add at least 2 destinations to vote on')
    if (!user) return setError('Auth loading, try again')
    setLoading(true)
    try {
      // Pass custom destinations to createRoom — overrides the sample places
      const code = await createRoom(name.trim(), destinations)
      await addMember(code, user.uid, name.trim())
      sessionStorage.setItem('userName', name.trim())
      nav(`/room/${code}`)
    } catch (e) { setError(e.message); setLoading(false) }
  }

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100%' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <button className="btn btn-ghost" style={{ width: 'auto', marginBottom: 24 }} onClick={() => nav('/')}>← Back</button>

        <div className="fade-up">
          <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Create a Room</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.9rem' }}>
            Add the places you want to vote on, then share the code with friends.
          </p>
        </div>

        <div className="card fade-up-delay" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>Your name</label>
            <input
              className="input"
              placeholder="e.g. Alex"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              maxLength={20}
              autoFocus
            />
          </div>

          <div className="divider" />

          {/* Destinations */}
          <AddDestination
            destinations={destinations}
            onChange={list => { setDestinations(list); setError('') }}
          />

          {error && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{error}</p>}

          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={loading || !name.trim() || destinations.length < 2}
          >
            {loading
              ? <span className="spinner" style={{ width: 20, height: 20 }} />
              : destinations.length < 2
              ? `Add ${2 - destinations.length} more place${destinations.length === 1 ? '' : 's'} to continue`
              : '🚀 Create Room'}
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          You'll be the host. You can start voting once everyone joins.
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginBottom: 8,
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}