import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form, Modal, Container, Table } from "react-bootstrap";
import numberToWords from "number-to-words";
import Nav from "../../Others/Nav";
import "../../style/SavingsDeposit.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPrint,
  faArrowLeft,
  faArrowRight,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserContext } from "../../Others/UserContext";
import Select from "react-select";
import moment from "moment";

const SavingsWithdrawal = () => {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedAccNumber, setSelectedAccNumber] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // const [currentDate, setCurrentDate] = useState(new Date());

  const [query, setQuery] = useState("");
  const { user } = useContext(UserContext);
  const loginBranchCode = user.branchDetails.branchCode;
  const loginBranchUser = user.employee.fullname;
  // const loginUserTime = currentDate.toLocaleString()
  const currentDate = new Date();

  const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  };

  const loginUserDate = currentDate.toLocaleDateString("en-GB", dateOptions);
  const loginUserTime = currentDate.toLocaleTimeString("en-GB", timeOptions);

  console.log("Date: ", loginUserDate); // e.g., "Date: 20/05/2024"
  console.log("Time: ", loginUserTime); // e.g., "Time: 14:24:36"
  const handleChangeDate = (event) => {
    const Date = moment(event.target.value).format("DD/MM/YYYY");
    setFormData({ ...formData, Date });
  };
  const [formData, setFormData] = useState({
    accountNumber: "",
    customerName: "",
    date: new Date().toISOString().split("T")[0], // Set initial date as current date
    customerNumber: "",
    amount: "",
    depositwords: "",
    paymentMode: "",
    transactionID: "",
    payslipNumber: "",
    userDate: "",
    userTime: "",
    accountBranchName: "",
    withdrawSavingsBill: "",
    withdrawTransactionId: "",
    withdrawalAmount: "",
    total: 0,
    balanceAmount: "",
    printedStatus: false
  });

  // useEffect(() => {
  //   // Fetch account numbers when query changes
  //   if (query) {
  //     fetchPhoneNumbers();
  //   } else {
  //     setAccountNumbers([]);
  //   }
  // }, [query]);

  // useEffect(() => {
  //   if (query !== '') {
  //     fetchPhoneNumbers();
  //   } else {
  //     setAccountNumbers([]);
  //   }
  // }, [query]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   let updatedFormData = { ...formData, [name]: value };

  //   if (name === 'amount') {
  //     const amountInWords = numberToWords.toWords(parseInt(value));
  //     updatedFormData = { ...updatedFormData, depositwords: amountInWords };
  //   }

  //   setFormData(updatedFormData);
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse the input value to an integer if it's not empty
    const parsedValue = value !== "" ? parseInt(value) : "";

    let updatedFormData = { ...formData, [name]: parsedValue };

    if (name === "amount") {
      // Calculate amount in words if the parsed value is a valid number
      const amountInWords =
        parsedValue !== "" && !isNaN(parsedValue)
          ? numberToWords.toWords(parsedValue)
          : "";
      updatedFormData = { ...updatedFormData, depositwords: amountInWords };
    }
    const balanceAmountCents = formData.total
      ? parseInt(formData.total.replace(/,/g, "")) * 100 - parsedValue * 100
      : 0;

    updatedFormData.balanceAmount = balanceAmountCents / 100; // Convert back to dollars for display

    setFormData(updatedFormData);
    const newSavingsBill = generatePayslipNumber();
    const newSavingsTransactionId = generateTransactionId();

    setFormData({
      ...formData,
      depositSavingsBill: newSavingsBill,
      depositTransactionId: newSavingsTransactionId,
      ...updatedFormData,
    });
  };

  
  const [searchAccount, setSearchAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {
    fetchACCData(branch, searchTerm);
  }, [branch, searchTerm]);

  const fetchACCData = async (branch, searchTerm = "") => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.malabarbank.in/api/savings?&branch=${branch}&searchTerm=${searchTerm}`
      );
      // Initialize sum
      let totalSum = 0;

      // Iterate over response data to find the sum for the specific RDS number
      response.data.data.forEach((obj) => {
        console.log("Processing account:", obj.accountNumber);
        console.log("search term", searchTerm);
        if (obj.accountNumber === searchTerm) {
          // Check if the RDSNumber matches the searchRDS
          let sum = parseFloat(obj.deposit); // Initialize sum with amount field
          console.log(`Initial amount for account ${searchTerm}: ${sum}`);

          obj.transferData.forEach((trans) => {
            if (trans.newAmount) {
              sum += parseFloat(trans.newAmount);
              console.log(`Added ${trans.newAmount}, new sum: ${sum}`);
            }
            if (trans.withdrawalAmount) {
              sum -= parseFloat(trans.withdrawalAmount);
              console.log(
                `Subtracted ${trans.withdrawalAmount}, new sum: ${sum}`
              );
            }
          });
          totalSum += sum; // Add sum to totalSum for the specific RDSNumber
          console.log(`Total sum for account ${searchTerm}: ${totalSum}`);
        }
      });

      // Set the total sum into state
      setFormData((prevState) => ({
        ...prevState,
        total: totalSum.toFixed(2),
      }));
      setAccountNumbers(response.data.data);
    } catch (error) {
      console.error("Error fetching memberships data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleACCNumberSelect = (value) => {
    fetchData(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      accountNumber: value,
      branchUser: loginBranchUser,
      userDate: loginUserDate,
      userTime: loginUserTime,
      branchCode: loginBranchCode,
    }));
    setSearchAccount(value);
    setSearchTerm(value);
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

  const handlePhoneNumberSelection = (option) => {
    setSelectedAccNumber(option);
    console.log("selected ph no:", selectedAccNumber);
    fetchMemberDetails(option.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      accountNumber: option.value, // Update the phone number field
    }));
    setQuery(option.value);
    setAccountNumbers([]);
  };

  const fetchMemberDetails = async (accountNumber) => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/accfetchMemberDetails?accountNumber=${accountNumber}`
      );
      const memberData = response.data;
      if (memberData) {
        setFormData({
          ...memberData,
          date: new Date().toISOString().split("T")[0], // Set date as current date
          amount: "", // Clear amount field
          depositwords: "", // Clear deposit words field
          transactionID: "",
        });
      } else {
        console.log("No member details found for RDS number:", accountNumber);
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  //generate Transaction Id
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
    return `W${lastNumber.toString().padStart(10, "0")}`;
  }
  const transactionID = generateTransactionId();
  console.log(transactionID);

  // generate paySlip
  function generatePayslipNumber() {
    // Retrieve the last used number for the payslip from local storage
    let lastNumber = localStorage.getItem("lastPayslipNumber");

    if (!lastNumber) {
      lastNumber = 1; // Start with 0000001
      localStorage.setItem("lastPayslipNumber", lastNumber);
    } else {
      lastNumber = parseInt(lastNumber) + 1; // Increment by one
      localStorage.setItem("lastPayslipNumber", lastNumber);
    }

    // Generate the payslip number with the format "PS" + lastNumber with padding
    return `PS${lastNumber.toString().padStart(10, "0")}`;
  }
  const payslipNumber = generatePayslipNumber();
  console.log(payslipNumber);

  // const handlePhoneNumberSelection = async (accountNumber) => {
  //   setSelectedPhoneNumber(accountNumber);
  //   fetchMemberDetails(accountNumber);
  //   // setQuery(accountNumber);
  //   setQuery("")
  //   setAccountNumbers([]);
  // };

  const handleReset = () => {
    setFormData({
      accountNumber: "",
      customerName: "",
      date: new Date().toISOString().split("T")[0],
      customerNumber: "",
      amount: "",
      depositwords: "",
    });
    setSelectedPhoneNumber("");
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { accountNumber, amount } = formData;
  //   const transactionID = generateTransactionId(accountNumber);

  //   // Generate payslip number
  //   const payslipNumber = generatePayslipNumber();
  //   try {
  //     // Send withdrawal request
  //     const withdrawalResponse = await axios.put(`https://api.malabarbank.in/api/savings/withdraw/${accountNumber}`, { amount });
  //     console.log('Withdrawal response:', withdrawalResponse.data);

  //     // Save withdrawal history
  //     const historyResponse = await axios.post('https://api.malabarbank.in/api/SavingsHistory', {

  //       accountNumber,
  //       action: 'withdraw',
  //       amount,
  //       updatedAt: formData.date,
  //       customerName:formData.customerName,
  //       customerNumber:formData.customerNumber,
  //       transactionID,
  //       payslipNumber,
  //     });
  //     console.log('Withdrawal history saved:', historyResponse.data);

  //     // Clear form fields
  //     handleReset();
  //     alert('Withdrawal successful!');
  //   } catch (error) {
  //     console.error('Error withdrawing:', error.response.data);
  //     alert('Error withdrawing. Please try again.');
  //   }
  // };

  const [alertMsg, setAlertMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Log the current state of formData to check its values
    console.log("Current formData:", formData);

    const withdrawalAmount = parseFloat(formData.amount);
    const totalAmount = parseFloat(formData.total);
    if (totalAmount - withdrawalAmount < 0) {
      setAlertMsg('Insufficient amount. Withdrawal not allowed.');
      setTimeout(() => {
        setAlertMsg('');
      }, 3000);
      return;
    }
    try {
      const addWithdraw = {
        _id: formData._id,
        withdrawalAmount: formData.amount,
        withdrawSavingsBill: payslipNumber,
        withdrawTransactionId: transactionID,
        Type: "Withdraw",
        Date: formData.Date,
        User: formData.branchUser,
        userDate: loginUserDate,
        userTime: loginUserTime,
        branchCode: formData.branchCode,
        newTime: formData.newTime,
        balanceAmount: formData.balanceAmount,
        printedStatus: false
      };

      console.log("Sending to backend:", addWithdraw);

      const response = await axios.post(
        `https://api.malabarbank.in/api/savings/addDeposit`,
        addWithdraw
      );
      console.log("Form data saved:", response.data);
      handleReset();
      alert("Withdraw updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating withdraw:", error);
      alert("Error updating withdraw. Please try again.");
    }
  };

  const [newSavingsdata, setNewSavingsdata] = useState([]);
  const [searchReceipt, setSearchReceipt] = useState("");

  // const branch = user?.branchDetails?.branchCode;
  useEffect(() => {
    fetchSavingsData(branch, searchReceipt);
  }, [branch, searchReceipt]);

  const fetchSavingsData = async (branch, searchReceipt = "") => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/api/SavingsHistory`
      );
      const savingsData = response.data.data.filter(
        (item) => item.action === "withdraw"
      );
      setNewSavingsdata(savingsData);
    } catch (error) {
      console.error("Error fetching savings data:", error);
    }
  };

  const [receiptData, setReceiptData] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const handleMobileSelect = (value) => {
    fetchReceiptData(value);
    setSearchReceipt("");
  };
  const fetchReceiptData = (name) => {
    const filteredCustomers = newSavingsdata.filter(
      (customer) => customer.customerName === name
    );
    if (filteredCustomers.length > 0) {
      setReceiptData(filteredCustomers[0]);
    } else {
      setReceiptData(null);
    }
  };

  return (
    <>
      <Nav />
      <div className="form-box">
        <h2>Savings Withdrawal Form</h2>
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
                    .filter(
                      (customer) =>
                        customer.accountNumber &&
                        customer.accountNumber
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((customer, index) => (
                      <li
                        key={index}
                        className="dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleACCNumberSelect(customer.accountNumber);
                          setShowDropdown(false);
                        }}
                      >
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
                name="date"
                value={moment(formData.Date, "DD/MM/YYYY").format("YYYY-MM-DD")}
                onChange={handleChangeDate}
                required
              />
            </div>
            <div className="form-field">
              <label>Phone No:</label>
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
              <label>Amount:</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Amount (In words):</label>
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
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </form>
        {alertMsg && (
          <div className="alert alert-success" role="alert">
            {alertMsg}
          </div>
        )}
      </div>
    </>
  );
};

export default SavingsWithdrawal;
