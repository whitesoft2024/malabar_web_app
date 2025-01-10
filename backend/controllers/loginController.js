
let otps = {};


const nodemailer = require('nodemailer');
const EmployeeRegister = require('../models/signup'); // Adjust the path as necessary
const BranchData = require('../models/branchCreate'); // Adjust the path as necessary

exports.login = async (req, res) => {
  console.log('Session before OTP:', req.session); // Debugging line
  const { user_id, password } = req.body;
  console.log('User ID:', user_id);
  console.log('Password:', password);

  try {
    let branchDetails = null;

    // Fetch user details from EmployeeRegister collection
    const employee = await EmployeeRegister.findOne({ user_id, password });

    if (employee) {
      const { email, branch_name, branchCode } = employee;

      // Generate and send OTP to user's email
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

      const expires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

// Store the OTP in the otps object
otps[user_id] = { otp, expires };
      // Configure your email transport
      let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'whitepayteam@gmail.com', // Your email
            pass: 'sykxcvhditrvilzx',  // Your email password
          },
        });

      // Send email
      await transporter.sendMail({
        from: 'whitepayteam@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code for Login is ${otp}`,
      });

      // Store the OTP in the session or a temporary storage for later verification
      req.session.otp = otp; // Make sure to configure session middleware
      console.log(req.session.otp,"req.session.otp1")

      res.json({ success: true, message: 'OTP sent to email', employee });
    } else {
      console.log('Credentials do not match');
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



exports.verifyOtps = async (req, res) => {
  const { otp, user_id } = req.body;

  try {
    // Check if OTP exists and is not expired
    const storedOtpInfo = otps[user_id];
    if (storedOtpInfo && storedOtpInfo.otp === otp && storedOtpInfo.expires > Date.now()) {
      // OTP is valid and not expired

      // Fetch employee details
      const employee = await EmployeeRegister.findOne({ user_id });
      if (employee) {
        let { branch_name, branchCode } = employee;

        // Debugging: Check the raw values
        console.log('Raw Employee branch_name:', branch_name);
        console.log('Raw Employee branchCode:', branchCode);

        // Trim any extra spaces
        branch_name = branch_name.trim();
        branchCode = branchCode.trim();

        // Debugging: Check the trimmed values
        console.log('Trimmed Employee branch_name:', branch_name);
        console.log('Trimmed Employee branchCode:', branchCode);

        // Case-insensitive query to find branch details
        const branchDetails = await BranchData.findOne({
          branch_name: { $regex: new RegExp(`^${branch_name}$`, 'i') },
          branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') }
        });

        if (branchDetails) {
          // Branch details found
          console.log('Branch details found:', branchDetails);
          res.status(200).json({
            success: true,
            message: 'OTP Verified successfully',
            employee,
            branchDetails
          });
        } else {
          // Branch details not found
          console.log('Branch details not found for:', { branch_name, branchCode });
          res.status(404).json({ success: false, message: 'Branch details not found' });
        }
      } else {
        // Employee not found
        res.status(404).json({ success: false, message: 'User not found' });
      }

      // Optionally, remove the OTP after successful verification
      delete otps[user_id];
    } else {
      // Invalid or expired OTP
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


