// export default RdReports
import React, { useState, useContext, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col, Card, FormControl,} from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import { UserContext } from "../Others/UserContext";
import moment from "moment";
import Nav from "../Others/Nav";
import "jspdf-autotable";

function RdReports() {
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const { user, setUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberDetails, setMemberDetails] = useState([]);
  const [filteredEmiData, setFilteredEmiData] = useState([]);

  // Ensure printAreaRef is defined at the top level of your component
  const printAreaRef = useRef(null);

  const RDfetchMemberDetails = async (searchTerm) => {
    const branchcode = user?.branchDetails?.branchCode;
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/api/getRdDetailsPg?branchcode=${branchcode}&RDNumber=${searchTerm}`
      );
      const memberData = response.data.data; // Access the 'data' array
      if (memberData && memberData.length > 0) {
        setMemberDetails(memberData);
        console.log(memberData);
      } else {
        console.log("No member details found for RDS number:", searchTerm);
        setMemberDetails([]); // Set to empty array if no data
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
      setMemberDetails([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (searchTerm) {
      RDfetchMemberDetails(searchTerm);
    }
  }, [searchTerm]);

  // Function to filter EMIs based on date range
  const filterEMIDataByDate = (emis, fromDate, toDate) => {
    if (!fromDate && !toDate) return emis; // Return all EMIs if no date range is specified

    const startDate = fromDate ? moment(fromDate, "DD/MM/YYYY") : null;
    const endDate = toDate ? moment(toDate, "DD/MM/YYYY") : null;

    let startIndex = 0;
    let endIndex = emis.length - 1;

    if (startDate) {
      startIndex = emis.findIndex((emi) =>
        moment(emi.date, "DD/MM/YYYY").isSameOrAfter(startDate, "day")
      );
      startIndex = startIndex === -1 ? 0 : startIndex;
    }

    if (endDate) {
      endIndex = emis.findIndex((emi) =>
        moment(emi.date, "DD/MM/YYYY").isAfter(endDate, "day")
      );
      endIndex = endIndex === -1 ? emis.length : endIndex;
    }

    return emis.slice(startIndex, endIndex);
  };

  // Perform the filtering operation here
  let filteredEMIs = memberDetails[0]?.emi || [];
  if (fromDate && toDate) {
    filteredEMIs = filterEMIDataByDate(filteredEMIs, fromDate, toDate);
  }

  const printDocument = () => {
    const memberData = memberDetails[0] || {};

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RD Report</title>
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
              table, th, td { 
  border: 1px solid #000; 
}
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            table, th, td { 
              border: 1px solid #000; 
            }
            th, td { 
              padding: 8px; 
              text-align: left; 
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
              overflow-x: visible;
              -webkit-overflow-scrolling: touch;
            }
          </style>
        </head>
        <body>
          <h1>RD REPORT</h1>
          <div class="details-container">
            <div class="details-section">
              <p><strong>Name:</strong> ${memberData.customerName || "N/A"}</p>
              <p><strong>RD Number:</strong> ${memberData.RDNumber || "N/A"}</p>
              <p><strong>Account Type:</strong> ${
                memberData.accountType || "N/A"
              }</p>
              <p><strong>Customer Number:</strong> ${
                memberData.customerNumber || "N/A"
              }</p>
            </div>
            <div class="details-section right">
              <p><strong>RD Scheme Type:</strong> ${
                memberData.RDschemeType || "N/A"
              }</p>
              <p><strong>Final Amount:</strong> ₹${(
                memberData.finalAmount || 0
              ).toFixed(2)}</p>
              <p><strong>Date of Join:</strong> ${
                memberData.startDate || "N/A"
              }</p> <p><strong>EMI :</strong> ₹${
                memberData.emiAmount || "N/A"
              }</p>
               <p><strong>Interest:</strong> ${
                memberData.interest || "N/A"
              }%</p>
            </div>
          </div>
          <div class="table-responsive">
            ${document.querySelector(".table-responsive").innerHTML}
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
  return (
    <>
      <Nav />
      <Container fluid className="mt-4" style={{ maxWidth: "90%" }}>
        <Row>
          <Col md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <FormControl
                  type="text"
                  placeholder="Enter RD Number"
                  className="mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="fromDate">From Date</Form.Label>
                      <Form.Control
                        type="date"
                        id="fromDate"
                        value={
                          fromDate
                            ? moment(fromDate, "DD/MM/YYYY").format(
                                "YYYY-MM-DD"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          setFromDate(
                            moment(e.target.value, "YYYY-MM-DD").format(
                              "DD/MM/YYYY"
                            )
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="toDate">To Date</Form.Label>
                      <Form.Control
                        type="date"
                        id="toDate"
                        value={
                          toDate
                            ? moment(toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) =>
                          setToDate(
                            moment(e.target.value, "YYYY-MM-DD").format(
                              "DD/MM/YYYY"
                            )
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  Clear Dates
                </Button>
              </Card.Body>
            </Card>

            {/* New Card for RD Number Details */}
            {Array.isArray(memberDetails) && memberDetails.length > 0 && (
              <Card className="shadow-sm mt-4">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 fw-bold">RD Details</h5>
                </Card.Header>
                <Card.Body>
                  <ul>
                    <li>
                      <strong>Name:</strong>{" "}
                      {memberDetails[0]?.customerName || "N/A"}
                    </li>
                    <li>
                      <strong>RD Number:</strong>{" "}
                      {memberDetails[0]?.RDNumber || "N/A"}
                    </li>
                    <li>
                      <strong>Account Type:</strong>{" "}
                      {memberDetails[0]?.accountType || "N/A"}
                    </li>
                    <li>
                      <strong>Customer Number:</strong>{" "}
                      {memberDetails[0]?.customerNumber || "N/A"}
                    </li>
                    <li>
                      <strong>RD Scheme Type:</strong>{" "}
                      {memberDetails[0]?.RDschemeType || "N/A"}
                    </li>
                    <li>
                      <strong>Final Amount:</strong> ₹
                      {(memberDetails[0]?.finalAmount || 0).toFixed(2)}
                    </li>
                    <li>
                      <strong>Date of Join:</strong>{" "}
                      {memberDetails[0]?.startDate || "N/A"}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={8}>
            <div ref={printAreaRef}>
              <Card className="shadow-lg h-100">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 fw-bold">RD Reports</h5>
                </Card.Header>
                <Card.Body>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "500px", overflowY: "auto" }}
                  >
                    <table
                      className="table table-striped table-hover table-bordered mb-0"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <thead
                        className="table-light"
                        style={{ position: "sticky", top: 0, zIndex: 1 }}
                      >
                        <tr>
                          <th scope="col" className="text-center align-middle">
                            #
                          </th>
                          <th scope="col" className="align-middle">
                            Date
                          </th>
                          <th scope="col" className="text-end align-middle">
                            Deposit
                          </th>

                          <th scope="col" className="text-end align-middle">
                            Current Balance
                          </th>
                          <th scope="col" className="text-end align-middle">
                            Monthly Interest
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredEMIs.length > 0 ? (
                          filteredEMIs.map((emi, emiIndex) => (
                            <tr key={emiIndex}>
                              <td className="text-center">{emi.emiNumber}</td>
                              <td>{emi.date}</td>{" "}
                              {/* This will now correctly display in DD/MM/YYYY format */}
                              <td className="text-end">
                                ₹{emi.amount?.toFixed(2) ?? "N/A"}
                              </td>
                              <td className="text-end">
                                ₹
                                {emi.currentInterestBalance?.toFixed(2) ??
                                  "N/A"}
                              </td>
                              <td className="text-end">
                                ₹{emi.currentInterest?.toFixed(2) ?? "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center text-muted fst-italic py-4"
                            >
                              No matching EMI details found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button
                    onClick={printDocument}
                    className="btn btn-danger w-100"
                  >
                    Print
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .table tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.1) !important;
          transition: background-color 0.3s ease;
        }
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card {
          border-radius: 15px;
          overflow: hidden;
        }
        .card-header {
          border-bottom: 0;
        }
        .table-responsive::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .table-responsive::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}

export default RdReports;
