// src/components/WaitingRoom.jsx
import { startVoting } from '../lib/rooms'
import Toast, { useToast } from './Toast'

export default function WaitingRoom({ room, userId }) {
  const { toast, showToast } = useToast()
  const isHost = room.hostName === room.members[userId]?.name
  const members = Object.values(room.members || {})
  const shareUrl = `${window.location.origin}/join/${room.code}`

  const copyLink = async () => {
    try {
      await navigator.share({ title: 'Where Do We Go?', url: shareUrl })
    } catch {
      navigator.clipboard.writeText(shareUrl).catch(() => {})
      showToast('Link copied! 🔗')
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(room.code).catch(() => {})
    showToast('Code copied!')
  }

  return (
    <div className="page">
      <Toast toast={toast} />

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }} className="fade-up">
        <div className="logo" style={{ marginBottom: 20 }}>
          Where Do <span>We Go?</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Waiting for friends…</h2>
        <div className="waiting-animation">
          <div className="waiting-dot" />
          <div className="waiting-dot" />
          <div className="waiting-dot" />
        </div>
      </div>

      {/* Room code */}
      <div style={{ width: '100%', maxWidth: 380 }} className="fade-up-delay">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginBottom: 10, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Room Code
        </p>
        <div className="code-display" onClick={copyCode} title="Tap to copy">
          {room.code}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', marginTop: 8 }}>
          Tap code to copy · Share with friends
        </p>
      </div>

      {/* Share button */}
      <div style={{ width: '100%', maxWidth: 380 }}>
        <button className="btn btn-secondary" onClick={copyLink}>
          🔗 Share Invite Link
        </button>
      </div>

      {/* Members */}
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          In the room ({members.length})
        </p>
        <div className="member-list">
          {members.map((m, i) => (
            <div key={i} className="member-chip">
              <div className="member-dot" />
              {m.name}
              {m.name === room.hostName && (
                <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>HOST</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start voting — host only */}
      {isHost && (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <button
            className="btn btn-primary"
            onClick={() => startVoting(room.code)}
            disabled={members.length < 1}
          >
            🗳️ Start Voting ({members.length} {members.length === 1 ? 'person' : 'people'})
          </button>
          {members.length < 2 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: 8 }}>
              You can start alone or wait for more people to join.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
