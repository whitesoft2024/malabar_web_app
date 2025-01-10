// routes.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/gdcsGroupController');

router.post('/group', groupController.createGroup);
router.post('/group/:groupId/member', groupController.addMemberToGroup);    // group id add
router.post('/group/:groupName/member', groupController.addMemberToGroup); //groupname add


// New route for fetching group details
router.get('/group/:groupId', groupController.getGroupDetails);



//group member details routes.js
router.get('/group/:groupId/members', groupController.getGroupMembers);


// New route for adding an EMI entry
router.post('/group/:groupId/member/:phoneNumber/emi', groupController.addEmiToMember);

// New route for adding an EMI entry base of bcode and gdcs num
router.post('/groupMember/:groupId/member/:gdcNumber/emi', groupController.addEmiToGroupMember);
router.post('/groupMember/:groupId/member/emi', groupController.addEmiToGroupMember);




router.get('/groups', groupController.getAllGroups);

//branch groups
router.get('/branchGroups', groupController.getAllBranchGroups);


router.get('/fetchMemberDetails', groupController.fetchMemberDetails);

router.get('/Gdcs/fetchMember', groupController.fetchGDCSMember);

router.get('/Gdcs/fetchGDCSGroup', groupController.fetchGDCSGroup);

// router.get('/fetchGroupMemberDetails', groupController.fetchGroupMemberDetails);





module.exports = router;
