// // import React, { useState, useEffect, useContext } from 'react';
// // import Select from 'react-select';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { UserContext } from "../../Others/UserContext";

// // const FdBondReq = () => {
// //   const [fdNumber, setFdNumber] = useState(null);
// //   const [customerName, setCustomerName] = useState('');
// //   const [mobileNumber, setMobileNumber] = useState('');
// //   const [fdAmount, setFdAmount] = useState('');
// //   const [fdBondPercentage, setFdBondPercentage] = useState('');
// //   const [bondTransferAmount, setBondTransferAmount] = useState('');
// //   const [recipientBankAccount, setRecipientBankAccount] = useState('');
// //   const [percentageOptions, setPercentageOptions] = useState([]); // For percentage dropdown
// //   const [image, setImage] = useState(null);
// //   const [fdOptions, setFdOptions] = useState([]);
// //   const { user, setUser } = useContext(UserContext);

// //   useEffect(() => {
// //     const fetchFdData = async () => {
// //       const branch= user?.branchDetails?.branchCode;

// //       try {
// //         const response = await fetch(`https://api.malabarbank.in/api/fdData?branch=${branch}`);
// //         const apiResponse  = await response.json();

// //          // Access the 'data' key of the response object
// //     const data = apiResponse.data;

// //         // const options = data.map(item => ({
// //         //   value: item.FDNumber,
// //         //   label: item.FDNumber
// //         // }));

// //         const options = data.map(item => ({
// //           value: item.FDNumber,
// //           label: `${item.FDNumber} - ${item.customerName}`, // Include customer name in label for better identification
// //           item: item // Store the entire item for later use
// //         }));

// //         setFdOptions(options);
// //         console.log(fdOptions,"fdOptions")
// //       } catch (error) {
// //         console.error('Error fetching FD data:', error);
// //       }
// //     };

// //     fetchFdData();
// //   }, []);

 
// //   useEffect(() => {
// //   const fetchBondPercentage = async () => {
// //     const branch = user?.branchDetails?.branchCode;

// //     try {
// //       const response = await fetch(`https://api.malabarbank.in/api/fdBondsByBranch?branchCode=${branch}`);
// //       const apiResponse = await response.json();

// //       const data = apiResponse.data;

// //       if (data && data.length > 0) {
// //         const options = data.map((item, index) => ({
// //           value: item.percentage,
// //           label: `${item.percentage}%`,
// //         }));

// //         setPercentageOptions(options);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching FD bond percentage:', error);
// //     }
// //   };

// //   fetchBondPercentage();
// // }, [user]);


// //   const handleFdNumberChange = (selectedOption) => {
// //     setFdNumber(selectedOption);
  
// //     // Directly access the item from the selected option
// //     const { customerName, customerNumber, amount } = selectedOption.item;
  
// //     setCustomerName(customerName);
// //     setMobileNumber(customerNumber); // Adjust based on actual property name for mobile number
// //     setFdAmount(amount);
// //   };

  
  
// //   useEffect(() => {
// //     if (fdAmount && fdBondPercentage) {
// //       calculateBondTransferAmount(fdAmount, fdBondPercentage.value);
// //     }
// //   }, [fdAmount, fdBondPercentage]);

// //   const handleBondPercentageChange = (selectedOption) => {
// //     setFdBondPercentage(selectedOption);
// //   };

// //   const calculateBondTransferAmount = (amount, percentage) => {
// //     if (!isNaN(amount) && !isNaN(percentage)) {
// //       const transferAmount = (amount * percentage) / 100;
// //       setBondTransferAmount(transferAmount.toFixed(2)); // Keep two decimal places
// //     } else {
// //       setBondTransferAmount('');
// //     }
// //   };
  

// //   const handleImageUpload = (e) => {
// //     setImage(e.target.files[0]);
// //   };

// //   const handleClear = () => {
// //     setFdNumber(null);
// //     setCustomerName('');
// //     setMobileNumber('');
// //     setFdAmount('');
// //     setFdBondPercentage('');
// //     setBondTransferAmount('');
// //     setRecipientBankAccount('');
// //     setImage(null);
// //   };


// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const formData = new FormData();

// //     if (fdNumber) formData.append('fdNumber', fdNumber.value);
// //     formData.append('customerName', customerName);
// //     formData.append('mobileNumber', mobileNumber);
// //     formData.append('fdAmount', fdAmount);
// //     if (fdBondPercentage) formData.append('bondPercentage', fdBondPercentage.value);
// //     formData.append('transferAmount', bondTransferAmount);
// //     formData.append('bankAccount', recipientBankAccount);
// //     if (image) formData.append('image', image);

// //     try {
// //       const response = await fetch('https://api.malabarbank.in/api/fdBondReq', {
// //         method: 'POST',
// //         body: formData
// //       });

// //       if (response.ok) {
// //         // Handle success
// //         alert('FD Bond request submitted successfully');
// //         handleClear();
// //       } else {
// //         // Handle errors
// //         alert('Failed to submit FD Bond request');
// //       }
// //     } catch (error) {
// //       console.error('Error submitting FD Bond request:', error);
// //     }
// //   };
// //   return (
// //     <div className="d-flex justify-content-center mt-5">
// //       <div className="card p-4 shadow-lg" style={{ width: '600px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
// //         <h4 className="text-center mb-4">FD Bond Request</h4>
// //         <form onSubmit={handleSubmit}>
// //           <div className="row">
// //             <div className="col-md-6">
// //               <div className="mb-3">
// //                 <label>FD Number</label>
// //                 <Select
// //                   value={fdNumber}
// //                   onChange={handleFdNumberChange}
// //                   options={fdOptions}
// //                   placeholder="Select FD Number"
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>Customer Name</label>
// //                 <input 
// //                   type="text" 
// //                   className="form-control" 
// //                   value={customerName} 
// //                   onChange={(e) => setCustomerName(e.target.value)} 
// //                   placeholder="Enter Customer Name" 
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>Mobile Number</label>
// //                 <input 
// //                   type="tel" 
// //                   className="form-control" 
// //                   value={mobileNumber} 
// //                   onChange={(e) => setMobileNumber(e.target.value)} 
// //                   placeholder="Enter Mobile Number" 
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>FD Amount</label>
// //                 <input 
// //                   type="number" 
// //                   className="form-control" 
// //                   value={fdAmount} 
// //                   onChange={(e) => setFdAmount(e.target.value)} 
// //                   placeholder="Enter FD Amount" 
// //                 />
// //               </div>
// //             </div>
// //             <div className="col-md-6">
// //               <div className="mb-3">
// //                 <label>FD Bond %</label>
// //                 <Select
// //                   value={fdBondPercentage}
// //                   onChange={(option) => setFdBondPercentage(option)}
// //                   options={percentageOptions}
// //                   placeholder="Enter FD Bond %" 
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>Bond Transfer Amount</label>
// //                 <input 
// //                   type="number" 
// //                   className="form-control" 
// //                   value={bondTransferAmount} 
// //                   onChange={(e) => setBondTransferAmount(e.target.value)} 
// //                   placeholder="Enter Bond Transfer Amount" 
// //                   readOnly
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>Upload Image</label>
// //                 <input 
// //                   type="file" 
// //                   className="form-control" 
// //                   onChange={handleImageUpload} 
// //                 />
// //               </div>
// //               <div className="mb-3">
// //                 <label>Recipient Bank Account</label>
// //                 <input 
// //                   type="text" 
// //                   className="form-control" 
// //                   value={recipientBankAccount} 
// //                   onChange={(e) => setRecipientBankAccount(e.target.value)} 
// //                   placeholder="Enter Recipient Bank Account" 
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="d-flex">
// //             <button type="submit" className="btn btn-primary w-50 me-2">Submit</button>
// //             <button type="button" className="btn btn-secondary w-50" onClick={handleClear}>Clear</button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );

// //   // return (
// //   //   <div className="d-flex justify-content-center mt-5">
// //   //     <div className="card p-4 shadow-lg" style={{ width: '600px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
// //   //       <h4 className="text-center mb-4">FD Bond Request</h4>
// //   //       <form onSubmit={handleSubmit}>
// //   //       <div className="col-md-6">
// //   //           <div className="mb-3">
// //   //             <label>FD Number</label>
// //   //             <Select
// //   //               value={fdNumber}
// //   //               onChange={handleFdNumberChange}
// //   //               options={fdOptions}
// //   //               placeholder="Select FD Number"
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>Customer Name</label>
// //   //             <input 
// //   //               type="text" 
// //   //               className="form-control" 
// //   //               value={customerName} 
// //   //               onChange={(e) => setCustomerName(e.target.value)} 
// //   //               placeholder="Enter Customer Name" 
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>Mobile Number</label>
// //   //             <input 
// //   //               type="tel" 
// //   //               className="form-control" 
// //   //               value={mobileNumber} 
// //   //               onChange={(e) => setMobileNumber(e.target.value)} 
// //   //               placeholder="Enter Mobile Number" 
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>FD Amount</label>
// //   //             <input 
// //   //               type="number" 
// //   //               className="form-control" 
// //   //               value={fdAmount} 
// //   //               onChange={(e) => setFdAmount(e.target.value)} 
// //   //               placeholder="Enter FD Amount" 
// //   //             />
// //   //           </div>
// //   //         </div>
// //   //         <div className="col-md-6">
// //   //           <div className="mb-3">
// //   //             <label>FD Bond %</label>
             
// //   //               <Select
// //   //                value={fdBondPercentage}
// //   //                onChange={(option) => setFdBondPercentage(option)}
// //   //                options={percentageOptions}
// //   //               placeholder="Enter FD Bond %" 
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>Bond Transfer Amount</label>
// //   //             <input 
// //   //               type="number" 
// //   //               className="form-control" 
// //   //               value={bondTransferAmount} 
// //   //               onChange={(e) => setBondTransferAmount(e.target.value)} 
// //   //               placeholder="Enter Bond Transfer Amount" 
// //   //               readOnly
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>Upload Image</label>
// //   //             <input 
// //   //               type="file" 
// //   //               className="form-control" 
// //   //               onChange={handleImageUpload} 
// //   //             />
// //   //           </div>
// //   //           <div className="mb-3">
// //   //             <label>Recipient Bank Account</label>
// //   //             <input 
// //   //               type="text" 
// //   //               className="form-control" 
// //   //               value={recipientBankAccount} 
// //   //               onChange={(e) => setRecipientBankAccount(e.target.value)} 
// //   //               placeholder="Enter Recipient Bank Account" 
// //   //             />
// //   //           </div>
// //   //         </div>
// //   //       </div>
// //   //       <div className="d-flex">
// //   //         <button  type="submit" className="btn btn-primary w-50 me-2">Submit</button>
// //   //         <button type="button" className="btn btn-secondary w-50" onClick={handleClear}>Clear</button>
// //   //       </div>
// //   //       </form>
// //   //     </div>
// //   //   </div>
// //   // );
// // };

// // export default FdBondReq;


// import React, { useState, useEffect, useContext } from 'react';
// import Select from 'react-select';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { UserContext } from "../../Others/UserContext";

// const FdBondReq = () => {
//   const [fdNumber, setFdNumber] = useState(null);
//   const [customerName, setCustomerName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [fdAmount, setFdAmount] = useState('');
//   const [fdBondPercentage, setFdBondPercentage] = useState(null); // Changed to null for consistency with Select
//   const [bondTransferAmount, setBondTransferAmount] = useState('');
//   const [recipientBankAccount, setRecipientBankAccount] = useState('');
//   const [percentageOptions, setPercentageOptions] = useState([]);
//   const [image, setImage] = useState(null);
//   const [fdOptions, setFdOptions] = useState([]);
//   const { user } = useContext(UserContext); // Assume setUser is not needed here

//   useEffect(() => {
//     const fetchFdData = async () => {
//       const branch = user?.branchDetails?.branchCode;

//       try {
//         const response = await fetch(`https://api.malabarbank.in/api/fdData?branch=${branch}`);
//         const apiResponse = await response.json();
//         const data = apiResponse.data;

//         const options = data.map(item => ({
//           value: item.FDNumber,
//           label: `${item.FDNumber} - ${item.customerName}`,
//           item: item
//         }));

//         setFdOptions(options);
//       } catch (error) {
//         console.error('Error fetching FD data:', error);
//       }
//     };

//     fetchFdData();
//   }, [user]);

//   useEffect(() => {
//     const fetchBondPercentage = async () => {
//       const branch = user?.branchDetails?.branchCode;

//       try {
//         const response = await fetch(`https://api.malabarbank.in/api/fdBondsByBranch?branchCode=${branch}`);
//         const apiResponse = await response.json();
//         const data = apiResponse.data;

//         if (data && data.length > 0) {
//           const options = data.map(item => ({
//             value: item.percentage,
//             label: `${item.percentage}%`,
//           }));

//           setPercentageOptions(options);
//         }
//       } catch (error) {
//         console.error('Error fetching FD bond percentage:', error);
//       }
//     };

//     fetchBondPercentage();
//   }, [user]);

//   const handleFdNumberChange = (selectedOption) => {
//     setFdNumber(selectedOption);
//     const { customerName, customerNumber, amount } = selectedOption.item;
//     setCustomerName(customerName);
//     setMobileNumber(customerNumber);
//     setFdAmount(amount);
//   };

//   const handleBondPercentageChange = (selectedOption) => {
//     setFdBondPercentage(selectedOption);
//   };

//   useEffect(() => {
//     if (fdAmount && fdBondPercentage) {
//       calculateBondTransferAmount(fdAmount, fdBondPercentage.value);
//     }
//   }, [fdAmount, fdBondPercentage]);

//   const calculateBondTransferAmount = (amount, percentage) => {
//     if (!isNaN(amount) && !isNaN(percentage)) {
//       const transferAmount = (amount * percentage) / 100;
//       setBondTransferAmount(transferAmount.toFixed(2));
//     } else {
//       setBondTransferAmount('');
//     }
//   };

//   const handleImageUpload = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleClear = () => {
//     setFdNumber(null);
//     setCustomerName('');
//     setMobileNumber('');
//     setFdAmount('');
//     setFdBondPercentage(null);
//     setBondTransferAmount('');
//     setRecipientBankAccount('');
//     setImage(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!fdBondPercentage || !bondTransferAmount || !recipientBankAccount) {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     // const formData = new FormData();
//     // if (fdNumber) formData.append('fdNumber', fdNumber.value);
//     // formData.append('customerName', customerName);
//     // formData.append('mobileNumber', mobileNumber);
//     // formData.append('fdAmount', fdAmount);
//     // formData.append('bondPercentage', fdBondPercentage.value);
//     // formData.append('transferAmount', bondTransferAmount);
//     // formData.append('bankAccount', recipientBankAccount);
//     // if (image) formData.append('image', image);
//     const formData = new FormData();
//     if (fdNumber) formData.append('fdNumber', fdNumber.value);
//     formData.append('customerName', customerName);
//     formData.append('mobileNumber', mobileNumber);
//     formData.append('fdAmount', fdAmount);
//     formData.append('fdBondPercentage', fdBondPercentage.value); // Corrected key
//     formData.append('bondTransferAmount', bondTransferAmount);   // Corrected key
//     formData.append('recipientBankAccount', recipientBankAccount); // Corrected key
//     if (image) formData.append('image', image);

//     try {
//       const response = await fetch('https://api.malabarbank.in/api/fdBondReq', {
//         method: 'POST',
//         body: formData
//       });

//       if (response.ok) {
//         alert('FD Bond request submitted successfully');
//         handleClear();
//       } else {
//         alert('Failed to submit FD Bond request');
//       }
//     } catch (error) {
//       console.error('Error submitting FD Bond request:', error);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center mt-5">
//       <div className="card p-4 shadow-lg" style={{ width: '600px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
//         <h4 className="text-center mb-4">FD Bond Request</h4>
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <label>FD Number</label>
//                 <Select
//                   value={fdNumber}
//                   onChange={handleFdNumberChange}
//                   options={fdOptions}
//                   placeholder="Select FD Number"
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>Customer Name</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   value={customerName} 
//                   onChange={(e) => setCustomerName(e.target.value)} 
//                   placeholder="Enter Customer Name" 
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>Mobile Number</label>
//                 <input 
//                   type="tel" 
//                   className="form-control" 
//                   value={mobileNumber} 
//                   onChange={(e) => setMobileNumber(e.target.value)} 
//                   placeholder="Enter Mobile Number" 
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>FD Amount</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   value={fdAmount} 
//                   onChange={(e) => setFdAmount(e.target.value)} 
//                   placeholder="Enter FD Amount" 
//                   readOnly
//                 />
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <label>FD Bond %</label>
//                 <Select
//                   value={fdBondPercentage}
//                   onChange={handleBondPercentageChange}
//                   options={percentageOptions}
//                   placeholder="Select FD Bond %"
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>Bond Transfer Amount</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   value={bondTransferAmount} 
//                   onChange={(e) => setBondTransferAmount(e.target.value)} 
//                   placeholder="Enter Bond Transfer Amount" 
//                   readOnly
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>Upload Image</label>
//                 <input 
//                   type="file" 
//                   className="form-control" 
//                   onChange={handleImageUpload} 
//                 />
//               </div>
//               <div className="mb-3">
//                 <label>Recipient Bank Account</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   value={recipientBankAccount} 
//                   onChange={(e) => setRecipientBankAccount(e.target.value)} 
//                   placeholder="Enter Recipient Bank Account" 
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="d-flex">
//             <button type="submit" className="btn btn-primary w-50 me-2">Submit</button>
//             <button type="button" className="btn btn-secondary w-50" onClick={handleClear}>Clear</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FdBondReq;







import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from "../../Others/UserContext";

const FdBondReq = () => {
  const [fdNumber, setFdNumber] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fdAmount, setFdAmount] = useState('');
  const [fdBondPercentage, setFdBondPercentage] = useState(null);
  const [bondTransferAmount, setBondTransferAmount] = useState('');
  const [recipientBankAccount, setRecipientBankAccount] = useState('');
  const [percentageOptions, setPercentageOptions] = useState([]);
  const [image, setImage] = useState(null);
  const [fdOptions, setFdOptions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFdData = async () => {
      const branch = user?.branchDetails?.branchCode;

      try {
        const response = await fetch(`https://api.malabarbank.in/api/fdData?branch=${branch}`);
        const apiResponse = await response.json();
        const data = apiResponse.data;

        const options = data.map(item => ({
          value: item.FDNumber,
          label: `${item.FDNumber} - ${item.customerName}`,
          item: item
        }));

        setFdOptions(options);
      } catch (error) {
        console.error('Error fetching FD data:', error);
      }
    };

    fetchFdData();
  }, [user]);

  useEffect(() => {
    const fetchBondPercentage = async () => {
      const branch = user?.branchDetails?.branchCode;

      try {
        const response = await fetch(`https://api.malabarbank.in/api/fdBondsByBranch?branchCode=${branch}`);
        const apiResponse = await response.json();
        const data = apiResponse.data;

        if (data && data.length > 0) {
          const options = data.map(item => ({
            value: item.percentage,
            label: `${item.percentage}%`,
          }));

          setPercentageOptions(options);
        }
      } catch (error) {
        console.error('Error fetching FD bond percentage:', error);
      }
    };

    fetchBondPercentage();
  }, [user]);

  const handleFdNumberChange = (selectedOption) => {
    setFdNumber(selectedOption);
    const { customerName, customerNumber, amount } = selectedOption.item;
    setCustomerName(customerName);
    setMobileNumber(customerNumber);
    setFdAmount(amount);
  };

  const handleBondPercentageChange = (selectedOption) => {
    setFdBondPercentage(selectedOption);
  };

  useEffect(() => {
    if (fdAmount && fdBondPercentage) {
      calculateBondTransferAmount(fdAmount, fdBondPercentage.value);
    }
  }, [fdAmount, fdBondPercentage]);

  const calculateBondTransferAmount = (amount, percentage) => {
    if (!isNaN(amount) && !isNaN(percentage)) {
      const transferAmount = (amount * percentage) / 100;
      setBondTransferAmount(transferAmount.toFixed(2));
    } else {
      setBondTransferAmount('');
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleClear = () => {
    setFdNumber(null);
    setCustomerName('');
    setMobileNumber('');
    setFdAmount('');
    setFdBondPercentage(null);
    setBondTransferAmount('');
    setRecipientBankAccount('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fdBondPercentage || !bondTransferAmount || !recipientBankAccount) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    const { branchCode, branch_name } = user?.branchDetails || {};
    const{fullname}=user?.employee ||{};

    if (fdNumber) formData.append('fdNumber', fdNumber.value);
    formData.append('customerName', customerName);
    formData.append('mobileNumber', mobileNumber);
    formData.append('fdAmount', fdAmount);
    formData.append('fdBondPercentage', fdBondPercentage.value);
    formData.append('bondTransferAmount', bondTransferAmount);
    formData.append('recipientBankAccount', recipientBankAccount);
    if (image) formData.append('image', image);
    formData.append('branchCode', branchCode);
    formData.append('branch_name', branch_name); 
    formData.append('branchUser', fullname);


    try {
      const response = await fetch('http://localhost:2000/api/fdBondReq', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('FD Bond request submitted successfully');
        handleClear();
      } else {
        alert('Failed to submit FD Bond request');
      }
    } catch (error) {
      console.error('Error submitting FD Bond request:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card p-4 shadow-lg" style={{ width: '600px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
        <h4 className="text-center mb-4">FD Bond Request</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label>FD Number</label>
                <Select
                  value={fdNumber}
                  onChange={handleFdNumberChange}
                  options={fdOptions}
                  placeholder="Select FD Number"
                />
              </div>
              <div className="mb-3">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="Enter Customer Name" 
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>Mobile Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={mobileNumber} 
                  onChange={(e) => setMobileNumber(e.target.value)} 
                  placeholder="Enter Mobile Number" 
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>FD Amount</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={fdAmount} 
                  onChange={(e) => setFdAmount(e.target.value)} 
                  placeholder="Enter FD Amount" 
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label>FD Bond %</label>
                <Select
                  value={fdBondPercentage}
                  onChange={handleBondPercentageChange}
                  options={percentageOptions}
                  placeholder="Select FD Bond %"
                />
              </div>
              <div className="mb-3">
                <label>Bond Transfer Amount</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={bondTransferAmount} 
                  onChange={(e) => setBondTransferAmount(e.target.value)} 
                  placeholder="Enter Bond Transfer Amount" 
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>Upload Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleImageUpload} 
                />
              </div>
              <div className="mb-3">
                <label>Recipient Bank Account</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={recipientBankAccount} 
                  onChange={(e) => setRecipientBankAccount(e.target.value)} 
                  placeholder="Enter Recipient Bank Account" 
                  required
                />
              </div>
            </div>
          </div>
          <div className="d-flex">
            <button type="submit" className="btn btn-primary w-50 me-2">Submit</button>
            <button type="button" className="btn btn-secondary w-50" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FdBondReq;
