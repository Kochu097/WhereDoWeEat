import { renderHook, waitFor } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'

// Mock firebase before importing the hook
vi.mock('../lib/firebase', () => ({
  initAuth: vi.fn(),
}))

import { initAuth } from '../lib/firebase'

const mockUser = { uid: '123', email: 'jane@example.com' }

beforeEach(() => {
  // Reset the module between tests to clear cachedUser
  vi.resetModules()
  vi.mocked(initAuth).mockReset()
  vi.mocked(initAuth).mockResolvedValue(mockUser)
})

describe('useAuth', () => {
  it('returns null initially when no cached user exists', async () => {
    const { useAuth } = await import('./useAuth')

    const { result } = renderHook(() => useAuth())

    expect(result.current).toBeNull()
  })

  it('resolves and returns the user after initAuth completes', async () => {
    const { useAuth } = await import('./useAuth')

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current).toEqual(mockUser)
    })
  })

  it('does not call initAuth again if cachedUser is already set', async () => {
    const { useAuth } = await import('./useAuth')

    // First mount — populates cachedUser
    const { unmount } = renderHook(() => useAuth())
    await waitFor(() => expect(initAuth).toHaveBeenCalledTimes(1))
    unmount()

    // Second mount — should use cache, not call initAuth again
    renderHook(() => useAuth())
    expect(initAuth).toHaveBeenCalledTimes(1)
  })
})