import React, { useState,useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import  {UserContext}  from './Others/UserContext'; 


const LoginOtpVeriModal = ({ isOpen, onRequestClose, loginData }) => {
  const { user, setUser } = useContext(UserContext);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // const handleVerifyOTP = async () => {
  //   try {
  //       console.log(loginData,"xxx")
  //     const updatedSignUpData = { ...loginData, otp }; // Include OTP in signUpData
  //     const response = await axios.post('https://api.malabarbank.in/auth/verify-otp', updatedSignUpData);
  //     console.log(response.data.message);
  //     alert('response.data.message');
  //     onRequestClose();
  //     navigate(`/main`);

  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     alert('Invalid or expired OTP. Please try again.');
  //   }
  // };
  const handleVerifyOTP = async () => {
  try {
    console.log(loginData, "xxx");
    const updatedSignUpData = { ...loginData, otp }; // Include OTP in signUpData
    const response = await axios.post('https://api.malabarbank.in/auth/verify-otp', updatedSignUpData);
    const responseData = response.data;
    if (response.status===200) {
      // Assuming the response contains a 'success' field indicating the result
      console.log(response.data.message);
      console.log(response.data,"res data");
      console.log(response,"res");

     
      // setUser({
      //   _id: responseData.employee._id,
      //   fullname: responseData.employee.fullname,
      //   user_id: responseData.employee.user_id,
      //   branch_name: responseData.employee.branch_name,
      //   branchCode: responseData.employee.branchCode,
      //   designation: responseData.employee.designation,
      //   email: responseData.employee.email,
      //   password: responseData.employee.password,
      //   bankName: responseData.branchDetails.bankName,
      //   ifseCode: responseData.branchDetails.ifseCode,
      //   state: responseData.branchDetails.state,
      //   address: responseData.branchDetails.address,
      //   phoneNumber: responseData.branchDetails.phoneNumber,
      //   landLine: responseData.branchDetails.landLine,
      // });
      setUser(responseData)
      console.log(user,"user7")
      alert(response.data.message);
      // Consuming user data
// console.log(user.id, user.name,"rejnung");
      onRequestClose();
      
      navigate('/main');
    } else {
      alert(response.data.message || 'OTP verification failed. Please try again.');
    }
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

export default LoginOtpVeriModal;
