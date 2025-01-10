const AdminRegister = require("../models/adminRegister");
const nodemailer = require('nodemailer');


// const adminLogin = async (req, res) => {
//   const { user_id, password } = req.body;
//   console.log('User ID:', user_id);
//   console.log('Password:', password);

//   try {
//     // Fetch user details from AdminRegister collection
//     const admin = await AdminRegister.findOne({ user_id, password });
//     if (admin) {
//       res.json({ success: true, admin });
//     } else {
//       res.status(401).json({ success: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// };


let otps = {};


exports.adminLogin = async (req, res) => {
  const { user_id, password } = req.body;
  console.log('User ID:', user_id);
  console.log('Password:', password);

  try {
    // Fetch admin details from AdminRegister collection
    const admin = await AdminRegister.findOne({ user_id, password });

    if (admin) {
      const { email } = admin;

      // Generate and send OTP to admin's email
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      const expires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
      console.log(otp,"otp");

      // Store the OTP in the otps object
      otps[user_id] = { otp, expires };

      // Configure your email transport
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sovin1994@gmail.com', // Your email
          pass: 'koqgqkcpnoitdnmu',  // Your email password
        },
      });

      // Send email
      await transporter.sendMail({
        from: 'sovin1994@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code for Login is ${otp}`,
      });

      res.json({ success: true, message: 'OTP sent to email', admin });
    } else {
      console.log('Credentials do not match');
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


exports.verifyAdminOtp = async (req, res) => {
  const { otp, user_id } = req.body;
  console.log(req.body, "req.body");
  console.log(otp, "otp");

  try {
    // Retrieve the stored OTP info using user_id as the key
    const storedOtpInfo = otps[user_id];

    console.log(storedOtpInfo, "storedOtpInfo");
    console.log(storedOtpInfo.otp, "storedOtpInfo.otp");

    if (storedOtpInfo && storedOtpInfo.otp === otp && storedOtpInfo.expires > Date.now()) {
      // OTP is valid and not expired
      const admin = await AdminRegister.findOne({ user_id });

      if (admin) {
        res.status(200).json({ message: 'OTP Verified successfully', admin });
      } else {
        res.json({ success: false, message: 'Admin not found' });
      }

      // Optionally, remove the OTP from memory after successful verification
      delete otps[user_id];
    } else {
      res.json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



// module.exports = { adminLogin };
