import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Container, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint, faArrowLeft, faArrowRight, faClockRotateLeft, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../style/Rd.css";
import axios from "axios";
import Nav from "../../Others/Nav";
import { UserContext } from "../../Others/UserContext";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import numberToWords from "number-to-words";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Rds = () => {
  // current Date and Time
  const [branchCode, setBranchCode] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [allRDSdata, setAllRDSdata] = useState([]);
  const { user } = useContext(UserContext);
  const [searchReceipt, setSearchReceipt] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newRDSdata, setNewRDSdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [nextPage, setNextPage] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageNumber, setPageNumber] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (rdsData) => {
    setSelectedRow(rdsData);
  };
  //current time 
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  //history
  const [showModalHisto, setShowModalHisto] = useState(false);
  const toggleModalHisto = () => {
    setShowModalHisto(!showModalHisto);
  };
  const handleCloseModalHisto = () => {
    setShowModalHisto(false);
  };

  //Edit modal
  const handleCloseModal = () => {
    setSelectedRow(false);
    setShowModal(false);
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

  const loginBranchUser = user.employee.fullname;
  const loginUserTime = currentDate.toLocaleString();

  const [formData, setFormData] = useState({
    branchUser: loginBranchUser,
    userTime: loginUserTime,
    RDSNumber: "",
    customerName: "",
    customerNumber: "",
    accountType: "",
    amount: "",
    membershipId: "",
    newDate: "",
    referenceName: "",
    address: "",
    rdsBill: "",
    action: "deposit",
    branchcode: user?.branchDetails?.branchCode,
    time: '',
  });

  const handleChangeDate = (event) => {
    const newDate = moment(event.target.value).format("DD/MM/YYYY");
    setFormData({ ...formData, newDate });
  };
  const [accountTypeCounts, setAccountTypeCounts] = useState({});
  const [rdsBillCount, setRdsBillCount] = useState(0);

  const updateRDSNumber = (branchCode) => {
    let accountType = formData.accountType || "RDS";

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

    const newRDSNumber = `${accountType}${branchCode}${(
      accountTypeCounts[accountType] || 1
    )
      .toString()
      .padStart(5, "0")}`;
    const newRdsBill = `RDS${(rdsBillCount + 1).toString().padStart(8, "0")}`;

    setFormData((prevFormData) => ({
      ...prevFormData,
      RDSNumber: newRDSNumber,
      rdsBill: newRdsBill,
      accountType: formData.accountType,
      branchUser: loginBranchUser,
      userTime: loginUserTime,
      time: getCurrentTime(),
    }));
    setRdsBillCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    if (formData.accountType && branchCode) {
      updateRDSNumber(branchCode);
    }
  }, [formData.accountType, user?.branchDetails?.branchCode]);

  const [showModal, setShowModal] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };
  // DATA FETCHING-------------------------------------------------
  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {
    fetchRDSData(currentPage, pageSize, branch, searchReceipt);
  }, [currentPage, pageSize, branch, searchReceipt]);

  const fetchRDSData = async (
    page,
    size,
    branch,
    searchTerm = "",
    searchReceipt = "",
    pageNumber = 1
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.malabarbank.in/api/RDSdata?page=${page}&limit=${size}&branch=${branch}&searchTerm=${searchTerm}&searchReceipt=${searchReceipt}&pageNumber=${pageNumber}`
      );
      setNewRDSdata(response.data.data);
      setAllRDSdata(response.data.data);
      setNextPage(response.data.nextPage);
    } catch (error) {
      console.error("Error fetching memberships data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchRDSData(1, pageSize, branch, value);
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
      fetchRDSData(currentPage + 1, pageSize, branch, searchTerm);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchRDSData(currentPage - 1, pageSize, branch, searchTerm);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    fetchRDSData(1, newSize, branch, searchTerm);
  };
  const handlePageNumberChange = (e) => {
    setPageNumber(e.target.value);
  };

  const goToPage = () => {
    const pageNumberInt = parseInt(pageNumber);
    if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
      setCurrentPage(pageNumberInt);
      fetchRDSData(pageNumberInt, pageSize, branch, searchTerm, searchReceipt);
      setPageNumber("");
    } else {
      alert("Please enter a valid page number.");
      document.getElementById("pageNumberInput").classList.add("input-error");
      setTimeout(() => {
        document.getElementById("pageNumberInput").classList.remove("input-error");
      }, 300);
    }
  };
  // const goToPage = () => {
  //   const pageNumberInt = parseInt(pageNumber);
  //   if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
  //     setCurrentPage(pageNumberInt);
  //     fetchRDSData(pageNumberInt, pageSize, branch, searchTerm, searchReceipt);
  //     setPageNumber(""); 
  //   } else {
  //     alert("Please enter a valid page number.");
  //   }
  // };


  //------------------------------------------------------------------------------

  const [showModalReceipt, setShowModalReceipt] = useState(false);
  const [selectedRowReceipt, setSelectedRowReceipt] = useState(null);

  const handleButtonClick = (item) => {
    setShowModalReceipt(true);
    setSelectedRowReceipt(item);
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

  const handleMobileSelect = (value) => {
    fetchReceiptData(value);
    setSearchReceipt("");
  };
  const fetchReceiptData = (mobile) => {
    const filteredCustomers = allRDSdata.filter(
      (customer) => customer.customerNumber === mobile
    );
    if (filteredCustomers.length > 0) {
      setReceiptData(filteredCustomers[0]);
    } else {
      setReceiptData(null);
    }
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

  //---------------------------------------------------------------------------------------------
  //history   
  const [historyData, setHistoryData] = useState([]);
  const [hisPageSize, setHisPageSize] = useState(10);
  const [nextHisPage, setNextHisPage] = useState(false);
  const [currentHisPage, setCurrentHisPage] = useState(1);

  useEffect(() => {
    fetchHistoryData(currentHisPage, hisPageSize, branch);
  }, [currentHisPage, hisPageSize, branch]);

  const fetchHistoryData = async (
    page,
    size,
    branch,
    searchTerm = ""

  ) => {
    try {
      const response = await fetch(
        `https://api.malabarbank.in/api/RDSdata?page=${page}&limit=${size}&branch=${branch}&searchTerm=${searchTerm}&searchReceipt=${searchReceipt}`
      );
      const data = await response.json();
      console.log("history", data);

      if (Array.isArray(data.data)) {
        // Process data if the 'data' property is an array
        const newHistoryData = data.data.map((entry) => {
          const { balance, ...rest } = entry; // Extract balance from entry
          return { ...rest, balance }; // Include balance in entry
        });

        setHistoryData(newHistoryData);
        setNextHisPage(data.nextPage);
      } else {
        console.error("Data is not an array:", data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleHistorysearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchHistoryData(1, hisPageSize, branch, value);
  };

  const handleNextHistoryPage = () => {
    if (nextHisPage) {
      setCurrentHisPage(currentHisPage + 1);
      fetchHistoryData(currentHisPage + 1, hisPageSize, branch, searchTerm);
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
    fetchHistoryData(1, newSize, branch, searchTerm);
  };
  //---------------------------------------------------------------------------------------------

  const [numberData, setNumberData] = useState("");
  const [searchNumber, setSearchNumber] = useState("");

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
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      // date: currentDate.toLocaleString(),
    }));
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

  const handleReferenceNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      referenceName: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First API call to save form data
      const response = await axios.post(
        "https://api.malabarbank.in/api/rds",
        formData
      );
      console.log("Form data saved:", response.data);

      // Second API call
      const secondResponse = await axios.post(
        "https://api.malabarbank.in/api/rdsEmi",
        formData
      );
      console.log("Second API response:", secondResponse.data);

      // Redirect to another page after both API calls are successful
      window.location.href = "/rds";
    } catch (error) {
      console.error("Error saving form data:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const handleRowClickHistory = (item) => {
    setSelectedItem(item);
  };

  // Function to close the modal
  const handleCloseModalHistory = () => {
    setSelectedItem(null);
  };

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedRowEdit, setSelectedRowEdit] = useState(null);
  const [slNo, setSlNo] = useState("");
  const [date, setDate] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [RDSNumber, setRDSNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [amount, setAmount] = useState("");

  const handleRowClickEdit = (rdsData) => {
    setSelectedRowEdit(rdsData);
    setShowModalEdit(true);
    setSlNo(rdsData.sl_no);
    setDate(rdsData.newDate || rdsData.Date);
    setMembershipId(rdsData.membershipId);
    setCustomerName(rdsData.customerName);
    setCustomerNumber(rdsData.customerNumber);
    setRDSNumber(rdsData.RDSNumber);
    setReferenceName(rdsData.referenceName);
    setAmount(rdsData.amount);
  };

  const handleSaveChanges = () => {
    // Display confirmation dialog
    const confirmSave = window.confirm(
      "Are you sure you want to save changes?"
    );

    // If user confirms, proceed with saving changes
    if (confirmSave) {
      axios
        .put(`https://api.malabarbank.in/api/rds/${selectedRowEdit.RDSNumber}`, {
          slNo,
          date,
          membershipId,
          customerName,
          customerNumber,
          RDSNumber,
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
      <div className="container border rounded p-4 mt-4 mb-4">
        <Nav />
        <center>
          <h2>RECCURING DEPOSIT SPECIAL</h2>
        </center>
        <div className="App">
          <div className="container">
            <Link to="/RDSmultiCollection">
              <div className="circle-button">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
            </Link>
          </div>
          <div className="form-group">
            <label>Page size</label>
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label htmlFor="Search" className="mr-2">
              Search:
            </label>
            <input
              type="text"
              className="form-control"
              // value={formData.branch}
              onChange={handleSearch}
              placeholder="Enter Search"
              style={{ width: "250px" }} // Adjust the width as needed
            />
          </div>

          <div className="circle-buttons-container">
            <div className="circle-button" onClick={handlePlusIconClick}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="circle-button">
              <FontAwesomeIcon icon={faEdit} />
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
                    <th style={{ textAlign: "center" }}>RDS JOIN DATE</th>
                    <th style={{ textAlign: "center" }}>MEMBERSHIP ID</th>
                    <th style={{ textAlign: "center" }}>CUSTOMER NAME</th>
                    <th style={{ textAlign: "center" }}>RDS NUMBER</th>
                    <th style={{ textAlign: "center" }}>REFERENCE NAME</th>
                    <th style={{ textAlign: "center" }}>BALANCE</th>
                  </tr>
                </thead>

                <tbody>
                  {newRDSdata.map((rdsData) => {
                    let balance = parseFloat(rdsData.amount) || 0; // Initialize balance with amount

                    if (rdsData.EmiData && rdsData.EmiData.length > 0) {
                      rdsData.EmiData.forEach((emi) => {
                        // Add newAmount and subtract withdrawalAmount for each EmiData entry
                        balance += (parseFloat(emi.newAmount) || 0) - (parseFloat(emi.withdrawalAmount) || 0);
                      });
                    }

                    return (
                      <tr
                        key={rdsData._id}
                        onClick={() => handleRowClickEdit(rdsData)}
                        className={selectedRowEdit === rdsData ? "selected-rowEdit" : ""}
                      >
                        <td>{rdsData.sl_no}</td>
                        <td>{rdsData.Date || rdsData.newDate || rdsData.date}</td>
                        <td>{rdsData.membershipId}</td>
                        <td>{rdsData.customerName}</td>
                        <td>{rdsData.RDSNumber}</td>
                        <td>{rdsData.referenceName}</td>
                        <td>{balance}</td> {/* Display the calculated balance */}
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
              {/* <input style={{width:'50px'}} type="number" value={pageNumber} onChange={handlePageNumberChange} placeholder="Enter page number" /> */}
              {/* <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1">Enter page number</a>
                  </li>
                  <li class="page-item">
                    <input type="number" value={pageNumber} style={{ width: '50px' }} onChange={handlePageNumberChange} aria-label="Page number input"/>
                  </li>
                  <li class="page-item">
                  <Button onClick={goToPage} disabled={!nextPage}>Go</Button>
                  </li>
                </ul>
              </nav> */}
              <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                  <li class="page-item disabled">
                    Enter page number
                  </li>
                  <li class="page-item">
                    <input
                      id="pageNumberInput" 
                      type="number"
                      value={pageNumber}
                      style={{ width: '50px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                      onChange={handlePageNumberChange}
                      aria-label="Page number input"
                    />
                  </li>
                  <li class="page-item">
                    <Button onClick={goToPage} disabled={!nextPage}>Go</Button>
                  </li>
                </ul>
              </nav>

            </div>
          </div>
        </center>
      </div>

      <Modal
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {selectedRowEdit && (
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>SL NO:</Form.Label>
                    <Form.Control
                      type="text"
                      value={slNo}
                      onChange={(e) => setSlNo(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>RDS JOIN DATE:</Form.Label>
                    <Form.Control
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>MEMBERSHIP ID:</Form.Label>
                    <Form.Control
                      type="text"
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>CUSTOMER NAME:</Form.Label>
                    <Form.Control
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>CUSTOMER NUMBER:</Form.Label>
                    <Form.Control
                      type="text"
                      value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>RDS NUMBER:</Form.Label>
                    <Form.Control
                      type="text"
                      value={RDSNumber}
                      onChange={(e) => setRDSNumber(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>REFERENCE NAME:</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedRowEdit.referenceName}
                      onChange={(e) => setReferenceName(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>BALANCE:</Form.Label>
                    <Form.Control
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveChanges}>
            Save Changes
          </Button>

          <Button variant="secondary" onClick={() => setShowModalEdit(false)}>
            Close
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
                                Phone Number
                              </label>
                              <Form.Control
                                type="text"
                                placeholder="Search..."
                                style={{ width: "200rem" }}
                                value={searchNumber}
                                onChange={(e) =>
                                  setSearchNumber(e.target.value)
                                }
                                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                              />
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
                                          handleNumberSelect(
                                            customer.customerMobile
                                          );
                                        }}
                                      >
                                        {customer.customerName} -{" "}
                                        {customer.customerMobile}
                                      </li>
                                    ))}
                                </ul>
                              )}
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
                                readOnly
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
                                readOnly
                              />
                            </div>
                            <div className="form-group">
                              <label className="labels" htmlFor="date">
                                Date :
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                id="newDate"
                                value={moment(formData.newDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                onChange={handleChangeDate}
                                placeholder=""
                                required
                              />
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
                                readOnly
                              />
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
                                readOnly
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
                                required
                              />
                            </div>
                            <div className="form-group"></div>
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
                                  onChange={handleChange}
                                  placeholder="Enter Address"
                                  readOnly
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

      {/* RDS HISTORY modal */}
      <Modal
        show={showModalHisto}
        onHide={handleCloseModalHisto} size='xl'
      // dialogClassName="add-multi custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form">
            <div className="card mt-0">
              <div className=" justify-content-center">
                <div className="">
                  <div className="card mt-0">
                    <div className="card-header text-light">
                      <h4>RDS HISTORY</h4>
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
                            // value={historyData.branch}
                            // onChange={handleHistorysearch}
                            placeholder="Enter Search"
                          />
                        </div>
                      </div>
                      <center>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>SL NO</th>
                              <th>DATE</th>
                              <th>RDS NO</th>
                              <th>CUSTOMER NAME</th>
                              <th>TYPE </th>
                              <th>RDS BILL</th>
                              <th>AMOUNT</th>
                              <th>TRANSACTION ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyData.map((item, index) => (
                              <React.Fragment key={item._id}>
                                <tr onClick={() => handleRowClickHistory(item)}>
                                  <td>{index + 1}</td>
                                  <td>{item.Date || item.date}</td>
                                  <td>{item.RDSNumber}</td>
                                  <td>{item.customerName}</td>
                                  <td>Initial</td>
                                  <td>{item.rdsBill}</td>
                                  <td>
                                    {item.amount || item.newAmount || item.withdrawelAmount}
                                  </td>
                                  <td>{item.transactionId}</td>
                                </tr>
                                {item.EmiData && item.EmiData.map((emi, emiIndex) => (
                                  <tr key={`${item._id}_emi_${emiIndex}`} onClick={() => handleRowClickHistory(item)}>
                                    {/* Empty cells for the fields common with main data */}
                                    <td></td>
                                    <td>{emi.newDate || emi.Date}</td>
                                    <td>{item.RDSNumber}</td>
                                    <td>{item.customerName}</td>
                                    <td>{emi.Type}</td>
                                    <td></td>
                                    <td>
                                      {emi.newAmount || emi.withdrawalAmount}
                                    </td>
                                    <td>{emi.transactionId}</td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))}
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
                            disabled={!nextPage}
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
              {/* Modal */}
              <Modal
                show={!!selectedItem}
                onHide={handleCloseModalHistory}
                size="xl"
              >
                <Modal.Header closeButton>
                  <Modal.Title>RECEIPT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Button onClick={handlePrintReceipt} style={{ float: "" }}>
                    {" "}
                    <FontAwesomeIcon icon={faPrint} />
                  </Button>
                  {selectedItem && (
                    <>
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
                              <b>Receipt ID:</b> {selectedItem.rdsBill}
                            </p>
                            <p>
                              <b>Transaction ID:</b>{" "}
                              {selectedItem.transactionId}
                            </p>
                            <p>
                              <b>Date:</b>{" "}
                              {selectedItem.Date || selectedItem.date}
                            </p>
                          </div>
                          <div
                            style={{ textAlign: "center", marginLeft: "5rem" }}
                          >
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
                              Recurring Deposit Special Receipt
                            </h3>
                            <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                          </div>
                          <div className="ml-5">
                            <p>
                              <b>Received From:</b> {selectedItem.customerName}{" "}
                            </p>
                            <p>
                              <b>Address: </b> {selectedItem.address}{" "}
                            </p>
                            <p>
                              <b>Account Number: </b> {selectedItem.RDSNumber}
                            </p>
                          </div>
                          <Container>
                            <Table striped hover>
                              <thead>
                                <tr>
                                  <td
                                    colSpan={5}
                                    style={{ textAlign: "center" }}
                                  >
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
                                  <td>{selectedItem.Type || "RDS"}</td>
                                  <td></td>
                                  <td>{selectedItem.Type}</td>
                                  <td>
                                    {selectedItem.amount || selectedItem.newAmount || selectedItem.withdrawalAmount}
                                  </td>
                                  <td></td>
                                  {/* <td>{selectedItem.balance}</td> */}
                                </tr>
                              </tbody>
                            </Table>
                          </Container>

                          <div className="d-flex">
                            <p className="ml-5">
                              {" "}
                              <AmountInWords
                                amount={
                                  selectedItem.newAmount ||
                                  selectedItem.withdrawalAmount || selectedItem.withdrawAmount
                                }
                              />
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
                                <h5>
                                  Total Amount:{" "}
                                  {/* {selectedItem.newAmount ||selectedItem.amount || selectedItem.withdrawalAmount } */}
                                  /-
                                </h5>
                              </p>
                            </div>
                          </div>
                          <div
                            className="ml-5 d-flex"
                            style={{ marginTop: "5rem" }}
                          >
                            <p style={{ marginRight: "10rem" }}>Remitter:</p>
                            <p style={{ marginRight: "10rem" }}>Clerk:</p>
                            <p style={{ marginRight: "10rem" }}>Manager:</p>
                            <p>Cashier:</p>
                          </div>
                        </div>

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
                              <b>Receipt ID:</b> {selectedItem.rdsBill}
                            </p>
                            <p>
                              <b>Transaction ID:</b>{" "}
                              {selectedItem.transactionId}
                            </p>
                            <p>
                              <b>Date:</b>{" "}
                              {selectedItem.Date || selectedItem.date}
                            </p>
                          </div>
                          <div
                            style={{ textAlign: "center", marginLeft: "5rem" }}
                          >
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
                              Recurring Deposit Special Receipt
                            </h3>
                            <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                          </div>
                          <div className="ml-5">
                            <p>
                              <b>Received From:</b> {selectedItem.customerName}{" "}
                            </p>
                            <p>
                              <b>Address: </b> {selectedItem.address}{" "}
                            </p>
                            <p>
                              <b>Account Number: </b> {selectedItem.RDSNumber}
                            </p>
                          </div>
                          <Container>
                            <Table striped hover>
                              <thead>
                                <tr>
                                  <td
                                    colSpan={5}
                                    style={{ textAlign: "center" }}
                                  >
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
                                  <td>{selectedItem.accountType || "RDS"} </td>
                                  <td></td>
                                  <td></td>
                                  <td>
                                    {selectedItem.newAmount || selectedItem.amount || selectedItem.withdrawalAmount}
                                  </td>
                                  <td></td>
                                </tr>
                              </tbody>
                            </Table>
                          </Container>
                          <div className="d-flex">
                            <p className="ml-5">
                              {" "}
                              <AmountInWords
                                amount={
                                  selectedItem.newAmount || selectedItem.withdrawalAmount
                                }
                              />
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
                                <h5>
                                  Total Amount:{" "}
                                  {selectedItem.newAmount ||
                                    selectedItem.withdrawalAmount}
                                  /-
                                </h5>
                              </p>
                            </div>
                          </div>
                          <div
                            className="ml-5 d-flex"
                            style={{ marginTop: "5rem" }}
                          >
                            <p style={{ marginRight: "10rem" }}>Remitter:</p>
                            <p style={{ marginRight: "10rem" }}>Clerk:</p>
                            <p style={{ marginRight: "10rem" }}>Manager:</p>
                            <p>Cashier:</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModalHistory}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

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
    </div>
  );
};

export default Rds;


{/* <tbody>
{historyData.map((item, index) => (
  <React.Fragment key={item._id}>
    <tr onClick={() => handleRowClickHistory(item)}>
      <td>{index + 1}</td>
      <td>{item.Date || item.date}</td>
      <td>{item.RDSNumber}</td>
      <td>{item.customerName}</td>
      <td>Initial</td>
      <td>{item.rdsBill}</td>
      <td>
        {item.amount || item.newAmount || item.withdrawelAmount}
      </td>
      <td>{item.transactionId || item.rdsBill}</td>
    </tr>
    {/* Check if EmiData exists and render it */}
//     {item.EmiData && item.EmiData.map((emi, emiIndex) => (
//       <tr key={`${item._id}_emi_${emiIndex}`}>
//         <td>{index + 1}</td>
//         <td>{emi.newDate || emi.Date}</td>
//         <td>{item.RDSNumber}</td>
//         <td>{item.customerName}</td>
//         <td>{emi.Type}</td>
//         <td>{item.rdsBill}</td>
//         <td>
//           {emi.newAmount || emi.withdrawelAmount}
//         </td>
//         <td>{emi.transactionId}</td>
//       </tr>
//     ))}
//   </React.Fragment>
// ))}
// </tbody> */}