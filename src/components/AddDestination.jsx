import { useState, useId } from 'react'

const CATEGORY_OPTIONS = [
  { label: 'Restaurant', emoji: '🍽️' },
  { label: 'Japanese',   emoji: '🍣' },
  { label: 'Italian',    emoji: '🍕' },
  { label: 'Indian',     emoji: '🍛' },
  { label: 'French',     emoji: '🥐' },
  { label: 'BBQ',        emoji: '🥩' },
  { label: 'Asian',      emoji: '🍜' },
  { label: 'Mexican',    emoji: '🌮' },
  { label: 'Healthy',    emoji: '🥗' },
  { label: 'Cafe',       emoji: '☕' },
  { label: 'Bar',        emoji: '🍺' },
  { label: 'Pizza',      emoji: '🍕' },
  { label: 'Burgers',    emoji: '🍔' },
  { label: 'Seafood',    emoji: '🦞' },
  { label: 'Other',      emoji: '📍' },
]

const EMPTY_FORM = { name: '', category: '', description: '', image: '' }

function DestinationForm({ onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const uid = useId()

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.label === form.category)

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name = 'Name is required'
    if (!form.category)        e.category = 'Pick a category'
    return e
  }

  const handleAdd = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)

    onAdd({
      id: uid + '-' + Date.now(),
      name: form.name.trim(),
      category: form.category,
      emoji: selectedCategory?.emoji ?? '📍',
      description: form.description.trim() || `${form.category} destination`,
      image: form.image.trim() || `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80`,
    })
  }

  return (
    <div style={{
      background: 'var(--bg)',
      border: '1.5px solid var(--border)',
      borderRadius: 14,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>Place name *</label>
        <input
          className="input"
          placeholder="e.g. Sushi Tei"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          maxLength={40}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      {/* Category grid */}
      <div>
        <label style={labelStyle}>Category *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CATEGORY_OPTIONS.map(c => (
            <button
              key={c.label}
              type="button"
              onClick={() => set('category', c.label)}
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                border: '1.5px solid',
                borderColor: form.category === c.label ? 'var(--accent)' : 'var(--border)',
                background: form.category === c.label ? 'rgba(255,77,109,0.12)' : 'var(--bg3)',
                color: form.category === c.label ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        {errors.category && <p style={errorStyle}>{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Short description <span style={{ opacity: 0.5 }}>(optional)</span></label>
        <input
          className="input"
          placeholder="e.g. Fresh sushi & sake in a lively setting"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Image URL */}
      <div>
        <label style={labelStyle}>Image URL <span style={{ opacity: 0.5 }}>(optional)</span></label>
        <input
          className="input"
          placeholder="https://..."
          value={form.image}
          onChange={e => set('image', e.target.value)}
        />
        {form.image && (
          <div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', height: 80 }}>
            <img
              src={form.image}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleAdd}
        >
          + Add Place
        </button>
      </div>
    </div>
  )
}

function DestinationChip({ place, onRemove, canRemove }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      background: 'var(--bg3)',
      border: '1.5px solid var(--border)',
      borderRadius: 12,
      animation: 'fadeUp 0.25s ease both',
    }}>
      <img
        src={place.image}
        alt={place.name}
        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>{place.emoji}</span>
          <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {place.name}
          </strong>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{place.category}</span>
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(place.id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '2px 6px',
            borderRadius: 6,
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--accent)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          aria-label={`Remove ${place.name}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
// Props:
//   destinations  – array of place objects (controlled from parent)
//   onChange      – called with updated array whenever list changes
export default function AddDestination({ destinations, onChange, isHost = true }) {
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (place) => {
    onChange([...destinations, place])
    setShowForm(false)
  }

  const handleRemove = (id) => {
    onChange(destinations.filter(p => p.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ ...labelStyle, margin: 0 }}>
          Destinations
          {destinations.length > 0 && (
            <span style={{ marginLeft: 8, color: 'var(--accent2)', fontWeight: 700 }}>
              ({destinations.length})
            </span>
          )}
        </label>
        {destinations.length > 0 && !showForm && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            min. 2 recommended
          </span>
        )}
      </div>

      {/* Existing destinations */}
      {destinations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {destinations.map(place => (
            <DestinationChip key={place.id} place={place} onRemove={handleRemove} canRemove={isHost}  />
          ))}
        </div>
      )}

      {/* Add form or add button */}
      {showForm ? (
        <DestinationForm
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px',
            background: 'var(--bg)',
            border: '1.5px dashed var(--border)',
            borderRadius: 12,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
            width: '100%',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          + Add a place
        </button>
      )}
    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
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

const errorStyle = {
  color: 'var(--accent)',
  fontSize: '0.78rem',
  marginTop: 4,
}