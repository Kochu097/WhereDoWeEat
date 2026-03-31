import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../hooks/useAuth'
import WaitingRoom from '../components/WaitingRoom'
import VotingView from '../components/VotingView'
import ResultsView from '../components/ResultsView'
 
export default function Room() {
  const { code } = useParams()
  const nav = useNavigate()
  const user = useAuth()
  const { room, loading, notFound } = useRoom(code)
 
  useEffect(() => { if (notFound) nav('/', { replace: true }) }, [notFound])
 
  const isMember = user && room?.members?.[user.uid]
  useEffect(() => {
    if (!loading && room && user && !isMember) nav(`/join/${code}`, { replace: true })
  }, [loading, room, user, isMember])
 
  if (loading || !user || !room) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
          <p style={{ color: 'var(--text-muted)' }}>Connecting to room…</p>
        </div>
      </div>
    )
  }
 
  if (room.status === 'waiting') return <WaitingRoom room={room} userId={user.uid} />
  if (room.status === 'voting')  return <VotingView  room={room} userId={user.uid} />
  if (room.status === 'results') return <ResultsView room={room} userId={user.uid} />
  return null
}