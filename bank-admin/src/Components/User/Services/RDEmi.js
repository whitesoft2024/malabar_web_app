import React, { useState, useEffect, useContext } from 'react';
import { Form, Col, Row, Container, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Nav from '../../Others/Nav';
import axios from "axios";
import { UserContext } from "../../Others/UserContext";

function RdsCollection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [query, setQuery] = useState("");
    const [rdNumbers, setRDNumbers] = useState([]);
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
        address: '',
        referenceName: '',
        addreferenceName: '',
        date: '',
        amount: '',
        newAmount: '',
        rdsBill: '',
        accountStatus: '',
        transactionId: '',
        emiAmount:'',
    });

    const handleChangeRD = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRDNumber = async (RDNumber) => {
        setSelectedPhoneNumber(RDNumber);
        fetchMemberDetails(RDNumber);
        setQuery(RDNumber);
        setRDNumbers([]);
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

    const handleAddItem = () => {
        // Extract years and months from the duration string
        const durationParts = formData.duration.split(' ');
        const years = parseInt(durationParts[0]); // Extract years
        const months = parseInt(durationParts[2]); // Extract months
        const finalAmount = parseFloat(formData.finalAmount);
        // Calculate total duration in years (including months converted to years)
        const totalDurationInYears = years + (months / 12);
    
        // Calculate interest amount
        const interestAmount = (finalAmount * (formData.interest / 100)) * totalDurationInYears;
    
        // Calculate final amount
        const emiAmount = finalAmount + interestAmount;
    
        const currentDate = new Date(); // Get the current date
        const formattedDate = currentDate.toLocaleDateString(); // Format the date as per your requirement
        console.log(typeof interestAmount);
        const itemToAdd = {
            ...formData,
            newAmount: formData.newAmount,
            currentDate: formattedDate, // Add current date to the item
            interestAmount: interestAmount, // Add interest amount to the item
            emiAmount: emiAmount // Add final amount to the item
        };
    
        delete itemToAdd._id;
        delete itemToAdd.__v;
        delete itemToAdd.amount;
        delete itemToAdd.referenceName;
    
        setItemsList([...itemsList, itemToAdd]);
        setFormData({ ...formData, emiAmount: '' });
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
            // Make a POST request to save the form data
            const response = await axios.post('https://api.malabarbank.in/auth/RDEmi', item);
            console.log('Form data saved:', response.data);

            // Extract RDNumber and amount from the item
            const { RDNumber, emiAmount } = item;
            // Convert emiAmount to string
            const emiAmountAsString = emiAmount.toString();

            // Make a PUT request to update the RD data
            const putResponse = await axios.put(`https://api.malabarbank.in/api/rdDataAdd/${RDNumber}`, { finalAmount: emiAmountAsString });
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
                RDNumber: item.RDNumber
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
            const response = await axios.get(`https://api.malabarbank.in/searchRDNumbers?query=${query}`);
            setRDNumbers(response.data);
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };

    const fetchMemberDetails = async (rdNumber) => {
        try {
            const response = await axios.get(`https://api.malabarbank.in/RDfetchMemberDetails?rdNumber=${rdNumber}`);
            const memberData = response.data;
            if (memberData) {
                setFormData({
                    ...memberData,
                    newAmount: '',
                    addreferenceName: '',
                });
            } else {
                console.log("No member details found for RDS number:", rdNumber);
            }
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    };

    useEffect(() => {
        if (query) {
            fetchPhoneNumbers();
        } else {
            setRDNumbers([]);
        }
    }, [query]);

    return (
        <div>
            <Nav />
            <h2 style={{ textAlign: "center", margin: "20px" }}>RD EMI Amount</h2>
            <Container className="d-flex justify-content-center">
                <Form>
                    <div className="Member form" >
                        <div className="card mt-0">
                            <div className=" justify-content-center">
                                <div className="">
                                    <div className="card mt-0">
                                        <div className="card-header text-light">
                                            <h4>DEPOSIT MONTHLY AMOUNT</h4>
                                        </div>
                                        <div className="card-body">

                                            <div className="row mb-3">

                                                <div className="col-2">
                                                    <label>RD Number</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Enter RDnumber"
                                                        value={query}
                                                        onChange={(e) => setQuery(e.target.value)}
                                                    />
                                                    {rdNumbers.length > 0 && (
                                                        <ul className="dropdown-menu2">
                                                            {rdNumbers
                                                                .filter((number, index, self) => self.findIndex(n => n.RDNumber === number.RDNumber) === index)
                                                                .map((number, index) => (
                                                                    <li
                                                                        key={index}
                                                                        onClick={() => handleRDNumber(number.RDNumber)}
                                                                    >
                                                                        {number.RDNumber}
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className="col-2">
                                                    <label>Last Bill Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="rdBill"
                                                        name="rdBill"
                                                        value={formData.rdBill}
                                                        onChange={handleChangeRD}
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <label  > Current Date</label>
                                                    <div className='form-control'>{currentDate.toLocaleString()}</div>
                                                </div>
                                                <div className="col-2">
                                                    <label >Reference Name</label>
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
                                                </div>
                                                <div className="col-2" style={{ marginTop: "30px" }}>
                                                    <Button className="" variant="dark" onClick={handleAddItem}>
                                                        Add
                                                    </Button>
                                                    <Button className="ml-2" variant="dark" onClick={handleRemoveLastItem}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            <center>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>SL NO</th>
                                                            <th>RD NO</th>
                                                            <th>MEMBERSHIP ID</th>
                                                            <th>NAME</th>
                                                            <th>AMOUNT </th>
                                                            <th>MONTH</th>
                                                            <th>PAY DATE</th>
                                                            <th>BILL NO</th>
                                                            <th>EMI AMOUNT</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemsList.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.date}</td>
                                                                <td>{item.customerName}</td>
                                                                <td>{item.membershipId}</td>
                                                                <td>{item.RDNumber}</td>
                                                                <td>{item.finalAmount}</td>
                                                                <td>{item.currentDate}</td>
                                                                <td>{item.rdBill}</td>
                                                                <td>{item.emiAmount}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </center>


                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </Form>
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
