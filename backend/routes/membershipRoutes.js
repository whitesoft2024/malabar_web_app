// routes/membershipRoutes.js
const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController')

router.post('/members', membershipController.create)

router.get('/membership', membershipController.getAll)

router.put('/membership/:id', membershipController.updateAll)

module.exports = router;











// // Route to update a membership by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const membershipId = req.params.id;
//         const updatedMembershipData = req.body; // New data from the request body

//         // Update the membership in the database
//         const updatedMembership = await Membership.findByIdAndUpdate(
//             membershipId,
//             updatedMembershipData,
//             { new: true } // Return the updated document
//         );

//         res.json(updatedMembership);
//     } catch (error) {
//         console.error('Error updating membership:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;
