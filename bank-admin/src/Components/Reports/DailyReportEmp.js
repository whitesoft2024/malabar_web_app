import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUpload, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import logo from "../style/logo.png";
import Nav from "../Others/Nav";
import { UserContext } from "../Others/UserContext";
// import moment from "moment"; // Import moment library for date manipulation

function DailyReportEmployee() {
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingBalanceEntered, setOpeningBalanceEntered] = useState(false);
  const [rdsData, setRdsData] = useState([]);
  const [rdEMI, setRdEMI] = useState([]);
  const [fdData, setFdData] = useState([]);
  const [gdcsData, setGdcsData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [expenseData, setExpenseData] = useState({ data: [] }); // Initialize with an empty array for the data property
  const [membershipData, setMembershipData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [currentOpeningBalance, setCurrentOpeningBalance] = useState(openingBalance);
  const [inputValue, setInputValue] = useState(openingBalance);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const formattedDate = selectedDate
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
  console.log('date format' + new Date().toLocaleDateString('en-GB'));
  console.log('selectDate' + formattedDate);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (inputValue !== openingBalance) {
      setCurrentOpeningBalance(inputValue);
    }
  }, [inputValue]);

  // RDS data fetch by Date
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?date=${formattedDate}&branch=${branchCode}`);

        if (response.data && Array.isArray(response.data.data)) {
          setRdsData(response.data.data);
          console.log('rdsData' + rdsData);
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

  //FDS 
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/fd?date=${formattedDate}&branch=${branchCode}`);

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

  // Saving Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/savings?date=${formattedDate}&branchCode=${branchCode}`);

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
        const response = await axios.get(`https://api.malabarbank.in/api/membership?date=${formattedDate}&branchCode=${branchCode}`);

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
        const response = await axios.get(`https://api.malabarbank.in/api/expense-book/Expense?date=${formattedDate}&branchCode=${branchCode}`);

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
        const response = await axios.get(`https://api.malabarbank.in/api/receipt-ledger/receiptLedger?date=${formattedDate}&branchCode=${branchCode}`);

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

  //Gdcs
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(
          `https://api.malabarbank.in/api/Gdcs/fetchMember?date=${formattedDate}&branchCode=${branchCode}`
        );
        setGdcsData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);
  //Loan 
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(
          `https://api.malabarbank.in/getLoanData?date=${formattedDate}&branchCode=${branchCode}`
        );
        setLoanData(response.data.data);
        console.log('loan' + loanData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);
  //Payment Data
  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(`https://api.malabarbank.in/api/payment-ledger/payLedger?date=${formattedDate}&branchCode=${branchCode}`);

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

  //RD

  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const response = await axios.get(
          `https://api.malabarbank.in/api/getRDemi?date=${formattedDate}&branchCode=${branchCode}`
        );
        setRdEMI(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [formattedDate, user]);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const filteredRdsData = Array.isArray(rdsData)
    ? rdsData
    : [];
  const filteredRdData = Array.isArray(rdEMI)
    ? rdEMI
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
  const filteredGdcsData = Array.isArray(gdcsData)
    ? gdcsData
    : [];
  const filteredLoanData = Array.isArray(loanData)
    ? loanData
    : [];

  let totalDebit = 0;
  let totalCredit = 0;

  if (openingBalanceEntered) {
    totalCredit += parseFloat(openingBalance) || parseFloat(currentOpeningBalance);
  }

  if (filteredRdsData) {
    filteredRdsData.forEach((item) => {
      let debit = 0;
      let credit = 0;

      // Check if the item's newDate matches formattedDate
      if (item.newDate === formattedDate) {
        debit = Number(item.debit || 0);
        credit = Number(item.amount || item.newAmount || 0);

        totalDebit += debit;
        totalCredit += credit;
      }

      // Check if any of the EmiData's Date matches formattedDate
      if (item.EmiData && Array.isArray(item.EmiData)) {
        item.EmiData.forEach((emiItem) => {
          if (emiItem.Date === formattedDate) {
            debit = Number(emiItem.withdrawalAmount || 0);
            credit = Number(emiItem.newAmount || 0);

            totalDebit += debit;
            totalCredit += credit;
          }
        });
      }
    });
  }
  if (filteredLoanData) {
    filteredLoanData.forEach((item) => {
      let credit = 0;

      if (item.date === formattedDate) {
        credit = Number(item.totalLoanAmount);

        totalCredit += credit;
      }

      if (item.loanEMI && Array.isArray(item.loanEMI)) {
        item.loanEMI.forEach((emiItem) => {
          if (emiItem.date === formattedDate) {
            credit = Number(emiItem.currentEmiBalance);

            totalCredit += credit;
          }
        });
      }
    });
  }
  if (filteredSavingsData) {
    filteredSavingsData.forEach((item) => {
      let debit = 0;
      let credit = 0;

      // Check if the item's newDate matches formattedDate
      if (item.date === formattedDate) {
        debit = Number(item.debit || 0);
        credit = Number(item.amount || item.newAmount || 0);

        totalDebit += debit;
        totalCredit += credit;
      }

      // Check if any of the transferData's Date matches formattedDate
      if (item.transferData && Array.isArray(item.transferData)) {
        item.transferData.forEach((transferItem) => {
          let transferDebit = 0;
          let transferCredit = 0;

          if (transferItem.Date === formattedDate) {
            transferDebit = Number(transferItem.withdrawalAmount || 0);
            transferCredit = Number(transferItem.newAmount || transferItem.amount || 0);

            totalDebit += transferDebit;
            totalCredit += transferCredit;
          }
        });
      }
    });
  }
  if (filteredGdcsData) {
    filteredGdcsData.forEach((item) => {
      // Calculate debit from members
      const filteredGdcsMembers = item.members ? item.members.filter(member => member.date === formattedDate) : [];
      filteredGdcsMembers.forEach(member => {
        totalCredit += Number(member.amount || 0);
      });

      // Calculate credit from EMIs
      const filteredGdcsEmis = item.members ? item.members.flatMap(member =>
        member.monthlyEmi ? member.monthlyEmi.filter(emi => emi.date === formattedDate) : []
      ) : [];
      filteredGdcsEmis.forEach(emi => {
        totalCredit += Number(emi.emiAmount || 0);
      });
    });
  }
  if (filteredRdData) {
    filteredRdData.forEach((item) => {
      let debit = 0;
      let credit = 0;

      // Check if the item's newDate matches formattedDate
      if (item.date === formattedDate) {
        debit = Number(item.debit || 0);
        credit = Number(item.Amount || item.newAmount || 0);

        totalDebit += debit;
        totalCredit += credit;
      }

      // Check if any of the EmiData's Date matches formattedDate
      if (item.emi && Array.isArray(item.emi)) {
        item.emi.forEach((emiItem) => {
          if (emiItem.date === formattedDate) {
            debit = Number(emiItem.withdrawalAmount || 0);
            credit = Number(emiItem.amount || 0);

            totalDebit += debit;
            totalCredit += credit;
          }
        });
      }
    });
  }
  if (filteredFdData) {
    filteredFdData.forEach((item) => {
      totalDebit += Number(item.debit || 0);
      totalCredit += Number(item.amount || item.newAmount || 0);
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

  let combinedOpeningBalance = '';
  useEffect(() => {
    if (openingBalanceEntered) {
      const combinedOpeningBalance = currentOpeningBalance || openingBalance;
      const closingBalanceValue = parseFloat(combinedOpeningBalance) + totalCredit - totalDebit - parseFloat(combinedOpeningBalance);

      setClosingBalance(closingBalanceValue);
    }
  }, [openingBalance, openingBalanceEntered, totalCredit, totalDebit, combinedOpeningBalance]);

  useEffect(() => {
    async function fetchData() {
      try {
        const branchCode = user.branchDetails?.branchCode;
        const dates = [];
        let currentDate = new Date(selectedDate);
        for (let i = 0; i < 5; i++) {
          currentDate.setDate(currentDate.getDate() - 1);
          dates.push(formatDate(currentDate));
        }

        for (const date of dates) {
          const response = await axios.get(`https://api.malabarbank.in/api/closinBalance?date=${date}&branchCode=${branchCode}`);

          if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            const closingBalance = response.data.data[0].closingBalance;
            setOpeningBalance(closingBalance);
            setOpeningBalanceEntered(true);
            break; // Stop the loop once a valid closing balance is found
          } else {
            console.error("Invalid response data:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [selectedDate, user]); // Depend on `selectedDate` and `user` to trigger this effect

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
  console.log('rd Data: ' + JSON.stringify(filteredRdData, null, 2));

  return (
    <div>
      <Nav />

      <div id="printable">
        <div style={{ textAlign: "center" }}>
          <div style={{ marginLeft: "25px" }}>
            <img src={logo} alt="logo" width="100px" />
          </div>
          <h2>Day Book </h2>
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
                  {openingBalance ? (
                    <Form.Control
                      type="number"
                      value={openingBalance}
                      readOnly
                    />
                  ) : (
                    <Form.Control
                      type="number"
                      // value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      value={openingBalanceEntered ? currentOpeningBalance : inputValue}
                      readOnly={openingBalanceEntered}
                    />
                  )}

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
              <th>Reference No</th>
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
            {filteredRdsData.map((item, index) => {
              const filteredItemEmiData = item.EmiData ? item.EmiData.filter(emiItem => emiItem.Date === formattedDate) : [];
              return (
                <React.Fragment key={index}>
                  {item.newDate === formattedDate && (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.newDate || item.date}</td>
                      <td>RDS/{item.RDSNumber}/{item.customerName}</td>
                      <td>{item.rdsBill}</td>
                      <td>{item.debit}</td>
                      <td>{item.amount || item.newAmount}</td>
                      <td>{item.remarks}</td>
                    </tr>
                  )}
                  {filteredItemEmiData.map((emiItem, emiIndex) => (
                    <tr key={`emi_${index}_${emiIndex}`}>
                      <td></td>
                      <td>{emiItem.Date}</td>
                      <td>RDS EMI/{item.RDSNumber}/{item.customerName}</td>
                      <td>{emiItem.withdrawRdsBill || emiItem.depositRdsBill}</td>
                      <td>{emiItem.withdrawalAmount}</td>
                      <td>{emiItem.newAmount}</td>
                      <td>{emiItem.remarks}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
            {filteredRdData.map((item, index) => {
              // Assuming formattedDate is defined and holds the date string you want to match against
              const filteredRDEmiData = item.emi ? item.emi.filter(emiItem => emiItem.date === formattedDate) : [];
              return (
                <React.Fragment key={index}>
                  {filteredRDEmiData.map((emiItem, emiIndex) => (
                    <tr key={`emi_${index}_${emiIndex}`}>
                      {/* Adjusted empty cell */}
                      <td></td>
                      <td>{emiItem.date}</td>
                      <td>RD EMI/{item.RDNumber}/{item.customerName}</td>
                      <td>{item.rdBill}</td>
                      {/* Assuming withdrawalAmount and remarks are properties of emiItem */}
                      <td>{emiItem.withdrawalAmount}</td>
                      <td>{emiItem.amount}</td>
                      <td>{emiItem.remarks}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}

            {filteredFdData.map((item, index) => (
              <tr key={index + filteredRdsData.length + filteredRdData.length}>
                <td>
                  {index + filteredRdsData.length + filteredRdData.length + 1}
                </td>
                <td>{item.newDate}</td>
                <td>FD</td>
                <td>{item.FDNumber}</td>
                <td>{item.debit}</td>
                <td>{item.amount || item.newAmount}</td>
                <td></td>
              </tr>
            ))}
            {filteredSavingsData.map((item, index) => {
              const filteredItemEmiData = item.transferData ? item.transferData.filter(transferItem => transferItem.Date === formattedDate) : [];
              return (
                <React.Fragment key={index}>
                  {item.date === formattedDate && (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.newDate || item.date}</td>
                      <td>Savings/{item.accountNumber}/{item.customerName}</td>
                      <td>{item.savingsBill}</td>
                      <td>{item.debit}</td>
                      <td>{item.amount || item.debit}</td>
                      <td>{item.remarks}</td>
                    </tr>
                  )}
                  {filteredItemEmiData.map((emiItem, emiIndex) => (
                    <tr key={`emi_${index}_${emiIndex}`}>
                      <td></td>
                      <td>{emiItem.Date}</td>
                      <td>Savings Transaction/{item.accountNumber}/{item.customerName}</td>
                      <td>{emiItem.withdrawSavingsBill || emiItem.depositSavingsBill}</td>
                      <td>{emiItem.withdrawalAmount}</td>
                      <td>{emiItem.newAmount}</td>
                      <td>{emiItem.remarks}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
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
                <td>Membership/{item.membershipId}/{item.customerName}</td>
                <td></td>
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
            {filteredGdcsData.map((item, index) => {
              const filteredGdcsMembers = item.members ? item.members.filter(member => member.date === formattedDate) : [];

              const filteredGdcsEmis = item.members ? item.members.flatMap(member =>
                member.monthlyEmi ? member.monthlyEmi.filter(emi => emi.date === formattedDate).map(emi => ({ ...emi, GDCSNumber: member.GDCSNumber, customerName: member.customerName })) : []
              ) : [];
              return (
                <React.Fragment key={index}>
                  {filteredGdcsMembers.map((member, memberIndex) => (
                    <React.Fragment key={`member_${index}_${memberIndex}`}>
                      <tr
                        key={
                          index +
                          filteredRdsData.length +
                          filteredRdData.length +
                          filteredFdData.length +
                          filteredSavingsData.length +
                          filteredMembershipData.length +
                          filteredExpenseData.length +
                          filteredReceiptData.length +
                          filteredPaymentData + 1
                        }
                      >
                        {index +
                          filteredRdsData.length +
                          filteredRdData.length +
                          filteredFdData.length +
                          filteredSavingsData.length +
                          filteredMembershipData.length +
                          filteredExpenseData.length +
                          filteredReceiptData.length +
                          filteredPaymentData + 1
                        }
                        <td>{member.date}</td>
                        <td>GDCS/{member.GDCSNumber}/{member.customerName}</td>
                        <td>{member.billNumber}</td>
                        <td>{member.cash}</td>
                        <td>{member.amount}</td>
                        <td>{member.accountNumber}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                  {filteredGdcsEmis.map((emi, emiIndex) => (
                    <tr key={`emi_${index}_${emiIndex}`}>
                      <td>{emiIndex}</td>
                      <td>{emi.date}</td>
                      <td>GDCS EMI/{emi.GDCSNumber}/{emi.customerName}</td>
                      <td>{emi.referenceName}</td>
                      <td>{emi.amount}</td>
                      <td>{emi.emiAmount}</td>
                      <td>{emi.transactionId}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
            {filteredLoanData.map((item, index) => {
              const filteredloanEmiData = item.loanEMI ? item.loanEMI.filter(emiItem => emiItem.date === formattedDate) : [];
              return (
                <React.Fragment key={index}>
                  {item.date === formattedDate && (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.date}</td>
                      <td>Loan/{item.loanNumber}/{item.customerName}</td>
                      <td>{item.loanBill}</td>
                      <td>{item.debit}</td>
                      <td>{item.totalLoanAmount}</td>
                      <td>{item.remarks}</td>
                    </tr>
                  )}
                  {filteredloanEmiData.map((emiItem, emiIndex) => (
                    <tr key={`emi_${index}_${emiIndex}`}>
                      <td></td>
                      <td>{emiItem.date}</td>
                      <td>Loan EMI/{item.loanNumber}/{item.customerName}</td>
                      <td>{emiItem.withdrawRdsBill || emiItem.depositRdsBill}</td>
                      <td>{emiItem.withdrawalAmount}</td>
                      <td>{emiItem.currentEmiBalance}</td>
                      <td>{emiItem.remarks}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
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
                  value={openingBalanceEntered ? closingBalance : ''}
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