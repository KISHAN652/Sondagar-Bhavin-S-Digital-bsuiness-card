// Analytics Routes
const express = require('express')
const router = express.Router()
const { db } = require('../config/firebase')

/**
 * POST /api/analytics
 * Track card visit
 */
router.post('/', async (req, res) => {
    try {
        const { cardId, device, timestamp } = req.body

        if (!cardId || !device) {
            return res.status(400).json({ message: 'Card ID and device required' })
        }

        // Add analytics entry
        await db.collection('analytics').add({
            cardId,
            device,
            timestamp: timestamp || new Date().toISOString(),
            createdAt: new Date(),
        })

        res.json({ message: 'Analytics tracked successfully' })
    } catch (error) {
        console.error('Error tracking analytics:', error)
        res.status(500).json({ message: 'Failed to track analytics' })
    }
})

module.exports = router
