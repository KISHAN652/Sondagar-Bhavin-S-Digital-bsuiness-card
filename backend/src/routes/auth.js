// Authentication Routes
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { auth, db } = require('../config/firebase')

/**
 * POST /api/auth/login
 * Login with Firebase ID token
 */
router.post('/login', async (req, res) => {
    try {
        const { idToken } = req.body

        if (!idToken) {
            return res.status(400).json({ message: 'ID token required' })
        }

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        // Get user from Firestore
        const userDoc = await db.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userData = userDoc.data()

        // Generate JWT tokens
        const accessToken = jwt.sign(
            {
                uid: uid,
                email: userData.email,
                role: userData.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        const refreshToken = jwt.sign(
            {
                uid: uid,
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            accessToken,
            refreshToken,
            user: {
                uid: uid,
                email: userData.email,
                role: userData.role,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(401).json({ message: 'Authentication failed' })
    }
})

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' })
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        // Get user from Firestore
        const userDoc = await db.collection('users').doc(decoded.uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userData = userDoc.data()

        // Generate new access token
        const accessToken = jwt.sign(
            {
                uid: decoded.uid,
                email: userData.email,
                role: userData.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({ accessToken })
    } catch (error) {
        console.error('Refresh token error:', error)
        res.status(401).json({ message: 'Invalid refresh token' })
    }
})

module.exports = router
