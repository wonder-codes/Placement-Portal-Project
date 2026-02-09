const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get my notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.user.toString() === req.user._id.toString()) {
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Send bulk notification (TPO)
router.post('/bulk', protect, authorize('TPO'), async (req, res) => {
    try {
        const { userIds, title, message, type } = req.body;
        const notifications = userIds.map(userId => ({
            user: userId,
            title,
            message,
            type: type || 'System'
        }));
        await Notification.insertMany(notifications);
        res.status(201).json({ message: 'Bulk notifications sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
