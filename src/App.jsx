import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import Room from './pages/Room'
 
export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/create"      element={<CreateRoom />} />
      <Route path="/join"        element={<JoinRoom />} />
      <Route path="/join/:code"  element={<JoinRoom />} />
      <Route path="/room/:code"  element={<Room />} />
    </Routes>
  )
}