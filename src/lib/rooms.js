import {
  doc, setDoc, getDoc, updateDoc,
  onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createRoom(hostName, customPlaces) {
  const code = generateRoomCode()

  await setDoc(doc(db, 'rooms', code), {
    code,
    hostName,
    places: customPlaces,
    status: 'waiting', // waiting | voting | results
    members: { },
    votes: { },
    createdAt: serverTimestamp(),
  })

  return code
}

export async function joinRoom(code, userName) {
  const roomRef = doc(db, 'rooms', code.toUpperCase())
  const snap = await getDoc(roomRef)

  if (!snap.exists()) throw new Error('Room not found')
  if (snap.data().status === 'results') throw new Error('This room has already finished voting')

  return roomRef
}

export async function addMember(code, userId, userName) {
  const roomRef = doc(db, 'rooms', code.toUpperCase())
  await updateDoc(roomRef, {
    [`members.${userId}`]: { name: userName, joinedAt: Date.now() }
  })
}

export async function castVote(code, userId, placeId, liked) {
  const roomRef = doc(db, 'rooms', code.toUpperCase())
  await updateDoc(roomRef, {
    [`votes.${userId}.${placeId}`]: liked
  })
}

export async function startVoting(code) {
  await updateDoc(doc(db, 'rooms', code), { status: 'voting' })
}

export async function finishVoting(code) {
  await updateDoc(doc(db, 'rooms', code), { status: 'results' })
}

export function subscribeToRoom(code, callback) {
  return onSnapshot(doc(db, 'rooms', code.toUpperCase()), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
    else callback(null)
  })
}

export function computeMatches(room) {
  const { places, votes, members } = room
  const memberIds = Object.keys(members)
  if (memberIds.length === 0) return []

  return places.filter(place => {
    return memberIds.every(uid => votes?.[uid]?.[place.id] === true)
  })
}

export function computeScores(room) {
  const { places, votes, members } = room
  const memberIds = Object.keys(members)

  return places
    .map(place => {
      const likes = memberIds.filter(uid => votes?.[uid]?.[place.id] === true).length
      const total = memberIds.filter(uid => votes?.[uid]?.[place.id] !== undefined).length
      return { ...place, likes, total, score: total > 0 ? likes / total : 0 }
    })
    .sort((a, b) => b.likes - a.likes)
}
