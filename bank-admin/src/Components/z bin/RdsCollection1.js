import React, { useState, useEffect, useContext } from 'react';
import { Form, Col, Row, Container, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Nav from '../Others/Nav';
import axios from "axios";
import { UserContext } from "../Others/UserContext";

function RdsCollection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [rdSNumbers, setRDSNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [formData, setFormData] = useState({
    schemeType: '',
    accountType: '',
    membershipId: '',
    RDSNumber: '',
    customerName: '',
    customerNumber: '',
    address:'',
    referenceName: '',
    addreferenceName: '',
    date: '',
    amount: '',
    newAmount: '',
    rdsBill: '',
    accountStatus: '',
    transactionId: '',
  });

  const handleChangeRDS = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneNumberSelection = async (RDSNumber) => {
    setSelectedPhoneNumber(RDSNumber);
    fetchMemberDetails(RDSNumber);
    setQuery(RDSNumber);
    setRDSNumbers([]);
    const selectedEmployee = employees.find(employee => employee.employeeName === formData.referenceName);
    if (selectedEmployee) {
      setFormData(prevFormData => ({
        ...prevFormData,
        addreferenceName: selectedEmployee.employeeName
      }));
    }
  };

  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/employee');
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

  const handleAddItem = () => {
    const itemToAdd = { ...formData, newAmount: formData.newAmount };
    delete itemToAdd._id;
    delete itemToAdd.__v;
    delete itemToAdd.amount;
    delete itemToAdd.referenceName;
    setItemsList([...itemsList, itemToAdd]);
    setFormData({ ...formData, newAmount: '', });
  };

  const handleRemoveLastItem = () => {
    if (itemsList.length > 0) {
      const updatedItemsList = [...itemsList];
      updatedItemsList.pop();
      setItemsList(updatedItemsList);
    }
  };
     // Generate a unique FDbillnumber
     let lastBillNumber = localStorage.getItem('transactionID') || 'TRDS000000000000';
     // Increment the bill number and format it
     let RDStransactionID = 'TRDS' + (parseInt(lastBillNumber.slice(3)) + 1).toString().padStart(12, '0');
     // Save the incremented bill number back to localStorage
     localStorage.setItem('transactionID', RDStransactionID);
       // Add RDStransactionID to the item object
     item.transactionId = RDStransactionID;
     

  const submitFormData = async (item) => {
    try {
      // Make a POST request to save the form data
      const response = await axios.post('http://localhost:2000/api/rdsEmi', item);
      console.log('Form data saved:', response.data);
  
      // Extract RDSNumber and amount from the item
      const { RDSNumber, newAmount } = item; 
  
      // Make a PUT request to update the RDS data
      const putResponse = await axios.put(`http://localhost:2000/api/rdsDataAdd/${RDSNumber}`, { amount: newAmount });
      console.log('RDS data updated:', putResponse.data);
    } catch (error) {
      console.error('Error saving form data or updating RDS amount:', error);
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedItemsList = itemsList.map(item => ({
        ...item,
        RDSNumber: item.RDSNumber
      }));
  
      for (const item of updatedItemsList) {
        await submitFormData(item);
      }
  
      setItemsList([]);
      // Optionally, you can clear the addreferenceName value here
      setFormData({ ...formData, addreferenceName: '' });
      console.log('Form data saved/updated successfully');
    } catch (error) {
      console.error('Error saving/updating form data:', error);
    }
  };

  const fetchPhoneNumbers = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/rdSsearchRDSNumbers?query=${query}`);
      setRDSNumbers(response.data);
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
    }
  };

  const fetchMemberDetails = async (rdsNumber) => {
    try {
      const response = await axios.get(`http://localhost:2000/rdSfetchMemberDetails?rdsNumber=${rdsNumber}`);
      const memberData = response.data;
      if (memberData) {
        setFormData({
          ...memberData,
          newAmount: '',
          addreferenceName: '',
        });
      } else {
        console.log("No member details found for RDS number:", rdsNumber);
      }
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchPhoneNumbers();
    } else {
      setRDSNumbers([]);
    }
  }, [query]);

  return (
    <div className='container border rounded p-4 mt-4 mb-4"'>
      <Nav />
      <h2 style={{ textAlign: "center", margin: "20px" }}>RDS EMI Amount</h2>
      <Container className="d-flex justify-content-center">
        <Form>
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Form.Group controlId="input1">
                <Form.Label>RDS Number</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter phone number"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {rdSNumbers.length > 0 && (
                  <ul className="dropdown-menu2">
                    {rdSNumbers
                      .filter((number, index, self) => self.findIndex(n => n.RDSNumber === number.RDSNumber) === index) 
                      .map((number, index) => (
                        <li
                          key={index}
                          onClick={() => handlePhoneNumberSelection(number.RDSNumber)}
                        >
                          {number.RDSNumber}
                        </li>
                      ))}
                  </ul>
                )}
              </Form.Group>

            </Col>
            <Col xs={6}>
              <Form.Group controlId="input2">
                <Form.Label>Date</Form.Label>
                <div className='form-control'>{currentDate.toLocaleString()}</div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Form.Group controlId="input3">
                <Form.Label>Amount</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  id="newAmount"
                  name="newAmount"
                  value={formData.newAmount}
                  onChange={handleChangeRDS}
                  placeholder=""
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
                <td>{item.date}</td>
                <td>{item.customerName}</td>
                <td>{item.membershipId}</td>
                <td>{item.RDSNumber}</td>
                <td>{item.newAmount}</td>
                <td>{item.rdsBill}</td>
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
