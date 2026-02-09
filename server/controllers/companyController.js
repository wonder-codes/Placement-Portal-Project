const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Create a company (Recruiter/TPO)
// @route   POST /api/companies
const createCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo, hrContact } = req.body;

        if (req.user.role === 'Recruiter') {
            const existing = await Company.findOne({ createdBy: req.user._id });
            if (existing) return res.status(400).json({ message: 'You already have a company profile' });
        }

        const company = await Company.create({
            name,
            description,
            website,
            location,
            logo,
            hrContact,
            createdBy: req.user._id,
            status: req.user.role === 'TPO' ? 'ACTIVE' : 'DRAFT'
        });

        if (req.user.role === 'Recruiter') {
            await User.findByIdAndUpdate(req.user._id, { company: company._id });
        }

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all companies
const getCompanies = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'Student') {
            filter = { status: 'ACTIVE', isActive: true };
        }
        const companies = await Company.find(filter);
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my company (Recruiter)
const getMyCompany = async (req, res) => {
    try {
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) return res.status(404).json({ message: 'No company profile found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update company
const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        // Access Control
        if (req.user.role === 'Recruiter' && company.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Restrict edits if ACTIVE (as requested)
        if (req.user.role === 'Recruiter' && company.status === 'ACTIVE') {
            // Allow only non-critical fields
            const { description, website, location, logo, hrContact } = req.body;
            Object.assign(company, { description, website, location, logo, hrContact });
        } else {
            Object.assign(company, req.body);
        }

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Deactivate company (TPO only)
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (company) {
            company.isActive = false;
            await company.save();
            res.json({ message: 'Company deactivated' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createCompany, getCompanies, getMyCompany, updateCompany, deleteCompany };
