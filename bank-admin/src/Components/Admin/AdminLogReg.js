// import React, { useState, useEffect, useContext } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import  {UserContext}  from '../Others/UserContext'; 
// import logo  from '../style/logo.png'

// function AdminLogReg() {

//     const [activeTab, setActiveTab] = useState('login');
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [otp, setOtp] = useState('');
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const navigate = useNavigate();
//     const { setUser } = useContext(UserContext);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             setCurrentDate(new Date());
//         }, 1000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const handleTabClick = (tab) => {
//         if (tab === activeTab) {
//             return;
//         }
//         setActiveTab(tab);
//     };
//     const handleOtpChange = (e) => {
//         setOtp(e.target.value);
//     };
    
//     //branch selection  handler


//     // signup data 
//     const [signUpData, setSignUpData] = useState({
//         fullname: '',
//         user_id: '',
//         email: '',
//         password: '',
//         otp: '',
//     });

//     // Function to update form data when input changes
//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setSignUpData(prevData => ({
//             ...prevData,
//             [id]: value
//         }));
//     };
    
   
//     // Function to handle form submission
//     const handleSignUp = async () => {
//         if (signUpData.password !== signUpData.confirm_password) {
//             // Display error message or take appropriate action
//         return;
//         }
//         try {
//             const response = await axios.post('https://api.malabarbank.in/adminSignup', signUpData);
//             console.log(response.data.message);
//             console.log(signUpData);
//             setActiveTab('otp');
//         } catch (error) {
//             console.error('Error saving data:', error);
//             // Handle errors as needed
//             alert('Failed to add the signup data. Please try again.');
//         }
//     };

//     // Function to send the OTP to the backend
//     const handleOtpSubmit = async () => {
//         try {
//             const response = await axios.post('https://api.malabarbank.in/otp', { otp });
//             if (response.data.message === 'Signup added successfully') {
//                 // Handle successful OTP verification
//                 alert('OTP verified successfully.');
//                 <Link to='/admin'></Link>
//                 // Navigate to the next page or perform other actions
//             } else {
//                 // Handle unsuccessful OTP verification
//                 alert('Invalid OTP. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error verifying OTP:', error);
//             alert('An error occurred while verifying the OTP. Please try again.');
//         }
//     };

//     const handleReset = () => {
//         setSignUpData({
//             fullname: '',
//             user_id: '',
//             email: '',
//             password: '',
//             confirm_password: '',
//             otp: '',
//         });
//     };

//     //login code 
    
//     const [loginData, setLoginData] = useState({
//         user_id: '',
//         password: '',
//     });

//     // Function to update login form data when input changes
//     const handleLoginInputChange = (e) => {
//         const { id, value } = e.target;
//         setLoginData((prevData) => ({
//             ...prevData,
//             [id]: value,
//         }));
//     };
    
//     //demo
//     const handleLogin = async () => {
//         try {
//           const response = await axios.post('https://api.malabarbank.in/admin', {
//             user_id: loginData.user_id,
//             password: loginData.password,
//           });
    
//           if (response.data.success) {
//             const { admin } = response.data;
//             // Update the global state using setUserData
//             setUser({
//                 admin,
//             });
//             console.log(admin);
//             navigate(`/adminMain`);
//             alert('Admin Login successful!');
//           } else {
//             alert('Login failed. Please check your credentials.');
//           }
//         } catch (error) {
//           console.error('Error during login:', error);
//           alert('An unexpected error occurred. Please try again.');
//         }
//      };
//     return (
//         <div className="container-fluid px-0">

//             <nav className="navbar navbar-light ">
//                 <div className="container-fluid">
//                     <a className="navbar-brand ms-5 d-flex align-items-center" href="#">
//                         <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
//                         <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
//                     </a>
//                     <div className="d-flex" style={{ width: "600px" }}>
//                         <FontAwesomeIcon 
//                             icon={faHouse} 
//                             className=" me-5 mt-4" />
//                         <FontAwesomeIcon
//                             icon={faPowerOff}
//                             // onClick={handleLogout} 
//                             className="text-danger me-5 mt-4"
//                         />
//                         <div className="d-flex">
//                             <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
//                             <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
//                                 <li className="me-2">User</li>
//                                 <li>Date</li>
//                             </ul>
//                             <ul className="list-unstyled mb-1 me-5">
//                                 <li className="me-2">: Admin</li>

//                                 <li className="me-2">:{currentDate.toLocaleString()}</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//             <div className="marquee  px-5 m-2">
//                 <marquee className="text-white" behavior="scroll" direction="left">
//                     New Updates : Welcome to Malabar Bank....Have a nice day....
//                 </marquee>
//             </div>

//             <div className="container-fluid p-3 my-5 d-flex flex-column log-reg-box">
//                 <div className="d-flex flex-row justify-content-between mb-3">
//                     <button
//                         className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
//                         onClick={() => handleTabClick('login')}
//                     >
//                         Login
//                     </button>
//                     <button
//                         className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
//                         onClick={() => handleTabClick('register')}
//                     >
//                         Register
//                     </button>
//                 </div>

//                 <div>
//                     {activeTab === 'login' && (
//                         <div>
//                             <div className="d-grid justify-content-center align-items-center mb-0 ">
//                                 {" "}
//                                 {/* Added this div for alignment */}
//                                 {/* <img
//                                     src={"http://139.84.130.134:81/IMAGES/logo.png"}
//                                     alt="Logo"
//                                     className="rounded-circle ms-5"
//                                     width="90"
//                                 /> */}
//                                 <h3 className="mb-0 ">Admin Login</h3>
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="email" className="form-label">
//                                     User_ID
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="user_id"
//                                     value={loginData.user_id}
//                                     onChange={handleLoginInputChange}
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label htmlFor="password" className="form-label">
//                                     Password
//                                 </label>

//                                 <input
//                                     type="password" className="form-control"
//                                     id="password"
//                                     value={loginData.password}
//                                     onChange={handleLoginInputChange}
//                                 />
//                             </div>

//                             <div className="d-flex justify-content-between mx-4 mb-4">
//                                 <div className="form-check">
//                                     <input type="checkbox" className="form-check-input" id="rememberMe" />
//                                     <label className="form-check-label" htmlFor="rememberMe">
//                                         Remember me
//                                     </label>
//                                 </div>
//                                 <a href="#!">Forgot password?</a>
//                             </div>

//                             <button className="btn mb-4 w-100 btn-primary" onClick={handleLogin}>Log in</button>
//                             <p className="text-center">
//                                 Not a member? <a href="#!" onClick={() => handleTabClick('register')}>Register</a>
//                             </p>
//                         </div>
//                     )}

//                     {activeTab === 'register' && (
//                         <div>
//                             <div className="card-body text-black ">
//                                 <div className="d-flex align-items-center mb-0 ">
//                                     <h3 className="mb-0 ">Admin Registration</h3>
//                                 </div>
//                                 {/* Form inputs */}
//                                 <div className="row">
//                                     <div className="col-6 mt-3">
//                                         <label htmlFor="FullName" className="form-label">
//                                             {" "}
//                                             Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control "
//                                             id="fullname"
//                                             name="FullName"
//                                             value={signUpData.fullname}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter your full name"
//                                         />
//                                     </div>
//                                     <div className="col-6 mt-3">
//                                         <label htmlFor="FullName" className="form-label">

//                                             User Id
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control "
//                                             sty
//                                             id="user_id"
//                                             name="FullName"
//                                             value={signUpData.user_id}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter your full name"
//                                         />
//                                     </div>
//                                 </div>
//                                 {/* State and City dropdowns */}
                                
//                                 <div className="mb-3">
//                                     <label htmlFor="Email" className="form-label">
//                                         Email
//                                     </label>
//                                     <input
//                                         type="email"
//                                         className="form-control "
//                                         id="email"
//                                         name="Email"
//                                         value={signUpData.email}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your email Id"
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="Password" className="form-label">
//                                         Password
//                                     </label>
//                                     <div className='d-flex d-col'>
//                                         <input
//                                             type={passwordVisible ? "text" : "password"}
//                                             className="form-control"
//                                             id="password"
//                                             name="Password"
//                                             value={signUpData.password}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter your password"
//                                         />
//                                         <button
//                                             type="button"
//                                             className="btn btn-outline-secondary"
//                                             onClick={() => setPasswordVisible(!passwordVisible)}
//                                         >
//                                             {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="mb-3">
//                                     <label htmlFor="ConfirmPassword" className="form-label">
//                                         Confirm Password
//                                     </label>
//                                     <div className='d-flex d-col'>
//                                         <input
//                                             type={passwordVisible ? "text" : "password"}
//                                             className="form-control "
//                                             id="confirm_password"
//                                             name="ConfirmPassword"
//                                             value={signUpData.confirm_password}
//                                             onChange={handleInputChange}
//                                             placeholder="Confirm your password"
//                                         />
//                                         <button
//                                             type="button"
//                                             className="btn btn-outline-secondary"
//                                             onClick={() => setPasswordVisible(!passwordVisible)}
//                                         >
//                                             {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <p className="mt-2 ">
//                                     Already have an account?{" "}
//                                     <Link to="/" className="text-primary">
//                                         Click to Login
//                                     </Link>
//                                 </p>

//                                 <div className="d-flex justify-content-end pt-1">
//                                     <button
//                                         type="button"
//                                         className="btn btn-light  me-2"
//                                         onClick={handleReset}
//                                     >
//                                         Reset all
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="btn btn-warning "
//                                         onClick={handleSignUp}
//                                     >
//                                         Submit form
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'otp' && (
//                        <div>
//                        <label htmlFor="otp">OTP:</label>
//                        <input
//                            type="text"
//                            id="otp"
//                            value={otp}
//                            onChange={handleOtpChange}
//                            maxLength={6}
//                        />
//                        <button onClick={handleOtpSubmit}>Submit OTP</button>
//                    </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminLogReg

import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import  {UserContext}  from '../Others/UserContext'; 
import logo  from '../style/logo.png'
// import AdminLoginOtpVeri from './AdminLoginOtpVeri';
import AdminLoginOtpVeri from '../Admin/AdminLoginOtpVeri';



function AdminLogReg() {

    const [activeTab, setActiveTab] = useState('login');
    const[adminLoginOtpVeriOpen,setAdminLoginOtpVeriOpen]=useState(false)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [otp, setOtp] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [isOTPmodalOpen, setIsOTPmodalOpen] = useState(false); // Correct state definition
    const [isLoginOtpModalOpen, setIsLoginOtpModalOpen] = useState(false); // Correct state definition

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleTabClick = (tab) => {
        if (tab === activeTab) {
            return;
        }
        setActiveTab(tab);
    };
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };
    
    //branch selection  handler


    // signup data 
    const [signUpData, setSignUpData] = useState({
        fullname: '',
        user_id: '',
        email: '',
        password: '',
        otp: '',
    });

    // Function to update form data when input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSignUpData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };
    
   
    // Function to handle form submission
    const handleSignUp = async () => {
        if (signUpData.password !== signUpData.confirm_password) {
            // Display error message or take appropriate action
        return;
        }
        try {
            const response = await axios.post('http://localhost:2000/adminSignup', signUpData);
            console.log(response.data.message);
            console.log(signUpData);
            setActiveTab('otp');
            
        } catch (error) {
            console.error('Error saving data:', error);
            // Handle errors as needed
            alert('Failed to add the signup data. Please try again.');
        }
    };

    // Function to send the OTP to the backend
    const handleOtpSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:2000/otp', { otp });
            if (response.data.message === 'Signup added successfully') {
                // Handle successful OTP verification
                alert('OTP verified successfully.');
                <Link to='/admin'></Link>
                // Navigate to the next page or perform other actions
            } else {
                // Handle unsuccessful OTP verification
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred while verifying the OTP. Please try again.');
        }
    };

    const handleReset = () => {
        setSignUpData({
            fullname: '',
            user_id: '',
            email: '',
            password: '',
            confirm_password: '',
            otp: '',
        });
    };

    //login code 
    
    const [loginData, setLoginData] = useState({
        user_id: '',
        password: '',
    });

    // Function to update login form data when input changes
    const handleLoginInputChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    
    //demo
    const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:2000/admin', {
            user_id: loginData.user_id,
            password: loginData.password,
          });
    
        //   if (response.data.success) {
        //     const { admin } = response.data;
        //     // Update the global state using setUserData
        //     setUser({
        //         admin,
        //     });
        //     console.log(admin);
        //     navigate(`/adminMain`);
        //     alert('Admin Login successful!');
        if (response.data.success) {
            alert('Credentials matched. Verify email OTP.');

            setIsLoginOtpModalOpen(true);
            setAdminLoginOtpVeriOpen(true)
        } else {
            alert('Login failed. Please check your credentials.');
        }
         
        } catch (error) {
          console.error('Error during login:', error);
          alert('An unexpected error occurred. Please try again.');
        }
     };
    return (
        <div className="container-fluid px-0">

            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <a className="navbar-brand ms-5 d-flex align-items-center" href="#">
                        <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                    </a>
                    <div className="d-flex" style={{ width: "600px" }}>
                        <FontAwesomeIcon 
                            icon={faHouse} 
                            className=" me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            // onClick={handleLogout} 
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">User</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: Admin</li>

                                <li className="me-2">:{currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="marquee  px-5 m-2">
                <marquee className="text-white" behavior="scroll" direction="left">
                    New Updates : Welcome to Malabar Bank....Have a nice day....
                </marquee>
            </div>

            <div className="container-fluid p-3 my-5 d-flex flex-column log-reg-box">
                <div className="d-flex flex-row justify-content-between mb-3">
                    <button
                        className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleTabClick('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleTabClick('register')}
                    >
                        Register
                    </button>
                </div>

                <div>
                    {activeTab === 'login' && (
                        <div>
                            <div className="d-grid justify-content-center align-items-center mb-0 ">
                                {" "}
                                {/* Added this div for alignment */}
                                {/* <img
                                    src={"http://139.84.130.134:81/IMAGES/logo.png"}
                                    alt="Logo"
                                    className="rounded-circle ms-5"
                                    width="90"
                                /> */}
                                <h3 className="mb-0 ">Admin Login</h3>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">
                                    User_ID
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="user_id"
                                    value={loginData.user_id}
                                    onChange={handleLoginInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password" className="form-control"
                                    id="password"
                                    value={loginData.password}
                                    onChange={handleLoginInputChange}
                                />
                            </div>

                            <div className="d-flex justify-content-between mx-4 mb-4">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#!">Forgot password?</a>
                            </div>

                            <button className="btn mb-4 w-100 btn-primary" onClick={handleLogin}>Log in</button>
                            <p className="text-center">
                                Not a member? <a href="#!" onClick={() => handleTabClick('register')}>Register</a>
                            </p>
                        </div>
                    )}

                    {activeTab === 'register' && (
                        <div>
                            <div className="card-body text-black ">
                                <div className="d-flex align-items-center mb-0 ">
                                    <h3 className="mb-0 ">Admin Registration</h3>
                                </div>
                                {/* Form inputs */}
                                <div className="row">
                                    <div className="col-6 mt-3">
                                        <label htmlFor="FullName" className="form-label">
                                            {" "}
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            id="fullname"
                                            name="FullName"
                                            value={signUpData.fullname}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="col-6 mt-3">
                                        <label htmlFor="FullName" className="form-label">

                                            User Id
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            sty
                                            id="user_id"
                                            name="FullName"
                                            value={signUpData.user_id}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                                {/* State and City dropdowns */}
                                
                                <div className="mb-3">
                                    <label htmlFor="Email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control "
                                        id="email"
                                        name="Email"
                                        value={signUpData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email Id"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Password" className="form-label">
                                        Password
                                    </label>
                                    <div className='d-flex d-col'>
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            name="Password"
                                            value={signUpData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="ConfirmPassword" className="form-label">
                                        Confirm Password
                                    </label>
                                    <div className='d-flex d-col'>
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control "
                                            id="confirm_password"
                                            name="ConfirmPassword"
                                            value={signUpData.confirm_password}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-2 ">
                                    Already have an account?{" "}
                                    <Link to="/" className="text-primary">
                                        Click to Login
                                    </Link>
                                </p>

                                <div className="d-flex justify-content-end pt-1">
                                    <button
                                        type="button"
                                        className="btn btn-light  me-2"
                                        onClick={handleReset}
                                    >
                                        Reset all
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-warning "
                                        onClick={handleSignUp}
                                    >
                                        Submit form
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'otp' && (
                       <div>
                       <label htmlFor="otp">OTP:</label>
                       <input
                           type="text"
                           id="otp"
                           value={otp}
                           onChange={handleOtpChange}
                           maxLength={6}
                       />
                       <button onClick={handleOtpSubmit}>Submit OTP</button>
                   </div>
                    )}
                </div>
            </div>

            <AdminLoginOtpVeri
       isOpen={adminLoginOtpVeriOpen}
       onRequestClose={() => setAdminLoginOtpVeriOpen(false)}
       loginData={loginData}
      />
        </div>
    );
}

export default AdminLogReg

