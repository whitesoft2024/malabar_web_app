// // controllers/emiController.js

// const LOANEMI = require('../models/LoanEmiModel'); // Adjust the path according to your project structure

// exports.addEmiPayment = async (req, res) => {
//   const { loanNumber, amount, date } = req.body;
//   try {
//     // Find the highest emiNumber for the given loanNumber
//     const highestEmiNumber = await LOANEMI.findOne({ loanNumber }).sort({ emiNumber: -1 }).limit(1);
//     let emiNumber = 1;
//     if (highestEmiNumber) {
//       emiNumber = highestEmiNumber.emiNumber + 1;
//     }

//     // Create a new EMI payment document with the incremented emiNumber
//     const loanemi = new LOANEMI({
//       loanNumber,
//       emiNumber,
//       amount,
//       date
//     });
//     await loanemi.save();
//     res.send('EMI payment added successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// };
