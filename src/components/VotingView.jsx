// src/components/VotingView.jsx
import { useRef, useCallback } from 'react'
import { castVote, finishVoting } from '../lib/rooms'
import SwipeCard from './SwipeCard'

export default function VotingView({ room, userId }) {
  const places = room.places || []
  const userVotes = room.votes?.[userId] || {}
  const voted = Object.keys(userVotes)
  const remaining = places.filter(p => !voted.includes(p.id))
  const isDone = remaining.length === 0
  const topCardRef = useRef(null)

  const handleSwipe = useCallback(async (place, liked) => {
    await castVote(room.code, userId, place.id, liked)
    // Check if all members have voted on all places
    const members = Object.keys(room.members || {})
    const allDone = members.every(uid => {
      const v = room.votes?.[uid] || {}
      // +1 for the vote just cast (optimistic)
      const count = Object.keys(v).length + (uid === userId && !(place.id in v) ? 1 : 0)
      return count >= places.length
    })
    if (allDone) finishVoting(room.code)
  }, [room, userId, places])

  const handleButtonSwipe = (liked) => {
    topCardRef.current?.swipe(liked)
  }

  const progress = voted.length / places.length
  const members = Object.entries(room.members || {})

  if (isDone) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '3.5rem' }}>✅</div>
          <h2 style={{ fontSize: '1.6rem' }}>All voted!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Waiting for others to finish…
          </p>
          <div className="waiting-animation">
            <div className="waiting-dot" />
            <div className="waiting-dot" />
            <div className="waiting-dot" />
          </div>
          <div className="member-list" style={{ justifyContent: 'center', marginTop: 8 }}>
            {members.map(([uid, m]) => {
              const count = Object.keys(room.votes?.[uid] || {}).length
              const done = count >= places.length
              return (
                <div key={uid} className="member-chip" style={{ opacity: done ? 1 : 0.45 }}>
                  <div className="member-dot" style={{ background: done ? 'var(--accent2)' : 'var(--text-muted)', animationPlayState: done ? 'running' : 'paused' }} />
                  {m.name} {done ? '✓' : `${count}/${places.length}`}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ gap: 10, paddingTop: 'calc(14px + var(--safe-top))' }}>

      {/* Header row */}
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">Where Do <span>We Eat?</span></div>
        <span className="badge badge-accent">{voted.length}/{places.length}</span>
      </div>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Card stack */}
      <div className="swipe-arena">
        <div className="swipe-stack">
          {remaining.slice(0, 2).reverse().map((place, i, arr) => {
            const isTop = i === arr.length - 1
            return (
              <SwipeCard
                key={place.id}
                place={place}
                isTop={isTop}
                onSwipe={(liked) => handleSwipe(place, liked)}
                ref={isTop ? topCardRef : null}
              />
            )
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="swipe-actions">
        <button
          className="action-btn action-btn-no"
          onClick={() => handleButtonSwipe(false)}
          aria-label="Skip this place"
          title="Nope"
        >
          👎
        </button>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-display)' }}>
          <div style={{ fontWeight: 700 }}>{remaining.length}</div>
          <div>left</div>
        </div>
        <button
          className="action-btn action-btn-yes"
          onClick={() => handleButtonSwipe(true)}
          aria-label="Like this place"
          title="Yes!"
        >
          👍
        </button>
      </div>

      {/* Live member progress */}
      <div style={{ width: '100%', maxWidth: 380, paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {members.map(([uid, m]) => {
            const count = Object.keys(room.votes?.[uid] || {}).length
            const done = count >= places.length
            return (
              <div key={uid} className="member-chip" style={{ opacity: done ? 1 : 0.5 }}>
                <div className="member-dot" style={{ background: done ? 'var(--accent2)' : 'var(--text-muted)' }} />
                {m.name} {done ? '✓' : `${count}/${places.length}`}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
