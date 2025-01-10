import React, { useState, useEffect, useContext } from 'react';
import { Form, Col, Row, Container, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Nav from '../../Others/Nav';
import axios from "axios";
import { UserContext } from "../../Others/UserContext";
import moment from 'moment';
import numberToWords from 'number-to-words';

function RdsCollection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newRDSdata, setNewRDSdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemsList, setItemsList] = useState([]);
  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  //fetch employee
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const handleReferenceNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      addreferenceName: value,
    });
  };
  const loginBranchCode = user.branchDetails.branchCode;
  const loginBranchUser = user.employee.fullname;
  const loginUserTime = currentDate.toLocaleString()
  const [formData, setFormData] = useState({
    branchCode: loginBranchCode,
    branchUser: loginBranchUser,
    userTime: loginUserTime,
    schemeType: '',
    accountType: '',
    membershipId: '',
    RDSNumber: '',
    customerName: '',
    customerNumber: '',
    address: '',
    referenceName: '',
    addreferenceName: '',
    Date: '',
    depositwords: '',
    amount: '',
    newAmount: '',
    depositRdsBill: '',
    accountStatus: '',
    depositTransactionId: '',
    time: '',
    total: 0,
  });

  let billCounter = 0;
  const generateRDSTransaction = () => {
    transactionCounter++;
    const paddedCounter = String(billCounter).padStart(14, '0');
    return `ETRDS${paddedCounter}`;
  };
  let transactionCounter = 0;
  const generateRDSbill = () => {
    const branchCode = user?.branchDetails?.branchCode;
    transactionCounter++;
    const paddedCounter = String(transactionCounter).padStart(8, '0');
    return `EDRDS${branchCode}${paddedCounter}`;
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  const handleChangeRDS = (e) => {
    const { name, value } = e.target;

    // Parse the input value to an integer if it's not empty
    const parsedValue = value !== '' ? parseInt(value) : '';

    let updatedFormData = { ...formData, [name]: parsedValue };

    if (name === 'newAmount') {
      // Calculate amount in words if the parsed value is a valid number
      const amountInWords = parsedValue !== '' && !isNaN(parsedValue) ? numberToWords.toWords(parsedValue) : '';
      updatedFormData = { ...updatedFormData, depositwords: amountInWords };
    }

    const newRdsBill = generateRDSbill();
    const newRDSTransactionId = generateRDSTransaction();

    setFormData({
      ...formData,
      branchCode: loginBranchCode,
      branchUser: loginBranchUser,
      userTime: loginUserTime,
      time: getCurrentTime(),
      depositRdsBill: newRdsBill,
      depositTransactionId: newRDSTransactionId,
      [name]: value,
    });
  };
  const handleChangeDate = (event) => {
    const Date = moment(event.target.value).format('DD/MM/YYYY');
    setFormData({ ...formData, Date });
  };

  const handleAddItem = () => {
    // Existing checks for Date and Amount
    if (!formData.Date || formData.Date.trim() === '') {
      alert("Please select the Date.");
      return;
    }

    if (!formData.newAmount || formData.newAmount.trim() === '') {
      alert("Please enter the Amount.");
      return;
    }

    // Include the RDS number's ID in the itemToAdd object
    const itemToAdd = { ...formData, newAmount: formData.newAmount, User: formData.branchUser, Type: "Deposit" };
    const existingItemIndex = itemsList.findIndex(item => item.RDSNumber === formData.RDSNumber);
    if (existingItemIndex !== -1) {
      // Update the existing item
      const updatedItemsList = [...itemsList];
      updatedItemsList[existingItemIndex] = itemToAdd;
      setItemsList(updatedItemsList);
    } else {
      // Add a new item to the list
      setItemsList([...itemsList, itemToAdd]);
    }
    setFormData({ ...formData, newAmount: '' }); // Reset newAmount after adding the item
  };
  const handleRemoveLastItem = () => {
    if (itemsList.length > 0) {
      const updatedItemsList = [...itemsList];
      updatedItemsList.pop();
      setItemsList(updatedItemsList);
    }
  };



  const submitFormData = async (item) => {
    try {

      const formattedEmiData = item.EmiData.map(emi => ({
        emiNo: 0,
        _id: formData._id,
        newAmount: emi.newAmount,
        depositRdsBill: formData.depositRdsBill,
        depositTransactionId: formData.depositTransactionId,
        Type: 'Deposit',
        Date: formData.Date,
        referenceName: formData.referenceName,
        User: formData.branchUser,
        userTime: formData.userTime,
        branchCode: formData.branchCode
      }));
      console.log(formattedEmiData);
      // Make a POST request to save the form data
      const response = await axios.post(`https://api.malabarbank.in/api/rds/addEmiData`, { ...item, EmiData: formattedEmiData });
      console.log('Form data saved:', response.data);
    } catch (error) {
      console.error('Error saving form data or updating RDS amount:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const item of itemsList) {
        await submitFormData(item);
      }

      // Clear the items list and reset form data after submitting all items
      setItemsList([]);
      setFormData({ ...formData, addreferenceName: '' });
      console.log('Form data saved/updated successfully');
    } catch (error) {
      console.error('Error saving/updating form data:', error);
    }
  };
  // data fetching 

  const [searchRDS, setSearchRDS] = useState('');

  const branch = user?.branchDetails?.branchCode;
  useEffect(() => {

    fetchRDSData(currentPage, pageSize, branch, searchRDS);
  }, [currentPage, pageSize, branch, searchRDS]);


  const fetchRDSData = async (page, size, branch, searchRDS = '') => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?page=${page}&limit=${size}&branch=${branch}&searchRDS=${searchRDS}`);

      // Initialize sum
      let totalSum = 0;

      // Iterate over response data to find the sum for the specific RDS number
      response.data.data.forEach(obj => {
        if (obj.RDSNumber === searchRDS) { // Check if the RDSNumber matches the searchRDS
          let sum = parseFloat(obj.amount); // Initialize sum with amount field
          obj.EmiData.forEach(emi => {
            if (emi.newAmount) {
              sum += parseFloat(emi.newAmount);
            }
            if (emi.withdrawalAmount) {
              sum -= parseFloat(emi.withdrawalAmount);
            }
          });
          totalSum += sum; // Add sum to totalSum for the specific RDSNumber
        }
      });

      // Set the total sum into state
      setFormData(prevState => ({
        ...prevState,
        total: totalSum.toFixed(2)
      }));


      setNewRDSdata(response.data.data)
    } catch (error) {
      console.error('Error fetching memberships data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRDSNumberSelect = (value) => {
    fetchData(value);
    setFormData(prevFormData => ({
      ...prevFormData,
      RDSNumber: value,
    }));
    setSearchRDS(value);
    setShowDropdown(false);
  };

  const fetchData = (mobile) => {
    const filteredCustomers = newRDSdata.filter(
      (customer) => customer.RDSNumber === mobile
    );
    if (filteredCustomers.length > 0) {
      setFormData(filteredCustomers[0]);
      setSearchRDS(filteredCustomers[0].RDSNumber);
    } else {
      setFormData(null);
    }
  };


  const deleteRow = (index) => {
    const updatedList = [...itemsList];
    updatedList.splice(index, 1); // Remove the item at the given index
    setItemsList(updatedList);
  };

  const renderDeleteTooltip = (index) => (
    <Tooltip id={`delete-tooltip-${index}`}>Delete</Tooltip>
  );

  return (
    <div className='container border rounded p-4 mt-4 mb-4"'>
      <Nav />
      <h2 style={{ textAlign: "center", margin: "20px" }}>RDS EMI Amount</h2>
      <Container className="d-flex justify-content-center">
        <Form>
          <Row className="justify-content-md-center">
            <Col>
              <Form.Group controlId="input1">
                <Form.Label>RDS Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  style={{ width: "15rem" }}
                  value={searchRDS}
                  onChange={(e) => setSearchRDS(e.target.value)}
                  onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                />
                {showDropdown && searchRDS && (
                  <ul className="dropdown-menu2">
                    {newRDSdata
                      .filter((customer) =>
                        (customer.RDSNumber && customer.RDSNumber.toLowerCase().includes(searchRDS.toLowerCase()))
                      )
                      .map((customer, index) => (
                        <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleRDSNumberSelect(customer.RDSNumber); setShowDropdown(false); }}>
                          {customer.customerName} - {customer.RDSNumber}
                        </li>
                      ))}
                  </ul>
                )}
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="input2">
                <Form.Label>Date</Form.Label>
                <input
                  type="date"
                  className="form-control"
                  id="Date"
                  name="Date"
                  value={moment(formData.Date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                  onChange={handleChangeDate}
                  placeholder=""
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Form.Group controlId="input3">
                <Form.Label>Total</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  id="total"
                  name="total"
                  value={formData.total}
                  onChange={handleChangeRDS}
                  placeholder=""
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="input4">
                <Form.Label>Last Bill Number</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  id="rdsBill"
                  name="rdsBill"
                  value={formData.rdsBill}
                  onChange={handleChangeRDS}
                  placeholder=""
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Form.Group controlId="input3">
                <Form.Label>Amount</Form.Label>
                <input
                  type="number"
                  className="form-control"
                  id="newAmount"
                  name="newAmount"
                  value={formData.newAmount}
                  onChange={handleChangeRDS}
                  placeholder=""
                  required
                />

              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="input4">
                <Form.Label>Amount in Words</Form.Label>
                <input
                  type="number"
                  className="form-control"
                  id="newAmount"
                  name="depositwords"
                  value={formData.depositwords}
                  // onChange={handleChangeRDS}
                  placeholder=""
                  required
                />
              </Form.Group>
            </Col>
            <Row className="justify-content-md-center">
              <Col md={3}>
                <Form.Group controlId="addreferenceName">
                  <Form.Label>Reference Name</Form.Label>
                  <select
                    className="form-control"
                    value={formData.addreferenceName}
                    name="addreferenceName"
                    onChange={handleReferenceNameChange}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.employeeName}>{employee.employeeName}</option>
                    ))}
                  </select>
                </Form.Group>
              </Col>
            </Row><br />
          </Row><br />
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Button style={{ marginLeft: "5rem" }} onClick={handleAddItem}><FontAwesomeIcon icon={faPlus} /></Button>
            </Col>
            <Col xs={6}>
              <Button style={{ marginLeft: "5rem" }} onClick={handleRemoveLastItem}><FontAwesomeIcon icon={faMinus} /></Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container className="mt-4" style={{ margin: "0 auto", textAlign: "center", maxHeight: "400px", overflowY: "auto" }}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>SLNO</th>
              <th>PAY_DATE</th>
              <th>NAME</th>
              <th>MEMBERSHIP_ID</th>
              <th>RDS_NO</th>
              <th>AMOUNT</th>
              <th>BILL NO</th>
            </tr>
          </thead>
          <tbody>
            {itemsList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.Date}</td>
                <td>{item.customerName}</td>
                <td>{item.membershipId}</td>
                <td>{item.RDSNumber}</td>
                <td>{item.newAmount}</td>
                <td>{item.rdsBill}</td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderDeleteTooltip(index)}
                  >
                    <span className="delete-icon" onClick={() => deleteRow(index)}>
                      &#10006;
                    </span>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <div style={{ height: "400px" }} />

      <Container className="mt-4" style={{ textAlign: "center" }}>
        <Row className="justify-content-md-center">
          <Col>
            <Button variant="primary" onClick={handleSubmit}>Process</Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default RdsCollection;