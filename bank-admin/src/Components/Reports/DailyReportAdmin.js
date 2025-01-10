import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUpload, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import logo from "../style/logo.png";
import Nav from "../Others/Nav";
import { UserContext } from "../Others/UserContext";
// import moment from "moment"; // Import moment library for date manipulation

function DailyReportAdmin() {
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingBalanceEntered, setOpeningBalanceEntered] = useState(false);
  const [rdsData, setRdsData] = useState([]);
  const [rdData, setRdData] = useState([]);
  const [fdData, setFdData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [expenseData, setExpenseData] = useState({ data: [] }); // Initialize with an empty array for the data property
  const [membershipData, setMembershipData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [branches, setBranches] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(
  //   new Date().toLocaleDateString('en-GB')
  // );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [formData, setFormData] = useState({
    branch_name: '',
    branchCode: '',
  });


  useEffect(() => {
    // Fetch branches from your server
    fetch("https://api.malabarbank.in/api/branches")
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error("Error fetching branches:", error));
  }, []);
  
  const formattedDate = selectedDate
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
  console.log('date format' + new Date().toLocaleDateString('en-GB'));
  console.log('selectDate' + formattedDate);
  const { user } = useContext(UserContext);

  // RDS data fetch by Date
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setRdsData(response.data.data);
        } else {
          setRdsData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRdsData([]);
      }
    }
    fetchData();
  }, [formattedDate, user])
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/fd?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setFdData(response.data.data);
        } else {
          setFdData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFdData([]);
      }
    }
    fetchData();
  }, [formattedDate, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setFormData({
    //     ...formData,
    //     [name]: value
    // });
    if (name === "branch_name") {
      const selectedBranch = branches.find(branch => branch.branch_name === value);
      setFormData(prevData => ({
        ...prevData,
        branch_name: value,
        branchCode: selectedBranch ? selectedBranch.branchCode : ''
      }));
    } else {
      // For other inputs, update as usual
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Saving Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/savings?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setSavingsData(response.data.data);
        } else {
          setSavingsData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSavingsData([]);
      }
    }
    fetchData();
  }, [formattedDate, user])
  //Membership Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/membership?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setMembershipData(response.data.data);
        } else {
          setMembershipData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMembershipData([]);
      }
    }
    fetchData();
  }, [formattedDate, user])
  //Expense-Book Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/expense-book/Expense?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setExpenseData(response.data.data);
        } else {
          setExpenseData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setExpenseData([]);
      }
    }
    fetchData();
  }, [formattedDate, user]);
  //Receipt Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/receipt-ledger/receiptLedger?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setReceiptData(response.data.data);
        } else {
          setReceiptData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setReceiptData([]);
      }
    }
    fetchData();
  }, [formattedDate, user]);
  //Payment Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/payment-ledger/payLedger?date=${formattedDate}`);

        if (response.data && Array.isArray(response.data.data)) {
          setPaymentData(response.data.data);
        } else {
          setPaymentData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPaymentData([]);
      }
    }
    fetchData();
  }, [formattedDate, user]);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/rd?date=${selectedDate}`
        );
        setRdData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);


  // const handleDateChange = (event) => {
  //   const selectedDate = event.target.value;
  //   setSelectedDate(selectedDate);
  // };
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };


  const filteredRdsData = Array.isArray(rdsData)
    ? rdsData
    : [];
  const filteredFdData = Array.isArray(fdData)
    ? fdData
    : [];
  const filteredSavingsData = Array.isArray(savingsData)
    ? savingsData
    : [];
  const filteredMembershipData = Array.isArray(membershipData)
    ? membershipData
    : [];
  const filteredExpenseData = Array.isArray(expenseData)
    ? expenseData
    : [];
  const filteredReceiptData = Array.isArray(receiptData)
    ? receiptData
    : [];
  const filteredPaymentData = Array.isArray(paymentData)
    ? paymentData
    : [];

  const filteredRdData = Array.isArray(rdData) ? rdData.filter((item) => {
    const branchCode = user.branchDetails?.branchCode;
    if (!branchCode) {
      return <div>No branch code available</div>;
    }
    const membershipIdBranchCode = item.membershipId?.substring(5, 8);
    // Extract the date from the item
    const itemDate = item.date.split(",")[0].trim();
    const formattedItemDate = itemDate
      .replace(/\//g, "-")
      .split("-")
      .map((part) => (part.length === 1 ? `0${part}` : part))
      .join("/");

    const isSelectedDate = formattedItemDate === formattedDate;

    return (
      item.date && isSelectedDate && branchCode === membershipIdBranchCode
    );
  }) : [];

  let totalDebit = 0;
  let totalCredit = 0;

  if (openingBalanceEntered) {
    totalCredit += parseFloat(openingBalance);
  }

  if (filteredRdsData) {
    filteredRdsData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || item.newAmount || 0);
    });
  }

  if (filteredRdData) {
    filteredRdData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || item.newAmount || 0);
    });
  }

  if (filteredFdData) {
    filteredFdData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || item.newAmount || 0);
    });
  }

  if (filteredSavingsData) {
    filteredSavingsData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.deposit || 0);
    });
  }

  if (filteredExpenseData) {
    filteredExpenseData.forEach((item) => {
      totalDebit += Number(item.amount || 0);
      totalCredit += Number(item.deposit || 0);
    });
  }
  if (filteredReceiptData) {
    filteredReceiptData.forEach((item) => {
      totalDebit += Number(item.amount || 0);
      totalCredit += Number(item.deposit || 0);
    });
  }

  if (filteredMembershipData) {
    filteredMembershipData.forEach((item) => {
      totalCredit += Number(item.amount || 0);
    });
  }

  if (filteredPaymentData) {
    filteredPaymentData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || 0);
    });
  }

  const [closingBalance, setClosingBalance] = useState(null);
  useEffect(() => {
    if (openingBalanceEntered) {
      // Calculate closing balance whenever opening balance or total debit/credit changes
      const closingBalanceValue =
        parseFloat(openingBalance) + totalCredit - totalDebit - openingBalance;
      setClosingBalance(closingBalanceValue);
    }
  }, [openingBalance, openingBalanceEntered, totalCredit, totalDebit]);

  useEffect(() => {
    if (openingBalanceEntered) {
      // Calculate closing balance whenever opening balance or total debit/credit changes
      const closingBalanceValue =
        parseFloat(openingBalance) + totalCredit - totalDebit - openingBalance;
      setClosingBalance(closingBalanceValue);
    }
  }, [openingBalance, openingBalanceEntered, totalCredit, totalDebit]);
  useEffect(() => {
    const fetchClosingBalance = async () => {
      if (!selectedDate) return;

      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setDate(selectedDateObj.getDate() - 1);
      let formattedDate = "";

      // Function to format date in DD/MM/YYYY format
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Function to find the most recent date with available data
      const findMostRecentDateWithData = async (date) => {
        let mostRecentDateWithData = "";
        while (true) {
          formattedDate = formatDate(date);
          try {
            const response = await fetch(
              `https://api.malabarbank.in/api/closing-balance?date=${formattedDate}`
            );
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const selectedDateData = data.find(
              (item) =>
                item.date === formattedDate &&
                item.branchCode === user.branchDetails?.branchCode
            );
            if (selectedDateData) {
              mostRecentDateWithData = formattedDate;
              break;
            }
          } catch (error) {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          }
          date.setDate(date.getDate() - 1);
        }
        return mostRecentDateWithData;
      };

      formattedDate = await findMostRecentDateWithData(selectedDateObj);

      try {
        const response = await fetch(
          `https://api.malabarbank.in/api/closing-balance?date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched data:", data);

        const selectedDateData = data.find(
          (item) =>
            item.date === formattedDate &&
            item.branchCode === user.branchDetails?.branchCode
        );
        if (selectedDateData) {
          setOpeningBalance(selectedDateData.closingBalance);
        } else {
          console.log("No data available for the selected date.");
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        window.alert(
          "There was a problem with fetching data. Please try again later."
        );
      }
    };
    fetchClosingBalance();
  }, [selectedDate]);

  useEffect(() => {
  }, [openingBalance]);

  const handleOpeningBalanceSubmit = (event) => {
    event.preventDefault();
    setOpeningBalanceEntered(true);
  };
  //Function to handle submission of closing balance
  const handleClosingBalanceSubmit = async () => {
    try {
      // Ensure both date and closingBalance are strings
      const payload = {
        date: currentDate, // Assuming currentDate is a string in the format "YYYY-MM-DD"
        closingBalance: closingBalance.toString(), // Convert closingBalance to a string
        branchCode: user.branchDetails?.branchCode,
        totalCredit: totalCredit.toString(),
        totalDebit: totalDebit.toString(),
      };
      console.log("Sending payload:", payload);
      // Make a POST request to the API endpoint
      await axios.post("https://api.malabarbank.in/api/closing-balance", payload);
      // Optionally, you can display a success message or perform other actions
      console.log("Closing balance saved successfully");
      // Show the success alert
      alert("Closing balance saved successfully");
    } catch (error) {
      // Handle errors
      console.error("Error saving closing balance:", error);
    }
  };
  // Function to format the date to "dd/mm/yyyy" format
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Update the current date when the component mounts
  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  return (
    <div>
      <Nav />

      <div id="printable">
        <div style={{ textAlign: "center" }}>
          <div style={{ marginLeft: "25px" }}>
            <img src={logo} alt="logo" width="100px" />
          </div>
          <h2>Day Book</h2>
          {/* <div>{user.branchDetails?.branchCode}</div> */}
          <div className="form-group row" style={{ width: "20rem", margin: "auto" }}>
            <label className="label col">Branch Name</label>
            <select
              className="form-select col"
              id="branch_name"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleInputChange}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branch_name}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="ml-4">
          <Row>
            <Col xs={2}>
              <Form>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  {/* <Form.Control
                    type="date"
                    onChange={handleDateChange}
                    value={selectedDate}
                  /> */}
                  <Form.Control
                    type="date"
                    onChange={handleDateChange}
                    value={selectedDate}
                  />

                </Form.Group>
              </Form>
            </Col>
            <Col className="offset " style={{ marginRight: "12rem" }}>
              <Button className="primary" style={{ float: "right" }}>
                <FontAwesomeIcon icon={faPrint} />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <Form>
                <Form.Group controlId="openingBalance">
                  <Form.Label>Opening Balance</Form.Label>
                  <Form.Control
                    type="text"
                    value={openingBalance}
                    readOnly
                  />
                  <Button
                    variant="primary"
                    onClick={handleOpeningBalanceSubmit}
                    disabled={openingBalanceEntered}
                    style={{ marginLeft: "1rem" }}
                  >
                    {openingBalanceEntered ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faUpload} />
                    )}
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Date</th>
              <th>Particulars</th>
              <th>V.No</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td colSpan={4} style={{ textAlign: "center" }}>
                <b>Opening Balance</b>
              </td>
              <td>{openingBalanceEntered ? openingBalance : ""}</td>
              <td></td>
            </tr>
            {filteredRdsData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.date}</td>
                <td>RDS</td>
                <td>{item.RDSNumber}</td>
                <td>{item.debit}</td>
                <td>{item.amount || item.newAmount}</td>
                <td>{item.remarks}</td>
              </tr>
            ))}
            {filteredRdData.map((item, index) => (
              <tr key={index + filteredRdsData.length}>
                <td>{index + filteredRdsData.length + 1}</td>
                <td>{item.date}</td>
                <td>RD</td>
                <td>{item.RDNumber}</td>
                <td>{item.debit}</td>
                <td>{item.amount || item.newAmount}</td>
                <td></td>
              </tr>
            ))}
            {filteredFdData.map((item, index) => (
              <tr key={index + filteredRdsData.length + filteredRdData.length}>
                <td>
                  {index + filteredRdsData.length + filteredRdData.length + 1}
                </td>
                <td>{item.date}</td>
                <td>FD</td>
                <td>{item.FDNumber}</td>
                <td>{item.debit}</td>
                <td>{item.amount || item.newAmount}</td>
                <td></td>
              </tr>
            ))}
            {filteredSavingsData.map((item, index) => (
              <tr
                key={
                  index +
                  filteredRdsData.length +
                  filteredRdData.length +
                  filteredFdData.length
                }
              >
                <td>
                  {index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    1}
                </td>
                <td>{item.date}</td>
                <td>Savings</td>
                <td>{item.accountNumber}</td>
                <td>{item.debit}</td>
                <td>{item.deposit}</td>
                <td></td>
              </tr>
            ))}
            {filteredMembershipData.map((item, index) => (
              <tr
                key={
                  index +
                  filteredRdsData.length +
                  filteredRdData.length +
                  filteredFdData.length +
                  filteredSavingsData.length + 1
                }
              >
                <td>
                  {index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length + 1
                  }
                </td>
                <td>{item.date ? item.date : "N/A"}</td>
                <td>{item.description}</td>
                <td>{item.membershipId}</td>
                <td>{item.debit}</td>
                <td>{item.amount}</td>
                <td></td>
              </tr>
            ))}
            {filteredExpenseData.map((item, index) => (
              <tr
                key={
                  index +
                  filteredRdsData.length +
                  filteredRdData.length +
                  filteredFdData.length +
                  filteredSavingsData.length +
                  filteredMembershipData.length + 1
                }
              >
                <td>
                  {index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length +
                    filteredMembershipData.length + 1
                  }
                </td>
                <td>{item.date ? item.date : "N/A"}</td>
                <td>{item.description}</td>
                <td>{item.voucherNumber}</td>
                <td>{item.amount}</td>
                <td>{item.deposit}</td>
                <td></td>
              </tr>
            ))}
            {filteredReceiptData.map((item, index) => (
              <tr
                key={
                  index +
                  filteredRdsData.length +
                  filteredRdData.length +
                  filteredFdData.length +
                  filteredSavingsData.length +
                  filteredMembershipData.length +
                  filteredExpenseData.length + 1
                }
              >
                <td>
                  {index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length +
                    filteredMembershipData.length +
                    filteredExpenseData.length + 1
                  }
                </td>
                <td>{item.date ? item.date : "N/A"}</td>
                <td>{item.description}</td>
                <td>{item.voucherNumber}</td>
                <td>{item.amount}</td>
                <td>{item.deposit}</td>
                <td></td>
              </tr>
            ))}
            {filteredPaymentData.map((item, index) => (
              <tr
                key={
                  index +
                  filteredRdsData.length +
                  filteredRdData.length +
                  filteredFdData.length +
                  filteredSavingsData.length +
                  filteredMembershipData.length +
                  filteredExpenseData.length +
                  filteredReceiptData.length + 1
                }
              >
                <td>
                  {index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length +
                    filteredMembershipData.length +
                    filteredExpenseData.length +
                    filteredReceiptData.length + 1
                  }
                </td>
                <td>{item.date ? item.date : "N/A"}</td>
                <td>{item.description}</td>
                <td>{item.voucherNumber}</td>
                <td>{item.amount}</td>
                <td>{item.deposit}</td>
                <td></td>
              </tr>
            ))}

          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td style={{ textAlign: "center" }}>
                <b>Total</b>
              </td>
              <td>{totalDebit}</td>
              <td>{totalCredit}</td>
            </tr>
          </tfoot>
        </Table>
        <Form>
          <Row>
            <Col xs={2} className="offset-9">
              <Form.Group controlId="closingBalance">
                <Form.Label>Closing Balance</Form.Label>
                <Form.Control
                  type="number"
                  value={openingBalanceEntered ? closingBalance : ""}
                  readOnly
                />
                <p>Current Date: {currentDate}</p>
                <Button onClick={handleClosingBalanceSubmit}>Submit</Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
export default DailyReportAdmin;
