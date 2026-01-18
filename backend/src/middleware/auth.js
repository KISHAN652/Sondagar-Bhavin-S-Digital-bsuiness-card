// Authentication Middleware
const jwt = require('jsonwebtoken')
const { db } = require('../config/firebase')

/**
 * Verify JWT access token
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Get user from Firestore
        const userDoc = await db.collection('users').doc(decoded.uid).get()

        if (!userDoc.exists) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Attach user to request
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: userDoc.data().role,
        }

        next()
    } catch (error) {
        console.error('Token verification error:', error)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

/**
 * Check if user has required role
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' })
        }

        next()
    }
}

module.exports = { verifyToken, requireRole }
