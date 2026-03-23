import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { getNextTierInfo } from '../utils/loyaltyHelper.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'cafe_mgmt_jwt_secret_2024'
const JWT_EXPIRES_IN = '30d'

/** Strip password from the user object before sending */
const safeUser = (user) => {
    const obj = user.toObject ? user.toObject() : { ...user }
    delete obj.password
    return obj
}

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/register
   Create a new user with a password. Returns user + JWT token.
──────────────────────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return res.status(409).json({ message: 'Email already registered. Please log in.' })
        }

        const user = new User({ name, email, phone, address, password })
        const saved = await user.save()

        const tierInfo = getNextTierInfo(saved.totalPointsEarned)
        const token = jwt.sign({ userId: saved._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.status(201).json({ user: { ...safeUser(saved), tierInfo }, token })
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message })
    }
})

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/login
   Authenticate with email + password. Returns user + JWT token.
──────────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email?.trim() || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Legacy users (no password) — prompt them to set one via register
        if (!user.password) {
            return res.status(401).json({
                message: 'This account was created without a password. Please sign up again to set one.',
                legacy: true
            })
        }

        const valid = await user.comparePassword(password)
        if (!valid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const tierInfo = getNextTierInfo(user.totalPointsEarned)
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.json({ user: { ...safeUser(user), tierInfo }, token })
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message })
    }
})

export default router
