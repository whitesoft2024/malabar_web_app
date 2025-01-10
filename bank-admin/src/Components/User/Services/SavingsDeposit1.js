import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import numberToWords from 'number-to-words';
import { Modal, Button, Container, Form } from "react-bootstrap";
import Nav from '../../Others/Nav';
import '../../style/SavingsDeposit.css';
import { UserContext } from "../../Others/UserContext";
import moment from 'moment';

const SavingsDeposit = () => {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState('');
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
    branchUser:'',
    userTime:'',
    branchCode:'',
  });
  const loginBranchCode = user.branchDetails.branchCode;
  const loginBranchUser = user.employee.fullname
  const loginUserTime = currentDate.toLocaleString()
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'amount') {
      const amountInWords = numberToWords.toWords(parseInt(value));
      updatedFormData = { ...updatedFormData, depositwords: amountInWords };
    }

    setFormData(updatedFormData);
  };

  //fetching 
  const [searchAccount, setSearchAccount] = useState('')
  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {

    fetchACCData(branch);
  }, [branch]);

  const fetchACCData = async (branch, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/savings?page=1&limit=10000000&branch=${branch}&searchSavings=${searchTerm}`);
      setAccountNumbers(response.data.data);
    } catch (error) {
      console.error('Error fetching memberships data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // const fetchACCData = async (branch, searchTerm = '') => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`https://api.malabarbank.in/api/savings?&branch=${branch}&searchTerm=${searchTerm}`);
  //     setAccountNumbers(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching memberships data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleACCNumberSelect = (value) => {
    fetchData(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      accountNumber: value,
      branchUser: loginBranchUser,
      userTime: loginUserTime,
      branchCode:loginBranchCode,
    }));
    setSearchAccount(value);
    setShowDropdown(false);
  };

  const fetchData = (mobile) => {
    const filteredCustomers = accountNumbers.filter(
      (customer) => customer.accountNumber === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSearchAccount(filteredCustomers[0].accountNumber);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { accountNumber, amount,branchUser,userTime,branchCode, } = formData;
    const transactionID = generateTransactionId(accountNumber);

    // Generate payslip number
    const payslipNumber = generatePayslipNumber();
    try {

      const historyResponse = await axios.post('https://api.malabarbank.in/api/SavingsHistory', {
        accountNumber,
        branchUser,
        userTime,
        branchCode,
        action: 'deposit',
        amount,
        updatedAt: formData.Date,
        customerName: formData.customerName,
        customerNumber: formData.customerNumber,
        transactionID,
        payslipNumber,
      });
      console.log('Transaction history saved:', historyResponse.data);


      // Update the deposit
      const response = await axios.put(`https://api.malabarbank.in/api/savings/addDeposit/${accountNumber}`, { deposit: amount });
      console.log('Deposit updated:', response.data);

      // Save the transaction history

      // Clear form fields
      handleReset();
      alert('Deposit updated successfully!');
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
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
              />
              {showDropdown && searchAccount && (
                <ul className="dropdown-menu2">
                  {accountNumbers
                    .filter((customer) =>
                      (customer.accountNumber && customer.accountNumber.toLowerCase().includes(searchAccount.toLowerCase()))
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
          <button type="submit">Submit</button>&nbsp; &nbsp;&nbsp;
          <button type="button" onClick={handleReset}>Reset</button>
        </form>
      </div>
    </>
  );
};

export default SavingsDeposit;
