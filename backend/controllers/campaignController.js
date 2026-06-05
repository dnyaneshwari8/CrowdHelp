const Campaign = require('../models/Campaign');
const path = require('path');
const fs = require('fs');

/**
 * Get all campaigns with search and filtering
 */
exports.getAllCampaigns = async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 9 } = req.query;
        
        // Show both 'APPROVED' (new system) and 'Active'/'ACTIVE' (old/alternate system)
        let query = { 
            status: { $in: ['APPROVED', 'Active', 'ACTIVE'] } 
        };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sortQuery = '-createdAt';
        if (sort === 'oldest') sortQuery = 'createdAt';
        if (sort === 'goal_high') sortQuery = '-goalAmount';
        if (sort === 'goal_low') sortQuery = 'goalAmount';
        if (sort === 'most_raised') sortQuery = '-currentAmount';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const campaigns = await Campaign.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name organizationName');

        const total = await Campaign.countDocuments(query);

        res.status(200).json({ 
            status: 'success', 
            results: campaigns.length,
            total,
            pages: Math.ceil(total / limit),
            data: { campaigns } 
        });
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
        console.log('--- CREATE CAMPAIGN REQUEST ---');
        console.log('User:', { id: req.user.id, role: req.user.role, ngoStatus: req.user.ngoStatus });
        
        const { title, description, category, goalAmount, startDate, endDate } = req.body;
        
        console.log('--- CAMPAIGN DATA RECEIVED ---');
        console.log('Title:', title);
        console.log('Description Length:', description?.length);
        console.log('Category:', category);
        console.log('Goal:', goalAmount);
        console.log('Dates:', { startDate, endDate });

        // Basic validation
        if (!title || !description || !category || !goalAmount || !startDate || !endDate) {
            const missing = [];
            if (!title) missing.push('title');
            if (!description) missing.push('description');
            if (!category) missing.push('category');
            if (!goalAmount) missing.push('goalAmount');
            if (!startDate) missing.push('startDate');
            if (!endDate) missing.push('endDate');
            
            return res.status(400).json({ 
                message: `The following fields are required: ${missing.join(', ')}`,
                missingFields: missing
            });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a campaign image' });
        }

        const role = req.user.role;
        const status = role === 'ADMIN' ? 'APPROVED' : 'PENDING';

        const campaignData = {
            title,
            description,
            category,
            goalAmount: Number(goalAmount),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            image: req.file.path,
            createdBy: req.user.id,
            createdByRole: role,
            status: status
        };

        if (role === 'NGO') {
            campaignData.ngoId = req.user.id;
        }

        const campaign = await Campaign.create(campaignData);

        res.status(201).json({ status: 'success', data: { campaign } });
    } catch (error) {
        console.error('--- CAMPAIGN CREATION ERROR ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })));
        }
        
        res.status(500).json({ 
            message: 'Error creating campaign', 
            error: error.message,
            details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
        });
    }
};

/**
 * Update campaign (Admin Only)
 */
exports.updateCampaign = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        if (req.file) {
            updateData.image = req.file.path;
            // Cloudinary handles deletion if configured, but here we just update the URL
        }

        const campaign = await Campaign.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate('createdBy', 'name organizationName');

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
