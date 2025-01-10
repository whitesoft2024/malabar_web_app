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
  // ... (previous state declarations remain the same)

  const getFormattedDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("DDMMYYYY");
  };

  const getFileName = () => {
    let fileName = "Swarna_Passbook";
    if (fromDate && toDate) {
      fileName += `_${getFormattedDate(fromDate)}_to_${getFormattedDate(toDate)}`;
    } else {
      fileName += `_${moment().format("DDMMYYYY")}`;
    }
    return fileName;
  };

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = `
      <style>
        @media print {
          @page { size: A4; margin: 1cm; }
          body { font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 5px; }
          .print-hide { display: none; }
        }
      </style>
      <div>${printAreaRef.current.innerHTML}</div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getFileName()}</title>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

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

  // ... (rest of the component code remains the same)

  return (
    // ... (JSX remains the same)
  );
}

export default SwarnaNidhiPassbook;



























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
  // ... (previous state declarations remain the same)

  const getFormattedDate = (date) => {
    return moment(date, "DD/MM/YYYY").format("DDMMYYYY");
  };

  const getFileName = () => {
    let fileName = "Swarna_Passbook";
    if (fromDate && toDate) {
      fileName += `_${getFormattedDate(fromDate)}_to_${getFormattedDate(toDate)}`;
    } else {
      fileName += `_${moment().format("DDMMYYYY")}`;
    }
    return fileName;
  };

  const handlePrint = () => {
    const printContents = `
      <style>
        @media print {
          @page { size: A4; margin: 1cm; }
          body { font-size: 12px; }
          table { width: 100%; border-collapse: separate; border-spacing: 0 1px; }
          th, td { border: none; padding: 5px; }
          tr { page-break-inside: avoid; }
          .print-hide { display: none; }
        }
      </style>
      <div>${printAreaRef.current.innerHTML}</div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getFileName()}</title>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

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

  const renderTables = () => {
    return generateRows.map((tableRows, tableIndex) => (
      <table key={`table-${tableIndex}`} className="table mb-4">
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
          {tableRows.map((row, rowIndex) => (
            <tr key={`row-${tableIndex}-${rowIndex}`} className={row.props.children[0].props.colSpan === 7 ? 'empty-row' : ''}>
              {row.props.children}
            </tr>
          ))}
        </tbody>
      </table>
    ));
  };

  // ... (rest of the component code remains the same)

  return (
    <div>
      <Nav />
      <Container>
        <h3 className="text-center my-4">PASSBOOK</h3>

        {/* ... (rest of the JSX remains the same) */}

        <div ref={printAreaRef}>
          {renderTables()}
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default SwarnaNidhiPassbook;

























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
  // ... (previous state declarations remain the same)

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

  const handlePrint = () => {
    const printContents = `
      <style>
        @media print {
          @page { size: A4; margin: 1cm; }
          body { font-size: 12px; }
          table { width: 100%; border-collapse: separate; border-spacing: 0 1px; }
          td { border: none; padding: 5px; }
          tr { page-break-inside: avoid; }
          .print-hide { display: none; }
          .empty-row td { height: 1em; }
        }
      </style>
      <div>${printAreaRef.current.innerHTML}</div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getFileName()}</title>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

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

  const renderTables = () => {
    return generateRows.map((tableRows, tableIndex) => (
      <table key={`table-${tableIndex}`} className="table mb-4">
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={`row-${tableIndex}-${rowIndex}`} className={row.props.children[0].props.colSpan === 7 ? 'empty-row' : ''}>
              {row.props.children}
            </tr>
          ))}
        </tbody>
      </table>
    ));
  };

  // ... (rest of the component code remains the same)

  return (
    <div>
      <Nav />
      <Container>
        <h3 className="text-center my-4">PASSBOOK</h3>

        {/* ... (rest of the JSX remains the same) */}

        <div ref={printAreaRef}>
          {renderTables()}
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default SwarnaNidhiPassbook;
















const [transactions, setTransactions] = useState([]);

// Add this to your existing useEffect
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
      setTransactions(response.data.data);  // Add this line
    } else {
      console.error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching installment data:", error);
  } finally {
    setIsLoading(false);
  }
};

const generateRows = useMemo(() => {
  if (!transactions.length || !schemeID) return [];

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const startDate = fromDate ? parseDate(fromDate) : new Date(0);
  const endDate = toDate ? parseDate(toDate) : new Date();

  const filteredInstallments = transactions
    .find(transaction => transaction.schemeId === schemeID)?.installments || [];

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
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))
    .filter(installment => {
      const installmentDate = parseDate(installment.date);
      return installmentDate >= startDate && installmentDate <= endDate;
    });

  const tables = [];
  let currentTable = [];
  let overallIndex = 1;
  let totalAmount = 0;

  // Count installments before start date
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
    totalAmount += installment.amount;
    currentTable.push(
      <tr key={`${installment.date}-${installment.emiIndex}`}>
        <td>{overallIndex++}</td>
        <td>{installment.date}</td>
        <td>Installment</td>
        <td>{installment.emiIndex}</td>
        <td>{installment.amount.toFixed(2)}</td>
        <td>{totalAmount.toFixed(2)}</td>
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
}, [transactions, schemeID, fromDate, toDate]);

const renderTables = () => {
  return generateRows.map((tableRows, tableIndex) => (
    <div key={`table-container-${tableIndex}`} className="table-container">
      <table className="table table-bordered mb-4">
        <thead className="print-hide">
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
    </div>
  ));
};




























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

