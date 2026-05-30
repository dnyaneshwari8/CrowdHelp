const Campaign = require('../models/Campaign');
const path = require('path');
const fs = require('fs');

/**
 * Get all campaigns with search and filtering
 */
exports.getAllCampaigns = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const campaigns = await Campaign.find(query).sort('-createdAt');
        res.status(200).json({ status: 'success', data: { campaigns } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get campaign by ID
 */
exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ status: 'success', data: { campaign } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create new campaign (Admin Only)
 */
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, category, goalAmount, startDate, endDate } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a campaign image' });
        }

        const campaign = await Campaign.create({
            title,
            description,
            category,
            goalAmount,
            startDate,
            endDate,
            image: `/uploads/${req.file.filename}`,
            createdBy: req.user.id
        });

        res.status(201).json({ status: 'success', data: { campaign } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update campaign (Admin Only)
 */
exports.updateCampaign = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
            // Optional: Delete old image
        }

        const campaign = await Campaign.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json({ status: 'success', data: { campaign } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete campaign (Admin Only)
 */
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        // Optional: Delete image file from server
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
