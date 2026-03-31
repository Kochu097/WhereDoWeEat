import { useNavigate } from 'react-router-dom'
 
export default function Home() {
  const nav = useNavigate()
  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }} className="fade-up">
        <div style={{ fontSize: '3.8rem', marginBottom: 16 }}>🗺️</div>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', marginBottom: 12 }}>Where Do<br />We Eat?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
          Stop debating. Swipe on places together and find where everyone wants to eat.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }} className="fade-up-delay">
        <span className="badge badge-accent">🔥 Real-time voting</span>
        <span className="badge badge-green">✓ No signup needed</span>
        <span className="badge badge-yellow">⚡ Instant results</span>
      </div>
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-up-delay2">
        <button className="btn btn-primary"    onClick={() => nav('/create')}>Create a Room</button>
        <button className="btn btn-secondary"  onClick={() => nav('/join')}>Join with a Code</button>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>Create a room, share the link, swipe — done.</p>
    </div>
  )
}