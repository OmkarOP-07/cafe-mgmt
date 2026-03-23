import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Cafe Management API Server' })
})

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✓ MongoDB connected successfully')
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message)
        process.exit(1)
    }
}

// Start server
const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`)
        console.log(`✓ Environment: ${process.env.NODE_ENV}`)
    })
}

startServer()

export default app
