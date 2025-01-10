// export default RdReports
import React, { useState, useContext, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col, Card, FormControl,} from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import { UserContext } from "../Others/UserContext";
import moment from "moment";
import Nav from "../Others/Nav";
import "jspdf-autotable";
import Select from "react-select";


function GdcsReport() {
    const { user, setUser } = useContext(UserContext);
    const [fromDate, setFromDate] = React.useState("");
    const [toDate, setToDate] = React.useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [memberDetails, setMemberDetails] = useState([]);
    const [filteredEmiData, setFilteredEmiData] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [groups, setGroups] = useState([]);
    const[gdcsNumber,setGDCSNumber]=useState("")
    const [emi, setEmi] = useState("");
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const dropdownRef = useRef(null);
    const [selectedgdcsNumber, setSelectedGdcsNumber] = useState(null);
    const [selectedGroupDetails, setSelectedGroupDetails] = useState({});
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState({
        customerName: "",
        membershipId: "",
      });




      // Ensure printAreaRef is defined at the top level of your component
  const printAreaRef = useRef(null);

  const branchCode = user?.branchDetails?.branchCode;



useEffect(() => {
  const fetchGDCSDetails = async () => {
      try {
          const response = await fetch(`https://api.malabarbank.in/api/branchGroups?branchCode=${branchCode}`);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const responseData = await response.json();
          if (responseData && responseData.data) {
              setGroups(responseData.data);
          } else {
              console.log("Invalid data format.");
          }
      } catch (error) {
          console.error("Error fetching GDCS details:", error);
      }
  };
  fetchGDCSDetails();
}, [branchCode]);

const filterEMIDataByDate = (emis, fromDate, toDate) => {
  if (!fromDate && !toDate) return emis; // Return all EMIs if no date range is specified

  const startDate = fromDate ? moment(fromDate, "DD/MM/YYYY") : null;
  const endDate = toDate ? moment(toDate, "DD/MM/YYYY") : null;

  return emis.filter((emi) => {
      const emiDate = moment(emi.date, "DD/MM/YYYY");
      const isAfterStartDate = startDate ? emiDate.isSameOrAfter(startDate, "day") : true;
      const isBeforeEndDate = endDate ? emiDate.isSameOrBefore(endDate, "day") : true;
      return isAfterStartDate && isBeforeEndDate;
  });
};

const handleGDCSNumberSelection = (selectedOption) => {
  if (selectedOption) {
      setSelectedGdcsNumber(selectedOption.value);

      if (groups.length === 0) {
          console.error("Groups array is empty");
          return;
      }

      const selectedGroup = groups.find((group) => group._id === selectedGroupId);
      if (selectedGroup) {
          const selectedMember = selectedGroup.members.find(
              (member) => member.GDCSNumber === selectedOption.value
          );

          if (selectedMember) {
              setSelectedCustomerDetails({
                  customerName: selectedMember.customerName,
                  membershipId: selectedMember.membershipId,
                  mobileNumber: selectedMember.phoneNumber,
                  schemeAmount: selectedGroup.schemeAmount,
                  duration: selectedGroup.duration,
                  emi: selectedGroup.emi,
                  priceMoney: selectedGroup.priceMoney,
                  startDate: selectedGroup.currentDate,
                  schemeType: selectedGroup.schemeType,
                  auctionSlabPercent: selectedGroup.companyComisionPercentage,
                  companyComisionPercentage: selectedGroup.companyComisionPercentage,
                  numberOfMembers: selectedGroup.numberofMember,
              });
              setFilteredEmiData(selectedMember.monthlyEmi || []);

              
          } else {
              console.error("Member not found for selected GDCS number");
              setSelectedCustomerDetails({
                  customerName: "",
                  membershipId: "",
                  mobileNumber: "",
                  schemeAmount: "",
                  duration: "",
                  emi: "",
                  priceMoney: "",
                  startDate: "",
                  schemeType: "",
                  auctionSlabPercent: "",
                  companyComisionPercentage: "",
                  numberOfMembers: "",
              });
              setFilteredEmiData([]);
              setSelectedGdcsNumber(null);
          }
      } else {
          console.error("Selected group not found in groups array");
           setSelectedGdcsNumber(null);
      }
  } else {
      setSelectedCustomerDetails({
          customerName: "",
          membershipId: "",
          mobileNumber: "",
          schemeAmount: "",
          duration: "",
          emi: "",
          priceMoney: "",
          startDate: "",
          schemeType: "",
          auctionSlabPercent: "",
          companyComisionPercentage: "",
          numberOfMembers: "",
      });
      setFilteredEmiData([]);

      setSelectedGdcsNumber(null);
      // Optionally, force a re-render of the React Select component
      // This can be done by toggling a key prop on the component
      // For demonstration purposes, let's assume the component has a 'key' prop
      // setComponentKey(prevKey => prevKey + 1);
  }
};

const handleGroupChange = (event) => {
  const selectedId = event.target.value;
  setSelectedGroupId(selectedId);

  if (groups.length === 0) {
      console.error("Groups array is empty");
      return;
  }

  const selectedGroup = groups.find((group) => group._id === selectedId);
  if (selectedGroup) {
    setSelectedGroupDetails(selectedGroup); // Update the state with the selected group details

      const phoneNumbers = selectedGroup.members.map(
          (member) => member.phoneNumber
      );
      setPhoneNumbers(phoneNumbers);

      const gdcsNumber = selectedGroup.members.map(
          (member) => member.GDCSNumber
      );
      setGDCSNumber(gdcsNumber);

      const emi = selectedGroup.emi;
      setEmi(emi);
  } else {
      console.error("Selected group not found in groups array");
  }
};

  const printDocument = () => {
    const memberData = memberDetails[0] || {};
    const groupName = selectedGroupDetails.GroupName || "N/A"; // Access the selected group's name

      // Calculate totals
      // Example calculation for totalAmount
const totalAmount = filteredEMIDataByDate.reduce((acc, emi) => acc + (emi.emiAmount  || 0), 0).toFixed(2); // Replace 'someField' with the actual field you're aggregating
  const totalPayableAmount = filteredEMIDataByDate.reduce((acc, emi) => acc + (emi.payableAmount || 0), 0).toFixed(2);
  const totalDividend = filteredEMIDataByDate.reduce((acc, emi) => acc + (emi.dividend || 0), 0).toFixed(2);

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
              .totals-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px; /* Adjust based on your design */
  padding: 10px; /* Optional: Adds some padding around the totals */
}

.details-section {
  width: auto; /* Adjusted to fit content */
  text-align: right; /* Aligns the text to the right */
}

.total-left {
  float: left; /* Aligns the total payable amount to the left */
  margin-right: 10px; /* Adds some spacing between the two totals */
}

.total-right {
  float: right; /* Aligns the total dividend to the right */
  margin-left: 10px; /* Adds some spacing between the two totals */
}

          </style>
        </head>
        <body>
          <h1>GDCS REPORT</h1>
          <div class="details-container">
            <div class="details-section">
              <p><strong>Name:</strong> ${selectedCustomerDetails.customerName || "N/A"}</p>
              <p><strong>GDCS Number:</strong> ${selectedgdcsNumber|| "N/A"}</p>
              <p><strong>Group:</strong> ${groupName}</p>
              <p><strong>Customer Number:</strong> ${
                selectedCustomerDetails.mobileNumber || "N/A"
              }</p>
            </div>
            <div class="details-section right">
              <p><strong>Scheme Type:</strong> ${
                selectedCustomerDetails.schemeType || "N/A"
              }</p>
              <p><strong>Final Amount:</strong> ₹${(
                selectedCustomerDetails.schemeAmount || 0
              ).toFixed(2)}</p>
              <p><strong>Date of Join:</strong> ${
                selectedCustomerDetails.startDate|| "N/A"
              }</p> <p><strong>EMI :</strong> ₹${
                selectedCustomerDetails.emi || "N/A"
              }</p>
              
            </div>
          </div>
          <div class="table-responsive">
            ${document.querySelector(".table-responsive").innerHTML}
          </div>
          <div class="totals-container">
           <div class="details-section">
      <span class="total-left">Total EMI: ₹${totalAmount}</span> <!-- Display the total amount here -->
    </div>
    <div class="details-section">
      <span class="total-center">Total Dividend: ₹${totalDividend}</span>
    </div>
    <div class="details-section">
      <span class="total-right">Total Payable Amount: ₹${totalPayableAmount}</span>
    </div>
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

  const filteredEMIDataByDate = filterEMIDataByDate(filteredEmiData, fromDate, toDate);

  return (
    <>
      <Nav />
      <Container fluid className="mt-4" style={{ maxWidth: "90%" }}>
        <Row>
          <Col md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
              <div className="form-group">
                        <label>All Groups</label>
                        <select
                          className="form-control"
                          id="allGroups"
                          onChange={handleGroupChange}
                          value={selectedGroupId}
                        >
                          <option value="">Select Group</option>
                          {groups && Array.isArray(groups) &&  groups.map((group) => (
                            <option
                             key={group._id} value={group._id}
                             >
                              {group.GroupName}
                            </option>
                           ))}
                        </select>
                      </div>
           
                <div className="form-group mt-1">
                    <label>Customer GDCS Number</label>
                     <Select
                        ref={dropdownRef}
                        options={gdcsNumber?gdcsNumber.map((number) => ({
                          value: number,
                          label: number,
                        })):[]}
                        value={
                          selectedgdcsNumber
                            ? {
                                value: selectedgdcsNumber,
                                label: selectedgdcsNumber,
                              }
                            : null
                        }
                        onChange={handleGDCSNumberSelection}
                        isClearable={true}
                        placeholder="Select GDCS Number"
                        isSearchable={true}
                      />
                    </div>
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

          

<Card className="shadow-sm mt-4">
  <Card.Header className="bg-primary text-white py-3">
    <h5 className="mb-0 fw-bold">GDCS Member Details</h5>
  </Card.Header>
  <Card.Body>
    <ul>
      <li>
        <strong>Name:</strong> {selectedCustomerDetails.customerName || "N/A"}
      </li>
      <li>
        <strong>GDCS Number:</strong> {selectedgdcsNumber || "N/A"}
      </li>
      <li>
        <strong>Membership Id:</strong> {selectedCustomerDetails.membershipId || "N/A"}
      </li>
      <li>
        <strong>Mobile Number:</strong> {selectedCustomerDetails.mobileNumber || "N/A"}
      </li>
      <li>
        <strong>Scheme Amount:</strong> {selectedCustomerDetails.schemeAmount || "N/A"}
      </li>
      <li>
        <strong>Duration:</strong> {selectedCustomerDetails.duration || "N/A"}
      </li>
      <li>
        <strong>EMI:</strong> {selectedCustomerDetails.emi || "N/A"}
      </li>
      <li>
        <strong>Start Date:</strong> {selectedCustomerDetails.startDate || "N/A"}
      </li>
      <li>
        <strong>Scheme Type:</strong> {selectedCustomerDetails.schemeType || "N/A"}
      </li>
      <li>
        <strong>Price Money:</strong> {selectedCustomerDetails.priceMoney || "N/A"}
      </li>
      <li>
        <strong>Number of Members:</strong> {selectedCustomerDetails.numberOfMembers || "N/A"}
      </li>
      <li>
        <strong>Company Commision:</strong> {selectedCustomerDetails.companyComisionPercentage || "N/A"}
      </li>
      <li>
        <strong>Auction Slab:</strong> {selectedCustomerDetails.auctionSlabPercent || "N/A"}
      </li>
      {/* Add more details as needed */}
    </ul>
  </Card.Body>
</Card>
          </Col>
          <Col md={8}>
            <div ref={printAreaRef}>
              <Card className="shadow-lg h-100">
                <Card.Header className="bg-primary text-white py-3">
                  <h5 className="mb-0 fw-bold">GDCS Reports</h5>
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
                            EMI
                          </th>

                          <th scope="col" className="text-end align-middle">
                            Divident
                          </th>
                          <th scope="col" className="text-end align-middle">
                            Payable Amount
                          </th>
                        </tr>
                      </thead>

<tbody>
  {filteredEMIDataByDate.length > 0 ? (
    filteredEMIDataByDate.map((emi, emiIndex) => (
      <tr key={emiIndex}>
        <td className="text-center">{emiIndex + 1}</td>
        <td>{emi.date}</td>
        <td className="text-end">₹{emi.emiAmount?.toFixed(2) ?? "N/A"}</td>
        <td className="text-end">₹{emi.dividend?.toFixed(2) ?? "N/A"}</td>
        <td className="text-end">₹{emi.payableAmount?.toFixed(2) ?? "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-muted fst-italic py-4">
        No EMI details found for the selected GDCS Number.
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
  )
}

export default GdcsReport