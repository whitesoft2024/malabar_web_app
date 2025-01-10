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
          {/* <td>{overallIndex++}</td> */}
          <td>{installment.date}</td>
          <td>Installment</td>
          {/* <td>{installment.emiIndex}</td> */}
          <td className="installment-number">{installment.emiIndex}</td> {/* Added className */}
          <td>{installment.amount}</td>
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
      <table key={`table-${tableIndex}`} className="table">
        <thead>
          <tr>
            {/* <th className="index-column">Index</th> */}
            <th className="Date-column">Date</th>
            <th>Particulars</th>
            <th>Installment no.</th>
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

  // const getFormattedDate = (date) => {
  //   return moment(date, "DD/MM/YYYY").format("DDMMYYYY");
  // };


  // const getFileName = () => {
  //   let fileName = `${schemeID}_Passbook`;
  //   if (fromDate && toDate) {
  //     fileName += `_${getFormattedDate(fromDate)}_to_${getFormattedDate(toDate)}`;
  //   } else {
  //     fileName += `_${moment().format("DDMMYYYY")}`;
  //   }
  //   return fileName;
  // };


  // const handlePrint = () => {
  //   const printContents = `
  //   <style>
  //     @media print {
  //       @page { size: A4; }
  //       body { font-size: 10px; }
  //       table { 
  //         width: 100%; 
  //         border-collapse: separate; 
  //         border-spacing: 0 0px;
  //         text-align: center;
  //       }
  //       .Date-column{
  //         text-align: left!important;
  //         // padding-left: 25px;
          
  //       }
  //       td { border: none; padding: 5px; }
  //       .print-hide { display: none; }
  //       .empty-row td { height: 1em; }

  //       table thead {
  //         visibility: hidden;
  //       }
  //     }
  //   </style>
  //   <div>${printAreaRef.current.innerHTML}</div>
  // `;
  
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>

  //       </head>
  //       <body>
  //         ${printContents}
  //       </body>
  //     </html>
  //   `);
  
  //   // Add inline style to the Date column cells
  //   // const tableRows = document.querySelectorAll('table tbody tr td:nth-child(1)');
  //   // tableRows.forEach(row => {
  //   //   row.style.textAlign = 'left';
  //   //   row.style.paddingLeft = '10px';
  //   // });
  
  //   printWindow.document.close();
  
  //   printWindow.onload = function () {
  //     printWindow.print();
  //     printWindow.onafterprint = function () {
  //       printWindow.close();
  //     };
  //   };
  // };

//   const handlePrint = () => {
//   const printContents = `
//   <style>
//     @media print {
//       @page { size: A4; margin: 0; }
//       body { font-size: 10px; margin: 0; padding: 0; }
//       table {
//         width: 100%;
//         border-collapse: separate;
//         border-spacing: 0;
//         text-align: center;
//         margin-left:0
//       }
//       .Date-column {
//         text-align: left !important;
//         padding-left: 0 !important;
//       }
//       td { border: none; padding: 5px 0; }
//       td:first-child { padding-left: 0;
//        }
//       .print-hide { display: none; }
//       .empty-row td { height: 1em; }
//       table thead { visibility: hidden; }
      
//     }
//   </style>
//   <div>${printAreaRef.current.innerHTML}</div>
//   `;

//   const printWindow = window.open('', '_blank');
//   printWindow.document.write(`
//     <html>
//       <head>
//       </head>
//       <body>
//         ${printContents}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   printWindow.onload = function () {
//     printWindow.print();
//     printWindow.onafterprint = function () {
//       printWindow.close();
//     };
//   };
// };

// const handlePrint = () => {
//   const printContents = `
//   <style>
//     @media print {
//       @page { size: A4; margin: 0; }
//       body { font-size: 10px; margin: 0; padding: 0; }
//       table {
//         width: 100%;
//         border-collapse: separate;
//         border-spacing: 0;
//         text-align: center;
//         padding-left: 10px; /* Add a small padding to the left of the table */
//       }
//       .Date-column {
//         text-align: left !important;
//         padding-left: 0 !important;
//       }
//       td { border: none; padding: 5px 0; }
//       td:first-child { 
//         padding-left: 5px; /* Add a small padding to the left of the date column */
//       }
//       .print-hide { display: none; }
//       .empty-row td { height: 1em; }
//       table thead { visibility: hidden; }
//     }
//   </style>
//   <div>${printAreaRef.current.innerHTML}</div>
//   `;

//   const printWindow = window.open('', '_blank');
//   printWindow.document.write(`
//     <html>
//       <head>
//       </head>
//       <body>
//         ${printContents}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   printWindow.onload = function () {
//     printWindow.print();
//     printWindow.onafterprint = function () {
//       printWindow.close();
//     };
//   };
// };
  

//   const handlePrint = () => {
//   const printContents = `
//   <style>
//     @media print {
//       @page { size: A4; margin: 0; }
//       body { 
//         font-size: 10px; 
//         margin: 0; 
//         padding: 0; 
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         border-spacing: 0;
//         text-align: center;
//         margin: 0;
//         padding: 0;
//       }
//       td { 
//         border: none; 
//         padding: 5px 0; 
//       }
//       td:first-child { 
//         text-align: left;
//         padding-left: 0;
//       }
//       .print-hide { display: none; }
//       .empty-row td { height: 1em; }
//       table thead { visibility: hidden; }
//     }
//   </style>
//   <div>${printAreaRef.current.innerHTML}</div>
//   `;

//   const printWindow = window.open('', '_blank');
//   printWindow.document.write(`
//     <html>
//       <head>
//       </head>
//       <body>
//         ${printContents}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   printWindow.onload = function () {
//     printWindow.print();
//     printWindow.onafterprint = function () {
//       printWindow.close();
//     };
//   };
// };


// const handlePrint = () => {
//   const printContents = `
//   <style>
//     @media print {
//       @page { size: A4; margin: 0; }
//       body { 
//         font-size: 10px; 
//         margin: 0; 
//         padding: 0; 
//       }
//       table {
//         width: calc(100% - 2px);
//         border-collapse: collapse;
//         border-spacing: 0;
//         text-align: center;
//         margin-left: 1px;
//       }
//       td { 
//         border: none; 
//         padding: 5px 0; 
//       }
//       td:first-child { 
//         text-align: left;
//         padding-left: 1px;
//       }
//       .print-hide { display: none; }
//       .empty-row td { height: 1em; }
//       table thead { visibility: hidden; }
//     }
//   </style>
//   <div>${printAreaRef.current.innerHTML}</div>
//   `;

//   const printWindow = window.open('', '_blank');
//   printWindow.document.write(`
//     <html>
//       <head>
//       </head>
//       <body>
//         ${printContents}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   printWindow.onload = function () {
//     printWindow.print();
//     printWindow.onafterprint = function () {
//       printWindow.close();
//     };
//   };
// };


const handlePrint = () => {
  const printContents = `
  <style>
    @media print {
      @page { size: A4; margin: 0; }
      body { 
        font-size: 10px; 
        margin: 0px;  
        padding: 0; 
      }

      table {
        width: calc(100% - 2px);
        border-collapse: collapse;
        border-spacing: 0;
        text-align: center;
        margin-left: 1px;
        margin-top:40px;
      }
      td { 
        border: none; 
        padding: 5px 0; 
        
        
      }
      td:first-child { 
        text-align: left;
        padding-left: 1px;
      }
      .print-hide { display: none; }
      .empty-row td { height: 1em; }
      table thead { visibility: hidden; }
    }
  </style>
  <div>${printAreaRef.current.innerHTML}</div>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };
};



  // const handlePrint = () => {
  //   const printContents = `
  //     <style>
  //       @media print {
  //         @page { size: A4; }
  //         body { font-size: 10px; }
  //         table { 
  //           width: 100%; 
  //           border-collapse: separate; 
  //           border-spacing: 0 0px;
  //           text-align: center;
  //         }
  //         .Date-column{
  //           text-align: left !important;
  //           padding-left: 10px
  //         }
          
  //         td { border: none; padding: 5px; }
  //         .print-hide { display: none; }
  //         .empty-row td { height: 1em; }

  //         table thead {
  //         visibility: hidden;
  //         }
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

  //   printWindow.onload = function () {
  //     printWindow.print();
  //     printWindow.onafterprint = function () {
  //       printWindow.close();
  //     };
  //   };
  // };

  const confirmPrint = () => {
    toast(
      ({ closeToast }) => (
        <div>
          Are you sure you want to print?
          <div style={{ marginTop: '10px' }}>
            <Button variant="primary" onClick={() => { handlePrint(); closeToast(); }} style={{ marginRight: '10px' }}>Yes</Button>
            <Button variant="secondary" onClick={closeToast}>No</Button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
    );
  };
  const frontPageDetails = `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          width: 100%;
        }
        .front-page-details {
          width: 90%;
          padding-top: 5px;
          margin: auto;
          text-align: center;
        }
        .container {
          display: flex;
          justify-content: center;
        }
        .column {
          width: 45%;
          text-align: left;
        }
        .row {
          display: flex;
          justify-content: left;
          align-items: center;
          margin-bottom: 2px;
        }
        .row.branch-address {
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          margin-right: 10px;
        }
        .value {
          text-align: left;
        }
        .spacer {
          visibility: hidden;
        }
      }
    </style>
    <div class="front-page-details">
      ${Array(11).fill('<p class="spacer">.</p>').join('')}
      <div class="container">
        <div class="column">
          <div class="row branch-address">
            <span class="label">Branch Address:</span>
            <span class="value">${user?.branchDetails?.address || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">IFSC Code:</span>
            <span class="value">${user?.branchDetails?.ifseCode || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Join Date:</span>
            <span class="value">${formData.date || formData.newDate || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Account Number:</span>
            <span class="value">${formData.schemeId || 'N/A'}</span>
          </div>
        </div>
        <div class="column">
          <div class="row">
            <span class="label">Membership ID:</span>
            <span class="value">${formData.membershipId || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Name:</span>
            <span class="value">${formData.customerName || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Mobile Number:</span>
            <span class="value">${formData.customerNumber || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Address:</span>
            <span class="value">${formData.address || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const handlePrint2 = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
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