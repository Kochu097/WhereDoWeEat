import { useState, useEffect } from 'react'
import { subscribeToRoom } from '../lib/rooms'
 
export function useRoom(code) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
 
  useEffect(() => {
    if (!code) return
    setLoading(true)
    const unsub = subscribeToRoom(code, (data) => {
      if (!data) setNotFound(true)
      else setRoom(data)
      setLoading(false)
    })
    return unsub
  }, [code])
 
  return { room, loading, notFound }
}