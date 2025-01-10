const crypto = require('crypto');
const userregister = require("../models/usermodel")
const nodemailer = require('nodemailer');
exports.AddNewEmployee1 =async (req,res)=>{
  try {
    const newSignupuser = new userregister(req.body);
    await newSignupuser.save();
    res.status(200).json({ message: 'Signup added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.Updatepaasowrd = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
    const updatedUser = await userregister.findOneAndUpdate(
      { phonenumber },
      { password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Branch name updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};exports.requestPasswordUpdate = async (req, res) => {
  try {
    const { phonenumber, email } = req.body;

    // Generate OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Save OTP and expiration time in the database
    await userregister.updateOne(
      { phonenumber },
      { otp, otpExpires: Date.now() + 15 * 60 * 1000 } // OTP expires in 15 minutes
    );

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'whitepayteam@gmail.com', // Replace with your email
        pass: 'sykxcvhditrvilzx', // Replace with your email app password
      },
    });

    const mailOptions = {
      from: '"Malabar Bank" <whitepayteam@gmail.com>', // Replace with your email
      to: email,
      subject: 'Your OTP Code',
      html: `
        <html>
          <head>
            <style>
              .container {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f4f4f4;
                border-radius: 5px;
                max-width: 600px;
                margin: auto;
              }
              .header {
                background-color: #007bff;
                color: white;
                padding: 10px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .footer {
                font-size: 12px;
                color: #777;
                text-align: center;
                padding: 10px;
                border-top: 1px solid #ddd;
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Malabar Bank</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Your OTP code is <span class="otp">${otp}</span>. It expires in 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Malabar Bank. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send OTP back in the response (only for specific use cases)
    res.status(200).json({ message: 'OTP sent to your email', otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.verifyOtpAndUpdatePassword = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;

    // Find user with the provided phone number
    const user = await userregister.findOne({ phonenumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the password
    const updatedUser = await userregister.findOneAndUpdate(
      { phonenumber },
      { password, otp: null, otpExpires: null }, // Clear OTP fields after update
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send email notification to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'whitepayteam@gmail.com', // Your email
        pass: 'sykxcvhditrvilzx',  // Your email password
      },
    });

    const mailOptions = {
      from: '"Malabar Bank" <whitepayteam@gmail.com>',
      to: updatedUser.email, // Send to the user's email
      subject: 'Password Updated Successfully',
      text: `Dear ${updatedUser.fullname},\n\nYour password has been updated successfully.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nYour Company Name`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password updated successfully, and email notification sent', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'whitepayteam@gmail.com', // Replace with your environment variable
    pass: 'sykxcvhditrvilzx', // Replace with your environment variable
  },
});

const sendLoginEmail = (email, fullname) => {
  const mailOptions = {
    from: '"Malabar Bank" <whitepayteam@gmail.com>', // Custom display name
    to: email,
    subject: 'Login Successful',
    html: `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #333;">Welcome Back, ${fullname}!</h1>
            <p style="color: #555;">We are pleased to inform you that you have successfully logged in to your account.</p>
            <p style="color: #555;">If you have any questions or need further assistance, please feel free to contact us.</p>
            <p style="color: #555;">Best regards,<br>Your Friendly Team</p>
          </div>
        </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

exports.userLogin = async (req, res) => {
  const { phonenumber, password } = req.body;
  console.log('User ID:', phonenumber);
  console.log('Password:', password);

  try {
    // Step 1: Fetch user details from AdminRegister collection
    const user = await userregister.findOne({ phonenumber, password });

    if (user) {
      // Step 2: Send email
      sendLoginEmail(user.email, user.fullname);

      // Step 3: Return admin details including branchCode and branchName
      res.json({
        success: true,
        message: `Login successful. Welcome back, ${user.fullname}! Your email is ${user.email}.`,
        user: {
          fullname: user.fullname,
          user_id: user.user_id,
          email: user.email,
          branchCode: user.branchCode,
          branchName: user.branchName,
          phonenumber: user.phonenumber,
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};