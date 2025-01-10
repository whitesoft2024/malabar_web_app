// import React,{useState} from 'react'
// import axios from 'axios';
// import Modal from 'react-modal';

// const OTPVerificationModal = ({ isOpen, onRequestClose, signUpData }) => {
//     const [otp, setOtp] = useState('');
  
//     const handleVerifyOTP = async () => {
//       try {

//         const updatedSignUpData = { ...signUpData, otp }; // Include OTP in signUpData
//         const response = await axios.post('https://api.malabarbank.in/addsign/verify-otp',  updatedSignUpData );
//         console.log(response.data.message);
//         alert('OTP verified successfully. Signup completed.');
//         onRequestClose();
//       } catch (error) {
//         console.error('Error verifying OTP:', error);
//         alert('Invalid or expired OTP. Please try again.');
//       }
//     };
  
//     return (
//       <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
//         <h2>Verify OTP</h2>
//         <input
//           type="text"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//         />
//         <button onClick={handleVerifyOTP}>Verify OTP</button>
//       </Modal>
//     );
//   };

// export default OTPVerificationModal

import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const OTPVerificationModal = ({ isOpen, onRequestClose, signUpData }) => {
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    try {
        console.log(signUpData.email,"xxx")
      const updatedSignUpData = { ...signUpData, otp }; // Include OTP in signUpData
      const response = await axios.post('https://api.malabarbank.in/addsign/verify-otp', updatedSignUpData);
      console.log(response.data.message);
      alert('OTP verified successfully. Signup completed.');
      onRequestClose();
      window.location.href = "/";

    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      style={{
        content: {
          width: '500px',
          height: '200px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <div className="modal-content border-0">
        <div className="modal-header">
          <h5 className="modal-title">Verify OTP</h5>
          <button type="button" className="close" onClick={onRequestClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body d-flex flex-column align-items-center">
          <div className="form-group w-100 mb-3">
            {/* <label htmlFor="otpInput">Enter OTP</label> */}
            <input
              type="text"
              id="otpInput"
              className="form-control mt-3 "
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-between w-100 mt-2">
          <button type="button" className="btn btn-secondary ms-2" onClick={onRequestClose}>Close</button>
          <button type="button" className="btn btn-primary ms-2" onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      </div>
    </Modal>
  );
};

export default OTPVerificationModal;
