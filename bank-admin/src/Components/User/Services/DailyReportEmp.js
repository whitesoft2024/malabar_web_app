import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUpload, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import logo from "../style/logo.png";
import Nav from "../Others/Nav";
import { UserContext } from "../Others/UserContext";
import moment from "moment"; // Import moment library for date manipulation

function DailyReportEmployee() {
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
  // const [creditSum, setCreditSum] = useState(0);
  // const [debitSum, setDebitSum] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to current date
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/rds?date=${selectedDate}`
        );
        console.log("API response:", response);
        console.log("rds", response.data);
        setRdsData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/fd?date=${selectedDate}`
        );
        console.log("fd", response.data);
        setFdData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/savings?date=${selectedDate}`
        );
        console.log("sav", response.data);
        setSavingsData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/expense-book/exp?date=${selectedDate}`
        );
        console.log("expense", response.data);
        setExpenseData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.malabarbank.in/api/membership?date=${selectedDate}`
        );
        console.log("Membership API Response:", response.data);
        setMembershipData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/payment-ledger/payled?date=${selectedDate}`
        );
        console.log("Payment API Response:", response.data);
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/receipt-ledger/recled?date=${selectedDate}`
        );
        console.log("Receipt API Response:", response.data);
        setReceiptData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  // Filter data based on selected date
  const formattedDate = selectedDate
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");

  const filteredRdsData = Array.isArray(rdsData)
    ? rdsData.filter((item) => {
        const branchCode = user.branchDetails?.branchCode;
        if (!branchCode) {
          // Handle the case when branchCode is not available
          console.log("No branch code available");
          return false;
        }

        const membershipIdBranchCode = item.membershipId?.substring(5, 8);

        // Extract the date from the item
        const itemDate = item.date.split(",")[0].trim();

        // Format the item date to match the selected date format
        const formattedItemDate = itemDate
          .replace(/\//g, "-") // Replaces '/' with '-'
          .split("-") // Split by '-'
          .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
          .join("/");

        // Check if the formattedDate matches any format
        const isSelectedDate = formattedItemDate === formattedDate;

        return (
          item.date && isSelectedDate && branchCode === membershipIdBranchCode
        );
      })
    : [];

    const filteredRdData = Array.isArray(rdData)
    ? rdData.filter((item) => {
      const branchCode = user.branchDetails?.branchCode;
      if (!branchCode) {
        // Handle the case when branchCode is not available
        return <div>No branch code available</div>;
      }

      const membershipIdBranchCode = item.membershipId?.substring(5, 8);

      // Extract the date from the item
      const itemDate = item.date.split(",")[0].trim();

      // Format the item date to match the selected date format
      const formattedItemDate = itemDate
        .replace(/\//g, "-") // Replaces '/' with '-'
        .split("-") // Split by '-'
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      // Check if the formattedDate matches any format
      const isSelectedDate = formattedItemDate === formattedDate;

      return (
        item.date && isSelectedDate && branchCode === membershipIdBranchCode
      );
    }) :[];

    const filteredFdData = Array.isArray(fdData)
    ? fdData.filter((item) => {
      const branchCode = user.branchDetails?.branchCode;
      if (!branchCode) {
        // Handle the case when branchCode is not available
        return <div>No branch code available</div>;
      }

      const membershipIdBranchCode = item.membershipId?.substring(5, 8);

      // Extract the date from the item
      const itemDate = item.date.split(",")[0].trim();

      // Format the item date to match the selected date format
      const formattedItemDate = itemDate
        .replace(/\//g, "-") // Replaces '/' with '-'
        .split("-") // Split by '-'
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      // Check if the formattedDate matches any format
      const isSelectedDate = formattedItemDate === formattedDate;

      return (
        item.date && isSelectedDate && branchCode === membershipIdBranchCode
      );
    })
    : [];

 const filteredSavingsData = Array.isArray(savingsData)
    ? savingsData.filter((item) => {
      const branchCode = user.branchDetails?.branchCode;
      if (!branchCode) {
        // Handle the case when branchCode is not available
        return <div>No branch code available</div>;
      }

      const membershipIdBranchCode = item.membershipId?.substring(5, 8);

      // Extract the date from the item
      const itemDate = item.date.split(",")[0].trim();

      // Format the item date to match the selected date format
      const formattedItemDate = itemDate
        .replace(/\//g, "-") // Replaces '/' with '-'
        .split("-") // Split by '-'
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      // Check if the formattedDate matches any format
      const isSelectedDate = formattedItemDate === formattedDate;

      return (
        item.date && isSelectedDate && branchCode === membershipIdBranchCode
      );
    })
    : [];

  let filteredExpenseData = [];
if (Array.isArray(expenseData)) {
  filteredExpenseData = expenseData.filter((item) => {
    const branchCode = user.branchDetails?.branchCode;
    if (!branchCode || !item.date) {
      return false; // Skip items with missing branch code or date
    }

    // Format the item date to match the selected date format
    const formattedItemDate = item.date.split(",")[0].trim().replace(/\//g, "-");

    // Check if the formattedDate matches any format
    const isSelectedDate = formattedItemDate === formattedDate;

    // Ensure branch code and date match the criteria
    return isSelectedDate && branchCode === item.branchCode;
  });
}

    console.log("expense filtered",filteredExpenseData)
  console.log("Membership Data:", membershipData.data);
  const filteredMembershipData = Array.isArray(membershipData)
    ? membershipData.filter((item) => {
      const branchCode = user.branchDetails?.branchCode;

      // Handle the case when branchCode is not available
      if (!branchCode) {
        console.warn("No branch code available for item:", item);
        return false;
      }

      // Check if item.date is defined before accessing it
      if (!item.date) {
        console.warn("No date available for item:", item);
        return false; // Skip this item if date is undefined
      }

      // Extract the date from the item
      const itemDate = item.date.split(",")[0].trim();

      // Format the item date to match the selected date format
      const formattedItemDateSlash = itemDate
        .replace(/\//g, "-") // Replace slashes with hyphens
        .split("-") // Split by hyphens
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      const formattedItemDateHyphen = itemDate
        .replace(/-/g, "/") // Replace hyphens with slashes
        .split("/") // Split by slashes
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      // Check if the formattedDate matches any format
      const isSelectedDateSlash = formattedItemDateSlash === formattedDate;
      const isSelectedDateHyphen = formattedItemDateHyphen === formattedDate;

      return (
        (isSelectedDateSlash || isSelectedDateHyphen) &&
        branchCode === item.branchCode
      );
    })
    : [];

  console.log("Filtered Membership Data:", filteredMembershipData);

  const filteredPaymentData = Array.isArray(paymentData)
  ? paymentData.filter((item) => {
      const branchCode = user.branchDetails?.branchCode;
      if (!branchCode) {
        // Handle the case when branchCode is not available
        return <div>No branch code available</div>;
      }

      // const membershipIdBranchCode = item.membershipId?.substring(5, 8);

      // Check if item.date is defined before accessing it
      if (!item.date) {
        return false; // Skip this item if date is undefined
      }

      // Extract the date from the item
      const itemDate = item.date.split(",")[0].trim();

      // Format the item date to match the selected date format
      const formattedItemDate = itemDate
        .replace(/\//g, "-") // Replaces '/' with '-'
        .split("-") // Split by '-'
        .map((part) => (part.length === 1 ? `0${part}` : part)) // Add leading zero if needed
        .join("/");

      // Check if the formattedDate matches any format
      const isSelectedDate = formattedItemDate === formattedDate;

      return isSelectedDate && branchCode === item.branchCode;
    })
    : [];

  // Calculate total debit and credit for the selected date
  // Calculate total debit and credit for the selected date
  let totalDebit = 0;
  let totalCredit = 0;

  if (openingBalanceEntered) {
    totalCredit += parseFloat(openingBalance); // Parse opening balance as a float
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

  if (filteredMembershipData) {
    filteredMembershipData.forEach((item) => {
      totalDebit += Number(item.amount || 0);
      totalCredit += Number(item.deposit || 0);
    });
  }

  if (filteredPaymentData) {
    filteredPaymentData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || 0);
    });
  }
  console.log("Total Debit:", totalDebit);
  console.log("Total Credit:", totalCredit);

  console.log("Filtered Membership Data:", filteredMembershipData);

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
              `http://localhost:2000/api/closing-balance?date=${formattedDate}`
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
          `http://localhost:2000/api/closing-balance?date=${formattedDate}`
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
    console.log("Opening balance after update:", openingBalance);
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
      await axios.post("http://localhost:2000/api/closing-balance", payload);

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
          <h2>Daily Report</h2>
          <div>{user.branchDetails?.branchCode}</div>
        </div>
        <div className="ml-4">
          <Row>
            <Col xs={2}>
              <Form>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
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
                    // onChange={handleOpeningBalanceChange}
                    // readOnly={openingBalanceEntered}
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

            {filteredRdsData &&
              filteredRdsData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>RDS</td>
                  <td>{item.rdsBill}</td>
                  <td>{item.debit}</td>
                  <td>{item.amount || item.newAmount}</td>
                  <td>{item.remarks}</td>
                </tr>
              ))}
            {filteredRdData &&
              filteredRdData.map((item, index) => (
                <tr key={index + filteredRdsData.length}>
                  <td>{index + filteredRdsData.length + 1}</td>
                  <td>{item.date}</td>
                  <td>RD</td>
                  <td>{item.rdBill}</td>
                  <td>{item.debit}</td>
                  <td>{item.amount || item.newAmount}</td>
                  <td></td>
                </tr>
              ))}
            {filteredFdData &&
              filteredFdData.map((item, index) => (
                <tr
                  key={index + filteredRdsData.length + filteredRdData.length}
                >
                  <td>
                    {index + filteredRdsData.length + filteredRdData.length + 1}
                  </td>
                  <td>{item.date}</td>
                  <td>FD</td>
                  <td>{item.fdBill}</td>
                  <td>{item.debit}</td>
                  <td>{item.amount || item.newAmount}</td>
                  <td></td>
                </tr>
              ))}
            {filteredSavingsData &&
              filteredSavingsData.map((item, index) => (
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
                  <td>{item.fdBill}</td>
                  <td>{item.amount}</td>
                  <td>{item.deposit}</td>
                  <td></td>
                </tr>
              ))}

            {filteredExpenseData &&
              filteredExpenseData.map((item, index) => (
                <tr
                  key={
                    index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length
                  }
                >
                  <td>
                    {index +
                      filteredRdsData.length +
                      filteredRdData.length +
                      filteredFdData.length +
                      filteredSavingsData.length +
                      1}
                  </td>
                  <td>{item.date ? item.date : "N/A"}</td>
                  <td>Expense:{item.description}</td>
                  <td>{item.voucherNumber}</td>
                  <td>{item.amount}</td>
                  <td>{item.deposit}</td>
                  <td></td>
                </tr>
              ))}
            {filteredMembershipData &&
              filteredMembershipData.length > 0 &&
              filteredMembershipData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>Membership</td>
                  <td>{item.membershipId}</td>
                  <td>{item.debit}</td>
                  <td>{item.deposit}</td>
                  <td></td>
                </tr>
              ))}
            {filteredPaymentData &&
              filteredPaymentData.map((item, index) => (
                <tr
                  key={
                    index +
                    filteredRdsData.length +
                    filteredRdData.length +
                    filteredFdData.length +
                    filteredSavingsData.length +
                    filteredExpenseData.length
                  }
                >
                  <td>
                    {index +
                      filteredRdsData.length +
                      filteredRdData.length +
                      filteredFdData.length +
                      filteredSavingsData.length +
                      filteredExpenseData.length +
                      1}
                  </td>
                  <td>{item.date ? item.date : "N/A"}</td>
                  <td>Payment:{item.description}</td>
                  <td>{item.voucherNumber}</td>
                  <td>{item.debit}</td>
                  <td>{item.amount}</td>
                  <td></td>
                </tr>
              ))}

            {/* {filteredMembershipData && Array.isArray(filteredMembershipData) && filteredMembershipData.map((item, index) => (
    <tr key={filteredRdsData.length +
                      filteredRdData.length +
                      filteredFdData.length +
                      filteredSavingsData.length +
                      filteredExpenseData.length +
                      1}>
      <td>{index + 1}</td>
      <td>{item.date}</td>
      <td>Membership</td>
      <td>{item.membershipId}</td>
      <td>{item.debit}</td>
      <td>{item.deposit}</td>
      <td></td>
    </tr>
  ))} */}
            {/* {filteredFdData.map((item, index) => (
              <tr key={
                index +
                filteredRdsData.length +
                filteredRdData.length +
                filteredFdData.length +
                filteredSavingsData.length +
                filteredExpenseData.length
              }>
                <td>
                {index +
                      filteredRdsData.length +
                      filteredRdData.length +
                      filteredFdData.length +
                      filteredSavingsData.length +
                      filteredExpenseData.length +
                      1}
                </td>
                <td>{item.date}</td>
                <td>FD Intrest</td>
                <td>{item.fdBill}</td>
                <td>{item.finalInterest}</td>
                <td></td>
                <td></td>
              </tr>
            ))} */}
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
                  // value={openingBalanceEntered ? closingBalance : ""}
                  // // value={closingBalance}
                  // onChange={(e) => setClosingBalance(e.target.value)}
                  // readOnly={!openingBalanceEntered}
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
export default DailyReportEmployee;
