import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../style/Rd.css";
import axios from "axios";
import Nav from "../../Others/Nav";
import { Link } from "react-router-dom";
import Select from 'react-select';
import { UserContext } from "../../Others/UserContext";
import LoanEMIHistoryModal from "./LoanEMIHistoryModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Loan = () => {


  // current Date and Time
  const [branchCode, setBranchCode] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loan, setLoan] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loanSearchTerm, setLoanSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState('');




  let formattedDate;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCloseModal = () => {
    setSelectedRow(false);
    setShowModal(false);
  };
  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);


  const [durationLabel, setDurationLabel] = useState('Duration in Month');



  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://api.malabarbank.in/api/employee');
      const data = await response.json();

      const branchCode = user?.branchDetails?.branchCode;
      if (branchCode) {

        const filteredEmployees = data.filter(employee => employee.branchCode === branchCode);
        setEmployees(filteredEmployees);
      } else {
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const [formData, setFormData] = useState({
    customerMobile: '',
    customerName: '',
    LOANtype: '',
    duration: '',
    emi: '',
    amount: '',
    loanNumber: '',
    referenceName: '',
    interestHolding: '',
    balanceDisburse: '',
    processingFee: '',
    interest: '',
    membershipId: '',
    recoveryMode: '',
    time: '',
    date: ''

  });

  //Loan number
  const [loanTypeCounts, setLoanTypeCounts] = useState({});

  // const updateLOANNumber = (branchCode) => {
  //   let LOANtype = formData.LOANtype || "LN";

  //   if (!loanTypeCounts[LOANtype]) {
  //     setLoanTypeCounts(prevCounts => ({
  //       ...prevCounts,
  //       [LOANtype]: 1,
  //     }));
  //   } else {
  //     setLoanTypeCounts(prevCounts => ({
  //       ...prevCounts,
  //       [LOANtype]: prevCounts[LOANtype] + 1,
  //     }));
  //   }

  //   const newNumber = loanTypeCounts[LOANtype] || 1;
  //   const newLoanNumber = `LN${branchCode}${newNumber.toString().padStart(5, '0')}`;
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     loanNumber: newLoanNumber,
  //   }));
  //   console.log("Updated LOANnumber:", newLoanNumber);
  // };

  const updateLOANNumber = (branchCode) => {
    let LOANtype = formData.LOANtype || "LN";

    // Check if the loan type count exists in the state
    if (!loanTypeCounts[LOANtype]) {
      // If it doesn't exist, initialize it to 1
      setLoanTypeCounts(prevCounts => ({
        ...prevCounts,
        [LOANtype]: 1,
      }));
    } else {
      // If it exists, increment it by 1
      setLoanTypeCounts(prevCounts => ({
        ...prevCounts,
        [LOANtype]: prevCounts[LOANtype] + 1,
      }));
    }

    // Generate the new loan number
    const newNumber = loanTypeCounts[LOANtype] || 1;
    const newLoanNumber = `LN${branchCode}${newNumber.toString().padStart(5, '0')}`;
    setFormData(prevFormData => ({
      ...prevFormData,
      loanNumber: newLoanNumber,
    }));
    console.log("Updated LOANnumber:", newLoanNumber);
  };


  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    console.log("branchCode", branchCode);
    if (formData.LOANtype && branchCode) {
      updateLOANNumber(branchCode);
    }
  }, [formData.LOANtype, branchCode]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedDate;

    if (name === 'date') {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      formattedDate = `${day}-${month}-${year}-${hours}:${minutes}:${seconds}`;
      console.log(formattedDate)
    } else {
      formattedDate = formData.date;
    }

    setFormData({
      ...formData,
      [name]: value,
      date: formattedDate,

    });
  };


  const [showModal, setShowModal] = useState(false);

  const handlePlusIconClick = () => {
    setShowModal(true);
  };

  // fetch by mobile

  const [query, setQuery] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');


  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    console.log("branchCode", branchCode);
    if (branchCode, query) {

      console.log("branchCodeXXX", branchCode);
      console.log("queryXXX", query);
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(`https://api.malabarbank.in/getMemberDetails?branchCode=${branchCode}&phoneNumber=${query}`);
          console.log("xxxrespo", response);
          const options = response.data.map((number) => ({
            value: number.customerMobile,
            label: number.customerMobile,
          }));
          setPhoneNumbers(options);
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchPhoneNumbers();
    } else {
      setPhoneNumbers([]);
    }
  }, [query]);



  const handlePhoneNumberSelection = (option) => {
    if (option) {
      setSelectedPhoneNumber(option);
      console.log("selected ph no:", selectedPhoneNumber);
      fetchMemberDetails(option.value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        customerMobile: option.value, // Update the phone number field
      }));
      setQuery(option.value);
      setPhoneNumbers([]);
    } else {
      setSelectedPhoneNumber(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        customerMobile: null, // Reset the phone number field
      }));
      setQuery('');
      setPhoneNumbers([]);
    }
  };



  const handleReferenceNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      referenceName: value,
    });
  };


  // fetch mobile number to find member details
  const fetchMemberDetails = async (phoneNumber) => {
    try {
      const response = await axios.get(`https://api.malabarbank.in/fetchMemberDetails?phoneNumber=${phoneNumber}`);

      const { membershipId, customerName } = response.data;

      // let lastBillNumber = localStorage.getItem('lastBillNumber') || 'LN0000000';
      // let LnBill = 'LN' + (parseInt(lastBillNumber.slice(3)) + 1).toString().padStart(7, '0');
      // localStorage.setItem('lastBillNumber', LnBill);
      let lastBillNumber = localStorage.getItem('lastBillNumber') || 'LN0000000';
      console.log("Last Bill Number:", lastBillNumber); // Debugging: Check the current value

      let currentNumber = parseInt(lastBillNumber.slice(3));
      console.log("Current Number:", currentNumber); // Debugging: Check the current number

      if (isNaN(currentNumber)) {
        // If currentNumber is NaN (e.g., 'LN0000000'), set it to 0
        currentNumber = 0;
      }

      let newNumber = currentNumber + 1;
      let LnBill = 'LN' + newNumber.toString().padStart(7, '0');
      console.log("New Bill Number:", LnBill); // Debugging: Check the new bill number

      setFormData(prevFormData => ({
        ...prevFormData,
        customerName,
        loanNumber: LnBill,
        membershipId, // Set the membership ID in the form data
      }));
      console.log("FormData", formData);

      // Now update localStorage with the new loan number
      localStorage.setItem('lastBillNumber', LnBill);
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        date: startDate.toISOString().split('T')[0], // Convert date to ISO string and extract date part
        time: time, // Directly use the time value
      };
      const response = await axios.post('https://api.malabarbank.in/api/loanform', updatedFormData);
      console.log('Loan posted successfully:', response.data);
      alert('loan form created successfully')
      setLoan(prevLoan => [...prevLoan, formData]);
      setFormData({
        customerMobile: '',
        customerName: '',
        LOANtype: '',
        duration: '',
        emi: '',
        amount: '',
        loanNumber: '',
        referenceName: '',
        interestHolding: '',
        balanceDisburse: '',
        processingFee: '',
        interest: '',
        membershipId: '',
        recoveryMode: '',
        totalLoanAmount: '',
        startDate: '',
        time: ''
      });
    } catch (error) {
      console.error('Error posting loan:', error);
    }
  };

  const [loanScheme, setLoanScheme] = useState([]);

  useEffect(() => {
    fetchLoanScheme();
    fetchLoanData();
  }, []);

  const fetchLoanScheme = async () => {
    try {
      const response = await fetch('https://api.malabarbank.in/api/loanScheme');
      const data = await response.json();
      setLoanScheme(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLoanData = async () => {
    const branchCode = user?.branchDetails?.branchCode;
    const loanNumber = loanSearchTerm; // Assuming loanSearchTerm is a state variable holding the user's search term

    try {
      const response = await axios.get(`https://api.malabarbank.in/getBranchLoanDetailsPG?branchCode=${branchCode}&loanNumber=${loanNumber}&page=${currentPage}&limit=${itemsPerPage}`);
      const { totalPages, loanData } = response.data; // Destructure the response
      setLoan(loanData); // Set the loan data
      setTotalPages(totalPages); // Set the total pages
    } catch (error) {
      console.error('Error fetching loan data:', error);
    }
  };


  useEffect(() => {
    fetchLoanData();
  }, [currentPage, itemsPerPage, loanSearchTerm]);


  const handleLoanTypeSelection = (schemeName) => {
    if (!loanScheme.length) return; // Return early if loanScheme is empty

    const selectedScheme = loanScheme.find((scheme) => scheme.schemeName === schemeName);

    if (selectedScheme) {
      setFormData({
        ...formData,
        LOANtype: selectedScheme.LOANtype,
        duration: selectedScheme.tenure,
        emi: selectedScheme.emi,
        amount: selectedScheme.requestedLoanAmount,
        interestHolding: selectedScheme.interestHolding,
        balanceDisburse: selectedScheme.balanceDisburse,
        processingFee: selectedScheme.processingFee,
        interest: selectedScheme.interestPercentage,
        recoveryMode: selectedScheme.recoveryMode,
        totalLoanAmount: parseFloat(selectedScheme.totalLoanAmount)


      });
      setDurationLabel(`Duration in ${selectedScheme.recoveryMode}`);
    } else {
      console.error(`No loan scheme found for LOANtype: ${schemeName}`);
    }
  };

  const handleReset = () => {
    setFormData({
      customerMobile: '',
      customerName: '',
      LOANtype: '',
      duration: '',
      emi: '',
      amount: '',
      loanNumber: '',
      referenceName: '',
      interestHolding: '',
      balanceDisburse: '',
      processingFee: '',
      interest: '',
      membershipId: '',
      recoveryMode: '',
      startDate: '',
      time: ''
    });
  };

  return (
    <div>
      <div className="container border rounded p-4 mt-4 mb-4">
        <Nav />
        <center>
          <h2>LOAN SANCTION</h2>
        </center>
        <div className="App">
          <div className="me-5"><input type="text" className="form-control" size="1" style={{ width: 'auto', height: '40px', width: '250px' }} placeholder="Enter Loan Number" value={loanSearchTerm} onChange={(e) => setLoanSearchTerm(e.target.value)} />
            {/*  <button className="btn btn-primary" onClick={() => fetchLoanData()}>Search</button> */}
          </div>
          {/* <div className="container"><Link to='/RDSmultiCollection'><div className="circle-button"><FontAwesomeIcon icon={faPrint} /> </div></Link></div> */}
          <div className="circle-buttons-container">
            <div className="circle-button" onClick={handlePlusIconClick} ><FontAwesomeIcon icon={faPlus} /></div>
            <div className="circle-button"><FontAwesomeIcon icon={faEdit} /></div>
            <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
          </div>
        </div>
        <center>


          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>LOAN SANCTION DATE</th>
                <th>MEMBERSHIP ID</th>
                <th>CUSTOMER NAME</th>
                <th>LOAN NUMBER</th>
                <th>REFERENCE NAME</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(loan) && loan.map((formData, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{formData.date}</td>
                  <td>{formData.membershipId}</td>
                  <td>{formData.customerName}</td>
                  <td>{formData.loanNumber}</td>
                  <td>{formData.referenceName}</td>
                  <td>{formData.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span class="me-2">Page {currentPage} of {totalPages}</span>
            <button class="btn btn-sm btn-outline-secondary ms-2" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>

            <select class="form-select me-2 ms-2 " size="1" style={{ width: 'auto', height: '36px' }} value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="50">100</option>

            </select>


          </div>

        </center>
      </div>


      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="">
            <div className="">
              <div className="Member form" >
                <div className="card mt-0">
                  <div className=" justify-content-center">
                    <div className="">
                      <div className="card mt-0">
                        <div className="card-header text-light">
                          <h4>LOAN FORM</h4>
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-6">
                                <label htmlFor="Customer Phonenumber">
                                  Customer Phone number
                                </label>
                                <div className="form-group">


                                  <Select
                                    value={selectedPhoneNumber}
                                    onChange={handlePhoneNumberSelection}
                                    onInputChange={(inputValue) => setQuery(inputValue)}
                                    options={phoneNumbers}
                                    placeholder="Enter phone number"
                                    isClearable={true}
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="accountHolderName">
                                    Account Holder Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter Account Holder Name"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="schemeType">Select Loan Scheme</label>
                                  <select
                                    className="form-control"
                                    id="LOANtype"
                                    name="LOANtype"
                                    value={formData.LOANtype}
                                    onChange={(e) => {
                                      handleChange(e);
                                      handleLoanTypeSelection(e.target.value);
                                    }}
                                    required
                                  >
                                    <option>--Select--</option>
                                    {loanScheme.map((loanscheme) => (
                                      <option key={loanscheme.schemeName} value={loanscheme.LOANtype}>
                                        {loanscheme.schemeName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="duration">
                                    {durationLabel}
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="Enter Duration in Month"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="interestHolding">Interest Holding:</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="interestHolding"
                                    name="interestHolding"
                                    value={formData.interestHolding}
                                    onChange={handleChange}
                                    placeholder=""
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="balanceDisburse">Balance Disburse:</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="balanceDisburse"
                                    name="balanceDisburse"
                                    value={formData.balanceDisburse}
                                    onChange={handleChange}
                                    placeholder=""
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="referenceName">
                                    Reference Name
                                  </label>
                                  <select
                                    className="form-control"
                                    value={formData.referenceName}
                                    name="referenceName"
                                    onChange={handleReferenceNameChange}
                                  >
                                    <option value="">Select an employee</option>
                                    {employees.map(employee => (
                                      <option key={employee.id} value={employee.employeeName}>{employee.employeeName}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="col-6">
                                <div className="form-group ">
                                  <label htmlFor="membershipId">
                                    Membership ID*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="membershipId"
                                    name="membershipId"
                                    value={formData.membershipId}
                                    onChange={handleChange}
                                    placeholder="Enter Membership ID"
                                    required
                                  />

                                  <div className="form-group mt-3">
                                    <label htmlFor="loanNumber">Loan Number</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="loanNumber"
                                      name="loanNumber"
                                      value={formData.loanNumber}
                                      onChange={handleChange}
                                      placeholder=""
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label htmlFor="amount">Amount</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="amount"
                                      name="amount"
                                      value={formData.amount}
                                      onChange={handleChange}
                                      placeholder="Enter Amount"
                                    />
                                  </div>
                                  {/* <div className="form-group">
                                    <label htmlFor="date"> Date</label>
                                    <div className="form-control">
                                      {currentDate.toLocaleString()}
                                    </div>
                                  </div> */}
                                  <div className="form-group">
                                    <label htmlFor="date"> Date</label>
                                    <br />
                                    {/* Date Picker */}
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      dateFormat="MM/dd/yyyy"
                                      className="form-control"
                                      style={{ width: '1000px' }}
                                    />

                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="date"> Time</label>

                                    {/* Time Selection */}
                                    <input
                                      type="time"
                                      className="form-control"
                                      style={{ marginTop: '10px' }}
                                      value={time}
                                      onChange={(e) => setTime(e.target.value)}
                                    /></div>
                                  <div className="form-group mt-3">
                                    <label htmlFor="interest">Interest Rates</label>
                                    <input
                                      className="form-control"
                                      id="interest"
                                      name="interest"
                                      value={formData.interest}
                                      onChange={handleChange}
                                    >
                                    </input>
                                  </div>

                                  <div className="form-group">
                                    <label htmlFor="processingFee">Processing Fee:</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="processingFee"
                                      name="processingFee"
                                      value={formData.processingFee}
                                      onChange={handleChange}
                                      placeholder=""
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label htmlFor="emi">EMI:</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="emi"
                                      name="emi"
                                      value={formData.emi}
                                      onChange={handleChange}
                                      placeholder=""
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="form-group ">
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                              <button onClick={handleReset}
                                type="reset"
                                className="btn btn-secondary m-2"
                              >
                                Reset
                              </button>

                              <Button variant="danger" onClick={handleCloseModal}>
                                Close
                              </Button>

                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>







      <LoanEMIHistoryModal


      />

    </div>
  )
}

export default Loan;
