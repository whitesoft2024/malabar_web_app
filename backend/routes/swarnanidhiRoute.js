const express = require('express');
const router = express.Router();
const {
    createGroup, // Changed from createScheme to createGroup
    addMemberToGroup, // New function to add a member to a group
    addInstallmentToMember, // New function to add installments to a specific member
    getAllSchemes,
    getAllSchemesPaginated,
    getSchemeById,
    addFirstPrice, 
    addSecondPrice,
     addThirdPrice,
     getInstallments,
     getInstallmentsBySchemeId,
     getPaginatedInstallmentsByGroupId,
     getPaginatedGroups,
     getAuctionDetails,
     getEmpData,
     getGroupMembersBySchemeId
    // updateSchemeById,
    // deleteSchemeById,
} = require('../controllers/swarnaNidhiController');

// Route to create a new group
router.post('/swarna1/addgroup', createGroup);

// Route to add a member to a specific group by groupId
router.post('/swarnaAddmem/:groupId', addMemberToGroup);

// Route to add an installment to a specific member by memberId in a specific group by groupId
router.post('/swarnaInstallment/:schemeId', addInstallmentToMember);

// router.post('/swarna1', createScheme);
router.get('/getswarna', getAllSchemes);

// Route to get paginated schemes data
router.get('/getswarnaPaginated', getAllSchemesPaginated);

router.get('/swarna1/:id', getSchemeById);

// Route to add first price detail
router.post('/addFirstPrice/:groupId', addFirstPrice);

// Route to add second price detail
router.post('/addSecondPrice/:groupId', addSecondPrice);



// Route to add third price detail
router.post('/addThirdPrice/:groupId', addThirdPrice);
// router.put('/swarna1/:id', updateSchemeById);
// router.delete('/swarna1/:id', deleteSchemeById);

// Route to get installments based on schemeId
router.get('/installments/:schemeId', getInstallmentsBySchemeId);


// Route to get auction details by groupId
router.get('/auction/:groupId', getAuctionDetails);



// Define the GET route for installments
router.get('/swarna/installments', getInstallments);


// Route to get paginated installments by groupId
router.get('/getPaginatedInstallments/:groupId', getPaginatedInstallmentsByGroupId);

// Route to get paginated group data
router.get('/getPaginatedGroups', getPaginatedGroups);

router.get('/getEmpList',getEmpData)


router.get('/Getmembers/:schemeId',getGroupMembersBySchemeId);


module.exports = router;
