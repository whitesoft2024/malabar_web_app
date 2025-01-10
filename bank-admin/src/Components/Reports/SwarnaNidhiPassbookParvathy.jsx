// import React, { useState, useContext, useEffect, useRef,useMemo } from "react";
// import { Container, Form, Button } from "react-bootstrap";
// import Nav from "../Others/Nav";
// import axios from "axios";
// import { UserContext } from "../Others/UserContext";
// import moment from "moment";
// import "../style/Main.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SwarnaNidhiPassbook() {
//   const [accountNumbers, setAccountNumbers] = useState([]);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
//   const [schemeID, setSchemeID] = useState('');

//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     customerName: "",
//     customerNumber: "",
//     amount: "",
//     depositwords: "",
//     transactionId: "",
//     branchUser: "",
//     userTime: "",
//     branchCode: "",
//     branchName: '',
//   });

//   // const [searchTerm, setSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [installments, setInstallments] = useState([]);
//   const [toDate, setToDate] = useState("");
//   const branch = user?.branchDetails?.branchCode;
//   const branchName = user?.branchDetails?.branch_name;

//   useEffect(() => {
//     fetchInstallmentData(schemeID);
//   }, [schemeID]);

//   const fetchInstallmentData = async (schemeId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

//       if (response.data && response.data.data) {
//         setAccountNumbers(response.data.data);
//         setInstallments(response.data.data);

//       } else {
//         console.error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching installment data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Account Numbers:", installments);
//   }, [installments]);


//   const handleACCNumberSelect = (value) => {
//     fetchData(value);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       schemeId: value,
//     }));
//     setSchemeID(value); 
//     setShowDropdown(false);
    
//   };
//   const fetchData = (mobile) => {
//     const filteredCustomers = accountNumbers.filter(
//       (customer) => customer.schemeId === mobile
//     );
//     if (filteredCustomers.length > 0) {
//       setFormData(filteredCustomers[0]);
//       setSchemeID(filteredCustomers[0].schemeId);
//       setSelectedAccountNumber(filteredCustomers[0].schemeId);
//     } else {
//       setFormData(null);
//     }
//   };
//   const filteredTransactions = Array.isArray(installments)
//   ? installments.filter(
//       (installment) => installment.schemeId === schemeID
//     )
//   : [];
//   console.log("Filtered Transactions:", filteredTransactions);

//   console.log("Filtered Transactions:", filteredTransactions);
//   const DatefilteredTransactions = installments.filter(
//     (transaction) => transaction.schemeId === selectedAccountNumber
//   );

//   const printAreaRef = useRef();

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = `
//         <style>
//           @media print {
//             @page {
//               size: A4 ;
//             }
//             body {
//               width: 100%; 
//             }
//             .print-area {
//               width: 90%;
//               padding-top: 5px;
  
//             }
//           }
//         </style>
//         <div class="print-area">
//           ${printAreaRef.current.innerHTML}
//         </div>`;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };
//   const confirmPrint = () => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Are you sure you want to print?
//           <div style={{ marginTop: '10px' }}>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 handlePrint();
//                 closeToast();
//               }}
//               style={{ marginRight: '10px' }}
//             >
//               Yes
//             </Button>
//             <Button variant="secondary" onClick={closeToast}>
//               No
//             </Button>
//           </div>
//         </div>
//       ),
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         draggable: false,
//       }
//     );
//   };

//   // const generateRows = () => {
//   //   let overallIndex = 1;
//   //   let rowCounter = 0;
  
//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };
  
//   //   const isDateInRange = (date) => {
//   //     const parsedDate = parseDate(date);
//   //     const fromDateObj = fromDate ? parseDate(fromDate) : null;
//   //     const toDateObj = toDate ? parseDate(toDate) : null;
  
//   //     if (fromDateObj && toDateObj) {
//   //       return parsedDate >= fromDateObj && parsedDate <= toDateObj;
//   //     } else if (fromDateObj) {
//   //       return parsedDate >= fromDateObj;
//   //     } else if (toDateObj) {
//   //       return parsedDate <= toDateObj;
//   //     }
//   //     return true; // If no date range is specified, include all dates
//   //   };
  
//   //   const transactionRows = DatefilteredTransactions.flatMap((transaction) => {
//   //     const rows = [];
  
//   //     if (transaction.installments) {
//   //       transaction.installments.forEach((data, dataIndex) => {
//   //         if (isDateInRange(data.date)) {
//   //           const remainingAmount = data.emiIndex * data.amount;
  
//   //           rows.push(
//   //             <tr className="trow" key={`${transaction._id}_installment_${dataIndex}`}>
//   //               <td className="print-hide">{overallIndex++}</td>
//   //               <td>{data.date}</td>
//   //               <td>Installment</td>
//   //               <td className="text-end">{data.emiIndex}</td>
//   //               <td className="text-end">{data.amount}</td>
//   //               <td className="text-end">{remainingAmount}</td>
//   //               <td></td>
//   //             </tr>
//   //           );
//   //           rowCounter++;
  
//   //           if (rowCounter === 30) {
//   //             rows.push(
//   //               <tr key={`page-break-${overallIndex}`} className="page-break print-hide" />
//   //             );
//   //             rowCounter = 0;
//   //           }
//   //         }
//   //       });
//   //     }
  
//   //     return rows;
//   //   });
  
//   //   return transactionRows;
//   // };



//   // const generateRows = () => {
//   //   let overallIndex = 1;
//   //   let rowCounter = 0;
//   //   let dataCountInRange = 0;
//   //   let totalDataCount = 0;
  
//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };
  
//   //   const isDateInRange = (date) => {
//   //     const parsedDate = parseDate(date);
//   //     const fromDateObj = fromDate ? parseDate(fromDate) : null;
//   //     const toDateObj = toDate ? parseDate(toDate) : null;
  
//   //     if (fromDateObj && toDateObj) {
//   //       return parsedDate >= fromDateObj && parsedDate <= toDateObj;
//   //     } else if (fromDateObj) {
//   //       return parsedDate >= fromDateObj;
//   //     } else if (toDateObj) {
//   //       return parsedDate <= toDateObj;
//   //     }
//   //     return true; // If no date range is specified, include all dates
//   //   };
  
//   //   const transactionRows = [];
//   //   let earliestTransactionDate = Infinity;
  
//   //   DatefilteredTransactions.forEach(transaction => {
//   //     if (transaction.installments) {
//   //       transaction.installments.forEach(data => {
//   //         const entryDate = parseDate(data.date).getTime();
//   //         if (entryDate < earliestTransactionDate) {
//   //           earliestTransactionDate = entryDate;
//   //         }
//   //       });
//   //     }
//   //   });
  
//   //   earliestTransactionDate = new Date(earliestTransactionDate);
  
//   //   // Count total data entries before filtering
//   //   DatefilteredTransactions.forEach(transaction => {
//   //     if (transaction.installments) {
//   //       totalDataCount += transaction.installments.length;
//   //     }
//   //   });
  
//   //   let dataCountOutsideRange = totalDataCount;
  
//   //   // Function to add page breaks if needed
//   //   const addPageBreakIfNeeded = (rows) => {
//   //     if (rowCounter === 30) {
//   //       rows.push(<tr key={`page-break-${overallIndex++}`} className="page-break print-hide" />);
//   //       rowCounter = 0;
//   //     }
//   //   };
  
//   //   // Generate blank rows for dates outside the range
//   //   const fromDateObj = fromDate ? parseDate(fromDate) : null;
//   //   const toDateObj = toDate ? parseDate(toDate) : null;
  
//   //   let currentDate = earliestTransactionDate;
//   //   while ((fromDateObj && currentDate < fromDateObj) || (!fromDateObj && !toDateObj)) {
//   //     addPageBreakIfNeeded(transactionRows);
//   //     transactionRows.push(
//   //       <tr key={`blank-row-${overallIndex++}`}>
//   //         <td className="print-hide">{overallIndex++}</td>
//   //         <td colSpan="6">&nbsp;</td>
//   //       </tr>
//   //     );
//   //     rowCounter++;
//   //     currentDate.setDate(currentDate.getDate() + 1);
//   //   }
  
//   //   // Generate transaction rows
//   //   DatefilteredTransactions.forEach((transaction) => {
//   //     if (transaction.installments) {
//   //       transaction.installments.forEach((data, dataIndex) => {
//   //         if (isDateInRange(data.date)) {
//   //           dataCountInRange++;
//   //           dataCountOutsideRange--;
//   //           addPageBreakIfNeeded(transactionRows);
//   //           const remainingAmount = data.emiIndex * data.amount;
  
//   //           transactionRows.push(
//   //             <tr className="trow" key={`${transaction._id}_installment_${dataIndex}`}>
//   //               <td className="print-hide">{overallIndex++}</td>
//   //               <td>{data.date}</td>
//   //               <td>Installment</td>
//   //               <td className="text-end">{data.emiIndex}</td>
//   //               <td className="text-end">{data.amount}</td>
//   //               <td className="text-end">{remainingAmount}</td>
//   //               <td></td>
//   //             </tr>
//   //           );
//   //           rowCounter++;
//   //         }
//   //       });
//   //     }
//   //   });
  
//   //   console.log('Total data count:', totalDataCount);
//   //   console.log('Data count within date range:', dataCountInRange);
//   //   console.log('Data count outside date range:', dataCountOutsideRange);
  
//   //   return transactionRows;
//   // };



//   const generateRows = () => {
//     let overallIndex = 1;
//     let rowCounter = 0;
//     const startDate = fromDate ? new Date(fromDate) : null;
//     const endDate = toDate ? new Date(toDate) : null;
  
//     const parseDate = (dateString) => {
//       const [day, month, year] = dateString.split('/').map(Number);
//       return new Date(year, month - 1, day);
//     };
  
//     const isDateInRange = (date) => {
//       const parsedDate = parseDate(date);
//       return (!startDate || parsedDate >= startDate) && (!endDate || parsedDate <= endDate);
//     };
  
//     const transactionRows = [];
//     const earliestDate = new Date(Math.min(...DatefilteredTransactions.map(t => t.date)));
//     const latestDate = new Date(Math.max(...DatefilteredTransactions.map(t => t.date)));
  
//     for (let currentDate = earliestDate; currentDate <= latestDate; currentDate.setDate(currentDate.getDate() + 1)) {
//       const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  
//       const matchingTransactions = DatefilteredTransactions.filter(t => t.date === formattedDate);
  
//       if (matchingTransactions.length > 0) {
//         matchingTransactions.forEach((transaction) => {
//           if (transaction.installments) {
//             transaction.installments.forEach((data, dataIndex) => {
//               if (isDateInRange(data.date)) {
//                 const remainingAmount = data.emiIndex * data.amount;
  
//                 transactionRows.push(
//                   <tr className="trow" key={`${transaction._id}_installment_${dataIndex}`}>
//                     <td className="print-hide">{overallIndex++}</td>
//                     <td>{data.date}</td>
//                     <td>Installment</td>
//                     <td className="text-end">{data.emiIndex}</td>
//                     <td className="text-end">{data.amount}</td>
//                     <td className="text-end">{remainingAmount}</td>
//                     <td></td>
//                   </tr>
//                 );
//                 rowCounter++;
//               }
//             });
//           }
  
//           if (rowCounter === 30) {
//             transactionRows.push(
//               <tr key={`page-break-${overallIndex}`} className="page-break print-hide" />
//             );
//             rowCounter = 0;
//           }
//         });
//       } else {
//         // Add blank rows for dates outside the selected range
//         const blankRow = (
//           <tr key={`blank-row-${formattedDate}`}>
//             <td colSpan="7">&nbsp;</td>
//           </tr>
//         );
  
//         if (!isDateInRange(formattedDate)) {
//           transactionRows.push(blankRow);
//         }
//       }
//     }
  
//     return transactionRows;
//   };

  
//   const memoizedGenerateRows = useMemo(() => generateRows(), [DatefilteredTransactions, fromDate, toDate]);


//   // const MemoizedTableComponent = React.memo(({ rows }) => (
//   //   <table className="table">
//   //     <tbody>
//   //       {rows}
//   //     </tbody>
//   //   </table>
//   // ));

//   // Define the MemoizedTableComponent
// const MemoizedTableComponent = React.memo(({ rows }) => (
//   <table className="table">
//     <thead>
//       <tr style={{ height: "2rem" }}>
//         <th className="print-hide">Index</th>
//         <th className="print-hide">Date</th>
//         <th className="print-hide">Particulars</th>
//         <th className="print-hide">Installment Number</th>
//         <th className="print-hide">Deposits</th>
//         <th className="print-hide">Total</th>
//         <th className="print-hide">Initials</th>
//       </tr>
//     </thead>
//     <tbody>
//       {rows}
//     </tbody>
//   </table>
// ));
  
  
  
//   const paginateRows = (rows, rowsPerPage = 20) => {
//     const paginatedRows = [];
//     for (let i = 0; i <= rows.length; i += rowsPerPage) {
//       paginatedRows.push(rows.slice(i, i + rowsPerPage));
//     }
//     return paginatedRows;
//   };

//   const frontPageDetails = `
//     <style>
//       @media print {
//         @page {
//           size: A4;
//           margin: 0; /* Remove default margin to prevent headers/footers */
//         }
//         body {
//           margin: 0; /* Remove body margin to align with @page */
//           width: 100%;
//         }
//         .front-page-details {
//           width: 90%;
//           padding-top: 5px;
//           margin: auto;
//           text-align: center; /* Center align all content */
//         }
//         .container {
//           display: flex;
//           justify-content: center; /* Center align columns */
//         }
//         .column {
//           width: 45%;
//           text-align: left; /* Reset text-align for content inside columns */
//         }
//         .row {
//           display: flex;
//           justify-content: left;
//           align-items: center; /* Center align items vertically */
//           margin-bottom: 2px; /* Default margin between rows */
//         }
//         .row.branch-address {
//           flex-direction: column; /* Stack label and value vertically */
//           align-items: flex-start; /* Align items to the start of the column */
//           margin-bottom: 10px; /* Additional space below Branch Address */
//         }
//         .label {
//           font-weight: bold;
//           margin-right: 10px; /* Adjust margin between label and value */
//         }
//         .value {
//           text-align: left; /* Right align value */
//         }
//           .spacer {
//             visibility: hidden; /* Hide the content while keeping the space */
//           }
//       }
//     </style>
//     <div class="front-page-details">
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//         <p class="spacer">.</p>
//       <div class="container">
//         <div class="column">
//           <div class="row branch-address">
//             <span class="label">Branch Address:</span>
//             <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">IFSC Code:</span>
//             <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Join Date:</span>
//             <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Account Number:</span>
//             <span class="value">${formData.schemeId || 'N/A'}</span>
//           </div>
//         </div>
//         <div class="column">
//           <div class="row">
//             <span class="label">Membership ID:</span>
//             <span class="value">${formData.membershipId || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Name:</span>
//             <span class="value">${formData.customerName || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Mobile Number:</span>
//             <span class="value">${formData.customerNumber || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Address:</span>
//             <span class="value">${formData.address || 'N/A'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//     `;

//   const handlePrint2 = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.open();
//     printWindow.document.write(`
//         <html>
//         <head>
//           <title>Print</title>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${frontPageDetails}
//         </body>
//         </html>
//       `);
//     printWindow.document.close();
//     window.location.reload();
//   };


//   return (
//     <div>
//       <Nav />
//       <Container>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//             height: "5rem",
//           }}
//         >
//           <h3>PASSBOOK</h3>
//         </div>

//         <label>Scheme Id</label>
//         <Form.Control
//           type="text"
//           placeholder="Search..."
//           style={{ width: "23.5rem" }}
//           value={schemeID}
//           onChange={(e) => setSchemeID(e.target.value)}
//           onFocus={() => setShowDropdown(true)}
//         />
//         {showDropdown && schemeID && (
//           <ul className="dropdown-menu2">
//             {accountNumbers
//               .filter(
//                 (customer) =>
//                   customer.schemeId &&
//                   customer.schemeId
//                     .toLowerCase()
//                     .includes(schemeID.toLowerCase())
//               )
//               .map((customer, index) => (
//                 <li
//                   key={index}
//                   className="dropdown-item"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleACCNumberSelect(customer.schemeId);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   {customer.schemeId} - {customer.customerName}
//                 </li>
//               ))}
//           </ul>
//         )}
//         <div style={{ textAlign: "center" }}>
//           <div className="row mb-3">
//             <div className="col-6">
//               <label htmlFor="fromDate">From Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 id="fromDate"
//                 value={moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")}
//                 onChange={(e) =>
//                   setFromDate(
//                     moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY")
//                   )
//                 }
//               />
//             </div>
//             <div className="col-6">
//               <label htmlFor="toDate">To Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 id="toDate"
//                 value={moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD")}
//                 onChange={(e) =>
//                   setToDate(
//                     moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY")
//                   )
//                 }
//               />
//             </div>
//           </div>

//         </div>
//         <button onClick={confirmPrint} className="btn btn-primary mb-3">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook
//         </button>
//         <button className="btn btn-primary mb-3" onClick={handlePrint2}>Print Passbook Frontpage</button>

//         <div ref={printAreaRef}>



//           {/* {paginateRows(generateRows()).map((rows, pageIndex) => (
//             <div key={`page-${pageIndex}`}>
//               <table className="table" id={`table-to-print-${pageIndex}`}>
//                 <thead>
//                   <tr style={{ height: "2rem" }}>
//                     <th className="print-hide">Index</th>
//                     <th className="print-hide">Date</th>
//                     <th className="print-hide">Particulars</th>
//                     <th className="print-hide">Installment Number</th>
//                     <th className="print-hide">Deposits</th>
//                     <th className="print-hide">Total</th>
//                     <th className="print-hide">Initials</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows}
//                 </tbody>
//               </table>
//               {pageIndex < paginateRows(generateRows()).length - 1 && (
//                 <div className="page-break" />
//               )}
//             </div>
//           ))} */}

// <div ref={printAreaRef}>
//   {paginateRows(memoizedGenerateRows).map((rows, pageIndex) => (
//     <div key={`page-${pageIndex}`}>
//       <MemoizedTableComponent rows={rows} />
//       {pageIndex < paginateRows(memoizedGenerateRows).length - 1 && (
//         <div className="page-break" />
//       )}
//     </div>
//   ))}
// </div>



//         </div>
//       </Container>
//       <ToastContainer />
//     </div>

//   )
// }

// export default SwarnaNidhiPassbook

// import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
// import { Container, Form, Button } from "react-bootstrap";
// import Nav from "../Others/Nav";
// import axios from "axios";
// import { UserContext } from "../Others/UserContext";
// import moment from "moment";
// import "../style/Main.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SwarnaNidhiPassbook() {
//   const [accountNumbers, setAccountNumbers] = useState([]);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
//   const [schemeID, setSchemeID] = useState('');
//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     customerName: "",
//     customerNumber: "",
//     amount: "",
//     depositwords: "",
//     transactionId: "",
//     branchUser: "",
//     userTime: "",
//     branchCode: "",
//     branchName: '',
//   });
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [installments, setInstallments] = useState([]);

//   useEffect(() => {
//     if (schemeID) {
//       fetchInstallmentData(schemeID);
//     }
//   }, [schemeID]);

//   const fetchInstallmentData = async (schemeId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

//       if (response.data && response.data.data) {
//         setAccountNumbers(response.data.data);
//         setInstallments(response.data.data);
//       } else {
//         console.error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching installment data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleACCNumberSelect = (value) => {
//     fetchData(value);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       schemeId: value,
//     }));
//     setSchemeID(value);
//     setShowDropdown(false);
//   };

//   const fetchData = (mobile) => {
//     const filteredCustomers = accountNumbers.filter(
//       (customer) => customer.schemeId === mobile
//     );
//     if (filteredCustomers.length > 0) {
//       setFormData(filteredCustomers[0]);
//       setSchemeID(filteredCustomers[0].schemeId);
//       setSelectedAccountNumber(filteredCustomers[0].schemeId);
//     } else {
//       setFormData({});
//     }
//   };

//   const generateRows = useMemo(() => {
//     if (!installments.length || !schemeID) return [];

//     const parseDate = (dateString) => {
//       const [day, month, year] = dateString.split('/').map(Number);
//       return new Date(year, month - 1, day);
//     };

//     const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//     const endDate = toDate ? parseDate(toDate) : new Date();

//     const filteredInstallments = installments
//       .filter(installment => installment.schemeId === schemeID)
//       .flatMap(installment => installment.installments || [])
//       .sort((a, b) => parseDate(a.date) - parseDate(b.date));

//     const rows = [];
//     let overallIndex = 1;
//     let totalAmount = 0;

//     filteredInstallments.forEach((installment, index) => {
//       const installmentDate = parseDate(installment.date);
      
//       if (installmentDate < startDate) {
//         // Add empty row for dates before the start date
//         rows.push(
//           <tr key={`empty-${index}`}>
//             <td colSpan="7">&nbsp;</td>
//           </tr>
//         );
//       } else if (installmentDate <= endDate) {
//         totalAmount += installment.amount;
//         rows.push(
//           <tr key={`${installment.date}-${index}`}>
//             <td>{overallIndex++}</td>
//             <td>{installment.date}</td>
//             <td>Installment</td>
//             <td>{installment.emiIndex}</td>
//             <td>{installment.amount.toFixed(2)}</td>
//             <td>{totalAmount.toFixed(2)}</td>
//             <td></td>
//           </tr>
//         );
//       }
//     });

//     return rows;
//   }, [installments, schemeID, fromDate, toDate]);

//   const printAreaRef = useRef();

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = `
//       <style>
//         @media print {
//           @page { size: A4; margin: 1cm; }
//           body { font-size: 12px; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid black; padding: 5px; }
//           .print-hide { display: none; }
//         }
//       </style>
//       <div>${printAreaRef.current.innerHTML}</div>
//     `;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   const confirmPrint = () => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Are you sure you want to print?
//           <div style={{ marginTop: '10px' }}>
//             <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
//             <Button variant="secondary" onClick={closeToast}>No</Button>
//           </div>
//         </div>
//       ),
//       { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
//     );
//   };

//   return (
//     <div>
//       <Nav />
//       <Container>
//         <h3 className="text-center my-4">SWARNANIDHI PASSBOOK</h3>

//         <Form.Group className="mb-3">
//           <Form.Label>Scheme Id</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Search..."
//             value={schemeID}
//             onChange={(e) => setSchemeID(e.target.value)}
//             onFocus={() => setShowDropdown(true)}
//           />
//           {showDropdown && schemeID && (
//             <ul className="dropdown-menu2 show">
//               {accountNumbers
//                 .filter((customer) => customer.schemeId && customer.schemeId.toLowerCase().includes(schemeID.toLowerCase()))
//                 .map((customer, index) => (
//                   <li key={index} className="dropdown-item" onClick={() => handleACCNumberSelect(customer.schemeId)}>
//                     {customer.schemeId} - {customer.customerName}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Form.Group>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>From Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={fromDate ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setFromDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>To Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={toDate ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setToDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//         </div>

//         <Button onClick={confirmPrint} className="mb-3">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook
//         </Button>

//         <div ref={printAreaRef}>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Index</th>
//                 <th>Date</th>
//                 <th>Particulars</th>
//                 <th>Installment Number</th>
//                 <th>Deposits</th>
//                 <th>Total</th>
//                 <th>Initials</th>
//               </tr>
//             </thead>
//             <tbody>
//               {generateRows}
//             </tbody>
//           </table>
//         </div>
//       </Container>
//       <ToastContainer />
//     </div>
//   );
// }

// export default SwarnaNidhiPassbook;




// import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
// import { Container, Form, Button } from "react-bootstrap";
// import Nav from "../Others/Nav";
// import axios from "axios";
// import { UserContext } from "../Others/UserContext";
// import moment from "moment";
// import "../style/Main.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SwarnaNidhiPassbook() {
//   const [accountNumbers, setAccountNumbers] = useState([]);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
//   const [schemeID, setSchemeID] = useState('');
//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     customerName: "",
//     customerNumber: "",
//     amount: "",
//     depositwords: "",
//     transactionId: "",
//     branchUser: "",
//     userTime: "",
//     branchCode: "",
//     branchName: '',
//     date: '',
//     newDate: '',
//     membershipId: '',
//     address: '',
//   });
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [installments, setInstallments] = useState([]);

//   useEffect(() => {
//     if (schemeID) {
//       fetchInstallmentData(schemeID);
//     }
//   }, [schemeID]);

//   const fetchInstallmentData = async (schemeId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

//       if (response.data && response.data.data) {
//         setAccountNumbers(response.data.data);
//         setInstallments(response.data.data);
//       } else {
//         console.error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching installment data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleACCNumberSelect = (value) => {
//     fetchData(value);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       schemeId: value,
//     }));
//     setSchemeID(value);
//     setShowDropdown(false);
//   };

//   const fetchData = (mobile) => {
//     const filteredCustomers = accountNumbers.filter(
//       (customer) => customer.schemeId === mobile
//     );
//     if (filteredCustomers.length > 0) {
//       setFormData(filteredCustomers[0]);
//       setSchemeID(filteredCustomers[0].schemeId);
//       setSelectedAccountNumber(filteredCustomers[0].schemeId);
//     } else {
//       setFormData({});
//     }
//   };

//   const generateRows = useMemo(() => {
//     if (!installments.length || !schemeID) return [];

//     const parseDate = (dateString) => {
//       const [day, month, year] = dateString.split('/').map(Number);
//       return new Date(year, month - 1, day);
//     };

//     const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//     const endDate = toDate ? parseDate(toDate) : new Date();

//     const filteredInstallments = installments
//       .filter(installment => installment.schemeId === schemeID)
//       .flatMap(installment => installment.installments || [])
//       .sort((a, b) => parseDate(a.date) - parseDate(b.date));

//     const rows = [];
//     let overallIndex = 1;
//     let totalAmount = 0;

//     filteredInstallments.forEach((installment, index) => {
//       const installmentDate = parseDate(installment.date);
      
//       if (installmentDate < startDate) {
//         // Add empty row for dates before the start date
//         rows.push(
//           <tr key={`empty-${index}`}>
//             <td colSpan="7">&nbsp;</td>
//           </tr>
//         );
//       } else if (installmentDate <= endDate) {
//         totalAmount += installment.amount;
//         rows.push(
//           <tr key={`${installment.date}-${index}`}>
//             <td>{overallIndex++}</td>
//             <td>{installment.date}</td>
//             <td>Installment</td>
//             <td>{installment.emiIndex}</td>
//             <td>{installment.amount.toFixed(2)}</td>
//             <td>{totalAmount.toFixed(2)}</td>
//             <td></td>
//           </tr>
//         );
//       }
//     });

//     return rows;
//   }, [installments, schemeID, fromDate, toDate]);

//   const printAreaRef = useRef();

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = `
//       <style>
//         @media print {
//           @page { size: A4; margin: 1cm; }
//           body { font-size: 12px; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid black; padding: 5px; }
//           .print-hide { display: none; }
//         }
//       </style>
//       <div>${printAreaRef.current.innerHTML}</div>
//     `;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   const confirmPrint = () => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Are you sure you want to print?
//           <div style={{ marginTop: '10px' }}>
//             <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
//             <Button variant="secondary" onClick={closeToast}>No</Button>
//           </div>
//         </div>
//       ),
//       { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
//     );
//   };

//   const frontPageDetails = `
//     <style>
//       @media print {
//         @page {
//           size: A4;
//           margin: 0;
//         }
//         body {
//           margin: 0;
//           width: 100%;
//         }
//         .front-page-details {
//           width: 90%;
//           padding-top: 5px;
//           margin: auto;
//           text-align: center;
//         }
//         .container {
//           display: flex;
//           justify-content: center;
//         }
//         .column {
//           width: 45%;
//           text-align: left;
//         }
//         .row {
//           display: flex;
//           justify-content: left;
//           align-items: center;
//           margin-bottom: 2px;
//         }
//         .row.branch-address {
//           flex-direction: column;
//           align-items: flex-start;
//           margin-bottom: 10px;
//         }
//         .label {
//           font-weight: bold;
//           margin-right: 10px;
//         }
//         .value {
//           text-align: left;
//         }
//         .spacer {
//           visibility: hidden;
//         }
//       }
//     </style>
//     <div class="front-page-details">
//       ${Array(11).fill('<p class="spacer">.</p>').join('')}
//       <div class="container">
//         <div class="column">
//           <div class="row branch-address">
//             <span class="label">Branch Address:</span>
//             <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">IFSC Code:</span>
//             <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Join Date:</span>
//             <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Account Number:</span>
//             <span class="value">${formData.schemeId || 'N/A'}</span>
//           </div>
//         </div>
//         <div class="column">
//           <div class="row">
//             <span class="label">Membership ID:</span>
//             <span class="value">${formData.membershipId || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Name:</span>
//             <span class="value">${formData.customerName || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Mobile Number:</span>
//             <span class="value">${formData.customerNumber || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Address:</span>
//             <span class="value">${formData.address || 'N/A'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   const handlePrint2 = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${frontPageDetails}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <div>
//       <Nav />
//       <Container>
//         <h3 className="text-center my-4">PASSBOOK</h3>

//         <Form.Group className="mb-3">
//           <Form.Label>Scheme Id</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Search..."
//             value={schemeID}
//             onChange={(e) => setSchemeID(e.target.value)}
//             onFocus={() => setShowDropdown(true)}
//           />
//           {showDropdown && schemeID && (
//             <ul className="dropdown-menu2 show">
//               {accountNumbers
//                 .filter((customer) => customer.schemeId && customer.schemeId.toLowerCase().includes(schemeID.toLowerCase()))
//                 .map((customer, index) => (
//                   <li key={index} className="dropdown-item" onClick={() => handleACCNumberSelect(customer.schemeId)}>
//                     {customer.schemeId} - {customer.customerName}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Form.Group>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>From Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={fromDate ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setFromDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>To Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={toDate ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setToDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//         </div>

//         <Button onClick={confirmPrint} className="mb-3 me-2">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook
//         </Button>
//         <Button onClick={handlePrint2} className="mb-3">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook Frontpage
//         </Button>

//         <div ref={printAreaRef}>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Index</th>
//                 <th>Date</th>
//                 <th>Particulars</th>
//                 <th>Installment Number</th>
//                 <th>Deposits</th>
//                 <th>Total</th>
//                 <th>Initials</th>
//               </tr>
//             </thead>
//             <tbody>
//               {generateRows}
//             </tbody>
//           </table>
//         </div>
//       </Container>
//       <ToastContainer />
//     </div>
//   );
// }

// export default SwarnaNidhiPassbook;


// import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
// import { Container, Form, Button, Pagination } from "react-bootstrap";
// import Nav from "../Others/Nav";
// import axios from "axios";
// import { UserContext } from "../Others/UserContext";
// import moment from "moment";
// import "../style/Main.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SwarnaNidhiPassbook() {
//   const [accountNumbers, setAccountNumbers] = useState([]);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
//   const [schemeID, setSchemeID] = useState('');
//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     customerName: "",
//     customerNumber: "",
//     amount: "",
//     depositwords: "",
//     transactionId: "",
//     branchUser: "",
//     userTime: "",
//     branchCode: "",
//     branchName: '',
//     date: '',
//     newDate: '',
//     membershipId: '',
//     address: '',
//   });
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [installments, setInstallments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage] = useState(20);
//   const printAreaRef = useRef(null);

//   useEffect(() => {
//     if (schemeID) {
//       fetchInstallmentData(schemeID);
//     }
//   }, [schemeID]);

//   const fetchInstallmentData = async (schemeId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

//       if (response.data && response.data.data) {
//         setAccountNumbers(response.data.data);
//         setInstallments(response.data.data);
//       } else {
//         console.error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching installment data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleACCNumberSelect = (value) => {
//     fetchData(value);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       schemeId: value,
//     }));
//     setSchemeID(value);
//     setShowDropdown(false);
//   };

//   const fetchData = (mobile) => {
//     const filteredCustomers = accountNumbers.filter(
//       (customer) => customer.schemeId === mobile
//     );
//     if (filteredCustomers.length > 0) {
//       setFormData(filteredCustomers[0]);
//       setSchemeID(filteredCustomers[0].schemeId);
//       setSelectedAccountNumber(filteredCustomers[0].schemeId);
//     } else {
//       setFormData({});
//     }
//   };

//   const generateRows = useMemo(() => {
//     if (!installments.length || !schemeID) return [];

//     const parseDate = (dateString) => {
//       const [day, month, year] = dateString.split('/').map(Number);
//       return new Date(year, month - 1, day);
//     };

//     const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//     const endDate = toDate ? parseDate(toDate) : new Date();

//     const filteredInstallments = installments
//       .filter(installment => installment.schemeId === schemeID)
//       .flatMap(installment => installment.installments || [])
//       .sort((a, b) => parseDate(a.date) - parseDate(b.date));

//     const rows = [];
//     let overallIndex = 1;
//     let totalAmount = 0;

//     filteredInstallments.forEach((installment, index) => {
//       const installmentDate = parseDate(installment.date);
      
//       if (installmentDate < startDate) {
//         // Add empty row for dates before the start date
//         rows.push(
//           <tr key={`empty-${index}`}>
//             <td colSpan="7">&nbsp;</td>
//           </tr>
//         );
//       } else if (installmentDate <= endDate) {
//         totalAmount += installment.amount;
//         rows.push(
//           <tr key={`${installment.date}-${index}`}>
//             <td>{overallIndex++}</td>
//             <td>{installment.date}</td>
//             <td>Installment</td>
//             <td>{installment.emiIndex}</td>
//             <td>{installment.amount.toFixed(2)}</td>
//             <td>{totalAmount.toFixed(2)}</td>
//             <td></td>
//           </tr>
//         );
//       }
//     });

//     return rows;
//   }, [installments, schemeID, fromDate, toDate]);

//   const pageCount = Math.ceil(generateRows.length / rowsPerPage);
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = generateRows.slice(indexOfFirstRow, indexOfLastRow);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = `
//       <style>
//         @media print {
//           @page { size: A4; margin: 1cm; }
//           body { font-size: 12px; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid black; padding: 5px; }
//           .print-hide { display: none; }
//         }
//       </style>
//       <div>${printAreaRef.current.innerHTML}</div>
//     `;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   const confirmPrint = () => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Are you sure you want to print?
//           <div style={{ marginTop: '10px' }}>
//             <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
//             <Button variant="secondary" onClick={closeToast}>No</Button>
//           </div>
//         </div>
//       ),
//       { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
//     );
//   };

//   const frontPageDetails = `
//     <style>
//       @media print {
//         @page {
//           size: A4;
//           margin: 0;
//         }
//         body {
//           margin: 0;
//           width: 100%;
//         }
//         .front-page-details {
//           width: 90%;
//           padding-top: 5px;
//           margin: auto;
//           text-align: center;
//         }
//         .container {
//           display: flex;
//           justify-content: center;
//         }
//         .column {
//           width: 45%;
//           text-align: left;
//         }
//         .row {
//           display: flex;
//           justify-content: left;
//           align-items: center;
//           margin-bottom: 2px;
//         }
//         .row.branch-address {
//           flex-direction: column;
//           align-items: flex-start;
//           margin-bottom: 10px;
//         }
//         .label {
//           font-weight: bold;
//           margin-right: 10px;
//         }
//         .value {
//           text-align: left;
//         }
//         .spacer {
//           visibility: hidden;
//         }
//       }
//     </style>
//     <div class="front-page-details">
//       ${Array(11).fill('<p class="spacer">.</p>').join('')}
//       <div class="container">
//         <div class="column">
//           <div class="row branch-address">
//             <span class="label">Branch Address:</span>
//             <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">IFSC Code:</span>
//             <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Join Date:</span>
//             <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Account Number:</span>
//             <span class="value">${formData.schemeId || 'N/A'}</span>
//           </div>
//         </div>
//         <div class="column">
//           <div class="row">
//             <span class="label">Membership ID:</span>
//             <span class="value">${formData.membershipId || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Name:</span>
//             <span class="value">${formData.customerName || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Mobile Number:</span>
//             <span class="value">${formData.customerNumber || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Address:</span>
//             <span class="value">${formData.address || 'N/A'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   const handlePrint2 = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${frontPageDetails}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <div>
//       <Nav />
//       <Container>
//         <h3 className="text-center my-4">PASSBOOK</h3>

//         <Form.Group className="mb-3">
//           <Form.Label>Scheme Id</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Search..."
//             value={schemeID}
//             onChange={(e) => setSchemeID(e.target.value)}
//             onFocus={() => setShowDropdown(true)}
//           />
//           {showDropdown && schemeID && (
//             <ul className="dropdown-menu2 show">
//               {accountNumbers
//                 .filter((customer) => customer.schemeId && customer.schemeId.toLowerCase().includes(schemeID.toLowerCase()))
//                 .map((customer, index) => (
//                   <li key={index} className="dropdown-item" onClick={() => handleACCNumberSelect(customer.schemeId)}>
//                     {customer.schemeId} - {customer.customerName}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Form.Group>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>From Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={fromDate ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setFromDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>To Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={toDate ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setToDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//         </div>

//         <Button onClick={confirmPrint} className="mb-3 me-2">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook
//         </Button>
//         <Button onClick={handlePrint2} className="mb-3">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook Frontpage
//         </Button>

//         <div ref={printAreaRef}>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Index</th>
//                 <th>Date</th>
//                 <th>Particulars</th>
//                 <th>Installment Number</th>
//                 <th>Deposits</th>
//                 <th>Total</th>
//                 <th>Initials</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRows}
//             </tbody>
//           </table>
//           <Pagination>
//             {[...Array(pageCount)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => paginate(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//           </Pagination>
//         </div>
//       </Container>
//       <ToastContainer />
//     </div>
//   );
// }

// export default SwarnaNidhiPassbook;



// import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
// import { Container, Form, Button, Pagination } from "react-bootstrap";
// import Nav from "../Others/Nav";
// import axios from "axios";
// import { UserContext } from "../Others/UserContext";
// import moment from "moment";
// import "../style/Main.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPrint } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SwarnaNidhiPassbook() {
//   const [accountNumbers, setAccountNumbers] = useState([]);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
//   const [schemeID, setSchemeID] = useState('');
//   const [formData, setFormData] = useState({
//     accountNumber: "",
//     customerName: "",
//     customerNumber: "",
//     amount: "",
//     depositwords: "",
//     transactionId: "",
//     branchUser: "",
//     userTime: "",
//     branchCode: "",
//     branchName: '',
//     date: '',
//     newDate: '',
//     membershipId: '',
//     address: '',
//   });
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [installments, setInstallments] = useState([]);
//   const printAreaRef = useRef(null);

//   // Remove currentPage and rowsPerPage states as they're no longer needed
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [rowsPerPage] = useState(20);

//   useEffect(() => {
//     if (schemeID) {
//       fetchInstallmentData(schemeID);
//     }
//   }, [schemeID]);

//   const fetchInstallmentData = async (schemeId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

//       if (response.data && response.data.data) {
//         setAccountNumbers(response.data.data);
//         setInstallments(response.data.data);
//       } else {
//         console.error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching installment data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleACCNumberSelect = (value) => {
//     fetchData(value);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       schemeId: value,
//     }));
//     setSchemeID(value);
//     setShowDropdown(false);
//   };

//   const fetchData = (mobile) => {
//     const filteredCustomers = accountNumbers.filter(
//       (customer) => customer.schemeId === mobile
//     );
//     if (filteredCustomers.length > 0) {
//       setFormData(filteredCustomers[0]);
//       setSchemeID(filteredCustomers[0].schemeId);
//       setSelectedAccountNumber(filteredCustomers[0].schemeId);
//     } else {
//       setFormData({});
//     }
//   };

//   // CHANGE: Completely rewritten generateRows function
//   // const generateRows = useMemo(() => {
//   //   if (!installments.length || !schemeID) return [];

//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };

//   //   const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//   //   const endDate = toDate ? parseDate(toDate) : new Date();

//   //   const filteredInstallments = installments
//   //     .filter(installment => installment.schemeId === schemeID)
//   //     .flatMap(installment => installment.installments || [])
//   //     .sort((a, b) => parseDate(a.date) - parseDate(b.date));

//   //   const tables = [];
//   //   let currentTable = [];
//   //   let overallIndex = 1;
//   //   let totalAmount = 0;
//   //   let emptyRowsAdded = false;

//   //   filteredInstallments.forEach((installment) => {
//   //     const installmentDate = parseDate(installment.date);
      
//   //     if (installmentDate < startDate && !emptyRowsAdded) {
//   //       // Add empty rows for dates before the start date
//   //       for (let i = 0; i < 20 && currentTable.length < 20; i++) {
//   //         currentTable.push(
//   //           <tr key={`empty-${i}`}>
//   //             <td colSpan="7">&nbsp;</td>
//   //           </tr>
//   //         );
//   //       }
//   //       emptyRowsAdded = true;
//   //     } else if (installmentDate <= endDate) {
//   //       totalAmount += installment.amount;
//   //       currentTable.push(
//   //         <tr key={`${installment.date}-${overallIndex}`}>
//   //           <td>{overallIndex++}</td>
//   //           <td>{installment.date}</td>
//   //           <td>Installment</td>
//   //           <td>{installment.emiIndex}</td>
//   //           <td>{installment.amount.toFixed(2)}</td>
//   //           <td>{totalAmount.toFixed(2)}</td>
//   //           <td></td>
//   //         </tr>
//   //       );
//   //     }

//   //     if (currentTable.length === 20) {
//   //       tables.push([...currentTable]);
//   //       currentTable = [];
//   //     }
//   //   });

//   //   // Add any remaining rows to the last table
//   //   if (currentTable.length > 0) {
//   //     tables.push([...currentTable]);
//   //   }

//   //   return tables;
//   // }, [installments, schemeID, fromDate, toDate]);


//   // const generateRows = useMemo(() => {
//   //   if (!installments.length || !schemeID) return [];
  
//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };
  
//   //   const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//   //   const endDate = toDate ? parseDate(toDate) : new Date();
  
//   //   const filteredInstallments = installments
//   //     .filter(installment => installment.schemeId === schemeID)
//   //     .flatMap(installment => installment.installments || [])
//   //     .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  
//   //   const tables = [];
//   //   let currentTable = [];
//   //   let overallIndex = 1;
//   //   let totalAmount = 0;
//   //   let emptyRowsAdded = false;
  
//   //   // Calculate the number of empty rows needed
//   //   const earliestDate = filteredInstallments[0]?.date;
//   //   if (earliestDate) {
//   //     const earliestDateObj = parseDate(earliestDate);
//   //     const daysDiff = Math.floor((startDate - earliestDateObj) / (1000 * 60 * 60 * 24));
//   //     const emptyRowsNeeded = Math.min(daysDiff, 20); // Limit to 20 rows
  
//   //     if (daysDiff > 0) {
//   //       for (let i = 0; i < emptyRowsNeeded; i++) {
//   //         currentTable.push(
//   //           <tr key={`empty-${i}`}>
//   //             <td colSpan="7">&nbsp;</td>
//   //           </tr>
//   //         );
//   //       }
//   //       emptyRowsAdded = true;
//   //     }
//   //   }
  
//   //   filteredInstallments.forEach((installment) => {
//   //     const installmentDate = parseDate(installment.date);
      
//   //     if (installmentDate >= startDate && installmentDate <= endDate) {
//   //       totalAmount += installment.amount;
//   //       currentTable.push(
//   //         <tr key={`${installment.date}-${overallIndex}`}>
//   //           <td>{overallIndex++}</td>
//   //           <td>{installment.date}</td>
//   //           <td>Installment</td>
//   //           <td>{installment.emiIndex}</td>
//   //           <td>{installment.amount.toFixed(2)}</td>
//   //           <td>{totalAmount.toFixed(2)}</td>
//   //           <td></td>
//   //         </tr>
//   //       );
//   //     }
  
//   //     if (currentTable.length === 20) {
//   //       tables.push([...currentTable]);
//   //       currentTable = [];
//   //     }
//   //   });
  
//   //   // Add any remaining rows to the last table
//   //   if (currentTable.length > 0) {
//   //     tables.push([...currentTable]);
//   //   }
  
//   //   return tables;
//   // }, [installments, schemeID, fromDate, toDate]);

//   // const generateRows = useMemo(() => {
//   //   if (!installments.length || !schemeID) return [];
  
//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };
  
//   //   const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//   //   const endDate = toDate ? parseDate(toDate) : new Date();
  
//   //   const filteredInstallments = installments
//   //     .filter(installment => installment.schemeId === schemeID)
//   //     .flatMap(installment => installment.installments || [])
//   //     .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  
//   //   const tables = [];
//   //   let currentTable = [];
//   //   let overallIndex = 1;
//   //   let totalAmount = 0;
  
//   //   // Find the index of the first installment after the start date
//   //   const startIndex = filteredInstallments.findIndex(installment => 
//   //     parseDate(installment.date) >= startDate
//   //   );
  
//   //   // If no installments found after the start date, return empty tables
//   //   if (startIndex === -1) return tables;
  
//   //   // Calculate the number of empty rows needed
//   //   const emptyRowsNeeded = Math.max(0, 20 - (filteredInstallments.length - startIndex));
  
//   //   // Add empty rows at the beginning of the first table
//   //   for (let i = 0; i < emptyRowsNeeded; i++) {
//   //     currentTable.push(
//   //       <tr key={`empty-${i}`}>
//   //         <td colSpan="7">&nbsp;</td>
//   //       </tr>
//   //     );
//   //   }
  
//   //   // Process the installments starting from the start index
//   //   for (let i = startIndex; i < filteredInstallments.length; i++) {
//   //     const installment = filteredInstallments[i];
//   //     const installmentDate = parseDate(installment.date);
      
//   //     if (installmentDate <= endDate) {
//   //       totalAmount += installment.amount;
//   //       currentTable.push(
//   //         <tr key={`${installment.date}-${overallIndex}`}>
//   //           <td>{overallIndex++}</td>
//   //           <td>{installment.date}</td>
//   //           <td>Installment</td>
//   //           <td>{installment.emiIndex}</td>
//   //           <td>{installment.amount.toFixed(2)}</td>
//   //           <td>{totalAmount.toFixed(2)}</td>
//   //           <td></td>
//   //         </tr>
//   //       );
//   //     }
  
//   //     if (currentTable.length === 20) {
//   //       tables.push([...currentTable]);
//   //       currentTable = [];
//   //     }
//   //   }
  
//   //   // Add any remaining rows to the last table
//   //   if (currentTable.length > 0) {
//   //     tables.push([...currentTable]);
//   //   }
  
//   //   return tables;
//   // }, [installments, schemeID, fromDate, toDate]);
  

//   // const generateRows = useMemo(() => {
//   //   if (!installments.length || !schemeID) return [];
  
//   //   const parseDate = (dateString) => {
//   //     const [day, month, year] = dateString.split('/').map(Number);
//   //     return new Date(year, month - 1, day);
//   //   };
  
//   //   const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//   //   const endDate = toDate ? parseDate(toDate) : new Date();
  
//   //   const filteredInstallments = installments
//   //     .filter(installment => installment.schemeId === schemeID)
//   //     .flatMap(installment => installment.installments || [])
//   //     .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  
//   //   const tables = [];
//   //   let currentTable = [];
//   //   let overallIndex = 1;
//   //   let totalAmount = 0;
  
//   //   // Find the index of the first installment after the start date
//   //   const startIndex = filteredInstallments.findIndex(installment => 
//   //     parseDate(installment.date) >= startDate
//   //   );
  
//   //   // If no installments found after the start date, use all installments
//   //   const actualStartIndex = startIndex !== -1 ? startIndex : 0;
  
//   //   // Calculate the number of empty rows needed
//   //   const emptyRowsNeeded = Math.max(0, 20 - (filteredInstallments.length - actualStartIndex));
  
//   //   // Add empty rows at the beginning of the first table
//   //   for (let i = 0; i < emptyRowsNeeded; i++) {
//   //     currentTable.push(
//   //       <tr key={`empty-${i}`}>
//   //         <td colSpan="7">&nbsp;</td>
//   //       </tr>
//   //     );
//   //   }
  
//   //   // Process all installments starting from the actual start index
//   //   for (let i = actualStartIndex; i < filteredInstallments.length; i++) {
//   //     const installment = filteredInstallments[i];
//   //     const installmentDate = parseDate(installment.date);
      
//   //     if (installmentDate <= endDate) {
//   //       totalAmount += installment.amount;
//   //       currentTable.push(
//   //         <tr key={`${installment.date}-${overallIndex}`}>
//   //           <td>{overallIndex++}</td>
//   //           <td>{installment.date}</td>
//   //           <td>Installment</td>
//   //           <td>{installment.emiIndex}</td>
//   //           <td>{installment.amount.toFixed(2)}</td>
//   //           <td>{totalAmount.toFixed(2)}</td>
//   //           <td></td>
//   //         </tr>
//   //       );
//   //     }
  
//   //     if (currentTable.length === 20) {
//   //       tables.push([...currentTable]);
//   //       currentTable = [];
//   //     }
//   //   }
  
//   //   // Add any remaining rows to the last table
//   //   if (currentTable.length > 0) {
//   //     tables.push([...currentTable]);
//   //   }
  
//   //   return tables;
//   // }, [installments, schemeID, fromDate, toDate]);

//   const generateRows = useMemo(() => {
//     if (!installments.length || !schemeID) return [];
  
//     const parseDate = (dateString) => {
//       const [day, month, year] = dateString.split('/').map(Number);
//       return new Date(year, month - 1, day);
//     };
  
//     const startDate = fromDate ? parseDate(fromDate) : new Date(0);
//     const endDate = toDate ? parseDate(toDate) : new Date();
  
//     const filteredInstallments = installments
//       .filter(installment => installment.schemeId === schemeID)
//       .flatMap(installment => installment.installments || [])
//       .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  
//     const tables = [];
//     let currentTable = [];
//     let overallIndex = 1;
//     let totalAmount = 0;
  
//     // Count the number of installments before the start date
//     const installmentsBeforeStartDate = filteredInstallments.filter(installment => 
//       parseDate(installment.date) < startDate
//     ).length;
  
//     // Add empty rows for installments before the start date
//     for (let i = 0; i < installmentsBeforeStartDate; i++) {
//       currentTable.push(
//         <tr key={`empty-${i}`}>
//           <td colSpan="7">&nbsp;</td>
//         </tr>
//       );
//     }
  
//     // Process installments starting from the first one after the start date
//     for (let i = 0; i < filteredInstallments.length; i++) {
//       const installment = filteredInstallments[i];
//       const installmentDate = parseDate(installment.date);
      
//       if (installmentDate >= startDate && installmentDate <= endDate) {
//         totalAmount += installment.amount;
//         currentTable.push(
//           <tr key={`${installment.date}-${overallIndex}`}>
//             <td>{overallIndex++}</td>
//             <td>{installment.date}</td>
//             <td>Installment</td>
//             <td>{installment.emiIndex}</td>
//             <td>{installment.amount.toFixed(2)}</td>
//             <td>{totalAmount.toFixed(2)}</td>
//             <td></td>
//           </tr>
//         );
//       }
  
//       if (currentTable.length === 20) {
//         tables.push([...currentTable]);
//         currentTable = [];
//       }
//     }
  
//     // Add any remaining rows to the last table
//     if (currentTable.length > 0) {
//       tables.push([...currentTable]);
//     }
  
//     return tables;
//   }, [installments, schemeID, fromDate, toDate]);
  
  
  

//   // CHANGE: New function to render multiple tables
//   const renderTables = () => {
//     return generateRows.map((tableRows, tableIndex) => (
//       <table key={`table-${tableIndex}`} className="table table-bordered mb-4">
//         <thead>
//           <tr>
//             <th>Index</th>
//             <th>Date</th>
//             <th>Particulars</th>
//             <th>Installment Number</th>
//             <th>Deposits</th>
//             <th>Total</th>
//             <th>Initials</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableRows}
//         </tbody>
//       </table>
//     ));
//   };

//   // Remove paginate function and pageCount calculation as they're no longer needed
//   // const pageCount = Math.ceil(generateRows.length / rowsPerPage);
//   // const indexOfLastRow = currentPage * rowsPerPage;
//   // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   // const currentRows = generateRows.slice(indexOfFirstRow, indexOfLastRow);
//   // const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handlePrint = () => {
//     const originalContents = document.body.innerHTML;
//     const printContents = `
//       <style>
//         @media print {
//           @page { size: A4; margin: 1cm; }
//           body { font-size: 12px; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid black; padding: 5px; }
//           .print-hide { display: none; }
//         }
//       </style>
//       <div>${printAreaRef.current.innerHTML}</div>
//     `;

//     document.body.innerHTML = printContents;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   const confirmPrint = () => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           Are you sure you want to print?
//           <div style={{ marginTop: '10px' }}>
//             <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
//             <Button variant="secondary" onClick={closeToast}>No</Button>
//           </div>
//         </div>
//       ),
//       { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
//     );
//   };

//   const frontPageDetails = `
//     <style>
//       @media print {
//         @page {
//           size: A4;
//           margin: 0;
//         }
//         body {
//           margin: 0;
//           width: 100%;
//         }
//         .front-page-details {
//           width: 90%;
//           padding-top: 5px;
//           margin: auto;
//           text-align: center;
//         }
//         .container {
//           display: flex;
//           justify-content: center;
//         }
//         .column {
//           width: 45%;
//           text-align: left;
//         }
//         .row {
//           display: flex;
//           justify-content: left;
//           align-items: center;
//           margin-bottom: 2px;
//         }
//         .row.branch-address {
//           flex-direction: column;
//           align-items: flex-start;
//           margin-bottom: 10px;
//         }
//         .label {
//           font-weight: bold;
//           margin-right: 10px;
//         }
//         .value {
//           text-align: left;
//         }
//         .spacer {
//           visibility: hidden;
//         }
//       }
//     </style>
//     <div class="front-page-details">
//       ${Array(11).fill('<p class="spacer">.</p>').join('')}
//       <div class="container">
//         <div class="column">
//           <div class="row branch-address">
//             <span class="label">Branch Address:</span>
//             <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">IFSC Code:</span>
//             <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Join Date:</span>
//             <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Account Number:</span>
//             <span class="value">${formData.schemeId || 'N/A'}</span>
//           </div>
//         </div>
//         <div class="column">
//           <div class="row">
//             <span class="label">Membership ID:</span>
//             <span class="value">${formData.membershipId || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Name:</span>
//             <span class="value">${formData.customerName || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Mobile Number:</span>
//             <span class="value">${formData.customerNumber || 'N/A'}</span>
//           </div>
//           <div class="row">
//             <span class="label">Address:</span>
//             <span class="value">${formData.address || 'N/A'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   const handlePrint2 = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${frontPageDetails}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <div>
//       <Nav />
//       <Container>
//         <h3 className="text-center my-4">PASSBOOK</h3>

//         <Form.Group className="mb-3">
//           <Form.Label>Scheme Id</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Search..."
//             value={schemeID}
//             onChange={(e) => setSchemeID(e.target.value)}
//             onFocus={() => setShowDropdown(true)}
//           />
//           {showDropdown && schemeID && (
//             <ul className="dropdown-menu2 show">
//               {accountNumbers
//                 .filter((customer) => customer.schemeId && customer.schemeId.toLowerCase().includes(schemeID.toLowerCase()))
//                 .map((customer, index) => (
//                   <li key={index} className="dropdown-item" onClick={() => handleACCNumberSelect(customer.schemeId)}>
//                     {customer.schemeId} - {customer.customerName}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Form.Group>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>From Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={fromDate ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setFromDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//           <div className="col-md-6">
//             <Form.Group>
//               <Form.Label>To Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={toDate ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
//                 onChange={(e) => setToDate(moment(e.target.value).format("DD/MM/YYYY"))}
//               />
//             </Form.Group>
//           </div>
//         </div>

//         <Button onClick={confirmPrint} className="mb-3 me-2">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook
//         </Button>
//         <Button onClick={handlePrint2} className="mb-3">
//           <FontAwesomeIcon icon={faPrint} /> Print Passbook Frontpage
//         </Button>

//         <div ref={printAreaRef}>
//           {/* CHANGE: Use renderTables() instead of a single table */}
//           {renderTables()}
//         </div>
//       </Container>
//       <ToastContainer />
//     </div>
//   );
// }

// export default SwarnaNidhiPassbook;


import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Nav from "../Others/Nav";
import axios from "axios";
import { UserContext } from "../Others/UserContext";
import moment from "moment";
import "../style/Main.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SwarnaNidhiPassbook() {
  const [accountNumbers, setAccountNumbers] = useState([]);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
  const [schemeID, setSchemeID] = useState('');
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
    branchName: '',
    date: '',
    newDate: '',
    membershipId: '',
    address: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [installments, setInstallments] = useState([]);
  const printAreaRef = useRef(null);

  useEffect(() => {
    if (schemeID) {
      fetchInstallmentData(schemeID);
    }
  }, [schemeID, fromDate, toDate]);

  const fetchInstallmentData = async (schemeId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/installments/${schemeId}`);

      if (response.data && response.data.data) {
        setAccountNumbers(response.data.data);
        setInstallments(response.data.data);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching installment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataChange = (value, type) => {
    if (type === 'schemeId') {
      setSchemeID(value);
      fetchData(value);
    } else if (type === 'fromDate') {
      setFromDate(value);
    } else if (type === 'toDate') {
      setToDate(value);
    }
    
    if (schemeID) {
      fetchInstallmentData(schemeID);
    }
  };

  const handleACCNumberSelect = (value) => {
    handleDataChange(value, 'schemeId');
    setShowDropdown(false);
  };

  const fetchData = (mobile) => {
    const filteredCustomers = accountNumbers.filter(
      (customer) => customer.schemeId === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSelectedAccountNumber(filteredCustomers[0].schemeId);
    } else {
      setFormData({});
    }
  };



  const generateRows = useMemo(() => {
    if (!installments.length || !schemeID) return [];
  
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
  
    const startDate = fromDate ? parseDate(fromDate) : new Date(0);
    const endDate = toDate ? parseDate(toDate) : new Date();
  
    const filteredInstallments = installments
      .find(installment => installment.schemeId === schemeID)?.installments || [];
  
    // Remove duplicates and sort
    const uniqueInstallments = filteredInstallments.reduce((acc, current) => {
      const x = acc.find(item => item.date === current.date);
      if (!x) {
        return acc.concat([current]);
      } else {
        // If there's a duplicate, keep the one with the lower emiIndex
        return acc.map(item => item.date === current.date && current.emiIndex < item.emiIndex ? current : item);
      }
    }, []);
  
    const sortedInstallments = uniqueInstallments
      .sort((a, b) => a.emiIndex - b.emiIndex)
      .filter(installment => {
        const installmentDate = parseDate(installment.date);
        return installmentDate >= startDate && installmentDate <= endDate;
      });
  
    const tables = [];
    let currentTable = [];
    let overallIndex = 1;
  
    const installmentsBeforeStartDate = uniqueInstallments.filter(installment => 
      parseDate(installment.date) < startDate
    ).length;
  
    // Add empty rows for installments before start date
    for (let i = 0; i < installmentsBeforeStartDate; i++) {
      currentTable.push(
        <tr key={`empty-${i}`} className="empty-row">
          <td colSpan="7">&nbsp;</td>
        </tr>
      );
  
      if (currentTable.length === 20) {
        tables.push([...currentTable]);
        currentTable = [];
      }
    }
  
    // Add rows for all installments within the date range
    for (const installment of sortedInstallments) {
      currentTable.push(
        <tr key={`${installment.date}-${installment.emiIndex}`}>
          <td>{overallIndex++}</td>
          <td>{installment.date}</td>
          <td>Installment</td>
          <td>{installment.emiIndex}</td>
          <td>{installment.amount.toFixed(2)}</td>
          <td>{installment.emiTotal}</td>
          <td></td>
        </tr>
      );
  
      if (currentTable.length === 20) {
        tables.push([...currentTable]);
        currentTable = [];
      }
    }
  
    // Add any remaining rows to the last table
    if (currentTable.length > 0) {
      tables.push([...currentTable]);
    }
  
    return tables;
  }, [installments, schemeID, fromDate, toDate]);

  const renderTables = () => {
    return generateRows.map((tableRows, tableIndex) => (
      <table key={`table-${tableIndex}`} className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>Index</th>
            <th>Date</th>
            <th>Particulars</th>
            <th>Installment Number</th>
            <th>Deposits</th>
            <th>Total</th>
            <th>Initials</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    ));
  };

  const getFormattedDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("DDMMYYYY");
  };


  const getFileName = () => {
    let fileName = `${schemeID}_Passbook`;
    if (fromDate && toDate) {
      fileName += `_${getFormattedDate(fromDate)}_to_${getFormattedDate(toDate)}`;
    } else {
      fileName += `_${moment().format("DDMMYYYY")}`;
    }
    return fileName;
  };


  // const handlePrint = () => {
  //   const printContents = `
  //     <style>
  //       @media print {
  //         @page { size: A4; margin: 1cm; }
  //         body { font-size: 12px; }
  //         table { width: 100%; border-collapse: separate; border-spacing: 0 1px; }
  //         td { border: none; padding: 5px; }
  //         tr { page-break-inside: avoid; }
  //         .print-hide { display: none; }
  //         .empty-row td { height: 1em; }
        
  //   table thead {
  //   visibility: hidden; /* Keep the row space but hide the text */
  // }
  //       }
  //     </style>
  //     <div>${printAreaRef.current.innerHTML}</div>
  //   `;

  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>${getFileName()}</title>
  //       </head>
  //       <body>
  //         ${printContents}
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();

  //   printWindow.onload = function() {
  //     printWindow.print();
  //     printWindow.onafterprint = function() {
  //       printWindow.close();
  //     };
  //   };
  // };

 

  // const confirmPrint = () => {
  //   toast(
  //     ({ closeToast }) => (
  //       <div>
  //         Are you sure you want to print?
  //         <div style={{ marginTop: '10px' }}>
  //           <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
  //           <Button variant="secondary" onClick={closeToast}>No</Button>
  //         </div>
  //       </div>
  //     ),
  //     { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
  //   );
  // };
  // const frontPageDetails = `
  //   <style>
  //     @media print {
  //       @page {
  //         size: A4;
  //         margin: 0;
  //       }
  //       body {
  //         margin: 0;
  //         width: 100%;
  //       }
  //       .front-page-details {
  //         width: 90%;
  //         padding-top: 5px;
  //         margin: auto;
  //         text-align: center;
  //       }
  //       .container {
  //         display: flex;
  //         justify-content: center;
  //       }
  //       .column {
  //         width: 45%;
  //         text-align: left;
  //       }
  //       .row {
  //         display: flex;
  //         justify-content: left;
  //         align-items: center;
  //         margin-bottom: 2px;
  //       }
  //       .row.branch-address {
  //         flex-direction: column;
  //         align-items: flex-start;
  //         margin-bottom: 10px;
  //       }
  //       .label {
  //         font-weight: bold;
  //         margin-right: 10px;
  //       }
  //       .value {
  //         text-align: left;
  //       }
  //       .spacer {
  //         visibility: hidden;
  //       }
  //     }
  //   </style>
  //   <div class="front-page-details">
  //     ${Array(11).fill('<p class="spacer">.</p>').join('')}
  //     <div class="container">
  //       <div class="column">
  //         <div class="row branch-address">
  //           <span class="label">Branch Address:</span>
  //           <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">IFSC Code:</span>
  //           <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">Join Date:</span>
  //           <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">Account Number:</span>
  //           <span class="value">${formData.schemeId || 'N/A'}</span>
  //         </div>
  //       </div>
  //       <div class="column">
  //         <div class="row">
  //           <span class="label">Membership ID:</span>
  //           <span class="value">${formData.membershipId || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">Name:</span>
  //           <span class="value">${formData.customerName || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">Mobile Number:</span>
  //           <span class="value">${formData.customerNumber || 'N/A'}</span>
  //         </div>
  //         <div class="row">
  //           <span class="label">Address:</span>
  //           <span class="value">${formData.address || 'N/A'}</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `;



  const handlePrint = () => {
    const printContents = `
      <style>
        @media print {
          @page { 
            size: A4; 
            margin: 1cm; 
          }
          body { 
            font-size: 12px; 
          }
          table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0 1px; 
          }
          td { 
            border: none; 
            padding: 5px; 
          }
          tr { 
            page-break-inside: avoid; 
          }
          .print-hide, .index-column { 
            display: none; 
          }
          .empty-row td { 
            height: 1em; 
          }
          table thead {
            display: table-header-group;
          }
          table thead th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
        }
      </style>
      <div>${printAreaRef.current.innerHTML}</div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getFileName()}</title>
          <script>
            function removePageInfo() {
              var style = document.createElement('style');
              style.innerHTML = '@page { size: A4; margin: 1cm; } @page :first { margin-top: 0; } @page { margin-bottom: 0; } body { margin: 0; }';
              document.head.appendChild(style);
            }
          </script>
        </head>
        <body onload="removePageInfo(); window.print(); window.onafterprint = function() { window.close(); }">
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  const handlePrint2 = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getFileName()}_FrontPage</title>
        </head>
        <body onload="window.print(); window.close();">
          ${frontPageDetails}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <Nav />
      <Container>
        <h3 className="text-center my-4">SWARNANIDHI PASSBOOK</h3>

        <Form.Group className="mb-3">
          <Form.Label>Scheme Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={schemeID}
            onChange={(e) => handleDataChange(e.target.value, 'schemeId')}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && schemeID && (
            <ul className="dropdown-menu2 show">
              {accountNumbers
                .filter((customer) => customer.schemeId && customer.schemeId.toLowerCase().includes(schemeID.toLowerCase()))
                .map((customer, index) => (
                  <li key={index} className="dropdown-item" onClick={() => handleACCNumberSelect(customer.schemeId)}>
                    {customer.schemeId} - {customer.customerName}
                  </li>
                ))}
            </ul>
          )}
        </Form.Group>

        <div className="row mb-3">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={fromDate ? moment(fromDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
                onChange={(e) => handleDataChange(moment(e.target.value).format("DD/MM/YYYY"), 'fromDate')}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={toDate ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
                onChange={(e) => handleDataChange(moment(e.target.value).format("DD/MM/YYYY"), 'toDate')}
              />
            </Form.Group>
          </div>
        </div>

        <Button onClick={confirmPrint} className="mb-3 me-2">
          <FontAwesomeIcon icon={faPrint} /> Print Passbook
        </Button>
        <Button onClick={handlePrint2} className="mb-3">
          <FontAwesomeIcon icon={faPrint} /> Print Passbook Frontpage
        </Button>

        <div ref={printAreaRef}>
          {renderTables()}
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default SwarnaNidhiPassbook;