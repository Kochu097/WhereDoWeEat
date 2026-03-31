import { useState, useEffect } from 'react'
import { initAuth } from '../lib/firebase'
 
let cachedUser = null
 
export function useAuth() {
  const [user, setUser] = useState(cachedUser)
  useEffect(() => {
    if (cachedUser) return
    initAuth().then((u) => { cachedUser = u; setUser(u) })
  }, [])
  return user
}