import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext(null)

/**
 * Generates a simple UUID v4 for guest user identification.
 * This is stored in localStorage so the same guest is recognised across
 * sessions until they clear storage.
 */
const generateGuestId = () =>
    'usr-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)

export function UserProvider({ children }) {
    const [user, setUser]       = useState(null)   // full user profile from DB
    const [userId, setUserId]   = useState(null)   // MongoDB _id (persisted in localStorage)
    const [loading, setLoading] = useState(true)

    /* ── On mount: load userId from localStorage, then fetch profile ── */
    useEffect(() => {
        const storedId = localStorage.getItem('cafeUserId')
        if (storedId) {
            setUserId(storedId)
            fetchUser(storedId)
        } else {
            setLoading(false)
        }
    }, [])

    /** Fetch user profile from backend and cache in state */
    const fetchUser = async (id) => {
        try {
            const { data } = await axios.get(`/api/users/${id}`)
            setUser(data)
            setUserId(data._id)
        } catch {
            /* User not found (e.g. DB reset) — clear stale localStorage id */
            localStorage.removeItem('cafeUserId')
        } finally {
            setLoading(false)
        }
    }

    /**
     * registerUser — called when the first-order modal is submitted.
     * Creates (or retrieves existing) user on backend and persists their _id.
     */
    const registerUser = async ({ name, email, phone = '', address = '' }) => {
        try {
            const { data } = await axios.post('/api/users', { name, email, phone, address })
            localStorage.setItem('cafeUserId', data._id)
            setUser(data)
            setUserId(data._id)
            return data
        } catch (err) {
            /* 409 = email already exists → fetch that user instead */
            if (err.response?.status === 409 && err.response.data?.user) {
                const existing = err.response.data.user
                localStorage.setItem('cafeUserId', existing._id)
                setUser(existing)
                setUserId(existing._id)
                return existing
            }
            throw err
        }
    }

    /** Refresh the cached user profile (called after order placement) */
    const refreshUser = () => userId && fetchUser(userId)

    /** Update profile fields locally after a successful PUT */
    const updateUserLocally = (updates) => setUser(prev => prev ? { ...prev, ...updates } : prev)

    return (
        <UserContext.Provider value={{ user, userId, loading, registerUser, refreshUser, updateUserLocally, fetchUser }}>
            {children}
        </UserContext.Provider>
    )
}

/** Hook for consuming user context */
export const useUser = () => useContext(UserContext)
