
const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middleware/validation');

router.post('/addSchool', validateAddSchool, addSchool);

router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
