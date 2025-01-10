import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NavbarSection from '../adminOthers/AdminNavbar'
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../style/logo.png"
import axios from "axios";
// import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faCross,
  faMultiply,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../Others/UserContext";

import "react-datepicker/dist/react-datepicker.css";

function ClosingDenominationAdmin() {
  const [denominations, setDenominations] = useState({
    500: "",
    200: "",
    100: "",
    50: "",
    20: "",
    10: "",
  });
  const [coinsAmount, setCoinsAmount] = useState("");
  const [stampsAmount, setStampsAmount] = useState("");
  const [shortage, setShortage] = useState(0);
  const [excess, setExcess] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [branchCodes, setBranchCodes] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [branches, setBranches] = useState([]);
  const { user,setUser } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log(user);
  const handleDenominationChange = (e, denomination) => {
    const value = e.target.value;
    setDenominations((prevState) => ({
      ...prevState,
      [denomination]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location = (`/`);
};

  const calculateTotalAmount = () => {
    const denominationsTotal = Object.entries(denominations).reduce(
      (acc, [denomination, value]) => {
        return acc + (value ? value * denomination : 0);
      },
      0
    );
    const coins = coinsAmount ? parseInt(coinsAmount) : 0;
    const stamps = stampsAmount ? parseInt(stampsAmount) : 0;
    return denominationsTotal + coins + stamps;
  };

  const handleCoinsChange = (e) => {
    setCoinsAmount(e.target.value);
  };

  const handleStampsChange = (e) => {
    setStampsAmount(e.target.value);
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [closingBalance, setClosingBalance] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      fetchData(formattedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    // Reset the form fields immediately after setting the new date
    resetForm2();
    // Fetch closing denomination data for the new date
    fetchClosingDenomination(formatDateString(newDate));
  };

  const formatDate = (dateString) => {
    // Convert selectedDate from yyyy-mm-dd to dd/mm/yyyy format
    const parts = dateString.split("-");
    const formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
    return formattedDate;
  };

  const fetchData = async (date) => {
    try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await fetch(`https://api.malabarbank.in/api/closinBalance?date=${date}&branchCode=${branchCode}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        if (responseData && Array.isArray(responseData.data) && responseData.data.length > 0) {
            const closingBalance = responseData.data[0].closingBalance;
            setClosingBalance(closingBalance);
        } else {
            console.error("Invalid response data:", responseData);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
  useEffect(() => {
    if (selectedDate && selectedBranchCode) {
      fetchData(formatDateString(selectedDate), selectedBranchCode);
    }
  }, [selectedDate, selectedBranchCode]);
  
  

  console.log("selected date", selectedDate);

  console.log("closing balance", closingBalance);

  useEffect(() => {
    const netCash = calculateTotalAmount();
    if (closingBalance === "" || isNaN(closingBalance)) return;
    if (closingBalance > netCash) {
      setShortage(closingBalance - netCash);
      setExcess(0);
    } else {
      setShortage(0);
      setExcess(netCash - closingBalance);
    }
  }, [closingBalance, coinsAmount, denominations, stampsAmount]);

  const resetForm = () => {
    setDenominations({
      500: "",
      200: "",
      100: "",
      50: "",
      20: "",
      10: "",
    });
    setCoinsAmount("");
    setStampsAmount("");
    setShortage(0);
    setExcess(0);
    setSelectedDate("");
    setClosingBalance(null);
  };

  const resetForm2 = () => {
    setDenominations({
      500: "",
      200: "",
      100: "",
      50: "",
      20: "",
      10: "",
    });
    setCoinsAmount("");
    setStampsAmount("");
    setShortage(0);
    setExcess(0);
    setClosingBalance(null);
  };
  const [formData, setFormData] = useState({
    branch_name: '',
    branchCode: '',
    netCash: "",
    closingBalance: "",
    shortage: "",
    excess: "",
    coinsAmount: "",
    stampsAmount: "",
    date: "",
    branchCode: "",
    total500: 0,
    total200: 0,
    total100: 0,
    total50: 0,
    total20: 0,
    total10: 0,
  });

  useEffect(() => {
    // Fetch branches from your server
    fetch("https://api.malabarbank.in/api/branches")
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error("Error fetching branches:", error));
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch_name") {
      const selectedBranch = branches.find(branch => branch.branch_name === value);
      setFormData(prevData => ({
        ...prevData,
        branch_name: value,
        branchCode: selectedBranch ? selectedBranch.branchCode : ''
      }));
      console.log("Selected branch code:", selectedBranch ? selectedBranch.branchCode : '');
    } else {
      // For other inputs, update as usual
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  

  const handleSubmit = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to close the cash today?"
    );
    if (!confirmed) {
      // User cancelled, do nothing
      return;
    }

    try {
      // Perform the submission
      const response = await axios.post(
        "https://api.malabarbank.in/api/closing-denomination",
        formData
      );
      console.log("Response:", response); // Log the response for debugging
      if (response.status === 200 || response.status === 201) {
        console.log("Closing denomination saved successfully");
        alert("Closing denomination saved successfully");
        // Add any additional logic after successful submission
        resetForm();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(
          "Closing denomination already exists for this branch on the selected date"
        );
      } else {
        console.error("Error saving closing denomination:", error);
        // Handle other errors
      }
    }
  };

  useEffect(() => {
    const netCash = calculateTotalAmount();
    const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-GB")
      : "";

    // Calculate the total amounts for each denomination
    // const total500 = denominations['500'] ? parseInt(denominations['500']) * 500 : 0;
    // const total200 = denominations['200'] ? parseInt(denominations['200']) * 200 : 0;
    // const total100 = denominations['100'] ? parseInt(denominations['100']) * 100 : 0;
    // const total50 = denominations['50'] ? parseInt(denominations['50']) * 50 : 0;
    // const total20 = denominations['20'] ? parseInt(denominations['20']) * 20 : 0;
    // const total10 = denominations['10'] ? parseInt(denominations['10']) * 10 : 0;
    const total500 = denominations["500"] ? parseInt(denominations["500"]) : 0;
    const total200 = denominations["200"] ? parseInt(denominations["200"]) : 0;
    const total100 = denominations["100"] ? parseInt(denominations["100"]) : 0;
    const total50 = denominations["50"] ? parseInt(denominations["50"]) : 0;
    const total20 = denominations["20"] ? parseInt(denominations["20"]) : 0;
    const total10 = denominations["10"] ? parseInt(denominations["10"]) : 0;

    // Update formData with the total amounts for each denomination
    setFormData((prevState) => ({
      ...prevState,
      netCash: netCash,
      closingBalance: closingBalance,
      shortage: shortage,
      excess: excess,
      date: formattedDate, // Include the selected date
      // branchCode: user.branchDetails?.branchCode,
      total500: total500,
      total200: total200,
      total100: total100,
      total50: total50,
      total20: total20,
      total10: total10,
      coinsAmount: coinsAmount, // Include coinsAmount
      stampsAmount: stampsAmount, // Include stampsAmount
    }));
  }, [
    closingBalance,
    coinsAmount,
    denominations,
    stampsAmount,
    shortage,
    excess,
    selectedDate,
    user.branchDetails?.branchCode,
  ]);

  const formatDateString = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const [totals, setTotals] = useState({
    total500: "",
    total200: "",
    total100: "",
    total50: "",
    total20: "",
    total10: "",
  });

  const [denominationData, setDenominationData] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const fetchClosingDenomination = async (date,branchCode) => {
    try {
      const branchCode = formData.branchCode
      setLoading(true); // Set loading state to true when fetching data
      const response = await axios.get(
        `https://api.malabarbank.in/api/closing-denomination?date=${date}&branchCode=${formData.branchCode}`
      );
      const data = response.data;
      console.log("Closing denomination data:", data);
  
      const denominationsData = data.closingDenomination || {};
  
      console.log("denominationsData:", denominationsData);
  
      if (!data || Object.keys(denominationsData).length === 0) {
        console.log(
          "No data found for the selected date. Resetting fields to neutral state."
        );
        // If no data is found, reset the fields to neutral state
        setDenominations({
          500: "",
          200: "",
          100: "",
          50: "",
          20: "",
          10: "",
        });
        setCoinsAmount("");
        setStampsAmount("");
      } else {
        console.log(
          "Data found for the selected date. Updating fields with fetched data."
        );
        // Update the fields with fetched data
        setDenominations({
          500: denominationsData.total500 || "",
          200: denominationsData.total200 || "",
          100: denominationsData.total100 || "",
          50: denominationsData.total50 || "",
          20: denominationsData.total20 || "",
          10: denominationsData.total10 || "",
        });
        setCoinsAmount(denominationsData.coinsAmount || "");
        setStampsAmount(denominationsData.stampsAmount || "");
      }
    } catch (error) {
      console.error("Error fetching closing denomination data:", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };
  
  useEffect(() => {
    if (selectedDate && selectedBranchCode) {
      fetchClosingDenomination(formatDateString(selectedDate), selectedBranchCode);
    }
  }, [selectedDate, selectedBranchCode]);
  
  // Ensure selectedDate and branch code changes trigger the effect
  // Ensure selectedDate is in the dependency array
  // fetchClosingDenomination(formatDateString(selectedDate));
  

  // const fetchBranchCodes = async () => {
  //   try {
  //     const response = await axios.get('https://api.malabarbank.in/api/branches');
  //     return response.data; // Assuming the response contains an array of branch codes
  //   } catch (error) {
  //     console.error('Error fetching branch codes:', error);
  //     return []; // Return an empty array if there's an error
  //   }
  // };

  // useEffect(() => {
  //   const fetchBranchCodesData = async () => {
  //     const data = await fetchBranchCodes();
  //     setBranchCodes(data);
  //   };
  //    resetForm2();
  //   fetchBranchCodesData();
  // }, []); // Empty dependency array to run the effect only once on component mount



  const handlePrint = () => {
    const elementToPrint = document.getElementById(
      "closing-denomination-content"
    );
    if (elementToPrint) {
      // Add border styling
      //   elementToPrint.style.border = '1px solid black'; // Adjust border style as needed
      //   elementToPrint.style.padding = '20px'; // Adjust padding as needed

      const originalContents = document.body.innerHTML;
      const printContents = elementToPrint.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;

      // Reset border styling after printing
      elementToPrint.style.border = "";
    } else {
      console.error("Element to print not found.");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-light ">
                    <div className="container-fluid">
                        <Link className="navbar-brand ms-5 d-flex align-items-center" to='/adminMain'>
                            <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                            <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                        </Link>
                        <div className="d-flex" style={{ width: "600px" }}>
                            <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
                            <FontAwesomeIcon
                                icon={faPowerOff}
                                onClick={handleLogout}
                                className="text-danger me-5 mt-4"
                            />
                            <div className="d-flex">
                                <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                                <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                    <li className="me-2">User</li>
                                    <li>Date</li>
                                    <li>Branch</li>
                                </ul>
                                <ul className="list-unstyled mb-1 me-5">
                                    <li className="me-2">: Admin</li>
                                    <li className="me-2">: {currentDate.toLocaleString()}</li>
                                    <li className="me-2">:<select
                                        className="form-group"
                                        id="branch_name"
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map((branch) => (
                                            <option key={branch._id} value={branch.branch_name}>
                                                {branch.branch_name}
                                            </option>
                                        ))}
                                    </select> </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <NavbarSection />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <div style={{ margin: "auto", textAlign: "center" }}>
              <h2>CLOSING DENOMINATION</h2>
              {/* <p>{user.branchDetails?.branch_name}</p> */}
            </div>
          </Col>
        </Row>
      </Container>
      <div className="border border-secondary border-5 p-5 m-3">
        <div id="closing-denomination-content">
          <Col xs={2}>
            <Form.Label>Date</Form.Label>
          </Col>
          

          <Col>
            <Form.Control
              type="date"
              style={{ width: "150px" }} // Adjust the width as needed
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Col>

          <Container>
          <Row>
            <Col>
            <Form.Group controlId="exampleForm.SelectCustom">
  <Form.Label style={{marginLeft:"-2rem"}}>Select Branch</Form.Label>
  {/* <Form.Select 
    style={{width:"9.5rem",marginLeft:"-2rem"}} 
    value={selectedBranchCode} 
    onChange={(e) => {
      const branchCode = e.target.value;
      setSelectedBranchCode(branchCode);
      resetForm2();
      // Call fetchData with the selected date and branch code
      fetchData(formatDateString(selectedDate), branchCode);
    }}
  >
    <option value="">Select Branch</option>
    {branchCodes.map(branch => (
      <option key={branch.branchCode} value={branch.branchCode}>{branch.branch_name}</option>
    ))}
  </Form.Select> */}
  <select
              className="form-select col"
              id="branch_name"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleInputChange}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branch_name}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
</Form.Group>

</Col>
            </Row>
                

            <Form>
              <Row
                className="align-items-center"
                style={{ marginLeft: "15rem" }}
              >
                <Col xs="auto">
                  <h4>Rs</h4>
                </Col>
                <Col xs="auto" style={{ marginLeft: "15rem" }}>
                  <h4>Nos</h4>
                </Col>
                <Col xs="auto" style={{ marginLeft: "8rem" }}>
                  <h4>Amount</h4>
                </Col>
              </Row>
              {Object.entries(denominations)
                .reverse()
                .map(([denomination, value]) => (
                  <Row
                    key={denomination}
                    className="align-items-center"
                    style={{ marginLeft: "15rem", marginBottom: "1rem" }}
                  >
                    <Col
                      xs={3}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {" "}
                      {/* Fixed width */}
                      <Form.Label style={{ width: "60px" }}>
                        {denomination}
                      </Form.Label>{" "}
                      {/* Fixed width */}
                      <FontAwesomeIcon
                        icon={faMultiply}
                        style={{ marginLeft: "1rem" }}
                      />
                    </Col>

                    <Col xs={3}>
                      <Form.Control
                        type="number"
                        value={value || ""}
                        placeholder="0"
                        onChange={(e) =>
                          handleDenominationChange(e, denomination)
                        }
                        style={{ width: "100%" }}
                        aria-label={`Input for ${denomination} denomination`}
                        readOnly
                      />
                    </Col>
                    <Col xs={3}>
                      <Form.Control
                        className="result-input"
                        type="number"
                        value={(value || 0) * denomination}
                        readOnly
                        style={{ width: "100%" }}
                      />
                    </Col>
                  </Row>
                ))}

              <Row
                className="align-items-center"
                style={{ marginLeft: "34.1rem", marginBottom: "1rem" }}
              >
                <Col xs="auto">
                  <Form.Label>Coins</Form.Label>
                </Col>
                <Col xs="auto">
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={
                      denominationData
                        ? denominationData.coinsAmount
                        : coinsAmount
                    }
                    onChange={handleCoinsChange}
                    readOnly
                  />
                </Col>
              </Row>
              <Row
                className="align-items-center"
                style={{ marginLeft: "33.8rem", marginBottom: "1rem" }}
              >
                <Col xs="auto">
                  <Form.Label>Stamp</Form.Label>
                </Col>
                <Col xs="auto">
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={
                      denominationData
                        ? denominationData.stampsAmount
                        : stampsAmount || ""
                    }
                    onChange={handleStampsChange}
                    readOnly
                  />
                </Col>
              </Row>
              <Row
                className="align-items-center"
                style={{ marginBottom: "1rem" }}
              >
                <Col xs="auto">
                  <Form.Label style={{ marginLeft: "25rem" }}>
                    Net Cash
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    value={
                      denominationData
                        ? denominationData.netCash
                        : calculateTotalAmount()
                    }
                    readOnly
                    style={{ width: "8rem", marginLeft: "2.9rem" }}
                  />
                </Col>
              </Row>
              <Row
                className="align-items-center"
                style={{ marginBottom: "1rem" }}
              >
                <Col xs="auto">
                  <Form.Label style={{ marginLeft: "25rem" }}>
                    Closing Balance
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    value={closingBalance !== null ? closingBalance : ""}
                    readOnly
                    style={{ width: "8rem" }}
                  />
                </Col>
              </Row>
              <Row
                className="align-items-center"
                style={{ marginBottom: "1rem" }}
              >
                <Col xs="auto">
                  <Form.Label style={{ marginLeft: "25rem", color: "red" }}>
                    Shortage
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    value={
                      denominationData ? denominationData.shortage : shortage
                    }
                    readOnly
                    style={{ width: "8rem", marginLeft: "2.9rem" }}
                  />
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto">
                  <Form.Label style={{ marginLeft: "25rem" }}>
                    Excess
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    value={denominationData ? denominationData.excess : excess}
                    readOnly
                    style={{ width: "8rem", marginLeft: "4.1rem" }}
                  />
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
         <Container>
          <Row className="justify-content-center mt-3">
            <Col className="text-center">
              {" "}
              {/* Single column for buttons */}
              {/* <Button className="me-1" onClick={handleSubmit}>
                Close Cash Today
              </Button> */}
              {/* <Button className="me-1" onClick={resetForm}>
                Clear
              </Button> */}
              {/* <Button onClick={handlePrint}>Print</Button> */}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ClosingDenominationAdmin;
