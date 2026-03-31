import { computeMatches, computeScores } from '../lib/rooms'
import { useNavigate } from 'react-router-dom'

export default function ResultsView({ room }) {
  const nav = useNavigate()
  const matches = computeMatches(room)
  const scores  = computeScores(room)
  const memberCount = Object.keys(room.members || {}).length

  return (
    <div className="page">
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }} className="fade-up">
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>
          {matches.length > 0 ? '🎉' : '😅'}
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
          {matches.length > 0 ? 'You have matches!' : 'No full matches'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {matches.length > 0
            ? `${matches.length} place${matches.length > 1 ? 's' : ''} everyone wants to go to`
            : 'Here\'s how the votes stacked up'}
        </p>
      </div>

      {/* Perfect matches */}
      {matches.length > 0 && (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--accent2)', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ✓ Everyone agrees
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matches.map((place, i) => (
              <div key={place.id} className="result-card match" style={{ animationDelay: `${i * 0.1}s` }}>
                <img src={place.image} alt={place.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span>{place.emoji}</span>
                    <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{place.name}</strong>
                  </div>
                  <span className="badge badge-accent">{place.category}</span>
                </div>
                <div className="result-score">
                  <div style={{ fontSize: '1.4rem' }}>🏆</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent2)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {memberCount}/{memberCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All scores */}
      <div style={{ width: '100%', maxWidth: 380 }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          All results
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scores.map((place, i) => (
            <div key={place.id} className="result-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <img src={place.image} alt={place.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
                  {place.name}
                </div>
                {/* Mini progress */}
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{
                    width: `${place.score * 100}%`,
                    background: place.score === 1 ? 'var(--accent2)' : place.score > 0.5 ? 'var(--accent3)' : 'var(--accent)'
                  }} />
                </div>
              </div>
              <div className="result-score" style={{ minWidth: 40 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
                  {place.likes}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  /{memberCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Play again */}
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div className="divider" style={{ marginBottom: 20 }} />
        <button className="btn btn-primary" onClick={() => nav('/create')}>
          🔄 Start a New Room
        </button>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => nav('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
