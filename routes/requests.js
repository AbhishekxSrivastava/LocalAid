const express = require('express');
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get all service requests
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new service request
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, location, serviceType, urgency } = req.body;

    try {
        const newRequest = new Request({
            title,
            description,
            location,
            serviceType,
            urgency,
            createdBy: req.user.id
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a service request (Authorized)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const requestId = req.params.id;

        // Log the incoming request for debugging
        console.log('DELETE Request Received');
        console.log('Request ID:', requestId);
        console.log('User ID:', req.user.id);

        // Validate ObjectId format to avoid MongoDB errors
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            console.error('Invalid request ID format');
            return res.status(400).json({ message: 'Invalid request ID format' });
        }

        // Find the request by ID
        const request = await Request.findById(requestId);
        
        // If the request is not found
        if (!request) {
            console.error('Request not found');
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check if the logged-in user is the owner of the request
        if (request.createdBy.toString() !== req.user.id) {
            console.error('User not authorized to delete this request');
            return res.status(403).json({ message: 'User not authorized to delete this request' });
        }

        // Delete the request
        await Request.findByIdAndDelete(requestId);
        console.log('Request deleted successfully');

        return res.status(200).json({ message: 'Request deleted successfully' });
    } catch (err) {
        // Detailed error logging for debugging
        console.error('Error deleting request:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
