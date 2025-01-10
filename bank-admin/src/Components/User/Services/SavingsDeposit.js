import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import numberToWords from 'number-to-words';
import { Modal, Button, Container, Form } from "react-bootstrap";
import Nav from '../../Others/Nav';
// import '../../style/SavingsDeposit.css';
import { UserContext } from "../../Others/UserContext";
import moment from 'moment';

const SavingsDeposit = () => {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleChangeDate = (event) => {
    const Date = moment(event.target.value).format('DD/MM/YYYY');
    setFormData({ ...formData, Date });
  };

  const [formData, setFormData] = useState({
    accountNumber: '',
    customerName: '',
    customerNumber: '',
    amount: '',
    depositwords: '',
    transactionId: '',
    branchUser: '',
    user:'',
    userDate:'',
    userTime: '',
    time:'',
    Date: '',
    balance:'',
    depositBill:'',
    branchCode: '',
    depositSavingsBill: '',
    depositTransactionId: '',
    total: 0,
    balanceAmount:'',
    printedStatus: false
  });

  

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  const loginBranchCode = user.branchDetails.branchCode;
  const loginBranchUser = user.employee.fullname
  // const loginUserTime = currentDate.toLocaleString()
   // const loginUserTime = currentDate.toLocaleString()
   const currentDate2 = new Date();

   const dateOptions = { 
     day: '2-digit', 
     month: '2-digit', 
     year: 'numeric' 
   };
   
   const timeOptions = { 
     hour: '2-digit', 
     minute: '2-digit', 
     second: '2-digit', 
     hour12: false // 24-hour format
   };
   
   const loginUserDate = currentDate2.toLocaleDateString('en-GB', dateOptions);
   const loginUserTime = currentDate2.toLocaleTimeString('en-GB', timeOptions);
   
  const newTime= getCurrentTime()
  console.log(newTime);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse the input value to an integer if it's not empty
    const parsedValue = value !== '' ? parseInt(value) : '';

    let updatedFormData = { ...formData, [name]: parsedValue };

    if (name === 'amount') {
      // Calculate amount in words if the parsed value is a valid number
      const amountInWords = parsedValue !== '' && !isNaN(parsedValue) ? numberToWords.toWords(parsedValue) : '';
      updatedFormData = { ...updatedFormData, depositwords: amountInWords };
    }
      // Calculate balanceAmount by adding newAmount to total, both converted to cents
      // const balanceAmountCents = (parseInt(formData.total.replace(/,/g, '')) * 100) + (parsedValue * 100);
      const balanceAmountCents = formData.total ? (parseInt(formData.total.replace(/,/g, '')) * 100) + (parsedValue * 100) : 0;

      updatedFormData.balanceAmount = balanceAmountCents / 100; // Convert back to dollars for display

    // setFormData(updatedFormData);
    const newSavingsBill = generatePayslipNumber();
    const newSavingsTransactionId = generateTransactionId();

    setFormData({
      ...formData,
      branchUser: loginBranchUser,
      userTime: loginUserTime,
      userDate: loginUserDate ,
      depositSavingsBill: newSavingsBill,
      depositTransactionId: newSavingsTransactionId,
      ...updatedFormData,
    })
  };

  

  //fetching 
  const [searchAccount, setSearchAccount] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {

    fetchACCData(branch,searchTerm);
  }, [branch,searchTerm]);


  const fetchACCData = async (branch, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/savings?&branch=${branch}&searchTerm=${searchTerm}`);
      console.log(response.data.data)
      //  // Initialize sum
      //  let totalSum = 0;

      //  // Iterate over response data to find the sum for the specific RDS number
      //  response.data.data.forEach(obj => {
      //   console.log('Processing account:', obj.accountNumber);
      //   console.log("search term",searchTerm)
      //    if (obj.accountNumber === searchTerm) { // Check if the RDSNumber matches the searchRDS
      //      let sum = parseFloat(obj.deposit); // Initialize sum with amount field
      //      console.log(`Initial amount for account ${searchTerm}: ${sum}`);

      //      obj.transferData.forEach(trans => {
      //        if (trans.newAmount) {
      //          sum += parseFloat(trans.newAmount);
      //          console.log(`Added ${trans.newAmount}, new sum: ${sum}`);
      //        }
      //        if (trans.withdrawalAmount) {
      //          sum -= parseFloat(trans.withdrawalAmount);
      //          console.log(`Subtracted ${trans.withdrawalAmount}, new sum: ${sum}`);
      //        }
      //      });
      //      totalSum += sum; // Add sum to totalSum for the specific RDSNumber
      //      console.log(`Total sum for account ${searchTerm}: ${totalSum}`);
      //    }
      //  });
       // Initialize sum
    let totalSum = 0;

    // Iterate over response data to find the sum for the specific account number
    response.data.data.forEach(obj => {
      console.log('Processing account:', obj.accountNumber);
      console.log("search term", searchTerm);
      if (obj.accountNumber === searchTerm) {
        // Initialize sum with deposit if it exists, otherwise start with 0
        let sum = obj.deposit ? parseFloat(obj.deposit) : 0;
        console.log(`Initial amount for account ${searchTerm}: ${sum}`);

        // Iterate over transferData to calculate sum
        obj.transferData.forEach(trans => {
          if (trans.newAmount) {
            sum += parseFloat(trans.newAmount);
            console.log(`Added ${trans.newAmount}, new sum: ${sum}`);
          }
          if (trans.withdrawalAmount) {
            sum -= parseFloat(trans.withdrawalAmount);
            console.log(`Subtracted ${trans.withdrawalAmount}, new sum: ${sum}`);
          }
        });

        totalSum += sum; // Add sum to totalSum for the specific account
        console.log(`Total sum for account ${searchTerm}: ${totalSum}`);
      }
    });
 
       // Set the total sum into state
       setFormData(prevState => ({
         ...prevState,
         total: totalSum.toFixed(2)
       }));
 
      setAccountNumbers(response.data.data);
    } catch (error) {
      console.error('Error fetching memberships data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleACCNumberSelect = (value) => {
    fetchData(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      accountNumber: value,
      branchUser: loginBranchUser,
      userTime: loginUserTime,
      userDate: loginUserDate ,
      branchCode: loginBranchCode,
      // newTime: newTime,
    }));
    setSearchAccount(value);
    setSearchTerm(value)
    setShowDropdown(false);
  };

  const fetchData = (mobile) => {
    const filteredCustomers = accountNumbers.filter(
      (customer) => customer.accountNumber === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSearchAccount(filteredCustomers[0].accountNumber);
      setSearchTerm(filteredCustomers[0].accountNumber);
    } else {
      setFormData(null);
    }
  };


  //generate transaction id

  function generateTransactionId(recipt) {
    // Retrieve the last used number for the branch code from local storage
    let lastNumber = localStorage.getItem(`lastNumber_${recipt}`);

    if (!lastNumber) {
      lastNumber = 1; // Start with 00000001
      localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
    } else {
      lastNumber = parseInt(lastNumber) + 1; // Increment by one
      localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
    }

    // Generate the ID with the format "MS" + lastNumber with padding
    return `T${lastNumber.toString().padStart(10, '0')}`;
  }
  const transactionID = generateTransactionId();
  console.log(transactionID)


  //payslip no: generation
  function generatePayslipNumber() {
    // Retrieve the last used number for the payslip from local storage
    let lastNumber = localStorage.getItem('lastPayslipNumber');

    if (!lastNumber) {
      lastNumber = 1; // Start with 0000001
      localStorage.setItem('lastPayslipNumber', lastNumber);
    } else {
      lastNumber = parseInt(lastNumber) + 1; // Increment by one
      localStorage.setItem('lastPayslipNumber', lastNumber);
    }

    // Generate the payslip number with the format "PS" + lastNumber with padding
    return `PS${lastNumber.toString().padStart(10, '0')}`;
  }
  const payslipNumber = generatePayslipNumber();
  console.log(payslipNumber);

  const handleReset = () => {
    setFormData({
      accountNumber: '',
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      customerNumber: '',
      amount: '',
      depositwords: '',
    });
    setSelectedPhoneNumber('');
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  // Log the current state of formData to check its values
  console.log("Current formData:", formData);

  try {
    const addDeposit = {
      _id: formData._id,
      newAmount: formData.amount,
      depositSavingsBill: formData.depositSavingsBill,
      depositTransactionId: formData.depositTransactionId,
      Type: 'Deposit',
      Date: formData.Date,
      User: formData.branchUser,
      userDate: formData.userDate,
      userTime: formData.userTime,
      branchCode: formData.branchCode,
      balanceAmount: formData.balanceAmount,
      printedStatus: false
    };

    console.log("Sending to backend:", addDeposit);

    const response = await axios.post(`https://api.malabarbank.in/api/savings/addDeposit`, addDeposit);
    console.log('Form data saved:', response.data);
    handleReset();
    alert('Deposit updated successfully!');
    window.location.reload();
  } catch (error) {
    console.error('Error updating deposit:', error);
    alert('Error updating deposit. Please try again.');
  }
};


return (
  <>
    <Nav />
    
    <div className="form-box">
      <h2>Savings Deposit Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Account No:</label>
            <Form.Control
              type="text"
              placeholder="Search..."
              style={{ width: "23.5rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)} // Show dropdown on focus
            />
            {showDropdown && searchTerm && (
              <ul className="dropdown-menu2">
                {accountNumbers
                  .filter((customer) =>
                    (customer.accountNumber && customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((customer, index) => (
                    <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleACCNumberSelect(customer.accountNumber); setShowDropdown(false); }}>
                      {customer.customerName} - {customer.accountNumber}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="form-field">
            <label>Customer Name:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Date:</label>
            <input
              type="date"
              className="form-control"
              id="Date"
              name="Date"
              value={moment(formData.Date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
              onChange={handleChangeDate}
              placeholder=""
              required
            />
          </div>
          <div className="form-field">
            <label>Mobile No:</label>
            <input
              type="text"
              name="customerNumber"
              value={formData.customerNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Deposit:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Deposit (In words):</label>
            <input
              type="text"
              name="depositwords"
              value={formData.depositwords}
              readOnly
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field col-12 col-md-6">
            <label>Balance:</label>
            <input
              type="number"
              name="amount"
              value={formData.total}
              onChange={handleChange}
              readOnly
            />
          </div>
          </div>
        <button type="submit">Submit</button>&nbsp; &nbsp;&nbsp;
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  </>
);
};

export default SavingsDeposit;
