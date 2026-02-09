const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getMyCompany, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCompanies)
    .post(protect, authorize('TPO', 'Recruiter'), createCompany);

router.get('/my', protect, authorize('Recruiter'), getMyCompany);

router.route('/:id')
    .put(protect, authorize('TPO', 'Recruiter'), updateCompany)
    .delete(protect, authorize('TPO'), deleteCompany);

module.exports = router;
