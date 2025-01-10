const ExpenseBook = require('../models/expenseBookModel')



// controllers/expenseBookController.js

exports.createExpenseBookEntry = async (req, res) => {
    try {
      // Extract the required fields from the request body
      const { branchCode, category, Frequency } = req.body;
  
      // Validate that all required fields are present and not empty
      if (!branchCode || !category || !Frequency) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Proceed with creating the new expense book entry if validation passes
      const newExpenseBookEntry = new ExpenseBook({
        branchCode,
        category,
        Frequency,
        expenseDetails: [] // Initialize with an empty array
      });
  
      await newExpenseBookEntry.save();
  
      res.status(201).json({ message: 'Expense book entry created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating expense book entry', error: error.message });
    }
  };




  // controllers/expenseBookController.js

// exports.addExpenseDetail = async (req, res) => {
//   try {
//     // Extract the required fields from the request body
//     const { amount, description, date, voucherNumber, remarks } = req.body;

//     // Validate that all required fields are present and not empty
//     if (!amount || !description || !date || !voucherNumber || !remarks) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     // Extract the ExpenseBook ID from the request parameters or query
//     const expenseBookId = req.params.id || req.query.id;

//     // Find the ExpenseBook document by ID
//     const expenseBook = await ExpenseBook.findById(expenseBookId);

//     if (!expenseBook) {
//       return res.status(404).json({ message: 'Expense book not found.' });
//     }

//     // Append the new expense detail to the expenseDetails array
//     expenseBook.expenseDetails.push({
//       amount,
//       description,
//       date,
//       voucherNumber,
//       remarks,
//     });

//     // Save the updated ExpenseBook document
//     await expenseBook.save();

//     res.status(200).json({ message: 'Expense detail added successfully', expenseBook });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding expense detail', error: error.message });
//   }
// };

// exports.addExpenseDetail = async (req, res) => {
//   try {
//     // Extract the required fields from the request body
//     const { amount, description, date, voucherNumber, remarks } = req.body;

//     // Validate that all required fields are present and not empty
//     if (!amount || !description || !date || !voucherNumber || !remarks) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     // Extract the ExpenseBook ID from the request parameters or query
//     const expenseBookId = req.params.id || req.query.id;

//     // Find the ExpenseBook document by ID
//     const expenseBook = await ExpenseBook.findById(expenseBookId);

//     if (!expenseBook) {
//       return res.status(404).json({ message: 'Expense book not found.' });
//     }

//     // Create a new expense detail object with the provided fields
//     const newExpenseDetail = {
//       amount,
//       description,
//       date,
//       voucherNumber,
//       remarks,
//       category: expenseBook.category, // Reference the category from the expenseBook document
//       Frequency: expenseBook.Frequency, // Reference the Frequency from the expenseBook document
//     };

//     // Append the new expense detail to the expenseDetails array
//     expenseBook.expenseDetails.push(newExpenseDetail);

//     // Save the updated ExpenseBook document
//     await expenseBook.save();

//     res.status(200).json({ message: 'Expense detail added successfully', expenseBook });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding expense detail', error: error.message });
//   }
// };

// Function to generate a unique 10-character alphanumeric voucher number
const generateVoucherNumber = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let voucherNumber;
  let isUnique = false;

  while (!isUnique) {
    voucherNumber = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      voucherNumber += characters[randomIndex];
    }

    // Check if the generated voucher number is unique
    const existingExpense = await ExpenseBook.findOne({ 'expenseDetails.voucherNumber': voucherNumber });
    if (!existingExpense) {
      isUnique = true;
    }
  }

  return voucherNumber;
};

exports.addExpenseDetail = async (req, res) => {
  try {
    // Extract the required fields from the request body
    const { amount, description, date, remarks } = req.body;

    // Validate that all required fields are present and not empty
    if (!amount || !description || !date || !remarks) {
      return res.status(400).json({ message: 'All fields are required except voucher number.' });
    }

    // Extract the ExpenseBook ID from the request parameters or query
    const expenseBookId = req.params.id || req.query.id;

    // Find the ExpenseBook document by ID
    const expenseBook = await ExpenseBook.findById(expenseBookId);

    if (!expenseBook) {
      return res.status(404).json({ message: 'Expense book not found.' });
    }

    // Generate a unique voucher number
    const voucherNumber = await generateVoucherNumber();

    // Create a new expense detail object with the provided fields and generated voucher number
    const newExpenseDetail = {
      amount,
      description,
      date,
      voucherNumber,
      remarks,
      category: expenseBook.category, // Reference the category from the expenseBook document
      Frequency: expenseBook.Frequency, // Reference the Frequency from the expenseBook document
    };

    // Append the new expense detail to the expenseDetails array
    expenseBook.expenseDetails.push(newExpenseDetail);

    // Save the updated ExpenseBook document
    await expenseBook.save();

    res.status(200).json({ message: 'Expense detail added successfully', expenseBook });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense detail', error: error.message });
  }
};



// controllers/expenseBookController.js

exports.getExpensesByBranchCode = async (req, res) => {
  try {
    // Extract the branchCode from the request parameters or query
    const branchCode = req.query.branchCode;

    // Validate that branchCode is provided
    if (!branchCode) {
      return res.status(400).json({ message: 'Branch code is required.' });
    }

    // Find ExpenseBook documents by branchCode
    const expenseBooks = await ExpenseBook.find({ branchCode: branchCode }).populate('expenseDetails');

    if (expenseBooks.length === 0) {
      return res.status(404).json({ message: 'No expense books found for the given branch code.' });
    }

    res.status(200).json({
      success: true,
      message: 'Expense books fetched successfully',
      data: expenseBooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: error.message,
    });
  }
};




// Create and Save a new Branch Request
// exports.create = async (req, res) => {
//     const newExpenseBook = new ExpenseBook(req.body)
//     try {
//         const savedExpenseBook = await newExpenseBook.save()
//         res.status(201).json({
//             success: true,
//             message: 'Expense sheet created successfully',
//             ExpenseBook: savedExpenseBook
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again.',
//             error: error.message,
//         })
//     }
// }

// // Fetch all expenses
// exports.getAll = async (req, res) => {
//     try {
//         const expenseBooks = await ExpenseBook.find({})
//         res.status(200).json({
//             success: true,
//             message: 'Expenses fetched successfully',
//             data: expenseBooks
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again',
//             error: error.message
//         })
//     }
// }
// exports.getExpensesByDate = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const branchCode = req.query.branchCode;
//         const date = req.query.date;

//         console.log('date:', date);
//         let query = {};

//         if (branchCode) {
//             query.branchCode = branchCode;
//         }

//         if (date) {
//             const searchExpenseRegex = new RegExp(date, 'i');
//             query.$or = [
//               { date: searchExpenseRegex }
//             ];
//           }

//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;

//         const total = await ExpenseBook.countDocuments(query);

//         const newExpensedata = await ExpenseBook.find(query).limit(limit).skip(startIndex);

//         let nextPage = null;
//         if (endIndex < total) {
//             nextPage = page + 1;
//         }

//         res.json({ data: newExpensedata, nextPage, total });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again',
//             error: error.message
//         });
//     }
// };

// exports.checkVoucherNumber = async (req, res) => {
//     const voucherNumber = req.params.voucherNumber;
//     try {
//         const existingExpenseBook = await ExpenseBook.findOne({ voucherNumber: voucherNumber });
//         if (existingExpenseBook) {
//             // If an expense with the given voucher number exists, return false
//             res.status(200).json({ isUnique: false });
//         } else {
//             // If no expense with the given voucher number exists, return true
//             res.status(200).json({ isUnique: true });
//         }
//     } catch (error) {
//         console.error('Error checking voucher number', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again.',
//             error: error.message,
//         });
//     }
// };