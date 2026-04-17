import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

const EMOJI_RATINGS = [
  { value: 1, emoji: '😠', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Amazing' },
]

// ─── Status screens ────────────────────────────────────────────────────────────

function SuccessScreen({ onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🙏</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
        Thanks for the feedback!
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
        It helps us make the app better for everyone.
      </p>
      <button className="btn btn-primary" onClick={onClose}>Close</button>
    </div>
  )
}

function ErrorScreen({ onRetry, onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>😬</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
        Something went wrong
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
        Couldn't save your feedback. Check your connection and try again.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onRetry}>Retry</button>
      </div>
    </div>
  )
}

// ─── Main widget ───────────────────────────────────────────────────────────────

export default function FeedbackWidget({ open, onClose, userId, context = 'app' }) {
  const [rating, setRating] = useState(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [hoveredRating, setHoveredRating] = useState(null)

  if (!open) return null

  const reset = () => {
    setRating(null)
    setMessage('')
    setStatus('idle')
    setHoveredRating(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!rating) return
    setStatus('submitting')
    try {
      await addDoc(collection(db, 'feedback'), {
        rating,
        message: message.trim() || null,
        userId: userId || null,
        context,
        createdAt: serverTimestamp(),
        // Handy for grouping: approximate date without full timestamp
        date: new Date().toISOString().split('T')[0],
      })
      setStatus('success')
    } catch (err) {
      console.error('Feedback write failed:', err)
      setStatus('error')
    }
  }

  const activeRating = hoveredRating ?? rating
  const currentEmoji = EMOJI_RATINGS.find(r => r.value === activeRating)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 100,
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share feedback"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg2, #1a1a2e)',
          border: '1.5px solid var(--border)',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          padding: '24px 24px 36px',
          zIndex: 101,
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36,
          height: 4,
          borderRadius: 99,
          background: 'var(--border)',
          margin: '0 auto 20px',
        }} />

        {/* Content */}
        {status === 'success' && <SuccessScreen onClose={handleClose} />}
        {status === 'error' && <ErrorScreen onRetry={handleSubmit} onClose={handleClose} />}

        {(status === 'idle' || status === 'submitting') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 800,
                marginBottom: 4,
              }}>
                How's your experience?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Takes 10 seconds, helps us a lot.
              </p>
            </div>

            {/* Emoji rating */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                {EMOJI_RATINGS.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    aria-label={r.label}
                    onClick={() => setRating(r.value)}
                    onMouseEnter={() => setHoveredRating(r.value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    style={{
                      fontSize: activeRating === r.value ? '2.4rem' : '2rem',
                      background: 'none',
                      border: '2px solid',
                      borderColor: rating === r.value ? 'var(--accent)' : 'transparent',
                      borderRadius: 12,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: activeRating === r.value ? 'translateY(-4px) scale(1.15)' : 'none',
                      opacity: rating && rating !== r.value && hoveredRating !== r.value ? 0.45 : 1,
                    }}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
              {/* Rating label */}
              <p style={{
                textAlign: 'center',
                fontSize: '0.82rem',
                color: 'var(--accent)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                minHeight: '1.2em',
                transition: 'opacity 0.15s',
                opacity: currentEmoji ? 1 : 0,
              }}>
                {currentEmoji?.label ?? ''}
              </p>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>
                Anything else? <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                className="input"
                placeholder="What did you love? What's missing?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={300}
                rows={3}
                style={{
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                {message.length}/300
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={handleClose}
                disabled={status === 'submitting'}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  flex: 2,
                  opacity: !rating || status === 'submitting' ? 0.5 : 1,
                  cursor: !rating || status === 'submitting' ? 'not-allowed' : 'pointer',
                }}
                onClick={handleSubmit}
                disabled={!rating || status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send feedback ✨'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframe animations (injected once) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
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
