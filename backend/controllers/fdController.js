const FixedData = require('../models/fixedProduct');
const CounterModel = require("../models/counterSchema");
const numberToWords = require('number-to-words');
const cron = require('node-cron');

const incrementFDFiveDigits = (FDNumber) => {
  return FDNumber.replace(/\d{5}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(5, '0');
  });
};

// Utility function to increment bill numbers
// const incrementFDBill = (lastBill) => {
//   const numericPart = parseInt(lastBill.slice(2)); // Extract numeric part after "FD"
//   const incremented = numericPart + 1;
//   return `FD${incremented.toString().padStart(8, '0')}`; // Pad with leading zeros
// };

// exports.createFD = async (req, res) => {
//   try {
//     // Increment the sequence in CounterModel
//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "fdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const branchCode = req.body.FDNumber.slice(2, 5);

//     // Fetch the last FDNumber based on branchCode
//     const lastFDNumber = await FixedData.findOne({ FDNumber: { $regex: `^FD${branchCode}` } })
//       .sort({ FDNumber: -1 })
//       .limit(1);

//     let newFDNumber;
//     if (lastFDNumber) {
//       newFDNumber = incrementFDFiveDigits(lastFDNumber.FDNumber);
//     } else {
//       newFDNumber = `FD${branchCode}00001`;
//     }

//     // Generate the next fdBill number
//     const lastFDBill = await FixedData.findOne({ fdBill: { $regex: '^FD' } })
//       .sort({ fdBill: -1 })
//       .limit(1);

//     let newFDBill;
//     if (lastFDBill) {
//       newFDBill = incrementFDBill(lastFDBill.fdBill); // Increment the last fdBill number
//     } else {
//       newFDBill = 'FD00000001'; // Default first fdBill
//     }

//     // Convert amount and totalAmount to words
//     const amountInWords = convertNumberToWords(req.body.amount);
//     const totalAmountInWords = convertNumberToWords(req.body.totalAmount);

//     // Function to convert duration string to months
//     const convertDurationToMonths = (durationString) => {
//       const parts = durationString.split(' ');
//       let yearsAsMonths = 0;
//       let additionalMonths = 0;

//       if (parts.length >= 2) {
//         yearsAsMonths = parseInt(parts[0]) * 12 || 0;
//         additionalMonths = parseInt(parts[2]) || 0;
//       }

//       return yearsAsMonths + additionalMonths;
//     };

//     // Convert duration to months
//     const durationInMonths = convertDurationToMonths(req.body.duration);

//     // Create a new FixedData document
//     const newFixedData = new FixedData({
//       ...req.body,
//       FDNumber: newFDNumber,
//       sl_no: counter.seq,
//       amountInWords: amountInWords,
//       totalAmountInWords: totalAmountInWords,
//       durationInMonths: durationInMonths,
//       fdBill: newFDBill, // Save the generated fdBill
//     });

//     // Save the new FixedData document to the database
//     await newFixedData.save();
//     res.status(200).json({ message: 'RDS details uploaded successfully' });
//   } catch (error) {
//     console.error("Error creating FD:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.createFD = async (req, res) => {
//   try {

//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "fdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const branchCode = req.body.FDNumber.slice(2, 5);
//     const lastFDNumber = await FixedData.findOne({ FDNumber: { $regex: `^FD${branchCode}` } }).sort({ FDNumber: -1 }).limit(1);

//     let newFDNumber;
//     if (lastFDNumber) {
//       newFDNumber = incrementFDFiveDigits(lastFDNumber.FDNumber);
//     } else {
//       newFDNumber = `FD${branchCode}00001`;
//     }

//     const newFixedData = new FixedData({
//       ...req.body,
//       FDNumber: newFDNumber,
//       sl_no: counter.seq
//     });

//     await newFixedData.save();
//     res.status(200).json({ message: 'RDS details uploaded successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




// Function to convert number to words
const convertNumberToWords = (num) => {
  if (!num) return '';
  return numberToWords.toWords(num);
};

// exports.createFD = async (req, res) => {
//   try {
//     // Increment the sequence in CounterModel
//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "fdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const branchCode = req.body.FDNumber.slice(2, 5);

//     // Fetch the last FDNumber based on branchCode
//     const lastFDNumber = await FixedData.findOne({ FDNumber: { $regex: `^FD${branchCode}` } })
//       .sort({ FDNumber: -1 })
//       .limit(1);

//     let newFDNumber;
//     if (lastFDNumber) {
//       newFDNumber = incrementFDFiveDigits(lastFDNumber.FDNumber);
//     } else {
//       newFDNumber = `FD${branchCode}00001`;
//     }

//     // Convert amount and totalAmount to words
//     const amountInWords = convertNumberToWords(req.body.amount);
//     const totalAmountInWords = convertNumberToWords(req.body.totalAmount);

//     // Create a new FixedData document
//     const newFixedData = new FixedData({
//       ...req.body,
//       FDNumber: newFDNumber,
//       sl_no: counter.seq,
//       amountInWords: amountInWords,         // Store amount in words
//       totalAmountInWords: totalAmountInWords // Store total amount in words
//     });

//     // Save the new FixedData document to the database
//     await newFixedData.save();
//     res.status(200).json({ message: 'RDS details uploaded successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.createFD = async (req, res) => {
//   try {
//     // Increment the sequence in CounterModel
//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "fdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const branchCode = req.body.FDNumber.slice(2, 5);

//     // Fetch the last FDNumber based on branchCode
//     const lastFDNumber = await FixedData.findOne({ FDNumber: { $regex: `^FD${branchCode}` } })
//       .sort({ FDNumber: -1 })
//       .limit(1);

//     let newFDNumber;
//     if (lastFDNumber) {
//       newFDNumber = incrementFDFiveDigits(lastFDNumber.FDNumber);
//     } else {
//       newFDNumber = `FD${branchCode}00001`;
//     }

//     // Convert amount and totalAmount to words
//     const amountInWords = convertNumberToWords(req.body.amount);
//     const totalAmountInWords = convertNumberToWords(req.body.totalAmount);

//     // Function to convert duration string to months
//     const convertDurationToMonths = (durationString) => {
//       const parts = durationString.split(' ');
//       let yearsAsMonths = 0;
//       let additionalMonths = 0;

//       if (parts.length >= 2) {
//         yearsAsMonths = parseInt(parts[0]) * 12 || 0;
//         additionalMonths = parseInt(parts[2]) || 0;
//       }

//       return yearsAsMonths + additionalMonths;
//     };

//     // Convert duration to months
//     const durationInMonths = convertDurationToMonths(req.body.duration);

//     console.log("Converted duration:", req.body.duration, "to", durationInMonths); // For debugging

//     // Create a new FixedData document
//     const newFixedData = new FixedData({
//       ...req.body,
//       FDNumber: newFDNumber,
//       sl_no: counter.seq,
//       amountInWords: amountInWords,
//       totalAmountInWords: totalAmountInWords,
//       durationInMonths: durationInMonths
//     });

//     // Save the new FixedData document to the database
//     await newFixedData.save();
//     res.status(200).json({ message: 'RDS details uploaded successfully' });
//   } catch (error) {
//     console.error("Error creating FD:", error);
//     res.status(500).json({ error: error.message });
//   }
// };




exports.createFD = async (req, res) => {
  try {
    // Increment the sequence in CounterModel
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "fdval" },
      { '$inc': { 'seq': 1 } },
      { new: true, upsert: true }
    );

    const branchCode = req.body.FDNumber.slice(2, 5);

    // Fetch the last FDNumber based on branchCode
    const lastFDNumber = await FixedData.findOne({ FDNumber: { $regex: `^FD${branchCode}` } })
      .sort({ FDNumber: -1 })
      .limit(1);

    let newFDNumber;
    if (lastFDNumber) {
      newFDNumber = incrementFDFiveDigits(lastFDNumber.FDNumber);
    } else {
      newFDNumber = `FD${branchCode}00001`;
    }

    // Convert amount and totalAmount to words
    const amountInWords = convertNumberToWords(req.body.amount);
    const totalAmountInWords = convertNumberToWords(req.body.totalAmount);

    // Function to convert duration string to months
    const convertDurationToMonths = (durationString) => {
      const parts = durationString.split(' ');
      let yearsAsMonths = 0;
      let additionalMonths = 0;

      if (parts.length >= 2) {
        yearsAsMonths = parseInt(parts[0]) * 12 || 0;
        additionalMonths = parseInt(parts[2]) || 0;
      }

      return yearsAsMonths + additionalMonths;
    };

    // Convert duration to months
    const durationInMonths = convertDurationToMonths(req.body.duration);

    console.log("Converted duration:", req.body.duration, "to", durationInMonths); // For debugging

    // Fetch the last fdBill to increment
    const lastFDBill = await FixedData.findOne({})
      .sort({ fdBill: -1 })
      .limit(1);

    let newFDBill;
    if (lastFDBill) {
      const lastBillNumber = parseInt(lastFDBill.fdBill.slice(3)); // Extract the number part
      newFDBill = `FDB${(lastBillNumber + 1).toString().padStart(8, '0')}`; // Increment and pad to 8 digits
    } else {
      newFDBill = `FDB00000001`; // Starting value if no fdBill exists yet

    }

      // Ensure amount is treated as a number
      const initialTotalIntFdBal = parseFloat(req.body.amount) || 0;

    // Create a new FixedData document
    const newFixedData = new FixedData({
      ...req.body,
      FDNumber: newFDNumber,
      sl_no: counter.seq,
      amountInWords: amountInWords,
      totalAmountInWords: totalAmountInWords,
      durationInMonths: durationInMonths,
      fdBill: newFDBill, // Add the newly generated fdBill
      totalIntFdBal: initialTotalIntFdBal // Set initial value for totalIntFdBal
    });

    // Add monthly interest calculation in the createFD function
const monthlyInterestAmount = newFixedData.finalInterest / durationInMonths;

newFixedData.monthlyInterest.push({
  date: new Date(), 
  amount: monthlyInterestAmount,
});


    // Save the new FixedData document to the database
    await newFixedData.save();
    res.status(200).json({ message: 'RDS details uploaded successfully' });
  } catch (error) {
    console.error("Error creating FD:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branch;
    const searchTerm = req.query.searchTerm;
    const searchReceipt = req.query.searchReceipt;
    const date = req.query.date;

    let query = {};

    if (branchCode) {
      query.branchCodeUser = branchCode;
    }

    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { customerName: searchTermRegex },
        { FDNumber: searchTermRegex },
        { customerNumber: searchTermRegex }
      ];
    }

    if (searchReceipt) {
      const searchReceiptRegex = new RegExp(searchReceipt, 'i');
      query.$or = [
        { customerName: searchReceiptRegex },
        { customerNumber: searchReceiptRegex }
      ];
    }

    if (date) {
      const searchFDRegex = new RegExp(date, 'i');
      query.$or = [
        { date: searchFDRegex }
      ];
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await FixedData.countDocuments(query);

    const newFDdata = await FixedData.find(query).limit(limit).skip(startIndex);

    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    res.json({ data: newFDdata, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// exports.getAllFdData = async (req, res) => {
//   try {
//     const branchCode = req.query.branch;
//     const searchTerm = req.query.searchTerm;
//     const searchReceipt = req.query.searchReceipt;
//     const date = req.query.date;

//     let query = {};

//     if (branchCode) {
//       query.branchCodeUser = branchCode;
//     }

//     if (searchTerm) {
//       const searchTermRegex = new RegExp(searchTerm, 'i');
//       query.$or = [
//         { customerName: searchTermRegex },
//         { FDNumber: searchTermRegex },
//         { customerNumber: searchTermRegex }
//       ];
//     }

//     if (searchReceipt) {
//       const searchReceiptRegex = new RegExp(searchReceipt, 'i');
//       query.$or = [
//         { customerName: searchReceiptRegex },
//         { customerNumber: searchReceiptRegex }
//       ];
//     }

//     if (date) {
//       const searchFDRegex = new RegExp(date, 'i');
//       query.$or = [
//         { date: searchFDRegex }
//       ];
//     }

//     const newFDdata = await FixedData.find(query);

//     res.json({ data: newFDdata });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllFdData = async (req, res) => {
  try {
    const branchCode = req.query.branch;

    if (!branchCode) {
      return res.status(400).json({ error: 'Branch code is required' });
    }

    const query = { branchCodeUser: branchCode };

    const newFDdata = await FixedData.find(query);

    console.log(`Number of records found: ${newFDdata.length}`);


    res.json({ data: newFDdata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getFdNumbersByBranchAndSearch = async (req, res) => {
  try {
    const { branchCode, FDNumber } = req.params;

    // Validate inputs
    if (!branchCode || !FDNumber) {
      return res.status(400).json({ error: "Both branchCode and FDNumber are required." });
    }

    // Fetch matching records
    const fdNumbers = await FixedData.find({
      branchCodeUser: branchCode,
      FDNumber: { $regex: `^${FDNumber}`, $options: 'i' }, // Case-insensitive search
    });

    if (fdNumbers.length === 0) {
      return res.status(404).json({ message: "No matching FD numbers found." });
    }

    res.status(200).json({ data: fdNumbers });
  } catch (error) {
    console.error("Error fetching FD numbers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};








// // Run every month at midnight on the 1st
// cron.schedule('0 0 1 * *', async () => {
//   console.log("Running monthly interest credit job...");

//   try {
//     const fds = await FixedData.find({});  // Get all FDs

//     for (let fd of fds) {
//       const monthsSinceLastCredit = calculateMonthsSince(fd.lastInterestCredited);

//       if (monthsSinceLastCredit > 0) {
//         for (let i = 0; i < monthsSinceLastCredit; i++) {
//           const monthlyInterestAmount = fd.finalInterest / fd.durationInMonths;

//           // Add monthly interest for each missed month
//           fd.monthlyInterest.push({
//             date: new Date(),
//             amount: monthlyInterestAmount,
//           });
          
//           // Increase total amount with monthly interest
//           fd.totalAmount += monthlyInterestAmount;
//         }
        
//         fd.lastInterestCredited = new Date();
//         await fd.save();
//       }
//     }

//     console.log("Monthly interest credited successfully.");
//   } catch (error) {
//     console.error("Error in monthly interest credit job:", error);
//   }
// });

// // Helper to calculate months since the last credit
// function calculateMonthsSince(lastDate) {
//   const now = new Date();
//   const months = (now.getFullYear() - lastDate.getFullYear()) * 12 + (now.getMonth() - lastDate.getMonth());
//   return Math.max(0, months);
// }



// For a one-minute interval
// cron.schedule('* * * * *', async () => {
//   console.log("Running 1-minute interval interest credit job...");

//   try {
//     const fds = await FixedData.find({});  // Get all FDs

//     for (let fd of fds) {
//       // Calculate the interest amount per minute
//       const monthlyInterestAmount = fd.finalInterest / fd.durationInMonths;
//       const dailyInterest = monthlyInterestAmount / 30;
//       const minuteInterest = dailyInterest / 1440;

//       // Add the calculated interest every minute
//       fd.monthlyInterest.push({
//         date: new Date(),
//         amount: minuteInterest,
//       });

//       // Increment totalAmount by minuteInterest
//       fd.totalAmount += minuteInterest;

//       // Update lastInterestCredited timestamp
//       fd.lastInterestCredited = new Date();

//       await fd.save();
//     }

//     console.log("Interest credited successfully for 1-minute interval.");
//   } catch (error) {
//     console.error("Error in 1-minute interval interest credit job:", error);
//   }
// });






//last used 
// cron.schedule('* * * * *', async () => {
//   console.log("Running 1-minute interval interest credit job...");

//   try {
//     const fds = await FixedData.find({}); // Get all FDs

//     for (let fd of fds) {
//       // Check for valid finalInterest and durationInMonths
//       if (!fd.finalInterest || !fd.durationInMonths) {
//         console.error(`Invalid data for FD: ${fd._id}. Skipping interest calculation.`);
//         continue;
//       }

//       // Calculate the minute-based interest
//       const monthlyInterestAmount = fd.finalInterest / fd.durationInMonths;
//       const dailyInterest = monthlyInterestAmount / 30;
//       const minuteInterest = dailyInterest / 1440;

//       // Validate minuteInterest calculation
//       if (isNaN(minuteInterest) || minuteInterest <= 0) {
//         console.error(`Invalid minuteInterest calculation for FD: ${fd._id}. Skipping update.`);
//         continue;
//       }

//       // Push the interest amount into the monthlyInterest array
//       fd.monthlyInterest.push({
//         date: new Date(),
//         amount: minuteInterest,
//       });

//       // Increment the total amount
//       fd.totalAmount += minuteInterest;
//       fd.lastInterestCredited = new Date();

//       await fd.save();
//     }

//     console.log("Interest credited successfully for 1-minute interval.");
//   } catch (error) {
//     console.error("Error in 1-minute interval interest credit job:", error);
//   }
// });

// cron.schedule('* * * * *', async () => {
//   console.log("Running 1-minute interval interest credit job...");

//   const batchSize = 100;
//   let skip = 0;
//   let hasMoreData = true;

//   try {
//     while (hasMoreData) {
//       const fds = await FixedData.find({}).skip(skip).limit(batchSize);

//       if (fds.length === 0) {
//         hasMoreData = false;
//         break;
//       }

//       const bulkOps = fds.map(fd => {
//         const monthlyInterestAmount = fd.finalInterest / fd.durationInMonths;
//         const dailyInterest = monthlyInterestAmount / 30;
//         const minuteInterest = dailyInterest / 1440;

//         // Only proceed if the interest calculation is valid
//         if (isNaN(minuteInterest) || minuteInterest <= 0) return null;

//         // Update the totalAmount without appending to monthlyInterest array
//         return {
//           updateOne: {
//             filter: { _id: fd._id },
//             update: {
//               $inc: { totalAmount: minuteInterest },
//               $set: { lastInterestCredited: new Date() }
//             }
//           }
//         };
//       }).filter(op => op); // Filter out any invalid operations

//       await FixedData.bulkWrite(bulkOps);
//       skip += batchSize;
//     }

//     console.log("Interest credited successfully for 1-minute interval.");
//   } catch (error) {
//     console.error("Error in 1-minute interval interest credit job:", error);
//   }
// });



// cron.schedule('* * * * *', async () => {
//   console.log("Running 1-minute interval interest credit job...");

//   const batchSize = 100;
//   let skip = 0;
//   let hasMoreData = true;

//   try {
//     while (hasMoreData) {
//       // Fetch batch of FD records
//       const fds = await FixedData.find({}).skip(skip).limit(batchSize);

//       if (fds.length === 0) {
//         hasMoreData = false;
//         break;
//       }

//       const bulkOps = fds.map(fd => {
//         const monthlyInterestAmount = fd.finalInterest / fd.durationInMonths;
//         const dailyInterest = monthlyInterestAmount / 30;
//         const minuteInterest = dailyInterest / 1440;

//         // Validate interest calculation
//         if (isNaN(minuteInterest) || minuteInterest <= 0) return null;

//         // Skip records without required properties
//         if (fd.totalIntFdBal == null || fd.interestBalance == null) return null;

//         return {
//           updateOne: {
//             filter: { _id: fd._id },
//             update: {
//               $push: {
//                 monthlyInterest: {
//                   date: new Date(),
//                   amount: minuteInterest,
//                 },
//               },
//               $inc: {
//                 totalIntFdBal: minuteInterest,
//                 interestBalance: minuteInterest,
//               },
//               $set: { lastInterestCredited: new Date() },
//             },
//           },
//         };
//       }).filter(op => op); // Filter out invalid operations

//       if (bulkOps.length > 0) {
//         await FixedData.bulkWrite(bulkOps);
//       }

//       skip += batchSize;
//     }

//     console.log("Interest credited successfully for 1-minute interval.");
//   } catch (error) {
//     console.error("Error in 1-minute interval interest credit job:", error);
//   }
// });





cron.schedule('* * * * *', async () => {
  console.log("Running 1-minute interval interest credit job...");

  const batchSize = 100;
  let skip = 0;
  let hasMoreData = true;
  let modifiedFilesCount = 0;

  try {
    while (hasMoreData) {
      const fds = await FixedData.find({}).skip(skip).limit(batchSize);

      if (fds.length === 0) {
        hasMoreData = false;
        break;
      }

      const bulkOps = fds.map(fd => {
        const totalMinutes = fd.durationInMonths * 30 * 1440; // Total minutes in the FD duration
        // console.log("totalMinutes",totalMinutes)
        const minuteInterest = fd.finalInterest / totalMinutes;

        // Validate interest calculation
        if (isNaN(minuteInterest) || minuteInterest <= 0) return null;

        // Ensure `interestBalance` is initialized if missing
        if (fd.interestBalance == null) fd.interestBalance = 0;

        // Prepare update operation
        return {
          updateOne: {
            filter: { _id: fd._id },
            update: {
              $push: {
                monthlyInterest: {
                  date: new Date(),
                  amount: minuteInterest,
                },
              },
              $inc: {
                totalIntFdBal: minuteInterest,
                interestBalance: minuteInterest,
              },
              $set: { lastInterestCredited: new Date() },
            },
          },
        };
      }).filter(op => op); // Filter out invalid operations

      if (bulkOps.length > 0) {
        const result = await FixedData.bulkWrite(bulkOps);
        modifiedFilesCount += result.modifiedCount;
      }

      skip += batchSize;
    }

    console.log(`Interest credited successfully for 1-minute interval. Modified files: ${modifiedFilesCount}`);
  } catch (error) {
    console.error("Error in 1-minute interval interest credit job:", error);
  }
});



exports.withdrawInterest = async (req, res) => {
  try {
    const { FDNumber } = req.params; // FD number from the route parameter
    const { amount, date,branchUser } = req.body; // Amount to withdraw and date from the request body

    // Validate request body
    if (!amount || !date || !branchUser) {
      return res.status(400).json({ message: 'Amount,branch user and date are required.' });
    }

    // Find the FD data by FDNumber
    const fixedData = await FixedData.findOne({ FDNumber });
    if (!fixedData) {
      return res.status(404).json({ message: 'FD not found.' });
    }

    // Check if withdrawal amount is greater than interest balance
    if (amount > fixedData.interestBalance) {
      return res.status(400).json({ message: 'Insufficient funds.' });
    }

    // Subtract the withdrawal amount from interestBalance and totalIntFdBal
    fixedData.interestBalance -= amount;
    fixedData.totalIntFdBal -= amount;

    // Update the InterestWithdrawal array with the new transaction
    fixedData.InterestWithdrawal.push({
      date, // Ensure date is stored as a Date object
      amount,
      branchUser
    });

    // Save the updated FD data
    await fixedData.save();

    res.status(200).json({
      message: 'Withdrawal successful.',
      updatedData: fixedData,
    });
  } catch (error) {
    console.error('Error processing interest withdrawal:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};





// exports.withdrawInterest = async (req, res) => {
//   try {
//     const { fdId } = req.params;
//     const fd = await FixedData.findById(fdId);

//     if (!fd) {
//       return res.status(404).json({ error: "FD not found" });
//     }

//     // Calculate total available interest
//     const availableInterest = fd.monthlyInterest.reduce((sum, entry) => sum + entry.amount, 0);

//     // Deduct available interest from total amount
//     fd.totalAmount -= availableInterest;

//     // Clear the monthlyInterest array since interest has been withdrawn
//     fd.monthlyInterest = [];

//     await fd.save();

//     res.json({ message: "Interest withdrawn successfully", availableInterest });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


