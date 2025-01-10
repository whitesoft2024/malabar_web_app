import React, { useState, useContext, useEffect, useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Nav from "../Others/Nav";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UserContext } from "../Others/UserContext";
import moment from "moment";
import "../style/Main.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Passbook() {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");

  const [formData, setFormData] = useState({
    accountNumber: "",
    customerName: "",
    customerNumber: "",
    amount: "",
    depositwords: "",
    transactionId: "",
    branchUser: "",
    userTime: "",
    branchCode: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {
    fetchACCData(branch, searchTerm, fromDate, toDate);
  }, [branch, searchTerm, fromDate, toDate]);

  const fetchACCData = async (
    branch,
    searchTerm = "",
    fromDate = "",
    toDate = ""
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.malabarbank.in/api/savings?&branch=${branch}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`
      );
      setTransactions(response.data.data);
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
    }));
    setSearchTerm(value);
    setShowDropdown(false);
  };
  const fetchData = (mobile) => {
    const filteredCustomers = accountNumbers.filter(
      (customer) => customer.accountNumber === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSearchTerm(filteredCustomers[0].accountNumber);
      setSelectedAccountNumber(filteredCustomers[0].accountNumber);
    } else {
      setFormData(null);
    }
  };

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter(
      (transaction) => transaction.accountNumber === searchTerm
    )
    : [];
  console.log("Filtered Transactions:", filteredTransactions);

  const [showPassbook, setShowPassbook] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handlePrintAll = () => {
    setShowAll(true);
    setShowPassbook(false);
    setTimeout(() => {
      setShowAll(false);
    }, 300000);
  };

  const DatefilteredTransactions = transactions.filter(
    (transaction) => transaction.accountNumber === selectedAccountNumber
  );

  const printAreaRef = useRef();


  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = `
      <style>
        @media print {
          @page {
            size: A4 ;
          }
          body {
            width: 100%; 
          }
          .print-area {
            width: 90%;
            padding-top: 5px;
          }
        }
      </style>
      <div class="print-area">
        ${printAreaRef.current.innerHTML}
      </div>`;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };


  const confirmPrint = () => {
    toast(
      ({ closeToast }) => (
        <div>
          Are you sure you want to print?
          <div style={{ marginTop: '10px' }}>
            <Button
              variant="primary"
              onClick={() => {
                handlePrint();
                closeToast();
              }}
              style={{ marginRight: '10px' }}
            >
              Yes
            </Button>
            <Button variant="secondary" onClick={closeToast}>
              No
            </Button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const generateRows = () => {
    let overallIndex = 1;
    let rowCounter = 0;
    let dataCountInRange = 0;
    let totalDataCount = 0;

    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const isDateInRange = (date, fromDate, toDate) => {
      const parsedDate = parseDate(date);
      const from = fromDate ? parseDate(fromDate) : null;
      const to = toDate ? parseDate(toDate) : null;
      return (!from || parsedDate >= from) && (!to || parsedDate <= to);
    };

    let earliestTransactionDate = Infinity;
    DatefilteredTransactions.forEach(transaction => {
      if (transaction.date) {
        const entryDate = parseDate(transaction.date).getTime();
        if (entryDate < earliestTransactionDate) {
          earliestTransactionDate = entryDate;
        }
      }
      if (transaction.transferData) {
        transaction.transferData.forEach(data => {
          const transferDate = parseDate(data.Date).getTime();
          if (transferDate < earliestTransactionDate) {
            earliestTransactionDate = transferDate;
          }
        });
      }
    });

    earliestTransactionDate = new Date(earliestTransactionDate);

    // Count total data entries before filtering
    DatefilteredTransactions.forEach(transaction => {
      totalDataCount++;
      if (transaction.transferData) {
        totalDataCount += transaction.transferData.length;
      }
    });

    let dataCountOutsideRange = totalDataCount;

    // Function to add page breaks if needed
    const addPageBreakIfNeeded = (rows) => {
      if (rowCounter === 30) {
        rows.push(<tr key={`page-break-${overallIndex++}`} className="page-break print-hide" />);
        rowCounter = 0;
      }
    };

    // Generate transaction rows
    const transactionRows = DatefilteredTransactions.flatMap((transaction) => {
      const entryDate = transaction.date || transaction.Date;
      const filteredTransferData = transaction.transferData
        ? transaction.transferData.filter((trans) => isDateInRange(trans.Date, fromDate, toDate))
        : [];
      const isEntryInRange = isDateInRange(entryDate, fromDate, toDate);

      const rows = [];
      if (filteredTransferData.length === 0 && !isEntryInRange) {
        return rows;
      }

      if (isEntryInRange) {
        dataCountInRange++;
        dataCountOutsideRange--;  // Decrease outside range count for each in-range entry
        addPageBreakIfNeeded(rows);
        rows.push(
          <tr className="trow" key={transaction._id}>
            <td className="print-hide">{overallIndex++}</td>
            <td>{entryDate}</td>
            <td>{transaction.type}</td>
            <td className="text-end">{transaction.withdrawalAmount}</td>
            <td className="text-end">{transaction.deposit || transaction.amount}</td>
            <td className="text-end">{transaction.deposit}</td>
            <td>{transaction.initials}</td>
          </tr>
        );
        rowCounter++;
      }

      filteredTransferData.forEach((data, dataIndex) => {
        dataCountInRange++;
        dataCountOutsideRange--;  // Decrease outside range count for each in-range entry
        addPageBreakIfNeeded(rows);
        rows.push(
          <tr className="trow" key={`${transaction._id}_data_${dataIndex}`}>
            <td className="print-hide">{overallIndex++}</td>
            <td>{data.Date}</td>
            <td>{data.Type}</td>
            <td className="text-end">{data.withdrawalAmount}</td>
            <td className="text-end">{data.newAmount}</td>
            <td className="text-end">{data.balanceAmount}</td>
            <td></td>
          </tr>
        );
        rowCounter++;
      });

      return rows;
    });

    // Use dataCountOutsideRange as gapDays
    const gapDays = dataCountOutsideRange;
    // Generate blank rows
    const beforeblankRows = [];
    for (let i = 0; i < gapDays; i++) {
      beforeblankRows.push(
        <tr key={`blank-row`}>
          <td className="print-hide">{overallIndex++}</td>
          <td colSpan="6">&nbsp;</td>
        </tr>
      );
      rowCounter++;
      addPageBreakIfNeeded(beforeblankRows);
    }


    const combinedRows = [...beforeblankRows, ...transactionRows];

    console.log('Total data count:', totalDataCount);
    console.log('Data count within date range:', dataCountInRange);
    console.log('Data count outside date range:', dataCountOutsideRange);

    return combinedRows;
  };
  // const paginateRows = (rows, rowsPerPage = 33) => {
  //   const paginatedRows = [];
  //   for (let i = 0; i < rows.length; i += rowsPerPage) {
  //     const chunk = rows.slice(i, i + rowsPerPage);
  //     if (chunk.length > 19) {
  //       chunk.splice(19, 0, (
  //         <tr key={`blank-row-${i + 19}`}>
  //           <td colSpan="6">&nbsp;</td>
  //         </tr>
  //       ));
  //     }
  //     paginatedRows.push(chunk);
  //   }
  //   return paginatedRows;
  // };

  const paginateRows = (rows, rowsPerPage = 20) => {
    const paginatedRows = [];
    for (let i = 0; i <= rows.length; i += rowsPerPage) {
      paginatedRows.push(rows.slice(i, i + rowsPerPage));
    }
    return paginatedRows;
  };

  return (
    <div>
      <Nav />
      <Container>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "5rem",
          }}
        >
          <h3>PASSBOOK</h3>
        </div>

        <label>Account No:</label>
        <Form.Control
          type="text"
          placeholder="Search..."
          style={{ width: "23.5rem" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
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
        <div style={{ textAlign: "center" }}>
          <div className="row mb-3">
            <div className="col-6">
              <label htmlFor="fromDate">From Date</label>
              <input
                type="date"
                className="form-control"
                id="fromDate"
                value={moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")}
                onChange={(e) =>
                  setFromDate(
                    moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY")
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
                value={moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD")}
                onChange={(e) =>
                  setToDate(
                    moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY")
                  )
                }
              />
            </div>
          </div>

        </div>
        <button onClick={confirmPrint} className="btn btn-primary mb-3">
          <FontAwesomeIcon icon={faPrint} /> Print Passbook
        </button>
        <div ref={printAreaRef}>
          {paginateRows(generateRows()).map((rows, pageIndex) => (
            <div key={`page-${pageIndex}`}>
              <table className="table" id={`table-to-print-${pageIndex}`}>
                <thead>
                  <tr style={{ height: "2rem" }}>
                    <th className="print-hide">Index</th>
                    <th className="print-hide">Date</th>
                    <th className="print-hide">Particulars</th>
                    <th className="print-hide">Withdrawals</th>
                    <th className="print-hide">Deposits</th>
                    <th className="print-hide">Balance</th>
                    <th className="print-hide">Initials</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
              {pageIndex < paginateRows(generateRows()).length - 1 && (
                <div className="page-break" />
              )}
            </div>
          ))}
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}
export default Passbook;