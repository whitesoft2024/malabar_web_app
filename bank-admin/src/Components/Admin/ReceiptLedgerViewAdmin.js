import React, { useState, useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table, Button ,Modal, Container,Form} from "react-bootstrap";
// import "../style/BranchTransfer.css";
import { UserContext } from '../Others/UserContext';
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import NavBar from "./adminOthers/AdminNavbar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";

function ReceiptLedgerViewAdmin() {

    
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    //fetch expenses made by the branch side 
    const [parsedData, setParsedData] = useState([]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/receipt-ledger/recled');
            const data = await response.json();

            // Iterate through each object and print it
            data.data.forEach((obj, index) => {
                console.log(`Object ${index + 1}:`);
                console.log(); // Add an empty line for separation
            });

            // Set parsed data to state
            setParsedData(data.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const [rowsToShow, setRowsToShow] = useState(10); // State to track number of rows to display
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const [pageInput, setPageInput] = useState('')
    const [filteredData, setFilteredData] = useState('')
    const [search, setSearch] = useState('')

    const handleDropdownChange = (event) => {
        const value = parseInt(event.target.value);
        setRowsToShow(value);
        setCurrentPage(1); // Reset current page when changing number of rows
    };
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ensure currentPage doesn't go below 1
    };

    const totalPages = () => {
        const totalRows = search === '' ? parsedData.length : filteredData.length;
        return Math.ceil(totalRows / rowsToShow);
    };

    const handlePageInputChange = (event) => {
        const value = event.target.value;
        setPageInput(value); // Store the input value in a separate state
        // Check if the input value is a valid number and within the range of total pages
        if (!isNaN(value) && value >= 1 && value <= totalPages()) {
            setCurrentPage(parseInt(value)); // Update the currentPage state only if the input value is valid
        }
    };

    const getSLNo = (index) => {
        return (currentPage - 1) * rowsToShow + index + 1;
    }

      
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
    fetch("https://api.malabarbank.in/api/receipt-ledger/recled")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Fetched customer data:", responseData);
        console.log("Customer data type:", typeof responseData);

        // Extract the 'data' property from the response object
        const data = responseData.data;

        // Check if data is an array before setting it to customerData
        if (Array.isArray(data)) {
          setCustomerData(data);
        } else {
          console.error("Expected an array but received:", data);
          setCustomerData([]);
        }
      })
      .catch((error) => console.error("Error fetching customer data:", error));
};

const [selectedCustomer, setSelectedCustomer] = useState(null);
  
const handleMobileSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.voucherNumber); // Assuming you want to clear the search term
    setIsDropdownVisible(false); // Hide the dropdown after selection
    fetchReceiptData(customer.voucherNumber); // Update receipt data based on the selected customer
   };
   
  

  const fetchReceiptData = (mobile) => {
    // Find the customer object corresponding to the selected mobile number
    const selectedCustomer = customerData.find(
      (customer) => customer.voucherNumber === mobile
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

  
  
  
  function AmountInWords({ amount }) {
    console.log("Deposit value:", amount); // Add this line to check the value
    const amountInWords = formatIndianNumber(Number(amount));
  
    return <p><b>In words:</b> {amountInWords} only</p>;
  }


  return (
    <div>
        <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to="/main" >
                        <img src="http://139.84.130.134:81/IMAGES/logo.png" alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">MALABAR BANK</strong>
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
                                <li className="me-2"> : {user.employee ? user.employee.fullname : 'N/A'}</li>
                                <li className="me-2"> : {user.branchDetails ? user.branchDetails.branch_name : 'N/A'}</li>
                                <li className="me-2"> : {user.branchDetails ? user.branchDetails.branchCode : 'N/A'}</li>
                                <li className="me-2">:{currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <NavBar />
            <div className="container border rounded  mt-4">
                <div className="mt-3">
                    <center>
                        <h2>RECEIPT LEDGER</h2>
                    </center>
                </div>

                <div>
                    <div className="App">
                        <div className="circle-buttons-container">
                            <div className="mr-2">
                                <label htmlFor="referenceNumber">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="branch"
                                    name="branch"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Enter Search"
                                />
                            </div>
                            <div style={{ marginRight: "700px" }}>
                                <label>Page</label>
                                <select className="form-control " value={rowsToShow.toString()} onChange={handleDropdownChange}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
                            <Button
              style={{
                height: "3rem",
                marginTop: "1.3rem",
                backgroundColor: "#35725b",
              }}
              onClick={handleButtonClick}
            >
               Receipt
            </Button>
                        </div>
                    </div>

                    {/* Table list section */}
                    <center>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SL NO</th>
                                    <th>DATE</th>
                                    <th>BRANCH NAME</th>
                                    <th>BRANCH CODE</th>
                                    <th>CATEGORY</th>
                                    <th>AMOUNT</th>
                                    <th>DESCRIPTION</th>
                                    <th>VOUCHER NUMBER</th>
                                    <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData
                                    .filter(expense => {
                                        const branchNameMatch = expense.branchName && expense.branchName.toLowerCase().includes(search.toLowerCase());
                                        const categoryMatch = expense.category && expense.category.toLowerCase().includes(search.toLowerCase());
                                        const amountMatch = expense.amount && expense.amount.toString().toLowerCase().includes(search.toLowerCase());
                                        const voucherNumberMatch = expense.voucherNumber && expense.voucherNumber.toString().toLowerCase().includes(search.toLowerCase());
                                        const descriptionMatch = expense.description && expense.description.toLowerCase().includes(search.toLowerCase());
                                        const branchCodeMatch = expense.branchCode && expense.branchCode.toLowerCase().includes(search.toLowerCase());
                                        return search.toLowerCase() === '' || branchNameMatch || categoryMatch || amountMatch || voucherNumberMatch || descriptionMatch || branchCodeMatch;

                                    })
                                    .reverse()
                                    .slice(0, rowsToShow === 'Full' ? parsedData.length : parseInt(rowsToShow))
                                    .map((expense, index) => (
                                        <tr key={expense._id}>
                                            <td>{getSLNo(index)}</td>
                                            <td>{expense.date}</td>
                                            <td>{expense.branchName}</td>
                                            <td>{expense.branchCode}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.amount}</td>
                                            <td>{expense.description}</td>
                                            <td>{expense.voucherNumber}</td>
                                            <td>{expense.remarks}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        <div>
                            <Button onClick={prevPage} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <span>
                                <b>Go to:</b>
                                <input type="number" value={pageInput} onChange={handlePageInputChange} style={{ width: "4rem", textAlign: "center" }} ></input>
                                <b>Page:</b> {currentPage} of {totalPages()}
                            </span>
                            <Button
                                onClick={nextPage}
                                disabled={
                                    currentPage * rowsToShow >= parsedData.length ||
                                    currentPage * Math.min(rowsToShow, 50) >= parsedData.length
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </center>
                </div>
            </div>

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
{searchTerm && (
  <ul className="dropdown-menu2" style={{ display: searchTerm ? 'block' : 'none' }}>
    {console.log("Search Term:", searchTerm)}
    {console.log("Customer Data:", customerData)}
    {customerData
      .filter((customer) => {
        if (typeof searchTerm === "string") {
          return (
            (customer.branchName && customer.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.voucherNumber && customer.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        return false; // Exclude if searchTerm is not a string
      })
      .map((customer, index) => (
        <li key={index} className="dropdown-item"  onClick={() => handleMobileSelect(customer)}>
          {customer.branchName} - {customer.voucherNumber}
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
            {receiptData && (
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
                  <p><b>Receipt ID:</b>  {receiptData.voucherNumber}</p>
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
                  <h3 style={{ marginLeft: "9rem" }}>Receipt Ledger Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Customer Copy</p>
                  <p style={{ marginLeft: "9rem" }}>{receiptData ? receiptData.branchName : ""}</p>
                </div>
               
                {/* <div className="ml-5">
                  <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.accountNumber : ""}</p>
                </div> */}
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Receipt Ledger Information</b>
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
                        <td>{receiptData.remarks}</td>
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
                  <p><b>Receipt ID:</b> {receiptData ? receiptData.voucherNumber : ""}</p>
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
                  <h3 style={{ marginLeft: "9rem" }}>Receipt Ledger Receipt</h3>
                  <p style={{ marginLeft: "9rem" }}>Bank Copy</p>
                  <p style={{ marginLeft: "9rem" }}>{receiptData ? receiptData.branchName : ""}</p>
                </div>
                {/* <div className="ml-5">
                <p><b>Received From:</b>   {receiptData ? receiptData.customerName : ""} </p>
                  <p><b>Address: </b>   {receiptData ? receiptData.address : ""} </p>
                  <p><b>Account Number: </b>    {receiptData ? receiptData.accountNumber : ""}</p>
                </div> */}
                <Container>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                          <b>Receipt Ledger Information</b>
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
                        <td>{receiptData.remarks}</td>
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
            )}
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

export default ReceiptLedgerViewAdmin 