import React, { useRef, useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import Select from 'react-select';
import {
  faCalculator,
  faClockRotateLeft,
  faEdit,
  faPrint,
  faTableList,
  faFileCirclePlus,
  faPlus,
  faUser,
  faHouse,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../Others/UserContext";
import "../../style/Rdsov.css";
import SimpleInterestCalculator from "./SimpleInterestCalculator";
import { Popover } from "react-bootstrap";
import logo from "../../style/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RdEmiModal from "./RdEmiModal";
import RdEmiHistory from "./RdEmiHistory";

const Rdsov = () => {
  // current Date and Time
  const [branchCode, setBranchCode] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [newRDdata, setNewRDdata] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, setUser } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [showEmiModal, setShowEmiModal] = useState(false);


   //current time 
   function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

//emi modal
function handleEmiClick() {
  setShowEmiModal(true)
}

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (rdData) => {
    setSelectedRow(rdData);
  };

  // Set to store previously generated RD numbers
  const generatedrdBills = new Set();

  const [formData, setFormData] = useState({
    membershipId: "",
    customerName: "",
    accountType: "",
    schemeType: "",
    customerNumber: "",
    duration: "",
    address: "",
    interest: "",
    RDNumber: "",
    rdBill: "",
    amount: "",
    startDate: "",
    time:getCurrentTime(),
    RDschemeType: "",
    referenceName: "",
    branchcode: "",
    finalAmount: "",
    emiAmount:""
  });

  const handleChangeDate = (event) => {
    const xl = moment(event.target.value).format("DD/MM/YYYY");
    setFormData({ ...formData, startDate:xl });
  };

  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("https://api.malabarbank.in/api/employee");
      const data = await response.json();

      const branchCode = user?.branchDetails?.branchCode;
      if (branchCode) {
        const filteredEmployees = data.filter(
          (employee) => employee.branchCode === branchCode
        );
        setEmployees(filteredEmployees);
      } else {
        setEmployees(data);
      }
      // console.log(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleReferenceNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      referenceName: value,
    });
  };

  //generate RD Number
  const [accountTypeCounts, setAccountTypeCounts] = useState({});
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      // date: currentDate.toLocaleString(),
    });
  };


  
  const [rdScheme, setRdScheme] = useState([]);

  useEffect(() => {
    fetchrdScheme();
  }, []);

  const fetchrdScheme = async () => {
    try {
      const response = await fetch("https://api.malabarbank.in/api/rdSchmefetch");
      const data = await response.json();
      setRdScheme(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  // Find the scheme from fdScheme based on schemeType

  const handleAccountTypeSelection = (schemeType) => {
    const selectedScheme = rdScheme.find(
      (scheme) => scheme.schemeType === schemeType
    );

    setFormData({
      ...formData,
      RDschemeType: schemeType,
      duration: ` ${selectedScheme.durationMonth} months`,
      interest: selectedScheme.interest,
      emiAmount: selectedScheme.amount, // Ensure amount is a number
      interestCutAfter: selectedScheme.interestCutAfter,
      interestCutBefore: selectedScheme.interestCutBefore,
      finalAmount: selectedScheme.finalAmount, // Add finalAmount to the form data
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // fetch by mobile

  const [query, setQuery] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(-1);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  //search Rd details by phone number
  useEffect(() => {
    if (query) {
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(
            `https://api.malabarbank.in/api/fetchMemberDetails?phoneNumber=${query}`
          );
          const options = response.data.map((number) => ({
            value: number.customerMobile,
            label: number.customerMobile,
          }));


          setPhoneNumbers(options);
          console.log(response.data);
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
const handlePhoneNumberSelection = (option) => {

  console.log("option",option);
  if (option === null) {
    // Handle the case where the selection is cleared
    setSelectedPhoneNumber(null);
    setQuery(""); // Reset the query if necessary
    setPhoneNumbers([{ value: "", label: "" }]); // Clear the options if needed

    
    // Reset the formData to remove any data associated with the previously selected phone number
  setFormData({});
  } else {
    // Existing logic for when an option is selected
    setSelectedPhoneNumber(option.value);
    console.log("selected phno xxxx",selectedPhoneNumber);
    fetchMemberDetails(option.value);
    setFormData((prevFormData) => ({
    ...prevFormData,
      customerNumber: option.value,
    }));
    setQuery(option.value);
    setPhoneNumbers([]); // Optionally clear the options after selection
  }
  };
  

  // fetch mobile number to find member details
  const fetchMemberDetails = async (phoneNumber) => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/fetchMemberDetails?phoneNumber=${phoneNumber}`
      );

      const {
        membershipId,
        customerMobile,
        customerName,
        accountType,
        duration,
        interest,
        RDNumber,
        amount,
        date,
        referenceMobile,
        address,
      } = response.data;

      const extractedBranchCode = user?.branchDetails?.branchCode;

      setBranchCode(extractedBranchCode);
      console.log("extract branchcode" + extractedBranchCode);

    
      setFormData({
        membershipId,
        customerName,
        // accountType,
        customerNumber: customerMobile,
        // duration,
        address,
        // interest,
        // RDNumber,
        // amount,
        // referenceMobile,
        branchcode: extractedBranchCode,
      });
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  // search RDNumber
  const [rdquery, setRDQuery] = useState("");
  const [selectedRDNumber, setSelectedRDNumber] = useState("");
  const [rdNumbers, setRDNumbers] = useState([]);
  const [rdformData, setRDFormData] = useState();

  const RDfetchPhoneNumbers = async () => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/searchRDNumbers?rdquery=${rdquery}`
      );
      setRDNumbers(response.data);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  };

  const RDfetchMemberDetails = async (RDNumber) => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/RDfetchMemberDetails?RDNumber=${RDNumber}`
      );
      const memberData = response.data;
      if (memberData) {
        setRDFormData({
          ...memberData,
        });
        console.log(memberData);
      } else {
        console.log("No member details found for RDS number:", RDNumber);
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };
  useEffect(() => {
    if (rdquery) {
      RDfetchPhoneNumbers();
    } else {
      setRDNumbers([]);
    }
  }, [rdquery]);

  const handleRDNumber = async (RDNumber) => {
    setSelectedRDNumber(RDNumber);
    RDfetchMemberDetails(RDNumber);
    setRDQuery(RDNumber);
    setRDNumbers([]);
  };
  const handleChangeRD = (e) => {
    const { id, value } = e.target;
    setRDFormData({ ...formData, [id]: value });
  };

 

// Function to submit form data and prepare for the second API call
const submitFormData = async () => {
  try {

     // Create a new object excluding RDNumber and rdBill
     const formDataWithoutRDInfo = { ...formData };
     delete formDataWithoutRDInfo.RDNumber;
     delete formDataWithoutRDInfo.rdBill;

      // Add branchUser from UserContext
    const branchUser = user?.employee?.fullname || '';
    const payloadWithBranchUser = {
      ...formDataWithoutRDInfo,
      branchUser
    };

    const response = await axios.post("http://localhost:2000/api/rd", payloadWithBranchUser);
    console.log("Form data saved:", response.data);
    console.log("Form data saved xxx:", response.data.data);

    // Extract necessary data from the response
    const { _id, startDate, emiAmount } = response.data.data;

    // Prepare the payload for the second POST request
    const emiPayload = {
      emiData: [{
        amount: emiAmount,
        date: startDate,
        branchUser // Add branchUser to EMI payload
      }]
    };
    console.log("emiPayload",emiPayload);

    // Return the combined data for further processing
    return {...response.data, emiPayload };
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
};

// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Attempt to submit the form data
    const submitResult = await submitFormData();
    console.log(submitResult,"submitResult");
    console.log(submitResult.data.status,"submitResult.status");

    

    // Immediately show success alert for the first POST request if successful
    if (submitResult && submitResult.status === 200) {
      alert("RD Details uploaded successfully");
      const {startDate, emiAmount } =submitResult.data

          // Get branchUser from UserContext
      const branchUser = user?.employee?.fullname || '';

       // Get branchUser from UserContext
      const emiPayload = {
        emiData: [{
          amount: emiAmount,
          date: startDate,
          branchUser // Add branchUser to EMI payload
        }]
      };
      
      // Now proceed to make the second POST request
      const emiResult = await axios.post(
        `http://localhost:2000/api/add-emi/${submitResult.data._id}`,
        emiPayload
      );

        // Use the response message from the backend for the second POST request
    const secondRequestMessage = emiResult.data.message || "RD Collection added successfully";

      // Check if the second API call was successful
      if (emiResult && emiResult.status === 200) {
        // Clear the form data state upon successful submission of both requests
        setFormData({
          membershipId: "",
          customerName: "",
          accountType: "",
          schemeType: "",
          customerNumber: "",
          duration: "",
          address: "",
          interest: "",
          RDNumber: "",
          rdBill: "",
          startDate: "",
          time: "",
          RDschemeType: "",
          referenceName: "",
          branchcode: "",
          finalAmount: "",
          emiAmount: ""
        });

        // Close the modal and show additional success alerts
        handleCloseModal();
        alert(secondRequestMessage);
        window.location.reload();
        // alert("RD Collection added successfully");
      } else {
        // If the second API call fails, show an error message
        // alert("Failed to add EMI data. Error: " + JSON.stringify(emiResult.data));

        // If the second API call fails, show an error message using the backend response
      const errorMessage = emiResult.data.message || "Failed to add EMI data.";
      alert(errorMessage);
      }
    } else {
      // If the first API call fails, show an error message
      alert("Failed to save form data. Please try again.");
    }

  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error saving form data:", error);
  if (error.response && error.response.data && error.response.data.error) {
    alert(error.response.data.error);
  } else {
    // Fallback to a generic error message if no specific message is provided by the backend
    alert("An unexpected error occurred. Please try again later.");
  }
  }
};



  useEffect(() => {
    fetch(`http://localhost:2000/api/rd`)
      .then((response) => response.json())
      .then((data) => {
        // Initialize an array to store matching memberships
        const matchingMemberships = [];
        console.log(matchingMemberships,"matchingMemberships");

        // Map over the data to extract the branch code from each RDNumber and compare with user's branch code
        const branchCodes = data.map((item) => {
          if (item.branchcode) {
            console.log("item.branchcode",item.branchcode);
            const branchCode = user?.branchDetails?.branchCode;
            // Check if the extracted branch code matches the user's branch code
            if (branchCode === item.branchcode) {
              // If they match, add the membership to the matchingMemberships array
              const x=matchingMemberships.push(item);
              console.log("xxx",x);
            }
            return branchCode;
            console.log(branchCode,"branchCode return");
          }
          return undefined;
        });

        setNewRDdata(matchingMemberships);
       
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [showModalMatu, setShowModalMatu] = useState(false);
  const [showModalPreMatu, setShowModalPreMatu] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const handleMaturityClick = () => {
    setShowModalMatu(true);
  };
  const handlePreMaturityClick = () => {
    setShowModalPreMatu(true);
  };

  const handleCloseModalMatu = () => {
    setShowModalMatu(false); // Corrected to setShowModalMatu(false)
  };

  const handleCloseModalPreMatu = () => {
    setShowModalPreMatu(false); // Corrected to setShowModalMatu(false)
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
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

  //si modal

  const handleCloseModalCalc = () => {
    setShowModalCalc(false);
  };
  const [showModalCalc, setShowModalCalc] = useState(false);
  const toggleModalCalc = () => {
    setShowModalCalc(!showModalCalc);
  };

  //multiple collection adding
  const [showModalMulti, setShowModalMulti] = useState(false);
  const toggleModalMulti = () => {
    setShowModalMulti(!showModalMulti);
  };
  const handleCloseModalMulti = () => {
    setShowModalMulti(false);
  };

  //history
  const [showModalHisto, setShowModalHisto] = useState(false);
  const toggleModalHisto = () => {
    setShowModalHisto(!showModalHisto);
  };
  const handleCloseModalHisto = () => {
    setShowModalHisto(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);

    window.location = `/`;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterData(e.target.value.toLowerCase());
  };

  const filterData = (query) => {
    const filtered = newRDdata.filter((rdData) => {
      return (
        rdData.membershipId.toLowerCase().includes(query) ||
        rdData.customerName.toLowerCase().includes(query) ||
        rdData.RDNumber.toLowerCase().includes(query) ||
        rdData.branchcode.toLowerCase().includes(query)
      );
    });
    setFilteredData(filtered);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handlePageInputChange = (event) => {
    const value = event.target.value;
    setPageInput(value);
    if (!isNaN(value) && value >= 1 && value <= totalPages()) {
      setCurrentPage(parseInt(value)); // Update the currentPage state only if the input value is valid
    }
  };

  const totalPages = () => {
    const totalRows =
      searchQuery === "" ? newRDdata.length : filteredData.length;
    return Math.ceil(totalRows / rowsPerPage);
  };
  const getSLNo = (index) => {
    return (currentPage - 1) * rowsPerPage + index + 1;
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
    fetch("https://api.malabarbank.in/api/rd")
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
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownVisible(value !== ""); // Show the dropdown if there is input
  };

  const [showModalWithdrawReceipt, setShowModalWithdrawReceipt] =
    useState(false);

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
    const lakhsInWords =
      lakhs > 1 ? numberToWords.toWords(lakhs) + " Lakhs" : "One Lakh";

    if (remaining === 0) {
      return lakhsInWords;
    }

    const remainingInWords = numberToWords.toWords(remaining);
    return `${lakhsInWords} ${remainingInWords}`;
  }

  function AmountInWords({ amount }) {
    const amountInWords = formatIndianNumber(amount);

    return (
      <p>
        <b>In words:</b> {amountInWords} only
      </p>
    );
  }

  return (
    <div>
      <div className="container border rounded p-4 mt-4 mb-4">
        <nav className="navbar navbar-light ">
          <div className="container-fluid">
            <Link
              className="navbar-brand ms-5 d-flex align-items-center"
              to="/main"
            >
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
        <center>
          <h2>RECCURING DEPOSIT</h2>
        </center>

        <div className="">
          <div className="circle-buttons-container">
            <div className="mr-2">
              <label htmlFor="referenceNumber">Search</label>
              <input
                type="text"
                className="form-control"
                id="branch"
                name="branch"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter Search"
              />
            </div>

            <div style={{ marginRight: "200px" }}>
              <label style={{ width: "3.5rem" }}>Row No</label>
              <select
                className="form-control "
                onChange={handleRowsPerPageChange}
                value={rowsPerPage}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="circle-button" onClick={handlePlusIconClick}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            {/* <div className="circle-button" onClick={() => {}}>
              <FontAwesomeIcon icon={faEdit} />
            </div> */}
            {/* <div className="circle-button" onClick={togglePopover}>
              <FontAwesomeIcon onClick={togglePopover} icon={faTableList} />
            </div> */}
            <div className="circle-button" onClick={toggleModalCalc}>
              <FontAwesomeIcon icon={faCalculator} />
            </div>
            <div className="circle-button" onClick={handleEmiClick} >
              <FontAwesomeIcon icon={faFileCirclePlus} />
            </div>
            <div className="circle-button" onClick={toggleModalHisto}>
              <FontAwesomeIcon icon={faClockRotateLeft}  />
            </div>
            <div className="circle-button" onClick={() => {}}>
              <FontAwesomeIcon icon={faPrint} />
            </div>
          </div>
          <div style={{ float: "right" }}>
            <Button
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
                marginRight:"5px"
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


          {/* // POPOVER BUTTONS */}
          <div className="Popovermol" ref={popoverRef}>
            <Popover
              show={!showPopover}
              placement="right"
              onClose={togglePopover}
              className="popovertoggler"
            >
              {/* <Popover.Header className="bg-primary text-white" >Withdrawal</Popover.Header> */}
              <Popover.Body className="popoverbody">
                <Button
                  variant="success"
                  className="Maturity-Withdrawal "
                  onClick={handleMaturityClick}
                >
                  Maturity W
                </Button>
                <Button variant="danger" onClick={handlePreMaturityClick}>
                  Pre-Maturity W
                </Button>
              </Popover.Body>
            </Popover>
          </div>
        </div>

        <center style={{ marginTop: "5rem" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>RD JOIN DATE</th>
                <th>MEMBERSHIP ID</th>
                <th>CUSTOMER NAME</th>
                <th>RD NUMBER</th>
                {/* <th>REFERENCE NAME</th> */}
                <th>PHONE NUMBER</th>
                <th>RD COLLECTED</th>
                <th>INTEREST</th>

              </tr>
            </thead>
            <tbody>
              {(searchQuery ? filteredData : newRDdata)
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )
                .reverse()
                .map((rdData, index) => (
                  <tr
                    key={rdData._id}
                    onClick={() => handleRowClick(rdData)}
                    className={selectedRow === rdData ? "selected-row" : ""}
                  >
                    <td>{getSLNo(index)}</td>
                    <td>{rdData.startDate}</td>
                    <td>{rdData.membershipId}</td>
                    <td>{rdData.customerName}</td>
                    <td>{rdData.RDNumber}</td>
                    {/* <td>{rdData.referenceName}</td> */}
                    <td>{rdData.customerNumber}</td>
                    <td>{rdData.monthlyCollection}</td>
                    <td>{rdData.interestRecived}</td>

                  </tr>
                ))}
            </tbody>
          </Table>
          <div>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}  className="me-2">
              Back
            </Button>
            <span>
              <b>Go to:</b>{" "}
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                style={{ width: "4rem", textAlign: "center" }}
              ></input>
              <b>Page:</b> {currentPage} of {totalPages()}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={
                currentPage * rowsPerPage >= filteredData.length &&
                currentPage * rowsPerPage >= newRDdata.length
              }
              className="ms-2"
            >
              Next
            </Button>
          </div>
        </center>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>Reccuring Deposit Form</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-6">
                            
                            <div className="form-group">
                              <label htmlFor="Customer Phonenumber">
                                Customer Phonenumber
                              </label>
                              <div className="form-group ">
                               


                              <Select
 value={selectedPhoneNumber?{ value: selectedPhoneNumber, label: selectedPhoneNumber } : null} 
     onChange={handlePhoneNumberSelection}
    onInputChange={(inputValue) => setQuery(inputValue)}
    options={phoneNumbers}
    placeholder="Enter phone number"
    isClearable={true}
    required
  />
                              </div>
                            </div>









                            
                            <div className="form-group">
                              <label htmlFor="accountHolderName">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="customerName"
                                name="customerName"
                                value={formData.customerName}
                                // onChange={handleChange}
                                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                placeholder="Enter Account Holder Name"
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="accountType">Account Type*</label>
                              <select
                                className="form-control"
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                // onChange={handleChange}
                                onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                                required
                              >
                                <option>--Select--</option>
                                <option value="RD"> RD</option>
                                <option value="MRD">Mahila RD</option>
                                <option value="LSRD">Little Star RD</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="accountType">Scheme Type</label>
                              <select
                                className="form-control"
                                id="RDschemeType"
                                name="RDschemeType"
                                value={formData.RDschemeType}
                                onChange={(e) => {
                                  // handleChange(e);
                                  setFormData({...formData, accountType: e.target.value})
                                  handleAccountTypeSelection(e.target.value);
                                }}
                                required
                              >
                                <option>--Select--</option>
                                {Array.isArray(rdScheme) && rdScheme.map((rdscheme) => (
                                  <option
                                    key={rdscheme.schemeType}
                                    value={rdscheme.RDschemeType}
                                  >
                                    {rdscheme.schemeType}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="duration">
                                Duration in Month*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                // onChange={handleChange}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                placeholder="Enter Duration in Month"
                                required
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="interest">Interest</label>
                              <input
                                type="text"
                                className="form-control"
                                id="interest"
                                name="interest"
                                value={formData.interest}
                                // onChange={handleChange}
                                onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                placeholder="Enter Interest" 
                                required
                                readOnly
                              />
                            </div>
                            {/* <div className="form-group">
                              <label htmlFor="billNumber">Bill Number</label>
                              <input
                                type="text"
                                className="form-control"
                                id="rdBill"
                                name="rdBill"
                                value={formData.rdBill}
                                // onChange={handleChange}
                                onChange={(e) => setFormData({...formData, rdBill: e.target.value})}
                                placeholder="Enter Bill Number"
                                required
                              />
                            </div> */}
                              <div className="form-group">
                              <label htmlFor="EmiAmount">EMI Amount</label>
                              
                                <input
                                  type="text"
                                  className="form-control"
                                  id="amount"
                                  name="amount"
                                  value={formData.emiAmount}
                                  // onChange={handleChange}
                                  onChange={(e)=>setFormData({...formData,emiAmount:e.target.value})}
                                  placeholder="Amount"
                                  required
                                  readOnly
                                />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group ">
                              <label htmlFor="membershipId">
                                Membership ID*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="membershipId"
                                name="membershipId"
                                value={formData.membershipId}
                                // onChange={handleChange}
                                onChange={(e)=>setFormData({...formData,membershipId:e.target.value})}
                                placeholder="Enter Membership ID"
                                required
                                readOnly
                              />

                              
                              {/* <div className="form-group mt-3">
                                <label htmlFor="rdBill">RD Number</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="RDNumber"
                                  name="RDNumber"
                                  value={formData.RDNumber}
                                  // onChange={handleChange}
                                  onChange={(e)=>setFormData({...formData,RDNumber:e.target.value})}
                                  placeholder="Enter RD Number"
                                  required
                                />
                              </div> */}


                              {/* <div className="form-group">
                                <label htmlFor="amount">Amount</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="amount"
                                  name="amount"
                                  value={formData.amount}
                                  // onChange={handleChange}
                                  onChange={(e)=>setFormData({...formData,amount:e.target.value})}
                                  placeholder="Amount"
                                  required
                                />
                              </div> */}
                              <div className="form-group mt-3">
                                {/* <div className="form-control"> */}
                                <label className="label">Date</label>

                                 

<input
                                type="date"
                                className="form-control"
                                id="startDate"
                                value={moment(formData.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                onChange={handleChangeDate}
                                // onChange={(event) => {
                                //   handleChangeDate(event); // Call your existing handleChangeDate function
                                //   setFormData({...formData, startDate: event.target.value}); // Directly update the state
                                // }}
                                placeholder=""
                                required
                              />
                                {/* </div> */}
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
                                  {employees.map((employee) => (
                                    <option
                                      key={employee.id}
                                      value={employee.employeeName}
                                    >
                                      {employee.employeeName}
                                    </option>
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
                                    // onChange={handleChange}
                                    onChange={(e)=>setFormData({...formData,address:e.target.value})}
                                    placeholder="Enter Address"
                                    required
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  Branch Code
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="branch"
                                  name="branchcode"
                                  value={formData.branchcode}
                                  // onChange={handleChange}
                                  onChange={(e)=>setFormData({...formData,branchcode:e.target.value})}
                                  placeholder="Enter branch"
                                  readOnly
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  Total amount
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="finalAmount"
                                  name="finalAmount"
                                  value={formData.finalAmount}
                                  // onChange={handleChange}
                                  onChange={(e)=>setFormData({...formData,finalAmount:e.target.value})}
                                  placeholder=" Final Amount"
                                  readOnly
                                  required
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
                            onClick={() => {setFormData({
                              membershipId: "",
                              customerName: "",
                              accountType: "",
                              schemeType: "",
                              customerNumber: "",
                              duration: "",
                              address: "",
                              interest: "",
                              RDNumber: "",
                              rdBill: "",
                              amount: "",
                              startDate: "",
                              time:"",
                              RDschemeType: "",
                              referenceName: "",
                              branchcode: "",
                              finalAmount: "",
                              emiAmount:""
                            })
                            setSelectedPhoneNumber(''); // Clear the selected phone number
                          }}
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

      {/* //si modal */}
      <Modal
        show={showModalCalc}
        onHide={handleCloseModalCalc}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>SIMPLE INTEREST CALCULATOR</h4>
                    </div>
                    <div className="card-body">
                      <SimpleInterestCalculator />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form ml-4 mt-1 mb-1">
                <Button
                  className=""
                  variant="danger"
                  onClick={handleCloseModalCalc}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* // maturity modal */}
      <Modal
        show={showModalMatu}
        onHide={handleCloseModalMatu}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>MATURITY WITHDRAWAL FORM</h4>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              <label htmlFor="accountHolderName">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountHolderName"
                                name="accountHolderName"
                                // value={formData.accountHolderName}
                                // onChange={handleChange}
                                placeholder="Enter Account Holder Name"
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="accountType">Account Type*</label>
                              <select
                                className="form-control"
                                id="accountType"
                                name="accountType"
                                // value={formData.accountType}
                                // onChange={handleChange}
                                required
                              >
                                <option value=""> RD</option>
                                <option value="Savings">Mahila RD</option>
                                <option value="Current">Little Star</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="duration">
                                Duration in Month*
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="duration"
                                name="duration"
                                // value={formData.duration}
                                // onChange={handleChange}
                                placeholder="Enter Duration in Month"
                                required
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="interest">Commision</label>
                              <input
                                type="text"
                                className="form-control"
                                id="interest"
                                name="interest"
                                // value={formData.interest}
                                // onChange={handleChange}
                                placeholder="Enter Commision"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="billNumber">Bill Number </label>
                              <input
                                type="text"
                                className="form-control"
                                id="billNumber"
                                name="billNumber"
                                // value={formData.billNumber}
                                // onChange={handleChange}
                                placeholder="Enter Bill Number"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="referenceNumber">
                                Paid Month
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="branch"
                                name="branch"
                                // value={formData.branch}
                                // onChange={handleChange}
                                placeholder="Enter Paid Month"
                              />
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="form-group ">
                              <label htmlFor="membershipId">
                                Membership ID*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="membershipId"
                                name="membershipId"
                                // value={formData.membershipId}
                                // onChange={handleChange}
                                placeholder="Enter Membership ID"
                                required
                              />

                              <div className="form-group mt-3">
                                <label htmlFor="rdNumber">RD Number</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="rdNumber"
                                  name="rdNumber"
                                  // value={formData.rdNumber}
                                  // onChange={handleChange}
                                  placeholder="Enter RD Number"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="Mobile-number">
                                  Monthly Amount
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="mobile-number"
                                  name="mobile-number"
                                  // value={formData.mobileNumber}
                                  // onChange={handleChange}
                                  placeholder="Enter Monthly Amount"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="amount">Paid Amount</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="amount"
                                  name="amount"
                                  // value={formData.amount}
                                  // onChange={handleChange}
                                  placeholder="Enter Paid Amount"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="date"
                                  name="date"
                                  // value={formData.date}
                                  // onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  W Slip Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="referenceNumber"
                                  name="referenceNumber"
                                  // value={formData.referenceNumber}
                                  // onChange={handleChange}
                                  placeholder="Enter Reference Number"
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

                          <Button
                            variant="danger"
                            onClick={handleCloseModalMatu}
                          >
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

      {/* // pre-maturity modal */}
      <Modal
        show={showModalPreMatu}
        onHide={handleCloseModalPreMatu}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>PRE MATURITY WITHDRAWAL FORM</h4>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              <label htmlFor="accountHolderName">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="accountHolderName"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                placeholder="Enter Account Holder Name"
                                readOnly
                              />
                            </div>
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
                                <option value=""> RD</option>
                                <option value="Savings">Mahila RD</option>
                                <option value="Current">Little Star</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label htmlFor="duration">
                                Duration in Month*
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Enter Duration in Month"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="interest">Duration</label>
                              <input
                                type="text"
                                className="form-control"
                                id="interest"
                                name="interest"
                                value={formData.interest}
                                onChange={handleChange}
                                placeholder="Enter Commision"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="billNumber">
                                Duration Amount
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="billNumber"
                                name="billNumber"
                                value={formData.billNumber}
                                onChange={handleChange}
                                placeholder="Enter Bill Number"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="referenceNumber">
                                Monthly Amount
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="branch"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                placeholder="Enter Paid Month"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="referenceNumber">
                                Paid Amount
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="referenceNumber"
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleChange}
                                placeholder="Enter Reference Number"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="referenceNumber">
                                Paid Month
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="referenceNumber"
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleChange}
                                placeholder="Enter Reference Number"
                              />
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="form-group ">
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

                              <div className="form-group mt-3">
                                <label htmlFor="rdNumber">RD Number</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="rdNumber"
                                  name="rdNumber"
                                  value={formData.rdNumber}
                                  onChange={handleChange}
                                  placeholder="Enter RD Number"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="Mobile-number">
                                  Monthly Interest Percentage
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="mobile-number"
                                  name="mobile-number"
                                  value={formData.mobileNumber}
                                  onChange={handleChange}
                                  placeholder="Enter Monthly Interest Percentage"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="amount">
                                  Paid Amount with I{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="amount"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleChange}
                                  placeholder="Enter Paid Amount with I"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="date"
                                  name="date"
                                  value={formData.date}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  Interest Cutter
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="referenceNumber"
                                  name="referenceNumber"
                                  value={formData.referenceNumber}
                                  onChange={handleChange}
                                  placeholder="Enter Interest %"
                                  readOnly
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  Final Amount
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="referenceNumber"
                                  name="referenceNumber"
                                  value={formData.referenceNumber}
                                  onChange={handleChange}
                                  placeholder="Enter Final Amount"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="referenceNumber">
                                  W Slip Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="referenceNumber"
                                  name="referenceNumber"
                                  value={formData.referenceNumber}
                                  onChange={handleChange}
                                  placeholder="Enter Reference Number"
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

                          <Button
                            variant="danger"
                            onClick={handleCloseModalPreMatu}
                          >
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
              style={{ width: "15rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <ul
                className="dropdown-menu2"
                style={{ display: searchTerm ? "block" : "none" }}
              >
                {customerData
                  .filter(
                    (customer) =>
                      customer.customerName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      customer.customerNumber
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((customer, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      onClick={() =>
                        handleMobileSelect(customer.customerNumber)
                      }
                    >
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
                  // style={{
                  //   position: "absolute",
                  //   top: 0,
                  //   left: 0,
                  //   width: "100%",
                  //   height: "100%",
                  //   zIndex: "9999",
                  //   pointerEvents: "none", // Ensure the watermark doesn't interfere with interaction
                  //   backgroundImage: `url('/logo copy.png')`, // Replace 'path_to_your_watermark_image.jpg' with the path to your image
                  //   backgroundSize: "85%", // Adjust the background size to fit the content
                  //   opacity: "0.1", // Adjust the opacity to your preference
                  // }}
                ></div>
                <div
                  style={{
                    float: "right",
                    marginRight: "2rem",
                    marginTop: "10rem",
                  }}
                >
                  <p>
                    <b>Receipt ID:</b> {receiptData ? receiptData.rdBill : ""}
                  </p>
                  <p>
                    <b>Date:</b> {receiptData ? receiptData.date : ""}
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
                    Recurring Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Received From:</b>{" "}
                    {receiptData ? receiptData.customerName : ""}{" "}
                  </p>
                  <p>
                    <b>Address: </b> {receiptData ? receiptData.address : ""}{" "}
                  </p>
                  <p>
                    <b>Account Number: </b>{" "}
                    {receiptData ? receiptData.RDNumber : ""}
                  </p>
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
                  <p className="ml-5">
                    {" "}
                    {receiptData ? (
                      <AmountInWords amount={receiptData.amount} />
                    ) : null}
                  </p>
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
                      marginLeft: "30rem",
                    }}
                  >
                    <div style={{ paddingTop: "5px" }}>
                      <h5>
                        Total Amount: {receiptData ? receiptData.amount : ""}/-
                      </h5>
                    </div>
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
                  <p>
                    <b>Receipt ID:</b> {receiptData ? receiptData.rdBill : ""}
                  </p>
                  <p>
                    <b>Date:</b> {receiptData ? receiptData.date : ""}
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
                    Recurring Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Received From:</b>{" "}
                    {receiptData ? receiptData.customerName : ""}{" "}
                  </p>
                  <p>
                    <b>Address: </b> {receiptData ? receiptData.address : ""}{" "}
                  </p>
                  <p>
                    <b>Account Number: </b>{" "}
                    {receiptData ? receiptData.RDNumber : ""}
                  </p>
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
                  <p className="ml-5">
                    {" "}
                    {receiptData ? (
                      <AmountInWords amount={receiptData.amount} />
                    ) : null}
                  </p>
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
                      marginLeft: "30rem",
                    }}
                  >
                    <div style={{ paddingTop: "5px" }}>
                      <h5>
                        Total Amount: {receiptData ? receiptData.amount : ""}/-
                      </h5>
                    </div>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <ul
                className="dropdown-menu"
                style={{ display: searchTerm ? "block" : "none" }}
              >
                {customerData
                  .filter(
                    (customer) =>
                      customer.customerName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      customer.customerNumber
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((customer, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      onClick={() =>
                        handleMobileSelect(customer.customerNumber)
                      }
                    >
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
                  <p>
                    <b>Receipt ID:</b> {receiptData ? receiptData.rdBill : ""}
                  </p>
                  <p>
                    <b>Date:</b> {receiptData ? receiptData.date : ""}
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
                    Recurring Deposit Withdrawal Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Paid To:</b>{" "}
                    {receiptData ? receiptData.customerName : ""}{" "}
                  </p>
                  <p>
                    <b>Address: </b> {receiptData ? receiptData.address : ""}{" "}
                  </p>
                  <p>
                    <b>Account Number: </b>{" "}
                    {receiptData ? receiptData.RDNumber : ""}
                  </p>
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
                  <p className="ml-5">
                    {" "}
                    {receiptData ? (
                      <AmountInWords amount={receiptData.amount} />
                    ) : null}
                  </p>
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
                      marginLeft: "30rem",
                    }}
                  >
                    <div style={{ paddingTop: "5px" }}>
                      <h5>
                        Total Amount: {receiptData ? receiptData.amount : ""}/-
                      </h5>
                    </div>
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
                  <p>
                    <b>Receipt ID:</b> {receiptData ? receiptData.rdBill : ""}
                  </p>
                  <p>
                    <b>Date:</b> {receiptData ? receiptData.date : ""}
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
                    Recurring Deposit Withdrawal Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Paid To:</b>{" "}
                    {receiptData ? receiptData.customerName : ""}{" "}
                  </p>
                  <p>
                    <b>Address: </b> {receiptData ? receiptData.address : ""}{" "}
                  </p>
                  <p>
                    <b>Account Number: </b>{" "}
                    {receiptData ? receiptData.RDNumber : ""}
                  </p>
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
                  <p className="ml-5">
                    {" "}
                    {receiptData ? (
                      <AmountInWords amount={receiptData.amount} />
                    ) : null}
                  </p>
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
                      marginLeft: "30rem",
                    }}
                  >
                    <div style={{ paddingTop: "5px" }}>
                      <h5>
                        Total Amount: {receiptData ? receiptData.amount : ""}/-
                      </h5>
                    </div>
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
      <RdEmiModal
      show={showEmiModal}
      onHide={() => setShowEmiModal(false)} />
      <RdEmiHistory
       show={showModalHisto}
       onHide={() => setShowModalHisto(false)} />
    </div>
  );
};

export default Rdsov;
