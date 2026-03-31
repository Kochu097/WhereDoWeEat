import { useState, forwardRef, useImperativeHandle } from 'react'
import { useDrag } from '@use-gesture/react'

const SWIPE_THRESHOLD = 80

const SwipeCard = forwardRef(function SwipeCard({ place, onSwipe, isTop }, ref) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [gone, setGone] = useState(false)

  const rotation = offset.x / 12
  const yesOpacity = Math.max(0, Math.min(1, offset.x / SWIPE_THRESHOLD))
  const noOpacity  = Math.max(0, Math.min(1, -offset.x / SWIPE_THRESHOLD))

  const triggerSwipe = (liked) => {
    if (gone) return
    setGone(true)
    const flyX = liked ? window.innerWidth + 200 : -window.innerWidth - 200
    setOffset({ x: flyX, y: 0 })
    setTimeout(() => onSwipe(liked), 320)
  }

  useImperativeHandle(ref, () => ({ swipe: triggerSwipe }), [gone])

  const bind = useDrag(({ down, movement: [mx, my], velocity: [vx] }) => {
    if (!isTop || gone) return
    if (down) {
      setOffset({ x: mx, y: my * 0.25 })
    } else {
      const shouldSwipe = Math.abs(mx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.6
      if (shouldSwipe) {
        triggerSwipe(mx > 0)
      } else {
        setOffset({ x: 0, y: 0 })
      }
    }
  }, {
    filterTaps: true,
    pointer: { touch: true },
  })

  return (
    <div
      className="swipe-card"
      {...(isTop ? bind() : {})}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${isTop ? 1 : 0.96})`,
        transition: gone
          ? 'transform 0.32s ease-in'
          : offset.x === 0 && offset.y === 0
          ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'none',
        zIndex: isTop ? 10 : 5,
      }}
    >
      <img src={place.image} alt={place.name} draggable={false} />

      <div className="swipe-overlay swipe-overlay-yes" style={{ opacity: yesOpacity }}>
        YES! 🙌
      </div>
      <div className="swipe-overlay swipe-overlay-no" style={{ opacity: noOpacity }}>
        NOPE 👎
      </div>

      <div className="swipe-card-body">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1.4rem' }}>{place.emoji}</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 4vw, 1.2rem)',
              fontWeight: 700,
              lineHeight: 1.2
            }}>
              {place.name}
            </h3>
          </div>
          <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-block' }}>
            {place.category}
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {place.description}
          </p>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center', paddingTop: 4 }}>
          ← skip &nbsp;·&nbsp; like →
        </p>
      </div>
    </div>
  )
})

export default SwipeCard
