import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../style/Rd.css";
import axios from "axios";
import Nav from "../Others/Nav";
import { UserContext } from "../Others/UserContext";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";

const Rds = () => {
  // current Date and Time
  const [branchCode, setBranchCode] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [newRDSdata, setNewRDSdata] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(UserContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (rdsData) => {
    setSelectedRow(rdsData);

  }

  //Edit modal
  const handleCloseModal = () => {
    setSelectedRow(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveChanges = () => {
    // Send a PUT or PATCH request to update the data in the database
    fetch(`http://localhost:2000/api/membership/${selectedRow._id}`, {
      method: 'PUT', // or 'PATCH' if partial update is supported
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Optionally, update the local state with the updated data
        // setMemberships([...memberships.filter(m => m._id !== selectedRow._id), data]);
        handleCloseModal(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/employee');
      const data = await response.json();

      const branchCode = user?.branchDetails?.branchCode;
      if (branchCode) {

        const filteredEmployees = data.filter(employee => employee.branchCode === branchCode);
        setEmployees(filteredEmployees);
      } else {
        setEmployees(data);
      }
      // console.log(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const [formData, setFormData] = useState({
    RDSNumber: '',
    customerName: '',
    customerNumber: '',
    accountType: '',
    amount: '',
    membershipId: '',
    date: '',
    referenceName: '',
    address: '',
    rdsBill: '',
    branchcode: '',
  });

  console.log(branchCode)

  const [accountTypeCounts, setAccountTypeCounts] = useState({});

  const updateRDSNumber = (branchCode) => {
    let accountType = formData.accountType || "RDS";

    if (!accountTypeCounts[accountType]) {
      setAccountTypeCounts(prevCounts => ({
        ...prevCounts,
        [accountType]: 1,
      }));
    } else {
      setAccountTypeCounts(prevCounts => ({
        ...prevCounts,
        [accountType]: prevCounts[accountType] + 1,
      }));
    }

    const newNumber = accountTypeCounts[accountType] || 1;
    const newRDSNumber = `${accountType}${branchCode}${newNumber.toString().padStart(5, '0')}`;
    console.log(newRDSNumber);
    setFormData(prevFormData => ({
      ...prevFormData,
      RDSNumber: newRDSNumber,
      accountType: formData.accountType,
    }));
    console.log("Updated RDNumber:", newRDSNumber);
  };
  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    if (formData.accountType && branchCode) {
      updateRDSNumber(branchCode);
    }
  }, [formData.accountType, branchCode]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      date: currentDate.toLocaleString(),
    });
  };


  const [showModal, setShowModal] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  // fetch by mobile

  const [query, setQuery] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

  useEffect(() => {
    if (query) {
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(`http://localhost:2000/searchPhoneNumbers?query=${query}`);
          setPhoneNumbers(response.data);
          // console.log(response.data);
          console.log(query);
          console.log(phoneNumbers);
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchPhoneNumbers();
    } else {
      setPhoneNumbers([]);
    }
  }, [query]);

  const handlePhoneNumberSelection = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    fetchMemberDetails(phoneNumber);
    setFormData(prevFormData => ({
      ...prevFormData,
      customerNumber: phoneNumber
    }));
    setQuery(phoneNumber);
    setPhoneNumbers([]);
  };

  // Handle change for the referenceName dropdown
  const handleReferenceNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      referenceName: value,
    });
  };


  // fetch mobile number to find member details
  const fetchMemberDetails = async (phoneNumber) => {
    try {
      const response = await axios.get(`http://localhost:2000/fetchMemberDetails?phoneNumber=${phoneNumber}`);

      const { membershipId, customerName, customerMobile, RDSNumber, address, amount, date, newAmount } = response.data;
      // Convert the membership ID to a string
      // console.log(response.data);

      let total = amount + newAmount;
      const membershipIdStr = membershipId.toString();

      const branchCode = user?.branchDetails?.branchCode;

      // Generate a unique RDbillnumber
      let lastBillNumber = localStorage.getItem('lastBillNumber') || 'RDS0000000';
      // Increment the bill number and format it
      let rdsBill = 'RDS' + (parseInt(lastBillNumber.slice(3)) + 1).toString().padStart(7, '0');
      // Save the incremented bill number back to localStorage
      localStorage.setItem('lastBillNumber', rdsBill);

      setFormData({
        RDSNumber,
        customerName,
        amount,
        rdsBill,
        customerNumber: customerMobile,
        membershipId,
        date,
        address,
        branchcode: branchCode,
      });
      console.log("FormData", formData);
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  }

  const submitFormData = async () => {
    try {
      const response = await axios.post('http://localhost:2000/api/rds', formData);
      console.log('Form data saved:', response.data);
      window.location.href = "/rds";
      // Optionally, you can handle success or redirect the user to another page
    } catch (error) {
      console.error('Error saving form data:', error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFormData();
  };

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [nextPage, setNextPage] = useState(null);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    fetchRDSData(currentPage, pageSize, branchCode);
  }, [currentPage, pageSize, branchCode]);

  const fetchRDSData = async (page, size, branchCode) => {

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:2000/api/rds?page=${page}&limit=${size}&branchCode=${branchCode}`);
      setNewRDSdata(response.data.data);
      setNextPage(response.data.nextPage)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
      const branchCode = user?.branchDetails?.branchCode;
      fetchRDSData(currentPage + 1, pageSize, branchCode); // Include branchCode
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const branchCode = user?.branchDetails?.branchCode;
      fetchRDSData(currentPage - 1, pageSize, branchCode); // Include branchCode
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when page size changes
    fetchRDSData(1, newSize); // Fetch data for the first page with new page size
  };

  const groupedRDSData = newRDSdata ? newRDSdata.reduce((acc, current) => {
    const existingItem = acc.find(item => item.RDSNumber === current.RDSNumber);
    const amount = parseInt(current.amount || 0);
    const newAmount = parseInt(current.newAmount || 0);
    if (existingItem) {
      // If RDSNumber already exists, update the total amount
      existingItem.totalAmount += amount + newAmount;
    } else {
      // If RDSNumber doesn't exist, add it to the accumulator
      acc.push({
        ...current,
        totalAmount: amount + newAmount
      });
    }
    return acc;
  }, []) : [];

  const [showModalReceipt, setShowModalReceipt] = useState(false);

  const handleButtonClick = () => {
    setShowModalReceipt(true);
  };

  const handleClose = () => {
    setShowModalReceipt(false);
    setShowModalWithdrawReceipt(false);
  };


  const handlePrintReceipt = () => {
    const input = document.getElementById("receipt-print");

    html2canvas(input).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180; // Adjust the width as needed
        const imgHeight = 130; // Half of A4 page height in mm
  
        // Set minimum height for the table image
        const minHeight = 50; // Adjust as needed
        const tableHeight = Math.max(imgHeight, minHeight);
  
        // Calculate margin to center horizontally
        const marginX = (210 - imgWidth) / 2; // A4 page width is 210mm
  
        // Calculate startY to position the table at the top of the page
        const startY = 10; // Adjust as needed
  
        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", marginX, startY, imgWidth, tableHeight);
  
        // Save or print the PDF
        pdf.autoPrint(); // Automatically opens the print dialog
        window.open(pdf.output("bloburl"), "_blank"); // Opens the PDF in a new tab
      });
  };

  const [customerMobile, setCustomerMobile] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


  useEffect(() => {
    // Fetch customer data from API
    fetchCustomerData();
  }, []);

  const fetchCustomerData = () => {
    fetch("http://localhost:2000/api/rds")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched customer data:", data);
        setCustomerData(data); // Assuming the response contains an array of customer objects
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  };

  const handleMobileSelect = (value) => {
    setSelectedMobile(value);
    setSearchTerm(value); // Set the selected value to the search term
    // Fetch related data for the selected mobile number and update receiptData state
    fetchReceiptData(value);
    setIsDropdownVisible(false); // Hide the dropdown after selection
  };
  

  const fetchReceiptData = (mobile) => {
    // Find the customer object corresponding to the selected mobile number
    const selectedCustomer = customerData.find(
      (customer) => customer.customerNumber === mobile
    );
    if (selectedCustomer) {
      setReceiptData(selectedCustomer); // Set the receipt data based on the selected customer object
    } else {
      setReceiptData(null); // Clear the receipt data if customer not found
    }
  };
  const handleInputChangeReceipt = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownVisible(value !== ""); // Show the dropdown if there is input
  };

  const [showModalWithdrawReceipt, setShowModalWithdrawReceipt] = useState(false);

  const handleButtonClickWithdraw = () => {
    setShowModalWithdrawReceipt(true);
  };

  function formatIndianNumber(amount) {
    // Parse the amount into a number
    const numericAmount = parseFloat(amount);

    // Check if numericAmount is not a finite number or is NaN
    if (!Number.isFinite(numericAmount) || isNaN(numericAmount)) {
        return "Invalid amount";
    }

    // Proceed with the rest of the logic
    if (numericAmount < 100000) {
        // For amounts less than 1 lakh, use regular conversion
        return numberToWords.toWords(numericAmount);
    }

    // For amounts greater than or equal to 1 lakh
    const lakhs = Math.floor(numericAmount / 100000);
    const remaining = numericAmount % 100000;
    const lakhsInWords = lakhs > 1 ? numberToWords.toWords(lakhs) + " Lakhs" : "One Lakh";

    if (remaining === 0) {
        return lakhsInWords;
    }

    const remainingInWords = numberToWords.toWords(remaining);
    return `${lakhsInWords} ${remainingInWords}`;
}

function AmountInWords({ amount }) {
    const amountInWords = formatIndianNumber(amount);

    return <p><b>In words:</b> {amountInWords} only</p>;
}


  return (

    <div>
      <div className="container border rounded p-4 mt-4 mb-4">
        <Nav />
        <center>
          <h2>RECCURING DEPOSIT SPECIAL</h2>
        </center>
        <div className="App">
          <div className="container">
            <Link to='/RDSmultiCollection'>
              <div className="circle-button">
                <FontAwesomeIcon icon={faPrint} />
              </div>
            </Link>
          </div>
          {/* <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div> */}
          <div className="form-group">
            <label>Page size</label>
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="circle-buttons-container">
            <div className="circle-button" onClick={handlePlusIconClick} ><FontAwesomeIcon icon={faPlus} /></div>
            <div className="circle-button"><FontAwesomeIcon icon={faEdit} /></div>
            {/* <div className="circle-button">KYC</div> */}
            <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
            <Button
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
              }}
              onClick={handleButtonClick}
            >
              Deposit Receipt
            </Button>
            <Button
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
              }}
              onClick={handleButtonClickWithdraw}
            >
              Withdraw Receipt
            </Button>

          </div>
        </div>

        <center>
          <div className="table-container">
            {isLoading ? (
              <div className="loading-animation">Loading...</div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>SL NO</th>
                    <th style={{ textAlign: 'center' }}>RDS JOIN DATE</th>
                    <th style={{ textAlign: 'center' }}>MEMBERSHIP ID</th>
                    <th style={{ textAlign: 'center' }}>CUSTOMER NAME</th>
                    <th style={{ textAlign: 'center' }}>RDS NUMBER</th>
                    <th style={{ textAlign: 'center' }}>REFERENCE NAME</th>
                    <th style={{ textAlign: 'center' }}>BALANCE</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedRDSData.map((rdsData) => (
                    <tr key={rdsData._id} onClick={() => handleRowClick(rdsData)} className={selectedRow === rdsData ? 'selected-row' : ''}>
                      <td>{rdsData.sl_no}</td>
                      <td>{rdsData.date}</td>
                      <td>{rdsData.membershipId}</td>
                      <td>{rdsData.customerName}</td>
                      <td>{rdsData.RDSNumber}</td>
                      <td>{rdsData.referenceName}</td>
                      <td>{rdsData.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            )}
            <div className="pagination-buttons">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeft} /> Previous</Button>
              <span>Page {currentPage}</span>
              <Button onClick={handleNextPage} disabled={!nextPage}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>
              <select value={pageSize} onChange={handlePageSizeChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </center>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form">
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>RDS Registration Form</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {/* <div className="container"> */}
                          <div className="col-6">
                            <div className="form-group">
                              <label htmlFor="Customer Phonenumber">
                                Customer Phonenumber
                              </label>
                              <div className="form-group">

                                <div className="dropdown-wrapper">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                  />
                                  {phoneNumbers.length > 0 && (
                                    <ul className="dropdown-menu2">
                                      {phoneNumbers.map((number, index) => (
                                        <li
                                          key={index}
                                          onClick={() =>
                                            handlePhoneNumberSelection(
                                              number.customerMobile
                                            )
                                          }
                                        >
                                          {number.customerMobile}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="form-group">
                              <label htmlFor="accountHolderName">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountHolderName"
                                name="accountHolderName"
                                value={formData.customerName}
                                onChange={handleChange}
                                placeholder="Enter Account Holder Name"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="membershipId">
                                Membership ID*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="membershipId"
                                name="membershipId"
                                value={formData.membershipId}
                                onChange={handleChange}
                                placeholder="Enter Membership ID"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="label">DATE*</label>
                              <div className="form-control">
                                {currentDate.toLocaleString()}
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="billNumber">Bill Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="rdsBill"
                                name="rdsBill"
                                value={formData.rdsBill}
                                onChange={handleChange}
                                placeholder="Enter Bill Number"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="referenceNumber">Branch Code</label>
                              <input
                                type="text"
                                className="form-control"
                                id="branch"
                                name="branchcode"
                                value={formData.branchcode}
                                onChange={handleChange}
                                placeholder="Enter branch"
                                readOnly
                              />
                            </div>

                          </div>

                          <div className="col-6">

                            <div className="form-group">
                              <label htmlFor="accountType">Account Type*</label>
                              <select
                                className="form-control"
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                required
                              >
                                <option>--Select--</option>
                                <option value="RDS"> RDS</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="rdNumber">RDS NO</label>
                              <input
                                type="text"
                                className="form-control"
                                id="RDSNumber"
                                name="RDSNumber"
                                value={formData.RDSNumber}
                                onChange={handleChange}
                                placeholder="Enter RDS Number"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="amount">Amount</label>
                              <input
                                type="text"
                                className="form-control"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter Amount"
                              />
                            </div>
                            <div className="form-group">



                            </div>
                            <div className="form-group">
                              <label htmlFor="referenceName">
                                Reference Name
                              </label>
                              <select
                                className="form-control"
                                value={formData.referenceName}
                                name="referenceName"
                                onChange={handleReferenceNameChange} // Add onChange event handler
                              >
                                <option value="">Select an employee</option>
                                {employees.map(employee => (
                                  <option key={employee.id} value={employee.employeeName}>{employee.employeeName}</option>
                                ))}
                              </select>


                              <div className="form-group mt-3">
                                <label htmlFor="accountHolderAddress">
                                  Account Holder Address
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  placeholder="Enter Address"
                                />
                              </div>


                            </div>
                          </div>
                        </div>

                        <div className="form-group ">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                          <button
                            type="reset"
                            className="btn btn-secondary m-2"
                          >
                            Reset
                          </button>

                          <Button variant="danger" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>


      <Modal show={showModalReceipt} onHide={handleClose} size="xl">
        <div style={{ position: "relative" }}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Label htmlFor="phoneSelect">Search</Form.Label>
    
          <Form.Control
  type="text"
  placeholder="Search..."
  style={{width:"15rem"}}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
{searchTerm && customerData && customerData.length > 0 && (
  <ul className="dropdown-menu2" style={{ display: searchTerm ? 'block' : 'none' }}>
    {customerData
      .filter((customer) =>
        customer.customerName && customer.customerNumber &&
        (customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .map((customer, index) => (
        <li key={index} className="dropdown-item" onClick={() => handleMobileSelect(customer.customerNumber)}>
          {customer.customerName} - {customer.customerNumber}
        </li>
      ))}
  </ul>
)}

            <Button onClick={handlePrintReceipt} style={{ float: "right" }}>
              {" "}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
            <br />
            <br />

            <div id="receipt-print">
              <div style={{ border: "1px solid black" }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "9999",
                    pointerEvents: "none", // Ensure the watermark doesn't interfere with interaction
                    backgroundImage: `url('/logo copy.png')`, // Replace 'path_to_your_watermark_image.jpg' with the path to your image
                    backgroundSize: "85%", // Adjust the background size to fit the content
                    opacity: "0.1", // Adjust the opacity to your preference
                  }}
                ></div>
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.rdsBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.date : ""}</p>
                  
                </div>
                <div style={{ textAlign: "center", marginLeft:"5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Recurring Deposit Special Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.RDSNumber : ""}</p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Deposit Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>{receiptData ? receiptData.accountType : ""}</td>
                        <td></td>
                        <td></td>
                        <td>{receiptData ? receiptData.amount : ""}</td>
                      </tr>
                      
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                <p className="ml-5"> {receiptData ? <AmountInWords amount={receiptData.amount} /> : null}</p>
                <div
                  style={{
                    backgroundColor: "#488a99",
                    color: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "20rem" /* Adjust width to fit content */,
                    height:"3.5rem",
                    // float: "right",
                    marginLeft:"30rem"
                  }}
                >
                  
                  <p style={{paddingTop:"5px"}}>
                    <h5>Total Amount:    {receiptData ? receiptData.amount : ""}/-</h5>
                  </p>
                </div>
                </div>
                <div className="ml-5 d-flex" style={{ marginTop: "5rem" }}>
  <p style={{ marginRight: "10rem" }}>Remitter:</p>
  <p style={{ marginRight: "10rem" }}>Clerk:</p>
  <p style={{ marginRight: "10rem" }}>Manager:</p>
  <p>Cashier:</p>
</div>
              </div>

              <div style={{ border: "1px solid black" }}>
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.rdsBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.date : ""}</p>
                  
                </div>
                <div style={{ textAlign: "center",marginLeft:"5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Recurring Deposit Special Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.RDSNumber : ""}</p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Deposit Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                      <td>{receiptData ? receiptData.accountType : ""}</td>
                        <td></td>
                        <td></td>
                        <td>{receiptData ? receiptData.amount : ""}</td>
                      </tr>
                      
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                <p className="ml-5"> {receiptData ? <AmountInWords amount={receiptData.amount} /> : null}</p>
                <div
                  style={{
                    backgroundColor: "#488a99",
                    color: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "20rem" /* Adjust width to fit content */,
                    height:"3.5rem",
                    // float: "right",
                    marginLeft:"30rem"
                  }}
                >
                  
                  <p style={{paddingTop:"5px"}}>
                    <h5>Total Amount:    {receiptData ? receiptData.amount : ""}/-</h5>
                  </p>
                </div>
                </div>
                <div className="ml-5 d-flex" style={{ marginTop: "5rem" }}>
  <p style={{ marginRight: "10rem" }}>Remitter:</p>
  <p style={{ marginRight: "10rem" }}>Clerk:</p>
  <p style={{ marginRight: "10rem" }}>Manager:</p>
  <p>Cashier:</p>
</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>


      <Modal show={showModalWithdrawReceipt} onHide={handleClose} size="xl">
        <div style={{ position: "relative" }}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Label htmlFor="phoneSelect">Search</Form.Label>
    
          <Form.Control
  type="text"
  placeholder="Search..."
  style={{width:"15rem"}}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
{searchTerm && customerData && customerData.length > 0 && (
  <ul className="dropdown-menu2" style={{ display: searchTerm ? 'block' : 'none' }}>
    {customerData
      .filter((customer) =>
        customer.customerName && customer.customerNumber &&
        (customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .map((customer, index) => (
        <li key={index} className="dropdown-item" onClick={() => handleMobileSelect(customer.customerNumber)}>
          {customer.customerName} - {customer.customerNumber}
        </li>
      ))}
  </ul>
)}            <Button onClick={handlePrintReceipt} style={{ float: "right" }}>
              {" "}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
            <br />
            <br />

            <div id="receipt-print">
              <div style={{ border: "1px solid black" }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "9999",
                    pointerEvents: "none", // Ensure the watermark doesn't interfere with interaction
                    backgroundImage: `url('/logo copy.png')`, // Replace 'path_to_your_watermark_image.jpg' with the path to your image
                    backgroundSize: "85%", // Adjust the background size to fit the content
                    opacity: "0.1", // Adjust the opacity to your preference
                  }}
                ></div>
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.rdsBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.date : ""}</p>
                  
                </div>
                <div style={{ textAlign: "center", marginLeft:"5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Recurring Deposit Special Withdrawal Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Paid To:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.RDSNumber : ""}</p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Withdraw Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>{receiptData ? receiptData.accountType : ""}</td>
                        <td></td>
                        <td></td>
                        <td>{receiptData ? receiptData.amount : ""}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                <p className="ml-5"> {receiptData ? <AmountInWords amount={receiptData.amount} /> : null}</p>
                <div
                  style={{
                    backgroundColor: "#488a99",
                    color: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "20rem" /* Adjust width to fit content */,
                    height:"3.5rem",
                    // float: "right",
                    marginLeft:"30rem"
                  }}
                >
                  
                  <p style={{paddingTop:"5px"}}>
                    <h5>Total Amount:    {receiptData ? receiptData.amount : ""}/-</h5>
                  </p>
                </div>
                </div>
                <div className="ml-5 d-flex" style={{ marginTop: "5rem" }}>
  <p style={{ marginRight: "10rem" }}>Remitter:</p>
  <p style={{ marginRight: "10rem" }}>Clerk:</p>
  <p style={{ marginRight: "10rem" }}>Manager:</p>
  <p>Cashier:</p>
</div>
              </div>

              <div style={{ border: "1px solid black" }}>
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.rdsBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.date : ""}</p>
                  
                </div>
                <div style={{ textAlign: "center",marginLeft:"5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Recurring Deposit Special Withdrawal Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                <p><b>Paid To:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.RDSNumber : ""}</p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Withdraw Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                      <td>{receiptData ? receiptData.accountType : ""}</td>
                        <td></td>
                        <td></td>
                        <td>{receiptData ? receiptData.amount : ""}</td>
                      </tr>
                    
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                <p className="ml-5"> {receiptData ? <AmountInWords amount={receiptData.amount} /> : null}</p>
                <div
                  style={{
                    backgroundColor: "#488a99",
                    color: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "20rem" /* Adjust width to fit content */,
                    height:"3.5rem",
                    // float: "right",
                    marginLeft:"30rem"
                  }}
                >
                  
                  <p style={{paddingTop:"5px"}}>
                    <h5>Total Amount:    {receiptData ? receiptData.amount : ""}/-</h5>
                  </p>
                </div>
                </div>
                <div className="ml-5 d-flex" style={{ marginTop: "5rem" }}>
  <p style={{ marginRight: "10rem" }}>Remitter:</p>
  <p style={{ marginRight: "10rem" }}>Clerk:</p>
  <p style={{ marginRight: "10rem" }}>Manager:</p>
  <p>Cashier:</p>
</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}

export default Rds