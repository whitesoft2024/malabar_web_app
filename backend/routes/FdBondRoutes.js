const express = require('express');
const router = express.Router();
const fdBondController = require('../controllers/FdBondController');
// const upload = require('../app'); // Adjust path as necessary
const multer = require('multer');
const path = require('path');

router.post('/fd-bond', fdBondController.saveFdBond);

router.get('/fdBondsByBranch', fdBondController.getFdBondsByBranchCode);

// // Configure Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // specify the destination directory for uploads
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname)); // specify the file name
//     }
//   });
  
//   // Set up the Multer middleware
//   const upload = multer({ storage: storage });

// Set up multer to handle file upload

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

// Route to create a new FD Bond record
router.post('/fdBondReq', upload.single('image'),fdBondController.createFdBond);

// router.get('/fdData', fdBondController.getAllFdData);

// Define the route for getting all FD Bonds
router.get('/fdBranchReq', fdBondController.getAllFdBonds);

//update status property
// router.patch('/approve-fd-bond/:id', fdBondController.approveFdBondRequestAndGeneratePDF);
router.patch('/approve-fd-bond/:id', fdBondController.approveFdBondRequest);


// In routes file
router.get('/approvedfd-details/:id', fdBondController.getFdDetailsByObjectId);

module.exports = router;