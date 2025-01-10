import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPrint,
  faArrowLeft,
  faArrowRight,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import axios from "axios";
import Nav from "../../Others/Nav";
import { UserContext } from "../../Others/UserContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../style/logo.png";
import moment from "moment";

const Savings = () => {
  const [branchCode, setBranchCode] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [newSVdata, setNewSVdata] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(UserContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (SavingsData) => {
    setSelectedRow(SavingsData);
  };

  // Set to store previously generated RD numbers
  const generatedsvBills = new Set();

  const [formData, setFormData] = useState({
    membershipId: "",
    customerName: "",
    accountNumber: "",
    address: "",
    newDate: "",
    deposit: "",
    depositwords: "",
    customerNumber: "",
    type: "Initial",
    remarks: "",
    branchcode: user?.branchDetails?.branchCode,
    loginUser: "",
    loginUserTime: "",
    transactionId: "",
    savingsBill: "",
    branchUser: "",
    branchUserDate: "",
    branchUserTime: "",
  });
  const currentDate2 = new Date();

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
  const loginBranchUser = user.employee.fullname;
  const loginUserDate = currentDate2.toLocaleDateString("en-GB", dateOptions);
  const loginUserTime = currentDate2.toLocaleTimeString("en-GB", timeOptions);
  //generate RD Number
  const [accountTypeCounts, setAccountTypeCounts] = useState({});

  const updateSavingsNumber = (branchCode) => {
    let accountType = formData.accountType || "S";

    if (!accountTypeCounts[accountType]) {
      setAccountTypeCounts((prevCounts) => ({
        ...prevCounts,
        [accountType]: 1,
      }));
    } else {
      setAccountTypeCounts((prevCounts) => ({
        ...prevCounts,
        [accountType]: prevCounts[accountType] + 1,
      }));
    }

    const newNumber = accountTypeCounts[accountType] || 1;
    const newSavingsNumber = `S${branchCode}${newNumber
      .toString()
      .padStart(5, "0")}`;
    console.log(newSavingsNumber);
    setFormData((prevFormData) => ({
      ...prevFormData,
      accountNumber: newSavingsNumber,
      accountType: formData.accountType,
      transactionId: formData.transactionId,
      savingsBill: formData.savingsBill,
      branchUser: loginBranchUser,
      branchUserDate: loginUserDate,
      branchUserTime: loginUserTime,
      type: "Initial",
    }));
    console.log("Updated RDNumber:", newSavingsNumber);
  };

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    if (formData.accountType && branchCode) {
      updateSavingsNumber(branchCode);
    }
  }, [formData.accountType, branchCode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      savingsBill: "",
      transactionId: "",
      [e.target.name]: e.target.value,
      // date: currentDate.toLocaleString(),
    });
  };
  const handleChangeDate = (event) => {
    const newDate = moment(event.target.value).format("DD/MM/YYYY");
    setFormData({ ...formData, newDate });
  };

  const [showModal, setShowModal] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // fetch by mobile

  const submitFormData = async () => {
    try {
      const { _id, ...formDataWithoutId } = formData;
      const response = await axios.post(
        "https://api.malabarbank.in/api/savings",
        formDataWithoutId
      );
      console.log("Form data saved:", response.data);
      window.location.href = "/savings";
    } catch (error) {
      console.error("Error saving form data:", error.response.data);
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
  const [searchSavings, setSearchSavings] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    fetchSavingsData(currentPage, pageSize, branchCode, searchSavings);
  }, [currentPage, pageSize, branchCode, searchSavings]);

  const fetchSavingsData = async (
    page,
    size,
    branchCode,
    searchSavings = "",
    pageNumber = 1
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.malabarbank.in/api/savings?page=${page}&limit=${size}&branchCode=${branchCode}&searchSavings=${searchSavings}&pageNumber=${pageNumber}`
      );

      // setNewSVdata(response.data.data);
      const cleanedData = response.data.data.map(({ _id, ...rest }) => rest);
      setNewSVdata(cleanedData);

      setNextPage(response.data.nextPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchSavings(value);
    fetchSavingsData(1, pageSize, branch, value);
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
      const branchCode = user?.branchDetails?.branchCode;
      fetchSavingsData(currentPage + 1, pageSize, branchCode); // Include branchCode
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const branchCode = user?.branchDetails?.branchCode;
      fetchSavingsData(currentPage - 1, pageSize, branchCode); // Include branchCode
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    fetchSavingsData(1, newSize);
  };
  const handlePageNumberChange = (e) => {
    setPageNumber(e.target.value);
  };

  const goToPage = () => {
    const pageNumberInt = parseInt(pageNumber);
    if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
      setCurrentPage(pageNumberInt);
      fetchSavingsData(pageNumberInt, pageSize, branch, searchTerm);
      fetchSavingsData("");
    } else {
      const inputBox = document.getElementById("pageNumberInput");
      inputBox.classList.add("input-error");

      const errorMessage = document.createElement("div");
      errorMessage.innerText = "Please enter a valid page number.";
      errorMessage.classList.add("error-message");
      inputBox.parentNode.insertBefore(errorMessage, inputBox.nextSibling);

      setTimeout(() => {
        inputBox.classList.remove("input-error");
        errorMessage.remove();
      }, 3000);
    }
  };

  // const [customerMobile, setCustomerMobile] = useState([]);
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
    fetch("https://api.malabarbank.in/api/savings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        const data = responseData.data;

        // Filter out the _id field from each item in the data array
        const cleanedData = data.map((item) => {
          const { _id, ...cleanedItem } = item;
          return cleanedItem;
        });

        // Check if cleanedData is an array before setting it to customerData
        if (Array.isArray(cleanedData)) {
          setCustomerData(cleanedData);
        } else {
          console.error("Expected an array but received:", cleanedData);
          setCustomerData([]);
        }
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  };
  // const fetchCustomerData = () => {
  //   fetch("https://api.malabarbank.in/api/savings")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((responseData) => {
  //       const data = responseData.data;

  //       // Check if data is an array before setting it to customerData
  //       if (Array.isArray(data)) {
  //         setCustomerData(data);
  //       } else {
  //         console.error("Expected an array but received:", data);
  //         setCustomerData([]);
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching customer data:", error));
  // };

  const handleMobileSelect = (value) => {
    setSelectedMobile(value);
    // setSearchTerm(value); // Set the selected value to the search term
    // Fetch related data for the selected mobile number and update receiptData state
    fetchReceiptData(value);
    setIsDropdownVisible(false); // Hide the dropdown after selection
  };

  const fetchReceiptData = (mobile) => {
    // Find the customer object corresponding to the selected mobile number
    const selectedCustomer = customerData.find(
      // (customer) => customer.customerNumber === mobile
      (customer) => customer.accountNumber === mobile
    );
    if (selectedCustomer) {
      setReceiptData(selectedCustomer); // Set the receipt data based on the selected customer object
    } else {
      setReceiptData(null); // Clear the receipt data if customer not found
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

  function AmountInWords({ amount }) {
    // console.log("Deposit value:", amount); // Add this line to check the value
    const amountInWords = formatIndianNumber(Number(amount));

    return (
      <p>
        <b>In words:</b> {amountInWords} only
      </p>
    );
  }
  //data fetching from membership
  const [numberData, setNumberData] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchMemberships(currentPage, pageSize, branchCode, searchNumber);
    console.log(branchCode);
  }, [currentPage, pageSize, branchCode, searchNumber]);

  const fetchMemberships = async (
    page,
    size,
    branchCode,
    selectedNumber = ""
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.malabarbank.in/api/membership?page=${page}&limit=${size}&branchCode=${branchCode}&selectedNumber=${selectedNumber}`
      );
      setNumberData(response.data.data);
    } catch (error) {
      console.error("Error fetching memberships data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNumberSelect = (value) => {
    fetchData(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customerNumber: value, // Assuming value is the fetched phone number
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

  const [showModalHisto, setShowModalHisto] = useState(false);
  const toggleModalHisto = () => {
    setShowModalHisto(!showModalHisto);
  };
  const handleCloseModalHisto = () => {
    setShowModalHisto(false);
  };

  const [historyData, setHistoryData] = useState([]);
  const [hisPageSize, setHisPageSize] = useState(10);
  const [nextHisPage, setNextHisPage] = useState(false);
  const [currentHisPage, setCurrentHisPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const branch = user?.branchDetails?.branchCode;

  useEffect(() => {
    fetchHistoryData(
      currentHisPage,
      hisPageSize,
      branch,
      searchTerm,
      fromDate,
      toDate
    );
  }, [currentHisPage, hisPageSize, branch, searchTerm, fromDate, toDate]);

  const fetchHistoryData = async (
    currentHisPage,
    size,
    branch,
    searchTerm = "",
    fromDate = "",
    toDate = ""
  ) => {
    try {
      const response = await fetch(
        `https://api.malabarbank.in/api/savings?page=${currentHisPage}&branch=${branch}&limit=${size}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`
      );
      const responseData = await response.json();
      console.log("Received data:", responseData); // Log the received data

      if (Array.isArray(responseData.data)) {
        // Process data if the 'data' property is an array
        const newHistoryData = responseData.data.map((entry) => {
          const { balance, ...rest } = entry; // Extract balance from entry
          return { ...rest, balance }; // Include balance in entry
        });

        setHistoryData(newHistoryData);
        setNextHisPage(responseData.nextPage); // Update nextPage with responseData.nextPage
        console.log("History savings", newHistoryData);
      } else {
        console.error("Error: Data property is not an array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleHistorysearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchHistoryData(1, hisPageSize, branch, value, fromDate, toDate);
  };

  const handleNextHistoryPage = () => {
    if (nextHisPage) {
      setCurrentHisPage(currentHisPage + 1);
      fetchHistoryData(
        currentHisPage + 1,
        hisPageSize,
        branch,
        searchTerm,
        fromDate,
        toDate
      );
    }
  };

  const handlePreviousHistoryPage = () => {
    if (currentHisPage > 1) {
      setCurrentHisPage(currentHisPage - 1);
      fetchHistoryData(currentHisPage - 1, hisPageSize, branch, searchTerm);
    }
  };

  const handleHistoryPageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setHisPageSize(newSize);
    setCurrentHisPage(1);
    fetchHistoryData(1, newSize, branch, searchTerm, fromDate, toDate);
  };
  const handleFetchByDate = () => {
    fetchHistoryData(1, hisPageSize, branch, searchTerm, fromDate, toDate);
  };

  const [selectedRowHistory, setSelectedRowHistory] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [showModalHistory, setShowModalHistory] = useState(false);

  const handleRowClickHistory = (item, index, data = null, dataIndex = null) => {
    const selectedRowHistory = data || item;
    const parentItem = item;
    setSelectedRowHistory({...selectedRowHistory,parentItem});
    setSelectedItemIndex({ index, dataIndex });
    setShowModalHistory(true);
  };

  const closeModalHistory = () => {
    setSelectedRowHistory(null);
    setShowModalHistory(false);
  };

  const [selectedRowEdit, setSelectedRowEdit] = useState(null); // State variable to store the selected row data
  const [showModalEdit, setShowModalEdit] = useState(false); // State variable to manage modal visibility
  const [membershipId, setMembershipId] = useState("");
  const [slNo, setSlNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [depositwords, setDepositwords] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [branchcode, setBranchcode] = useState("");

  const handleRowClickEdit = (svData) => {
    setSelectedRowEdit(svData);
    setSlNo(svData.sl_no);
    setMembershipId(svData.membershipId);
    setCustomerName(svData.customerName);
    setCustomerNumber(svData.customerNumber);
    setAccountNumber(svData.accountNumber);
    setAddress(svData.address);
    setDate(svData.date);
    setDeposit(svData.deposit);
    setDepositwords(svData.depositwords);
    setRemarks(svData.remarks);
    setBranchcode(svData.branchcode);
    setShowModalEdit(true); // Set showModal to true to display the modal
  };

  const handleCloseModalEdit = () => {
    setShowModalEdit(false); // Close the modal
  };

  const handleSaveChanges = () => {
    // Display confirmation dialog
    const confirmSave = window.confirm(
      "Are you sure you want to save changes?"
    );

    // If user confirms, proceed with saving changes
    if (confirmSave) {
      axios
        .put(
          `https://api.malabarbank.in/api/savings/${selectedRowEdit.accountNumber}`,
          {
            membershipId,
            customerName,
            accountNumber,
            address,
            date,
            deposit,
            depositwords,
            customerNumber,
            remarks,
            branchcode,
          }
        )
        .then((response) => {
          console.log("Phone number updated successfully:", customerNumber);
          handleCloseModalEdit();
          toast.success("Changes saved successfully!", {
            position: "top-center",
          });
        })
        .catch((error) => {
          console.error("Error updating phone number:", error);
          toast.error("Failed to save changes. Please try again later.", {
            position: "top-center",
          });
        });
    }
  };

  function convertToIndianWords(number) {
    const parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber) || !isFinite(parsedNumber)) {
      return "";
    }

    const croreValue = Math.floor(parsedNumber / 10000000);
    const lakhValue = Math.floor((parsedNumber % 10000000) / 100000);
    const thousandValue = Math.floor((parsedNumber % 100000) / 1000);
    const remainder = Math.floor(parsedNumber % 1000);

    let words = "";

    if (croreValue > 0) {
      words +=
        capitalizeFirstLetter(numberToWords.toWords(croreValue)) + " Crore ";
    }
    if (lakhValue > 0) {
      words +=
        capitalizeFirstLetter(numberToWords.toWords(lakhValue)) + " Lakh ";
    }
    if (thousandValue > 0) {
      words +=
        capitalizeFirstLetter(numberToWords.toWords(thousandValue)) +
        " Thousand ";
    }
    if (remainder > 0) {
      words += capitalizeFirstLetter(numberToWords.toWords(remainder));
    }

    return words.trim();
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const clearDates = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <div>
      <div className="container border rounded p-4 mt-4 mb-4">
        <Nav />
        <center>
          <h2>SAVINGS ACCOUNT</h2>
        </center>
        <div className="">
          <div className="circle-buttons-container">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-0 ">
                  <label htmlFor="referenceNumber" className="mr-2">
                    Search:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="branch"
                    name="branch"
                    // value={searchTermTable}
                    onChange={handleSearch}
                    placeholder="Enter Search"
                    style={{ width: "20rem" }}
                  />
                </div>
              </div>
              <div className="col-md-6 ">
                <div className="form-group mb-0" style={{ marginLeft: "5rem" }}>
                  <div>
                    <label htmlFor="pageNumber" className="mr-2">
                      Row No:
                    </label>
                  </div>
                  <div>
                    <select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      className="form-control"
                      style={{ width: "3rem" }}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="circle-button"
              style={{ marginLeft: "23rem" }}
              onClick={handlePlusIconClick}
            >
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="circle-button" onClick={toggleModalHisto}>
              <FontAwesomeIcon icon={faClockRotateLeft} />
            </div>
            <div className="circle-button">
              <FontAwesomeIcon icon={faPrint} />
            </div>
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
                    <th style={{ textAlign: "center" }}>SL NO</th>
                    <th style={{ textAlign: "center" }}>CUSTOMER NAME</th>
                    <th style={{ textAlign: "center" }}>MEMBERSHIP ID</th>
                    <th style={{ textAlign: "center" }}>ACCOUNT NUMBER</th>
                    <th style={{ textAlign: "center" }}>Customer Address</th>
                    <th style={{ textAlign: "center" }}>Date</th>
                    <th style={{ textAlign: "center" }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {newSVdata.map((svData,index) =>  {
                    let balance = parseFloat(svData.amount  || svData.deposit) || 0; // Initialize balance with amount

                    if (svData.transferData && svData.transferData.length > 0) {
                      svData.transferData.forEach((trans) => {
                        // Add newAmount and subtract withdrawalAmount for each EmiData entry
                        balance += (parseFloat(trans.newAmount) || 0) - (parseFloat(trans.withdrawalAmount) || 0);
                      });
                    }
                    return (
                    <tr
                      key={svData._id}
                      onClick={() => handleRowClickEdit(svData)}
                      className={selectedRow === svData ? "selected-row" : ""}
                    >
                      <td>{index+1}</td>
                      <td>{svData.customerName}</td>
                      <td>{svData.membershipId}</td>
                      <td>{svData.accountNumber}</td>
                      <td>{svData.address}</td>
                      <td>{svData.date || svData.newDate}</td>
                      <td>{balance}</td>
                    </tr>
                  );
                  })}
                </tbody>
              </Table>
            )}
            <div className="pagination-buttons">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faArrowLeft} /> Previous
              </Button>
              <span>Page {currentPage}</span>
              <Button onClick={handleNextPage} disabled={!nextPage}>
                Next <FontAwesomeIcon icon={faArrowRight} />
              </Button>
              <select value={pageSize} onChange={handlePageSizeChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <nav aria-label="Page navigation example col">
              <ul class="pagination justify-content-end">
                <li class="page-item disabled">Enter page number:</li>
                <li class="page-item">
                  <input
                    id="pageNumberInput"
                    type="number"
                    value={pageNumber}
                    style={{
                      width: "50px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    onChange={handlePageNumberChange}
                    aria-label="Page number input"
                  />
                </li>
                <li class="page-item">
                  <Button onClick={goToPage} disabled={!nextPage}>
                    Go
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </center>
      </div>

      {/*edit modal*/}
      <Modal show={showModalEdit} onHide={handleCloseModalEdit} size="xl">
        <Modal.Header
          style={{
            color: "white",
            backgroundColor: "#488A99",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          closeButton
        >
          <Modal.Title style={{ margin: "auto", flex: "1" }}>
            Edit Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formSlNo">
                  <Form.Label>Sl No</Form.Label>
                  <Form.Control
                    type="text"
                    value={slNo}
                    onChange={(e) => setSlNo(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCustomerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formMembershipId">
                  <Form.Label>Membership ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formAccountNumber">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formDeposit">
                  <Form.Label>Deposit</Form.Label>
                  <Form.Control
                    type="text"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>Customer Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalEdit}>
            Close
          </Button>
          {/* Add save changes button */}
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form container" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>ADD NEW SAVINGS ACCOUNT</h4>
              </div>
              <div className="card-body ">
                <form onSubmit={handleSubmit} className="mt-3">
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <div className="form-group">
                        <label
                          htmlFor="Customer Phonenumber"
                          style={{ marginLeft: "-1rem" }}
                        >
                          Customer Phone Number
                        </label>
                        <Form.Control
                          type="text"
                          placeholder="Search..."
                          style={{ width: "28rem", marginLeft: "-1rem" }}
                          value={searchNumber}
                          onChange={(e) => setSearchNumber(e.target.value)}
                          onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                        />
                        {/* {showDropdown && searchNumber && (
                          <ul className="dropdown-menu2">
                            {numberData
                              .filter((customer) =>
                                customer.customerMobile.toLowerCase().includes(searchNumber.toLowerCase())
                              )
                              .map((customer, index) => (
                                <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleNumberSelect(customer.customerMobile); }}>
                                  {customer.customerName} - {customer.customerMobile}
                                </li>
                              ))}
                          </ul>
                        )} */}
                        {showDropdown && searchNumber && (
                          <ul className="dropdown-menu2">
                            {numberData
                              .filter(
                                (customer) =>
                                  customer &&
                                  customer.customerMobile &&
                                  customer.customerMobile
                                    .toLowerCase()
                                    .includes(searchNumber.toLowerCase())
                              )
                              .map((customer, index) => (
                                <li
                                  key={index}
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNumberSelect(customer.customerMobile);
                                  }}
                                >
                                  {customer.customerName} -{" "}
                                  {customer.customerMobile}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <label
                        htmlFor="accountType"
                        style={{ marginLeft: "-1rem" }}
                      >
                        Account Type*
                      </label>
                      <select
                        className="form-control"
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        style={{ width: "28rem", marginLeft: "-1rem" }}
                        required
                      >
                        <option>--Select--</option>
                        <option value="S">SAVINGS</option>
                      </select>
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
                        onChange={handleChange}
                        placeholder=""
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="accountHolderAddress">
                        Address :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="membershipId">
                        Membership ID :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="membershipId"
                        name="membershipId"
                        value={formData.membershipId}
                        onChange={handleChange}
                        placeholder=""
                        required
                        readOnly
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="accountNumber">
                        Account Number :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="initialDeposit">
                        Initial Deposit :
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="deposit"
                        name="deposit"
                        value={formData.deposit}
                        onChange={handleChange}
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="initialDeposit">
                        Initial Deposit (In Words) :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="depositwords"
                        name="depositwords"
                        value={convertToIndianWords(formData.deposit)}
                        onChange={handleChange}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="remarks">
                        Remarks :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="date">
                        Date :
                      </label>
                      {/* <div className="form-control">
                        {currentDate.toLocaleString()}
                      </div> */}
                      <input
                        type="date"
                        id="date"
                        name="date"
                        className="form-control"
                        value={moment(formData.newDate, "DD/MM/YYYY").format(
                          "YYYY-MM-DD"
                        )}
                        onChange={handleChangeDate}
                        required
                      />
                    </div>
                  </div>

                  <center>
                    <div className="form-group mt-5">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                      <button type="reset" className="btn btn-secondary m-2">
                        Reset
                      </button>
                      <Button variant="danger" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Savings HISTORY modal */}
      <Modal
        show={showModalHisto}
        onHide={handleCloseModalHisto}
        size="xl"
        // dialogClassName="add-multi custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form">
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>SAVINGS HISTORY</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-6">
                          <label htmlFor="referenceNumber">Search</label>
                          <input
                            type="text"
                            className="form-control"
                            id="branch"
                            name="branch"
                            value={historyData.branch}
                            onChange={handleHistorysearch}
                            placeholder="Enter Search"
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6">
                          <label htmlFor="fromDate">From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="fromDate"
                            value={moment(fromDate, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            onChange={(e) =>
                              setFromDate(
                                moment(e.target.value, "YYYY-MM-DD").format(
                                  "DD/MM/YYYY"
                                )
                              )
                            }
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="toDate">To Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="toDate"
                            value={moment(toDate, "DD/MM/YYYY").format(
                              "YYYY-MM-DD"
                            )}
                            onChange={(e) =>
                              setToDate(
                                moment(e.target.value, "YYYY-MM-DD").format(
                                  "DD/MM/YYYY"
                                )
                              )
                            }
                          />
                        </div>
                        <div className="col-12 d-flex justify-content-center mt-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={clearDates}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <center>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>SL NO</th>
                              <th>NAME</th>
                              <th>ACCOUNT NO</th>
                              <th>DATE</th>
                              <th>TYPE</th>
                              <th>SAVINGS BILL</th>
                              <th>AMOUNT</th>
                              <th>TRANSACTION ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyData.map((item, index) => {
                              const entryDate = item.date;
                              const filteredTransferData = item.transferData
                                ? item.transferData.filter((trans) => {
                                    const transDate = trans.Date;
                                    return (
                                      (!fromDate || transDate >= fromDate) &&
                                      (!toDate || transDate <= toDate)
                                    );
                                  })
                                : [];
                              const isEntryInRange =
                                (!fromDate || entryDate >= fromDate) &&
                                (!toDate || entryDate <= toDate);
                              if (
                                filteredTransferData.length === 0 &&
                                !isEntryInRange
                              ) {
                                return null;
                              }
                              return (
                                <React.Fragment key={item._id}>
                                  {isEntryInRange && (
                                    <tr
                                      onClick={() =>
                                        handleRowClickHistory(item,index)
                                      }
                                    >
                                      <td>{index + 1}</td>
                                      <td>{item.customerName}</td>
                                      <td>{item.accountNumber}</td>
                                      <td>{item.date || item.newDate}</td>
                                      <td>{item.type}</td>
                                      <td>{item.savingsBill}</td>
                                      <td>{item.amount || item.deposit}</td>
                                      <td>{item.transactionId}</td>
                                    </tr>
                                  )}
                                  {filteredTransferData.map((data, dataIndex) => (
                                      <tr
                                        key={`${item._id}_data_${dataIndex}`}
                                        onClick={() =>
                                          handleRowClickHistory(item,index,data,dataIndex)
                                        }
                                      >
                                        <td>
                                          {index + 1}.{dataIndex + 1}
                                        </td>
                                        <td>{item.customerName}</td>
                                        <td>{item.accountNumber}</td>
                                        <td>{data.Date}</td>
                                        <td>{data.Type}</td>
                                        <td>
                                          {data.depositSavingsBill ||
                                            data.withdrawSavingsBill}
                                        </td>
                                        <td>
                                          {data.newAmount ||
                                            data.withdrawalAmount}
                                        </td>
                                        <td>
                                          {data.depositTransactionId ||
                                            data.withdrawTransactionId}
                                        </td>
                                      </tr>
                                    ))}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </Table>
                        <div className="pagination-buttons">
                          <Button
                            onClick={handlePreviousHistoryPage}
                            disabled={currentHisPage === 1}
                          >
                            <FontAwesomeIcon icon={faArrowLeft} /> Previous
                          </Button>
                          <span>Page {currentHisPage}</span>
                          <Button
                            onClick={handleNextHistoryPage}
                            disabled={!nextHisPage}
                          >
                            Next <FontAwesomeIcon icon={faArrowRight} />
                          </Button>
                          <select
                            value={hisPageSize}
                            onChange={handleHistoryPageSizeChange}
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                      </center>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form ml-4 mt-1 mb-1">
                <Button
                  className=""
                  variant="danger"
                  onClick={handleCloseModalHisto}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={!!showModalHistory} onHide={closeModalHistory} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Button onClick={handlePrintReceipt} style={{ float: "" }}>
              {" "}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
          </div>

          {selectedRowHistory && (
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
                    <b>Receipt ID:</b>
                    {selectedRowHistory.withdrawSavingsBill ||
                      selectedRowHistory.depositSavingsBill ||
                      selectedRowHistory.savingsBill}
                  </p>
                  <p>
                    <b>Transaction ID:</b> {selectedRowHistory.depositTransactionId || selectedRowHistory.withdrawTransactionId || selectedRowHistory.transactionId}
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {selectedRowHistory.newDate || selectedRowHistory.date || selectedRowHistory.Date}
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
                    Savings Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Customer Name:</b> {selectedRowHistory.parentItem?.customerName}
                  </p>
                  <p>
                    <b>Phone Number: </b> {selectedRowHistory.parentItem?.customerNumber}
                  </p>
                  <p>
                    <b>Account Number: </b> {selectedRowHistory.parentItem?.accountNumber}
                  </p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          <b> Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {selectedRowHistory.transaction?.type || selectedRowHistory.Type || "Initial"}
                        </td>
                        <td>
                          {selectedRowHistory.transaction?.reference || selectedRowHistory.refernce}
                        </td>
                        <td>{selectedRowHistory.transaction?.description || ''}</td>

                        <td>
                          {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount}
                        </td>
                        <td>{selectedRowHistory.balanceAmount || selectedRowHistory.deposit}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                  <p className="ml-5">
                    {" "}
                    <AmountInWords amount= {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount} />
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
                      <h5>Total Amount:  {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount}/-</h5>
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
                    <b>Receipt ID:</b>
                    {selectedRowHistory.withdrawSavingsBill ||
                      selectedRowHistory.depositSavingsBill ||
                      selectedRowHistory.savingsBill}
                  </p>
                  <p>
                    <b>Transaction ID:</b> {selectedRowHistory.depositTransactionId || selectedRowHistory.withdrawTransactionId || selectedRowHistory.transactionId}
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {selectedRowHistory.newDate || selectedRowHistory.date || selectedRowHistory.Date}
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
                    Savings Deposit Receipt
                  </h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                </div>
                <div className="ml-5">
                  <p>
                    <b>Customer Name:</b> {selectedRowHistory.parentItem?.customerName}
                  </p>
                  <p>
                    <b>Phone Number: </b> {selectedRowHistory.parentItem?.customerNumber}
                  </p>
                  <p>
                    <b>Account Number: </b> {selectedRowHistory.parentItem?.accountNumber}
                  </p>
                </div>
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                          <b> Information</b>
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {selectedRowHistory.transaction?.type || selectedRowHistory.Type || "Initial"}
                        </td>
                        <td>
                          {selectedRowHistory.transaction?.reference || selectedRowHistory.refernce}
                        </td>
                        <td>{selectedRowHistory.transaction?.description || ''}</td>

                        <td>
                          {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount}
                        </td>
                        <td>{selectedRowHistory.balanceAmount || selectedRowHistory.deposit}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Container>
                <div className="d-flex">
                  <p className="ml-5">
                    {" "}
                    <AmountInWords amount= {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount} />
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
                      <h5>Total Amount:  {selectedRowHistory.transaction?.deposit ||
                            selectedRowHistory.deposit ||
                            selectedRowHistory.newAmount ||
                            selectedRowHistory.withdrawalAmount}/-</h5>
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
          <Button variant="secondary" onClick={closeModalHistory}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Savings;
