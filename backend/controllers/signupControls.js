
const EmployeeRegister = require("../models/signup")

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Function to generate a 6-digit OTP
const generateOTP = () => {
  console.log("otp generation invoked")
  return crypto.randomInt(100000, 999999).toString();
};

// Function to send an email with the OTP
const sendOTPEmail = async (email, otp) => {
  console.log("sendOTPEmail invoked")
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'whitepayteam@gmail.com', // Your email
      pass: 'sykxcvhditrvilzx',  // Your email password
    },
  });

  let mailOptions = {
    from: 'whitepayteam@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  // res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
  
};



// Temporarily store OTPs in memory (for demonstration purposes, use a database in production)
const otps = {};

exports.AddNewEmployee = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate an OTP
    const otp = generateOTP();

    // Store the OTP with an expiry time (e.g., 5 minutes)
    otps[email] = { otp, expires: Date.now() + 300000 }; // 5 minutes

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email. Please verify to complete signup.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.VerifyOTPAndAddEmployee = async (req, res) => {
  try {
    const { email, otp, ...employeeData } = req.body;

    // Construct the employeeData object including the email
    const finalEmployeeData = { ...employeeData, email }; // Add email back into the object

    // Check if the OTP is correct and not expired
    if (otps[email] && otps[email].otp === otp && otps[email].expires > Date.now()) {
      const newSignup = new EmployeeRegister(finalEmployeeData); // Use the constructed object
      await newSignup.save();

      // Remove the OTP from memory after successful verification
      delete otps[email];

      res.status(200).json({ message: 'Signup added successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// exports.VerifyOTPAndAddEmployee = async (req, res) => {
//   try {
//     const { email, otp, ...employeeData } = req.body;

//     // Check if the OTP is correct and not expired
//     if (otps[email] && otps[email].otp === otp && otps[email].expires > Date.now()) {
//       const newSignup = new EmployeeRegister(employeeData);
//       await newSignup.save();

//       // Remove the OTP from memory after successful verification
//       delete otps[email];

//       res.status(200).json({ message: 'Signup added successfully' });
//     } else {
//       res.status(400).json({ message: 'Invalid or expired OTP' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



// exports.AddNewEmployee =async (req,res)=>{
//   try {
//     const newSignup = new EmployeeRegister(req.body);
//     await newSignup.save();
//     res.status(200).json({ message: 'Signup added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }