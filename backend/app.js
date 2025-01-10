// app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Membership = require("./models/model")
const BranchData = require("./models/branchCreate")
const Designation = require("./models/designationCreate")
const EmployeeRegister = require("./models/signup")
const AdminRegister = require("./models/adminRegister")

require('dotenv').config()

const RDdata = require('./models/rdProducts');
const RDS = require('./models/rdsMain.js');
const FixedData = require('./models/fixedProduct');
const SavingsData = require('./models/savings.js');
const EmployeeSchemedata = require("./models/CreateSchemedata.js");
const LoanScheme = require('./models/loanSchema.js')
const { AddNewEmployee } = require('./controllers/signupControls');
const { log } = require('console');
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
mongoose.set('strictQuery', false);
const employeeAdd = require('./routes/admin/createField')
const fdSchemarouter = require('./routes/fdschemeRoutes');
const CounterModel = require("./models/counterSchema");

app.use(express.json());
// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB  

const connect = mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
connect
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json());

// Session middleware setup
app.use(session({
  // secret: process.env.SESSION_SECRET || 'secret',
  secret: "SESSION_SECRET_KEY",
  resave: false,
  saveUninitialized: false,
}));

app.get('/api/rd', async (req, res) => {
  try {
    const newRDdata = await RDdata.find();
    res.json(newRDdata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In your main server file (e.g., app.js or index.js)
// const FixedData = require('./models/FixedData'); // Adjust path as needed

// async function clearMonthlyInterestOnStart() {
//   try {
//     await FixedData.updateMany({}, { $set: { monthlyInterest: [] } });
//     console.log("Cleared monthlyInterest fields on server start.");
//   } catch (error) {
//     console.error("Error clearing monthlyInterest fields:", error);
//   }
// }

// Call the function at server start
// clearMonthlyInterestOnStart();


app.put('/updateMemberDetails/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const updatedData = req.body;

    const updatedMembership = await FixedData.findOneAndUpdate(
      { customerNumber: phoneNumber }, // Find document based on phone number
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedMembership) {
      return res.status(404).send('Member not found');
    }

    res.json(updatedMembership);
  } catch (err) {
    console.error('Error updating member details:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/designation', async (req, res) => {
  try {
    const newDesignation = new Designation(req.body);
    await newDesignation.save();
    res.status(200).json({ message: 'Designation added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/designation", async (req, res) => {
  try {
    const listDesignation = await Designation.find();
    res.json(listDesignation);
    console.log(listDesignation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//add branch 
app.post('/addBranch', async (req, res) => {
  try {
    const newBranch = new BranchData(req.body);
    await newBranch.save();
    res.status(200).json({ message: 'Branch added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// fetch the branch 
app.get("/api/branches", async (req, res) => {
  try {
    const branches = await BranchData.find();
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add New Admin Details
const generatedOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
let Data;
let otp;
app.post('/adminSignup', async (req, res) => {
  try {
    Data = req.body;
    console.log(req.session.Sidata);
    otp = generatedOtp();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'whitepayteam@gmail.com',
        pass: 'sykxcvhditrvilzx',
      }
    });
    const mailOptions = {
      from: 'whitepayteam@gmail.com',
      to: req.body.email,
      subject: 'Your OTP for Admin Signup',
      text: `Your OTP is: ${otp}`
    };

    // Send the OTP email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/otp', async (req, res) => {
  try {
    // Assuming the OTP is sent in the request body
    const userOtp = req.body.otp;
    console.log(userOtp)
    if (userOtp === otp) {
      // OTP is correct, proceed with the signup
      const newData = Data;
      const newAdminSignup = new AdminRegister(newData);
      await newAdminSignup.save();
      res.status(200).json({ message: 'Signup added successfully' });
    } else {
      // OTP is incorrect
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// admin login
// app.post('/admin', async (req, res) => {
//   const { user_id, password } = req.body;
//   console.log('User ID:', user_id);
//   console.log('Password:', password);

//   try {
//     // Step 1: Fetch user details from EmployeeRegister collection
//     const admin = await AdminRegister.findOne({ user_id, password });
//     res.json({ success: true, admin });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

// Login  Validation
// app.post('/login', async (req, res) => {
//   const { user_id, password } = req.body;
//   console.log('User ID:', user_id);
//   console.log('Password:', password);

//   try {
//     // Reset branch-related data at the beginning of each login attempt
//     let branchDetails = null;

//     // Step 1: Fetch user details from EmployeeRegister collection
//     const employee = await EmployeeRegister.findOne({ user_id, password });

//     if (employee) {
//       // Step 2: Extract branch_name and branchCode from the fetched employee details
//       const { branch_name, branchCode } = employee;
//       // Step 3: Fetch additional details from BranchData collection using branch_name and branchCode
//       branchDetails = await BranchData.findOne({ branch_name, branchCode });

//       if (branchDetails) {

//         res.json({ success: true, employee, branchDetails });
//       } else {
//         // Handle the case where branch details are not found
//         // You can choose to send a different response or take another action
//         res.json({ success: false, message: 'Branch details not found' });
//       }
//     } else {
//       console.log('Credentials do not match');
//       res.json({ success: false, message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });


const adminRoutes = require("../backend/routes/adminLoginRoutes.js");
// Use routes
app.use(adminRoutes);

//search data by phone number
app.get('/searchPhoneNumbers', async (req, res) => {
  try {
    const query = req.query.query;
    const phoneNumbers = await Membership.find({ customerMobile: { $regex: query, $options: 'i' } }, { customerMobile: 1, _id: 0 });
    res.json(phoneNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/fetchMemberDetails', async (req, res) => {
  try {
    const phoneNumber = req.query.phoneNumber;
    const member = await Membership.findOne({ customerMobile: phoneNumber });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search data by phone number in FD account 
app.get('/fdsearchPhoneNumbers', async (req, res) => {
  try {
    const query = req.query.query;
    if (typeof query !== 'string') {
      throw new Error('Query parameter must be a string');
    }
    const phoneNumbers = await FixedData.find({ customerNumber: { $regex: query, $options: 'i' } }, { customerNumber: 1, _id: 0 });
    res.json(phoneNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fdfetchMemberDetails', async (req, res) => {
  try {
    const phoneNumber = req.query.phoneNumber;
    const member = await FixedData.findOne({ customerNumber: phoneNumber });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//-----------------------------------------------------------------------------
// Savings search and fetch
app.get('/searchAccNumbers', async (req, res) => {
  try {
    const query = req.query.query;
    if (typeof query !== 'string') {
      throw new Error('Query parameter must be a string');
    }
    const accNumbers = await SavingsData.find({ accountNumber: { $regex: query, $options: 'i' } });
    res.json(accNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/accfetchMemberDetails', async (req, res) => {
  try {
    const accNumber = req.query.accountNumber;
    const member = await SavingsData.findOne({ accountNumber: accNumber });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Withdraw savings 
app.put('/api/savings/withdraw/:accountNumber', async (req, res) => {
  const { accountNumber } = req.params;
  const { amount } = req.body;

  try {
    // Find the deposit by account number
    const existingDeposit = await SavingsData.findOne({ accountNumber: accountNumber });
    
    if (!existingDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    // Ensure the withdrawal amount does not exceed the existing deposit
    if (parseFloat(amount) > parseFloat(existingDeposit.deposit)) {
      return res.status(400).json({ error: 'Withdrawal amount exceeds available balance' });
    }

    // Subtract the withdrawal amount from the existing deposit
    existingDeposit.deposit = parseFloat(existingDeposit.deposit) - parseFloat(amount);

    // Save the updated deposit
    await existingDeposit.save();

    // Return the updated deposit
    res.json({ message: 'Withdrawal successful', deposit: existingDeposit });
  } catch (error) {
    console.error('Error updating deposit:', error);
    res.status(500).json({ error: 'Error updating deposit. Please try again.' });
  }
});
//-----------------------------------------------------------------------------

const loanFormRoutes = require('./routes/loanFormRoute.js');
app.use('/', loanFormRoutes); // Use the loanFormRoutes


app.get('/api/loanform', async (req, res) => {
  try {
    const loanforms = await loanForm.find();
    res.json(loanforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//-----------------------------------------------------------------------------
// RD search and fetch

// app.put('/api/rdDataAdd/:RDNumber', async (req, res) => {
//   try {
//     const { RDNumber } = req.params;
//     const { finalAmount } = req.body;

//     // Find existing RDS document
//     const existingRD = await RDdata.findOne({ RDNumber });

//     if (!existingRD) {
//       return res.status(404).send('RD data not found');
//     }

//     // Validate amount
//     if (isNaN(parseFloat(finalAmount))) {
//       return res.status(400).send('Invalid amount provided');
//     }

//     let updatedAmount = parseFloat(existingRD.finalAmount);

//     // Update existingRDS with the new amount
//     existingRD.finalAmount = updatedAmount.toString();
//     await existingRD.save();

//     // Send response
//     res.json({ message: 'RD Emi amount updated', updatedRD: existingRD.finalAmount });
//   } catch (error) {
//     console.error('Error updating RDS data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
app.put('/api/rdDataAdd/:RDNumber', async (req, res) => {
  try {
    const { RDNumber } = req.params;
    const { finalAmount } = req.body;

    const existingRD = await RDdata.findOne({ RDNumber });

    if (!existingRD) {
      return res.status(404).send('RD data not found');
    }
    existingRD.finalAmount = finalAmount;

    await existingRD.save();

    res.json({ message: 'RD Emi amount updated', updatedRD: existingRD.finalAmount });
  } catch (error) {
    console.error('Error updating RD data:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/searchRDNumbers', async (req, res) => {
  try {
    const query = req.query.query;
    if (typeof query !== 'string') {
      throw new Error('Query parameter must be a string');
    }
    const accNumbers = await RDdata.find({ RDNumber: { $regex: query, $options: 'i' } });
    res.json(accNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/RDfetchMemberDetails', async (req, res) => {
  try {
    const rdNumber = req.query.rdNumber;
    const member = await RDdata.findOne({ RDNumber: rdNumber });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
//-----------------------------------------------------------------------------
app.post('/addsign', AddNewEmployee);
//membership Adding
const membershipRoutes = require('./routes/membershipRoutes');
app.use('/api', membershipRoutes);

app.use('/auth', employeeAdd)

app.get("/api/employee", async (req, res) => {
  try {
    const branches = await EmployeeSchemedata.find();
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//RDS
const RDScreateRouter = require('./routes/rdsRoutes.js')
app.use('/api', RDScreateRouter)

//FD
const createFDRouter = require('./routes/fdRoutes.js')
app.use('/api', createFDRouter)

//FD scheme 
app.use('/fds', fdSchemarouter)
const fdSchemedata = require("./models/fdschememodel");
// Route to handle form submission
app.get('/api/fdSchmefetch', async (req, res) => {
  try {
    const fdSchme = await fdSchemedata.find();
    res.json(fdSchme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all loan schemes
app.get('/api/loanScheme', async (req, res) => {
  try {
    const loanSchemes = await LoanScheme.find();
    res.json(loanSchemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//RD scheme
const rdschemeRouter = require('./routes/rdschemeRoutes.js')
app.use('/api', rdschemeRouter)

const createRdRouter = require('./routes/rdRoute.js')
app.use('/api', createRdRouter)

const rdschemadata = require('./models/rdschememodel.js');
app.get('/api/rdSchmefetch', async (req, res) => {
  try {
    const rdSchme = await rdschemadata.find();
    res.json(rdSchme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//savings
const createSavingsRouter = require('./routes/savingsRoute.js')
app.use('/api', createSavingsRouter)

//GDCD
const gdcsSchemeRouter=require('./routes/gdcsSchemeRoute')
app.use('/gdcs',gdcsSchemeRouter)
const GdcsCreateRouter=require('./routes/gdcsCreateRoute')
app.use('/gdcs', GdcsCreateRouter);
const gdcsGrouproutes=require("../backend/routes/gdcsGroupRoute.js")
app.use('/api', gdcsGrouproutes);


//Attendance register creation
const attendanceRegisterRoutes = require('./routes/attendanceRegisterRoutes.js')
app.use('/api/attendance-register', attendanceRegisterRoutes)

//Expense book creation
const expenseBookRoutes = require('./routes/expenseBookRoutes')
app.use('/api/expense-book', expenseBookRoutes)

//Payment ledger creation
const paymentLedgerRoutes = require('./routes/paymentLedgerRoutes.js')
app.use('/api/payment-ledger', paymentLedgerRoutes)

//Receipt ledger creation
const receiptLedgerRoutes = require('./routes/receiptLedgerRoutes.js')
app.use('/api/receipt-ledger', receiptLedgerRoutes)

//Swarna Nidhi
const swarnaRoutes = require('../backend/routes/swarnanidhiRoute.js');
app.use('/api', swarnaRoutes);

const SafuserRoute=require('../backend/routes/userRoute1.js')
app.use('/api', SafuserRoute);

const loginRoutes=require('./routes/loginRoutes.js')
app.use('/auth', loginRoutes);

const signUpRoutes =require('./routes/signupRoute.js')
app.use('/addsign', signUpRoutes);

// fdBond Routes  
const fdBondRoutes =require("./routes/FdBondRoutes.js")
app.use('/api', fdBondRoutes);

//Branch transactions
const bankTransactionRoutes = require('./routes/bankTransactionRoutes.js')
app.use('/api/bank-transaction', bankTransactionRoutes)
//closing denomination
const closingDenominationRoutes = require('./routes/closingDenominationRoutes.js')
app.use('/api/closing-denomination', closingDenominationRoutes);

//Clossing Balance
const closingBalanceRoutes = require('./routes/closingBalanceRoutes.js')
app.use('/api', closingBalanceRoutes);

//Branch money request 
const branchRequestRoutes = require('./routes/branchRequestRoutes');
app.use('/api/transfer-requests', branchRequestRoutes)

//Branch money transfer
const branchTransferRoutes = require('./routes/branchTransferRoutes')
app.use('/api/transfer-money', branchTransferRoutes)

//Admin money request
const adminRequestRoutes = require('./routes/adminRequestRoutes')
app.use('/api/admin-money-request', adminRequestRoutes)

//Admin money transfer
const adminTransferRoutes = require('./routes/adminTransferRoutes')
app.use('/api/admin-money-transfer', adminTransferRoutes)

const port = process.env.PORT || 2000;
app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}`)
); 
