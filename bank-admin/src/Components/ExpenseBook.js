import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Modal,
  Table,
  Button,
  Popover,
  Form,
  Container,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faPlus,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "./Others/UserContext";
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import NavBar from "./User/OtherUser/EmpNavBar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import numberToWords from "number-to-words";
import moment from "moment";
import Select from "react-select";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
const ExpenseBook = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [rowCounter, setRowCount] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to showing 10 items per page
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const handleExpenseClose = () => setShow(false);

  const handleExpensePlusIcon = () => setShow(true);

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setExpenseName(e.target.value);
    } else if (e.target.name === "frequency") {
      setFrequency(e.target.value);
    }
  };

  const handleSave = async () => {
    const branchCode = user?.branchDetails?.branchCode;
    // Gather form data

    const Frequency = frequency;
    const category = expenseName;
    const formData = { category, Frequency, branchCode };

    try {
      // Make the POST request
      const response = await fetch(
        "https://api.malabarbank.in/api/expense-book/create-entry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Handle the response
      if (response.ok) {
        const data = await response.json();
        // Display success message
        alert(`New entry added successfully! ${JSON.stringify(data.message)}`);
        handleExpenseClose()
      } else {
        // Display error message
        const errorMessage = await response.text();
        alert(`Error adding entry `);
      }
    } catch (error) {
      console.error("Failed to add expense");
      alert("An error occurred while trying to add the expense.");
    }

    // Optionally reset the form or update state here
  };

  const branchCode = user?.branchDetails?.branchCode;
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!branchCode) return; // Ensure branchCode is available

      try {
        const response = await fetch(
          `https://api.malabarbank.in/api/expense-book/expenses-by-branch-code?branchCode=${branchCode}`
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setExpenses(data.data); // Set the fetched data to the expenses state
        // Extracting and storing categories in the state
        // const categories = data.data.map(item => item.category);
        // setExpenseDetails(categories); // Assuming you want to store categories directly

        const categories = data.data.map((item) => ({
          id: item._id,
          name: item.category,
        }));
        setExpenseDetails(categories);

        // Logging the categories to the console
        console.log(categories);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, [branchCode]); // Re-run the effect if branchCode changes

  const categoryOptions = expenseDetails.map((category) => ({
    label: category.name,
    value: category.name,
  }));
  // Existing states

  // Function to handle change in the number of rows to show
  // const handleRowsChange = (event) => {
  //   const value = parseInt(event.target.value);
  //   setRowsToShow(value);
  // };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const loginBranch = user.branchDetails
    ? user.branchDetails.branch_name
    : "N/A";
  const loginBranchCode = user.branchDetails
    ? user.branchDetails.branchCode
    : "";
  const loginCurrentDate = currentDate.toLocaleString();

  const [expenseData, setExpenseData] = useState({
    branchName: loginBranch,
    branchCode: loginBranchCode,
    category: "",
    amount: "",
    description: "",
    date: loginCurrentDate,
    // voucherNumber: "",
    remarks: "",
  });

  const handleChangeExpense = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = expenseDetails.find(
      (category) => category.name === e.target.value
    );
    setSelectedCategoryId(selectedCategory.id);
    handleChangeExpense(e);
  };

  const [showExpense, setShowExpense] = useState(false);

  const handlePlusIcon = () => {
    setShowExpense(true);
  };

  const handleCloseModal = () => {
    setShowExpense(false);
  };

  const generateVoucherNumber = async () => {
    let newVoucherNumber = "";
    let isUnique = false;

    // Retrieve the last used voucher number from local storage
    const lastUsedNumber = localStorage.getItem("lastVoucherNumber") || 0;
    // Increment the last used number
    let number = parseInt(lastUsedNumber, 10) + 1;

    // Format the new voucher number
    newVoucherNumber = `V${"0".repeat(7 - number.toString().length)}${number}`;

    // Check if the voucher number already exists in the database
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/api/expense-book/exp/check-voucher-number/${newVoucherNumber}`
      );
      isUnique = response.data.isUnique; // Assuming the backend returns an object with an 'isUnique' property
    } catch (error) {
      console.error("Error checking voucher number", error);
      isUnique = true;
    }

    // If the voucher number is not unique, increment the number and try again
    while (!isUnique) {
      number++;
      newVoucherNumber = `V${"0".repeat(
        7 - number.toString().length
      )}${number}`;

      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/expense-book/exp/check-voucher-number/${newVoucherNumber}`
        );
        isUnique = response.data.isUnique;
      } catch (error) {
        console.error("Error checking voucher number", error);
        isUnique = true; // Assuming an error means the number is not unique
      }
    }

    // Update the last used voucher number in local storage
    localStorage.setItem(
      "lastVoucherNumber",
      newVoucherNumber.replace("V", "")
    );

    return newVoucherNumber;
  };

  useEffect(() => {
    const loginBranch = user.branchDetails
      ? user.branchDetails.branch_name
      : "N/A";
    const loginBranchCode = user.branchDetails
      ? user.branchDetails.branchCode
      : "";
    const loginCurrentDate = currentDate.toLocaleString();

    setExpenseData((prevState) => ({
      ...prevState,
      branchName: loginBranch,
      branchCode: loginBranchCode,
      date: loginCurrentDate,
    }));
  }, [user]);

  const handleReset = () => {
    setExpenseData({
      branchName: loginBranch,
      branchCode: loginBranchCode,
      category: "",
      amount: "",
      description: "",
      date: loginCurrentDate,
      voucherNumber: "",
      remarks: "",
    });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://api.malabarbank.in/api/expense-book/add-expense-detail/${selectedCategoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // If the response status is not OK, display the error message from the result
        alert(`Error: ${result.error || "Something went wrong"}`);
        return;
      }

      // Display success message from the API response
      alert(result.message || "Expense detail added successfully!");

      console.log(result);

      // Handle success response, e.g., close modal, reset form, etc.
      handleCloseModal();
      handleReset();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was a problem with the fetch operation.");
    }
  };

  //fetch expenses made by the branch side
  const [parsedData, setParsedData] = useState([]);

  const [rowsToShow, setRowsToShow] = useState(10); // State to track number of rows to display
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [pageInput, setPageInput] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [search, setSearch] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRowsToShow(value);
    setCurrentPage(1); // Reset to the first page when changing rows per page
    setPageInput(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when changing the date filter
    setPageInput(1);
  };

  const handleDateInChange = (date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    setExpenseData({
      ...expenseData,
      date: formattedDate,
    });
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return isNaN(parsedDate) ? null : parsedDate;
  };

  const totalPages = (data) => {
    return Math.ceil(data.length / rowsToShow);
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= totalPages(newFilteredData)) {
      setPageInput(value);
      setCurrentPage(value);
    } else if (e.target.value === "") {
      setPageInput("");
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages(newFilteredData)) {
      setCurrentPage(currentPage + 1);
      setPageInput(currentPage + 1);
    }
  };

  const getSLNo = (id) => {
    // Implement your SL No generation logic here
    return id;
  };

  // Filter data based on the selected date
  const newFilteredData = selectedDate
    ? expenses.flatMap((expense) =>
        expense.expenseDetails
          .filter(
            (detail) =>
              moment(detail.date, "DD/MM/YYYY").format("YYYY-MM-DD") ===
              selectedDate
          )
          .map((detail) => ({
            ...detail,
            category: expense.category,
            frequency: expense.Frequency,
          }))
      )
    : expenses.flatMap((expense) =>
        expense.expenseDetails.map((detail) => ({
          ...detail,
          category: expense.category,
          frequency: expense.Frequency,
        }))
      );

  // const getCurrentPageData = () => {
  //   const startIndex = (currentPage - 1) * rowsToShow;
  //   const endIndex = startIndex + rowsToShow;
  //   return newFilteredData.slice(startIndex, endIndex);
  // };

  const getCurrentPageData = () => {
    let filteredData = newFilteredData;

    if (selectedCategory) {
      filteredData = filteredData.filter(
        (detail) => detail.category === selectedCategory.label
      );
    }

    const startIndex = (currentPage - 1) * rowsToShow;
    const endIndex = startIndex + rowsToShow;
    return filteredData.slice(startIndex, endIndex);
  };

  const currentPageData = getCurrentPageData();

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

  const [showModalReceipt, setShowModalReceipt] = useState(false);

  // const handleButtonClick = () => {
  //   setShowModalReceipt(true);
  // };
  const handleClose = () => {
    setShowModalReceipt(false);
    setShowModalWithdrawReceipt(false);
  };

  const printAreaRef = useRef(null);

  const calculateTotalAmount = (data) => {
    return data.reduce((sum, detail) => sum + parseFloat(detail.amount), 0);
  };

  const totalAmount = calculateTotalAmount(currentPageData);

  const printDocument = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GDCS Report</title> <!-- Specify the title here -->
          <meta name="description" content="Generated GDCS Report">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              border: 2px solid #000;
            }
            h1 { 
              font-family: "Times New Roman", Times, serif;
              text-align: center; 
              margin-bottom: 20px;
              font-size: 28px;
              font-weight: bold;
              color: #333;
            }
            .details-container { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
            }
            .details-section { 
              width: 48%; 
            }
            .details-section.right { 
              text-align: right; 
            }
            table { 
              width: 100%; 
              max-width: 100%; /* Ensure table does not exceed the container */
              border-collapse: collapse; 
              margin-top: 20px;
            }
            table, th, td { 
              border: 1px solid #000; 
            }
            th, td { 
              padding: 8px; 
              text-align: left; 
              font-size: 12px; /* Adjusted font size */
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold;
              text-transform: uppercase;
            }
            thead {
              display: table-header-group;
            }
            tr {
              page-break-inside: avoid;
            }
            .table-responsive {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .totals-container {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
              padding: 10px;
            }
            .details-section {
              width: auto;
              text-align: right;
            }
            .total-left {
              float: left;
              margin-right: 10px;
            }
            .total-right {
              float: right;
              margin-left: 10px;
            }
          </style>
        </head>
        <body>
          <h1>EXPENSE RECEIPT</h1>
          <div class="table-responsive m-3">
            <div class="Container">
              ${document.querySelector(".table-responsive").innerHTML}
            </div>
          </div>
          <div class="totals-container">
            <div class="total-left"><strong>Total Amount: ₹ ${totalAmount}</strong></div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  const [showModalWithdrawReceipt, setShowModalWithdrawReceipt] =
    useState(false);
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
    console.log("Deposit value:", amount); // Add this line to check the value
    const amountInWords = formatIndianNumber(Number(amount));
    return (
      <p>
        <b>In words:</b> {amountInWords} only
      </p>
    );
  }

  const handlePrint = () => {
    navigate("/print-preview", { state: { data: currentPageData } });
  };

  return (
    <div>
      <nav className="navbar navbar-light ">
        <div className="container-fluid">
          <Link
            className="navbar-brand ms-5 d-flex align-items-center"
            to="/main"
          >
            <img
              src="http://139.84.130.134:81/IMAGES/logo.png"
              alt="logo"
              width="100px"
              className="d-inline-block align-text-top"
            />
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
                <li className="me-2">
                  {" "}
                  : {user.employee ? user.employee.fullname : "N/A"}
                </li>
                <li className="me-2">
                  {" "}
                  :{" "}
                  {user.branchDetails ? user.branchDetails.branch_name : "N/A"}
                </li>
                <li className="me-2">
                  {" "}
                  : {user.branchDetails ? user.branchDetails.branchCode : "N/A"}
                </li>
                <li className="me-2">: {currentDate.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <NavBar />
      <div className="container border rounded p-4 mt-4">
        <div className="mt-3">
          <center>
            <h2>EXPENSE LEDGER</h2>
          </center>
        </div>

        <div>
          <div className="">
            <div
              className="circle-buttons-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="mr-2">
                <label htmlFor="">Search</label>

                <Select
                  isClearable
                  options={categoryOptions}
                  onChange={(selectedOption) =>
                    setSelectedCategory(selectedOption)
                  }
                />

                <label style={{ marginRight: "1rem" }}>Filter by date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={{ width: "10rem" }}
                />
              </div>
              <div style={{ flex: "1", marginLeft: "1rem" }}>
                <label>Page</label>

                <select
                  className="form-control"
                  style={{ width: "4rem" }}
                  value={rowsToShow.toString()}
                  onChange={handleRowsChange}
                >
                  {" "}
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="circle-button"
                  onClick={handlePlusIcon}
                  style={{ marginTop: "2rem" }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div
                  className="circle-button"
                  onClick={handleExpensePlusIcon}
                  style={{ marginTop: "2rem" }}
                >
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                </div>
                <div
                  className="circle-button"
                  style={{ marginTop: "2rem" }}
                  // onClick={handlePrint}
                  onClick={printDocument}
                >
                  <FontAwesomeIcon icon={faPrint} />
                </div>
              </div>
            </div>
          </div>

          {/* Table list section */}
          <div
            ref={printAreaRef}
            id="printableArea"
            className="table-responsive"
          >
            <center>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>SL NO</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>CATEGORY</th>
                    <th>FREQUENCY</th>
                    <th>DESCRIPTION</th>
                    <th>VOUCHER NUMBER</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>

                {/* Modify the rendering of table data to include filtering based on rowsToShow */}
                <tbody>
                  {currentPageData.map((detail, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {moment(detail.date, "DD/MM/YYYY").format("DD/MM/YYYY")}
                      </td>
                      <td>{detail.amount}</td>
                      <td>{detail.category}</td>
                      <td>{detail.frequency}</td>
                      <td>{detail.description}</td>
                      <td>{detail.voucherNumber}</td>
                      <td>{detail.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </center>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              <b>Go to:</b>
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                style={{ width: "4rem", textAlign: "center" }}
              ></input>
              <b> Page: </b> {currentPage} of {totalPages(newFilteredData)}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages(newFilteredData)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Modal
        show={showExpense}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>ADD NEW EXPENSE LEDGER</h4>
              </div>
              <div className="card-body ">
                <form onSubmit={handleExpenseSubmit} className="mt-3">
                  <div className="form-group d-flex flex-row">
                    {/* <div className="col">
                    <label className="labels" htmlFor="branchName">Branch Name :</label>
                    <input type="text" className="form-control" id="branchName" name="branchName" value={expenseData.branchName || ""} onChange={handleChangeExpense} placeholder="" required readOnly />
                  </div> */}
                    <div className="col">
                      <label className="labels" htmlFor="amount">
                        Amount :
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        name="amount"
                        value={expenseData.amount || ""}
                        onChange={handleChangeExpense}
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="remarks">
                        Remarks :
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        value={expenseData.remarks || ""}
                        onChange={handleChangeExpense}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="category">
                        Category :
                      </label>
                      <select
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={expenseData.category || ""}
                        onChange={handleCategoryChange}
                        required
                      >
                        <option value="">Select</option>
                        {expenseDetails.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="labels" htmlFor="description">
                        Description :
                      </label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={expenseData.description || ""}
                        onChange={handleChangeExpense}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group d-flex flex-row">
                    <div className="col">
                      <label className="labels" htmlFor="date">
                        Date :
                      </label>
                      {/* <input type="text" className="form-control" id="date" name="date" value={expenseData.date || ""} onChange={handleChangeExpense} required readOnly /> */}
                      <DatePicker
                        // selected={expenseData.date ? new Date(expenseData.date) : null}
                        selected={parseDate(expenseData.date)}
                        onChange={handleDateInChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        id="date"
                        name="date"
                        placeholderText="Select a date"
                        required
                      />
                    </div>
                    {/* <div className="col">
                      <label className="labels" htmlFor="voucherNumber">
                        Voucher Number :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="voucherNumber"
                        name="voucherNumber"
                        value={expenseData.voucherNumber || ""}
                        onChange={handleChangeExpense}
                        required
                      />
                    </div> */}
                  </div>
                  <div className="form-group d-flex flex-row">
                    {/* <div className="col">
                    <label className="labels" htmlFor="remarks">Remarks :</label>
                    <textarea type="text" className="form-control" id="remarks" name="remarks" value={expenseData.remarks || ""} onChange={handleChangeExpense} required />
                  </div> */}
                    <div className="col">
                      <label className="labels" htmlFor=""></label>
                    </div>
                  </div>
                  <center>
                    <div className="form-group mt-5 ">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button type="submit" className="btn btn-primary ms-2">
                        Submit
                      </button>
                      <Button
                        variant="danger"
                        className="btn btn-secondary ms-2"
                        onClick={handleCloseModal}
                      >
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

      {/* //add expense modal */}

      <Modal show={show} onHide={handleExpenseClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicText">
              <Form.Label>Expense Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.Select">
              <Form.Label>Frequency</Form.Label>
              <Form.Control
                as="select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Select Frequency</option>
                <option value="annually">Annually</option>
                <option value="monthly">Monthly</option>
                <option value="Quaterly">Quaterly</option>
                <option value="Random">Random</option>
                <option value="Daily">Daily</option>

              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExpenseClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenseBook;
