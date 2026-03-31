import { useState } from 'react'
 
export function useToast() {
  const [toast, setToast] = useState({ msg: '', show: false })
  const showToast = (msg) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000)
  }
  return { toast, showToast }
}
 
export default function Toast({ toast }) {
  return <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
}