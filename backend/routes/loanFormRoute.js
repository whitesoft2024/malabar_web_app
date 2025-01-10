// routes/loanFormRoutes.js

const express = require('express');
const loanFormController = require('../controllers/loanFormController');

const router = express.Router();

// POST request to save loan scheme data
router.post('/api/loanform', loanFormController.saveLoanForm);

// GET request to retrieve all loan forms
router.get('/api/loanform', loanFormController.getLoanForms);


// router.get('/fetchMemberDetails/:branchCode/:phoneNumber',loanFormController.fetchMemberDetails)
router.get('/getMemberDetails',loanFormController.fetchMemberDetails)
// router.get('/fetchMemberDetails/',loanFormController.getCustomersByPhoneNumberSeries)

router.get('/getLoanDetails/',loanFormController.fetchLoanDetails)

router.get('/getBranchLoanDetailsPG',loanFormController.fetchBranchLoanDetailsPG)

router.get('/getLoanData',loanFormController.fetchLoanData)

router.get('/getAdminLoandetails',loanFormController.fetchloan)



// New route for adding an EMI entry
router.post('/emi/:groupId', loanFormController.addEmiToLoanForm);








// const employeeController = require('../controllers/l'); // Adjust the path as necessary

// router.get('/branchEmployee', loanFormController.getEmployeesByBranchCode);






module.exports = router;
