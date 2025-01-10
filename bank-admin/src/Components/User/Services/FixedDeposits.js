import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Popover, Form, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTableList, faArrowLeft, faArrowRight, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../../Others/UserContext";
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from '../../style/logo.png';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import NavBar from "../../Others/Nav";
import moment from 'moment';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function FixedDeposit1() {

  const { user, setUser } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRow, setSelectedRow] = useState(null);
  const [newFDdata, setNewFDdata] = useState([]);
  const [branchCode, setBranchCode] = useState("");
  const [searchReceipt, setSearchReceipt] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [allFDdata, setAllFDdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
const [nomineeRelationship, setNomineeRelationship] = useState("");



  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (fdData) => {
    setSelectedRow(fdData);
  };

  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://api.malabarbank.in/api/employee');
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

  const loginBranchCode = user.branchDetails.branchCode;
  const loginBranchUser = user.employee.fullname;
  const currentDateNew = new Date();
  const day = String(currentDateNew.getDate()).padStart(2, '0');
  const month = String(currentDateNew.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = currentDateNew.getFullYear();
  const loginUserTime = `${day}/${month}/${year}`;

  const [formData, setFormData] = useState({
    branchCodeUser: loginBranchCode,
    branchUser: loginBranchUser,
    userTime: loginUserTime,
    schemeType: "",
    accountType: '',
    duration: "",
    amount: "",
    interest: "",
    finalInterest: "",
    membershipId: "",
    FDNumber: "",
    customerName: "",
    customerNumber: "",
    interestCutAfter: '',
    interestCutBefore: '',
    address: "",
    referenceName: "",
    date: "",
    newDate: "",
    totalAmount: "",
    fdBill: "",
    accountStatus: '',
    matureDate:'',
    nomineeName: "",
    nomineeRelationship: "",
  });

  const [schemeData, setSchemeData] = useState({
    schemeType: "",
    duration: "",
    durationMonth: "",
    amount: "",
    interest: "",
    finalInterestAmount: "",
  });

  const [fdScheme, setFdScheme] = useState([]);

  useEffect(() => {
    fetchfdScheme();
  }, []);

  const fetchfdScheme = async () => {
    try {
      const response = await fetch('https://api.malabarbank.in/api/fdSchmefetch');
      const data = await response.json();

      setFdScheme(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAccountTypeSelection = (schemeType) => {
    // Find the scheme from fdScheme based on schemeType
    const selectedScheme = fdScheme.find((scheme) => scheme.schemeType === schemeType);
    // Populate the form fields with data from the selected scheme

    setFormData({
      ...formData,
      accountType: schemeType,
      duration: `${selectedScheme.durationYear} years ${selectedScheme.durationMonth} months`,
      interest: selectedScheme.interest,
      interestCutAfter: selectedScheme.interestCutAfter,
      interestCutBefore: selectedScheme.interestCutBefore,
    });
  };

  //Generate FD Number
  const [accountTypeCounts, setAccountTypeCounts] = useState({});
  const [fdBillCount, setFdBillCount] = useState(0)

  const updateFDNumber = () => {
    let accountType = formData.accountType || "FD";

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
    const newFDNumber = `FD${newNumber.toString().padStart(5, '0')}`;
    const newFdBill = `FD${(fdBillCount + 1).toString().padStart(8, '0')}`;
    console.log(newFDNumber);

    setFormData(prevFormData => ({
      ...prevFormData,
      FDNumber: newFDNumber,
      fdBill: newFdBill,
      accountType: formData.accountType,
    }));
    console.log("Updated RDNumber:", newFDNumber);
    setFdBillCount(prevCount => prevCount + 1)
  };

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    if (formData.accountType && branchCode) {
      updateFDNumber(branchCode);
    }
  }, [formData.accountType, branchCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const handleChangeDate = (event) => {
    const newDate = moment(event.target.value).format('DD/MM/YYYY');
    setFormData({ ...formData, newDate });
  };

  const handleChangeFd = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate interest amount if amount, interest, and duration are provided
    if (name === 'amount' && formData.interest && formData.duration) {
      const amount = parseFloat(value);
      const interest = parseFloat(formData.interest);
      const duration = parseFloat(formData.duration.split(' ')[0]); // Extracting duration in years
      console.log(amount, interest, duration);
      // Calculate interest amount
      const interestAmount = (amount * (interest / 100)) * duration;
      const finalAmount = amount + interestAmount;
      // Update the final interest amount in the form data

      setFormData(prevState => ({
        ...prevState,
        finalInterest: interestAmount.toFixed(2),
        totalAmount: finalAmount.toFixed(2),
        branchCodeUser: loginBranchCode,
        branchUser: loginBranchUser,
        userTime: loginUserTime
      }));
    }
  };

  //fetching memberships
  const [numberData, setNumberData] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    fetchMemberships(currentPage, pageSize, branchCode, searchNumber);
    console.log(branchCode);
  }, [currentPage, pageSize, branchCode, searchNumber]);

  const fetchMemberships = async (page, size, branchCode, selectedNumber = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/membership?page=${page}&limit=${size}&branchCode=${branchCode}&selectedNumber=${selectedNumber}`);
      const cleanedData = response.data.data.map(item => {
        const { _id,...rest } = item;
        return rest;
      });
      setNumberData(cleanedData);
    } catch (error) {
      console.error('Error fetching memberships data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitFd = async (e) => {
    e.preventDefault();

     // Log all data from userContext
  console.log("User Context Data:", user);
    
    // Ask the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to submit the form?");
    if (!isConfirmed) {
      return; // If not confirmed, exit the function
    }
  
    try {
      // Calculate mature date
      const durationInYears = formData.duration? parseInt(formData.duration.split(' ')[0]) : 0;
      const newDate = moment(formData.newDate, 'DD/MM/YYYY');
      const matureDate = newDate.add(durationInYears, 'years').format('DD/MM/YYYY');
  
      const updatedFormData = {
              ...formData,
              matureDate: matureDate,
              branchName: user?.branchDetails?.branch_name || '',
              nomineeName: formData.nomineeName,
              nomineeRelationship: formData.nomineeRelationship,
            };
      // Update the form data with mature date and remove _id
      const { _id,...updatedFormDataWithoutId } = updatedFormData;

       // Remove the `fdBill` property before sending to the API
    const { fdBill, ...updatedFormDataWithoutFdBill } = updatedFormData;
  
      const response = await axios.post("http://localhost:2000/api/fd", updatedFormDataWithoutFdBill);
      if (response.status === 200) {
        console.log("Form data saved:", response.data);
        window.location.href = "/fd"; // Optionally redirect to another page
        toast.success("Form data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      if (error.response && error.response.status === 500) {
        toast.error("An error occurred while saving the form data. Please try again later.");
      }
    }
  };

  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {

    fetchFDData(currentPage, pageSize, branch, searchReceipt);
  }, [currentPage, pageSize, branch, searchReceipt]);

  const fetchFDData = async (page, size, branch, searchTerm = '', searchReceipt = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/fd?page=${page}&limit=${size}&branch=${branch}&searchTerm=${searchTerm}&searchReceipt=${searchReceipt}`);
      // setNewFDdata(response.data.data);
      // Check if data is present in the response
      if (response.data || response.data.length < 0) {
        // Set new FD data
        setNewFDdata(response.data.data);
        setAllFDdata(response.data.data);
        setNextPage(response.nextPage); 
        
      } else {
        console.log("No data found in response");
      }
    } catch (error) {
      console.error('Error fetching FD data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchFDData(1, pageSize, branch, value)
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
      fetchFDData(currentPage + 1, pageSize, branch, searchTerm);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchFDData(currentPage - 1, pageSize, branch, searchTerm);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    fetchFDData(1, newSize, branch, searchTerm);
  };
  //------------------------------------------------------------------------------

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/fd", schemeData);
      console.log("Data saved:", response.data);
      // Clear form fields after successful submission
      setSchemeData({
        schemeType: "",
        duration: "",
        durationMonth: "",
        amount: "",
        interest: "",
        finalInterestAmount: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [showScheme, setShowScheme] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  const handleSchemeIcon = () => {
    setShowScheme(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowScheme(false);
  };

  const popoverRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear user data from local storage and reset user state
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to login page or any other page as needed
    window.location = `/`;
  };
  //receipt fetching

  const [receiptData, setReceiptData] = useState(null);

  const handleMobileSelect = (value) => {
    fetchReceiptData(value);
    setSearchReceipt('');
  };
  const fetchReceiptData = (mobile) => {
    const filteredCustomers = allFDdata.filter(
      (customer) => customer.customerMobile === mobile
    );
    if (filteredCustomers.length > 0) {
      setReceiptData(filteredCustomers[0]);
    } else {
      setReceiptData(null);
    }
  };
  //rdsNumber fetching
  const handleNumberSelect = (value) => {
    fetchData(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      customerNumber: value,
    }));
    setSearchNumber(value);
    setShowDropdown(false);
  };

  const fetchData = (mobile) => {
    const filteredCustomers = numberData.filter(
      (customer) => customer.customerMobile === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSearchNumber(filteredCustomers[0].customerMobile);
    } else {
      setFormData(null);
    }
  };

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

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleRowClickEdit = (fdData) => {
    setSelectedRowData(fdData);
    setShowModalEdit(true);
    setSlNo(fdData.sl_no);
    setNewDate(fdData.newDate || fdData.date);
    setMembershipId(fdData.membershipId);
    setCustomerName(fdData.customerName);
    setCustomerNumber(fdData.customerNumber);
    setFDNumber(fdData.FDNumber);
    setReferenceName(fdData.referenceName);
    setAmount(fdData.amount);
  };

  const handleCloseModalEdit = () => {
    setShowModalEdit(false);
    setSelectedRowData(null);
  };
  const [showModalBill, setShowModalBill] = useState(false);
  const [selectedRowDataBill, setSelectedRowDataBill] = useState(null);

  const handleCloseModalBill = () => {
    setShowModalBill(false);
    setSelectedRowDataBill(null);
  };

  const handleReceiptButtonClick = (fdData, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    setSelectedRowDataBill(fdData);
    setShowModalBill(true);
    setShowModalEdit(false);
  };

  const [slNo, setSlNo] = useState("")
  const [newdate, setNewDate] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [amount, setAmount] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [FDNumber, setFDNumber] = useState("");


  const handleSaveChanges = () => {
    // Display confirmation dialog
    const confirmSave = window.confirm(
      "Are you sure you want to save changes?"
    );
    // If user confirms, proceed with saving changes
    if (confirmSave) {
      axios
        .put(`https://api.malabarbank.in/api/fd/${selectedRowData.FDNumber}`, {
          slNo,
          newdate,
          membershipId,
          customerName,
          customerNumber,
          FDNumber,
          referenceName,
          amount,
        })
        .then((response) => {
          console.log("Data updated successfully:", response.data);
          setShowModalEdit(false);
          toast.success("Changes saved successfully!", {
            position: "top-center",
          });
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          toast.error("Failed to save changes. Please try again later.", {
            position: "top-center",
          });
        });
    }
  };

  return (
    <div>
      <nav className="navbar navbar-light ">
        <div className="container-fluid">
          <Link className="navbar-brand ms-5 d-flex align-items-center" to="/main" >
            <img
              src={logo}
              alt="logo"
              width="100px"
              className="d-inline-block align-text-top"
            />
            <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
          </Link>
          <div className="d-flex" style={{ width: "500px" }}>
            <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
            <FontAwesomeIcon
              icon={faPowerOff}
              onClick={handleLogout}
              className="text-danger me-5 mt-4"
            />
            <div className="d-flex">
              <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
              <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                <li className="me-2">User</li>
                <li className="me-2">Branch</li>
                <li className="me-2">Branch Code</li>
                <li>Date</li>
              </ul>
              <ul className="list-unstyled mb-1 me-5">
                <li className="me-2">
                  : {user ? user.employee.fullname : "N/A"}
                </li>
                <li className="me-2">
                  : {user ? user.branchDetails.branch_name : "N/A"}
                </li>
                <li className="me-2">
                  : {user ? user.branchDetails.branchCode : "N/A"}
                </li>
                <li className="me-2">: {currentDate.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* <NavBar /> */}
      <div className="container border rounded p-4 mt-4 mb-4">
        <center>
          <h2>FIXED DEPOSIT</h2>
        </center>
        <div className="">
          <div className="circle-buttons-container">
            <div className="row">
              <div className="col-md-6 d-flex align-items-center">
                <div className="form-group mb-0">
                  <label htmlFor="referenceNumber" className="mr-2">Search:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="branch"
                    name="branch"
                    value={searchTerm} // Change this to searchTermTable
                    onChange={handleSearch} // Change this to handleSearch
                    placeholder="Enter Search"
                    style={{ width: "250px" }}
                  />
                </div>
              </div>
            </div>
            <div className="circle-button ms-5" onClick={handlePlusIconClick}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="circle-button" onClick={handleSchemeIcon}>
              <FontAwesomeIcon icon={faTableList} />
            </div>
            <div className="circle-button"><FontAwesomeIcon icon={faClockRotateLeft} /></div>
            {/* <Button className="ms-5"
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
              }}
              onClick={handleButtonClick}
            >
              Deposit Receipt
            </Button>
            <Button className="ms-3"
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
              }}
              onClick={handleButtonClickWithdraw}
            >
              Withdraw Receipt
            </Button> */}
          </div>
        </div>

        {/* Table list section */}
        <center>
          <div className="table-container">
            {isLoading ? (
              <div className="loading-animation">Loading...</div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>SL NO</th>
                    <th style={{ textAlign: 'center' }}>FD JOIN DATE</th>
                    <th style={{ textAlign: 'center' }}>MEMBERSHIP ID</th>
                    <th style={{ textAlign: 'center' }}>CUSTOMER NAME</th>
                    <th style={{ textAlign: 'center' }}>FD NUMBER</th>
                    <th style={{ textAlign: 'center' }}>REFERENCE NAME</th>
                    <th style={{ textAlign: 'center' }}>AMOUNT</th>
                    <th style={{ textAlign: 'center' }}>MATURITY DATE</th>
                    <th style={{ textAlign: 'center' }}>MATURITY AMOUNT</th>
                    {/* <th style={{ textAlign: 'center' }}>RECEIPT</th> */}
                  </tr>
                </thead>

                <tbody>
                  {newFDdata && newFDdata.map((fdData) => (
                    <tr key={fdData._id} onClick={() => handleRowClickEdit(fdData)} className={selectedRowData === fdData ? 'selected-row' : ''}>
                      <td>{fdData.sl_no}</td>
                      <td>{fdData.date || fdData.newDate}</td>
                      <td>{fdData.membershipId}</td>
                      <td>{fdData.customerName}</td>
                      <td>{fdData.FDNumber}</td>
                      <td>{fdData.referenceName}</td>
                      <td>{fdData.amount}</td>
                      <td>{fdData.matureDate}</td>
                      <td>{fdData.totalAmount}</td>
                      <td>
                        <Button variant="primary" onClick={(event) => { handleCloseModalEdit(); handleReceiptButtonClick(fdData, event) }}>View Receipt</Button>

                      </td>
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

      {/*Receipt Modal*/}
      <Modal show={showModalBill} onHide={handleCloseModalBill} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Receipt Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Button onClick={handlePrintReceipt} style={{ float: "" }}>
              {" "}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
          </div>
          {selectedRowDataBill && (
            <div id="receipt-print">

              <div style={{ border: "1px solid black", position: "relative" }}>
                {/* Watermark */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "9999",
                    pointerEvents: "none",
                    backgroundImage: `url('/logo copy.png')`,
                    backgroundSize: "85%",
                    opacity: "0.1",
                  }}
                ></div>

                {/* Receipt Content */}
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p>
                    <b>Payslip No:</b> {selectedRowDataBill.fdBill}
                  </p>
                  <p>
                    <b>Date:</b>{loginUserTime}
                  </p>
                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>
                    Fixed Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Received From:</b> {selectedRowDataBill.customerName}
                  </p>
                  <p>
                    <b>Phone Number: </b> {selectedRowDataBill.customerNumber}
                  </p>
                  <p>
                    <b>Account Number: </b> {selectedRowDataBill.FDNumber}
                  </p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          <b>Deposit Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        {/* <th>Action</th> */}
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Maturity Date</th>
                        <th>Maturity Amount</th>

                        {/* <th>Balance</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {selectedRowDataBill.accountType || ""}
                        </td>
                        {/* <td>{selectedRowDataBill.action}Deposit</td> */}
                        <td>{selectedRowDataBill.newDate}</td>
                        <td>{selectedRowDataBill.amount}</td>
                        <td>{selectedRowDataBill.matureDate}</td>
                        <td>{selectedRowDataBill.totalAmount}</td>
                        {/* <td>{selectedRowDataBill.balance}</td> */}
                      </tr>
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                  <p className="ml-5">
                    {" "}
                    <AmountInWords amount={selectedRowDataBill.totalAmount} />
                  </p>
                  <div
                    style={{
                      backgroundColor: "#488a99",
                      color: "white",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      width: "20rem",
                      height: "3.5rem",
                      marginLeft: "30rem",
                      flexShrink: 0, // Prevent shrinking
                    }}
                  >
                    <p style={{ paddingTop: "5px" }}>
                      <h5>Total Amount: {selectedRowDataBill.totalAmount}/-</h5>
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
              <div style={{ border: "1px solid black", position: "relative" }}>
                {/* Watermark */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "9999",
                    pointerEvents: "none",
                    backgroundImage: `url('/logo copy.png')`,
                    backgroundSize: "85%",
                    opacity: "0.1",
                  }}
                ></div>

                {/* Receipt Content */}
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p>
                    <b>Payslip No:</b> {selectedRowDataBill.fdBill}
                  </p>
                  <p>
                    <b>Date:</b>{loginUserTime}
                  </p>
                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>
                    Fixed Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Received From:</b> {selectedRowDataBill.customerName}
                  </p>
                  <p>
                    <b>Phone Number: </b> {selectedRowDataBill.customerNumber}
                  </p>
                  <p>
                    <b>Account Number: </b> {selectedRowDataBill.FDNumber}
                  </p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          <b>Deposit Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        {/* <th>Action</th> */}
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Maturity Date</th>
                        <th>Maturity Amount</th>

                        {/* <th>Balance</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {selectedRowDataBill.accountType || ""}
                        </td>
                        {/* <td>{selectedRowDataBill.action}Deposit</td> */}
                        <td>{selectedRowDataBill.newDate}</td>
                        <td>{selectedRowDataBill.amount}</td>
                        <td>{selectedRowDataBill.matureDate}</td>
                        <td>{selectedRowDataBill.totalAmount}</td>
                        {/* <td>{selectedRowDataBill.balance}</td> */}
                      </tr>
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                  <p className="ml-5">
                    {" "}
                    <AmountInWords amount={selectedRowDataBill.totalAmount} />
                  </p>
                  <div
                    style={{
                      backgroundColor: "#488a99",
                      color: "white",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      width: "20rem",
                      height: "3.5rem",
                      marginLeft: "30rem",
                      flexShrink: 0, // Prevent shrinking
                    }}
                  >
                    <p style={{ paddingTop: "5px" }}>
                      <h5>Total Amount: {selectedRowDataBill.totalAmount}/-</h5>
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

          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalBill}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*edit Modal*/}
      <Modal show={showModalEdit} onHide={handleCloseModalEdit} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Row Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRowData && (
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="slNo">
                    <Form.Label>Sl No:</Form.Label>
                    <Form.Control readOnly value={slNo}
                      onChange={(e) => setSlNo(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="date">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control readOnly value={newdate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="membershipId">
                    <Form.Label>Membership ID:</Form.Label>
                    <Form.Control readOnly value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="customerName">
                    <Form.Label>Customer Name:</Form.Label>
                    <Form.Control readOnly value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="FDNumber">
                    <Form.Label>FD Number:</Form.Label>
                    <Form.Control readOnly value={FDNumber}
                      onChange={(e) => setFDNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="referenceName">
                    <Form.Label>Reference Name:</Form.Label>
                    <Form.Control readOnly value={referenceName}
                      onChange={(e) => setReferenceName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="amount">
                    <Form.Label>Amount:</Form.Label>
                    <Form.Control readOnly value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="customerNumber">
                    <Form.Label>Customer Number:</Form.Label>
                    <Form.Control value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCloseModalEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />


      {/* New FD modal section */}
      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal-width">
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>CREATE NEW FD ACCOUNT</h4>
              </div>
              <div className="card-body ">
                <form onSubmit={handleSubmitFd} className="ms-5 mt-3">
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label htmlFor="Customer Phonenumber">
                        Customer Phonenumber
                      </label>
                      <div className="form-group ">
                        <div className="dropdown-wrapper">
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchNumber}
                            onChange={(e) => setSearchNumber(e.target.value)}
                            onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                          />
                          {showDropdown && searchNumber && (
                            <ul className="dropdown-menu2">
                              {numberData
                                .filter((customer) =>
                                  customer.customerMobile && customer.customerMobile.toLowerCase().includes(searchNumber.toLowerCase())
                                )
                                .map((customer, index) => (
                                  <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleNumberSelect(customer.customerMobile); }}>
                                    {customer.customerName} - {customer.customerMobile}
                                  </li>
                                ))}
                            </ul>
                          )}

                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <label htmlFor="accountType">Scheme Type*</label>
                      <select
                        className="form-control"
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={(e) => {
                          handleChange(e);
                          handleAccountTypeSelection(e.target.value);
                        }}
                        required
                      >
                        <option>--Select--</option>
                        {fdScheme.map((scheme) => (
                          <option key={scheme.schemeType} value={scheme.schemeType}>
                            {scheme.schemeType}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="duration">
                        Duration :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChangeFd}
                        placeholder=""
                        required
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="amount">
                        Amount :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChangeFd}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="interest">
                        Interest Percentage :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="finalInterestAmount">
                        Final Interest Amount :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="finalInterest"
                        name="finalInterest"
                        value={formData.finalInterest}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="membershipId">
                        Account Holder Membership ID :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="membershipId"
                        name="membershipId"
                        value={formData.membershipId}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="fdNumber">
                        FD Number :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="FDNumber"
                        name="FDNumber"
                        value={formData.FDNumber}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="accountHolderName">
                        Account Holder Name :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="accountHolderAddress">
                        Account Holder Address :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="form-group d-flex flex-row">


</div>

                  </div>
                  <div className="form-group d-flex flex-row">
                  <div className="col">
    <label className="labels" htmlFor="nomineeName">
      Nominee Name :
    </label>
    <input
      type="text"
      className="form-control"
      id="nomineeName"
      name="nomineeName"
      value={formData.nomineeName}
      onChange={handleChangeFd}
      placeholder=""
      required
    />
  </div>
                  <div className="col">
    <label className="labels" htmlFor="nomineeRelationship">
      Nominee Relationship :
    </label>
    <input
      type="text"
      className="form-control"
      id="nomineeRelationship"
      name="nomineeRelationship"
      value={formData.nomineeRelationship}
      onChange={handleChangeFd}
      placeholder=""
      required
    />
  </div>
  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="label">REFERENCE NAME:</label>
                      <select
                        className="form-control"
                        value={formData.referenceName}
                        name="referenceName"
                        onChange={handleChange}
                      >
                        <option value="">Select an employee</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.employeeName}>{employee.employeeName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="date">
                        Date :
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="newDate"
                        name="newDate"
                        value={moment(formData.newDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                        onChange={handleChangeDate}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    {/* <div className="col">
                      <label className="labels" htmlFor="billNumber">
                        Bill Number :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billNumber"
                        name="billNumber"
                        value={formData.fdBill}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div> */}
                    <div className="col-6">
                      <label className="labels" htmlFor="totalAmount">
                        Total Amount :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="totalAmount"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChangeFd}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">

                  </div>

                  <center>
                    <div className="form-group mt-5 ">
                      <button type="submit" className="btn btn-primary">Add</button>
                      <button type="reset" className="btn btn-secondary m-2">Reset</button>
                      <Button variant="danger" onClick={handleCloseModal}>Close</Button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Scheme modal section */}
      <Modal show={showScheme} onHide={handleCloseModal} dialogClassName="custom-modal-width2">
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>SCHEME LIST</h4>
              </div>
              <form onSubmit={handleSubmitScheme} className="px-2">
                <center>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>SL NO</th>
                        <th>SCHEME TYPE</th>
                        <th>SCHEME AMOUNT</th>
                        <th>DURATION</th>
                        <th>INTEREST PERCENTAGE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fdScheme.map((scheme, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{scheme.schemeType}</td>
                          <td>{scheme.schemeAmount}</td>
                          <td>{`${scheme.durationYear} years ${scheme.durationMonth} months`}</td>
                          <td>{scheme.interest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </center>
              </form>
              <center>
                <div className="form-group mt-5">
                  <Button variant="danger" onClick={handleCloseModal}>Close</Button>
                </div>
              </center>
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
              style={{ width: "15rem" }}
              value={searchReceipt}
              onChange={(e) => setSearchReceipt(e.target.value)}
            />
            {searchReceipt && (
              <ul className="dropdown-menu2" style={{ display: searchReceipt ? 'block' : 'none' }}>
                {allFDdata
                  .filter((customer) =>
                    customer.customerName.toLowerCase().includes(searchReceipt.toLowerCase()) ||
                    customer.customerNumber.toLowerCase().includes(searchReceipt.toLowerCase())
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
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.fdBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.newDate : ""}</p>

                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Fixed Deposit Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.FDNumber : ""}</p>
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
                      height: "3.5rem",
                      // float: "right",
                      marginLeft: "30rem"
                    }}
                  >

                    <p style={{ paddingTop: "5px" }}>
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
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.fdBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.newDate : ""}</p>

                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Fixed Deposit Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.FDNumber : ""}</p>
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
                      height: "3.5rem",
                      // float: "right",
                      marginLeft: "30rem"
                    }}
                  >

                    <p style={{ paddingTop: "5px" }}>
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
              style={{ width: "15rem" }}
              value={searchReceipt}
              onChange={(e) => setSearchReceipt(e.target.value)}
            />
            {searchReceipt && (
              <ul className="dropdown-menu2" style={{ display: searchReceipt ? 'block' : 'none' }}>
                {allFDdata
                  .filter((customer) =>
                    customer.customerName.toLowerCase().includes(searchReceipt.toLowerCase()) ||
                    customer.customerNumber.toLowerCase().includes(searchReceipt.toLowerCase())
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
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.fdBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.newDate : ""}</p>

                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Fixed Deposit Withdrawal Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Paid To:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.FDNumber : ""}</p>
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
                      height: "3.5rem",
                      // float: "right",
                      marginLeft: "30rem"
                    }}
                  >

                    <p style={{ paddingTop: "5px" }}>
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
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.fdBill : ""}</p>
                  <p><b>Date:</b> {receiptData ? receiptData.newDate : ""}</p>

                </div>
                <div style={{ textAlign: "center", marginLeft: "5rem" }}>
                  <img
                    src="/mscs.png"
                    alt="logo"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginLeft: "9rem",
                    }}
                  />
                  <h3 style={{ marginLeft: "9rem" }}>Fixed Deposit Withdrawal Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                  <p><b>Paid To:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.FDNumber : ""}</p>
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
                      height: "3.5rem",
                      // float: "right",
                      marginLeft: "30rem"
                    }}
                  >

                    <p style={{ paddingTop: "5px" }}>
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

export default FixedDeposit1