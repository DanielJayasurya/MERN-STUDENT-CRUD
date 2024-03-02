const express = require('express');
const loginController = require('../controllers/loginController');
const Registration = require('../controllers/registrationController');
const Reports = require('../controllers/reportsController')

const router = express.Router();
router.post('/login', loginController);
router.post('/registration', Registration.postRegistration);
router.get('/registration', Registration.getRegistration);
router.put('/registration/:id', Registration.UpdateRegistration);
router.delete('/registration/:id', Registration.deleteRegistration);

router.get('/reports',Reports.getReports)
router.put('/reports/:id',Reports.updateReport)
module.exports = router;
