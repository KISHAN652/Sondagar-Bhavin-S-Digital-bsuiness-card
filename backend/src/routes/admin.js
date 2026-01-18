// Admin Routes
const express = require('express')
const router = express.Router()
const { db } = require('../config/firebase')
const { verifyToken, requireRole } = require('../middleware/auth')

/**
 * GET /api/admin/verify
 * Verify admin token
 */
router.get('/verify', verifyToken, (req, res) => {
    res.json({ valid: true, user: req.user })
})

/**
 * GET /api/admin/cards
 * Get all cards (ADMIN only)
 */
router.get('/cards', verifyToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const cardsSnapshot = await db.collection('cards').get()
        const cards = []

        cardsSnapshot.forEach((doc) => {
            cards.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        res.json(cards)
    } catch (error) {
        console.error('Error fetching cards:', error)
        res.status(500).json({ message: 'Failed to fetch cards' })
    }
})

/**
 * PUT /api/admin/cards/:cardId
 * Update card (ADMIN, EDITOR)
 */
router.put(
    '/cards/:cardId',
    verifyToken,
    requireRole(['ADMIN', 'EDITOR']),
    async (req, res) => {
        try {
            const { cardId } = req.params
            const updateData = req.body

            // Validate required fields
            if (!updateData.name || !updateData.email) {
                return res.status(400).json({ message: 'Name and email are required' })
            }

            // Update card
            await db.collection('cards').doc(cardId).update({
                ...updateData,
                updatedAt: new Date(),
            })

            res.json({ message: 'Card updated successfully' })
        } catch (error) {
            console.error('Error updating card:', error)
            res.status(500).json({ message: 'Failed to update card' })
        }
    }
)

/**
 * GET /api/admin/analytics/:cardId
 * Get analytics for a card (ADMIN, VIEWER)
 */
router.get(
    '/analytics/:cardId',
    verifyToken,
    requireRole(['ADMIN', 'VIEWER', 'EDITOR']),
    async (req, res) => {
        try {
            const { cardId } = req.params

            // Get all analytics for this card
            const analyticsSnapshot = await db
                .collection('analytics')
                .where('cardId', '==', cardId)
                .get()

            let totalVisits = 0
            let mobileVisits = 0
            let desktopVisits = 0
            let tabletVisits = 0

            analyticsSnapshot.forEach((doc) => {
                const data = doc.data()
                totalVisits++

                if (data.device === 'mobile') mobileVisits++
                else if (data.device === 'desktop') desktopVisits++
                else if (data.device === 'tablet') tabletVisits++
            })

            res.json({
                totalVisits,
                mobileVisits,
                desktopVisits,
                tabletVisits,
            })
        } catch (error) {
            console.error('Error fetching analytics:', error)
            res.status(500).json({ message: 'Failed to fetch analytics' })
        }
    }
)

module.exports = router
