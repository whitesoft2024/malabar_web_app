import React, { useState, useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
// import "../style/BranchTransfer.css";
import { UserContext } from '../Others/UserContext';
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import NavBar from "../Others/AdminNavbar";
import logo  from '../style/logo.png'

const ExpenseViewAdmin = () => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const { user } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    //fetch expenses made by the branch side 
    const [parsedData, setParsedData] = useState([]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/expense-book/exp');
            const data = await response.json();

            // Iterate through each object and print it
            data.data.forEach((obj, index) => {
                console.log(`Object ${index + 1}:`);
                console.log(); // Add an empty line for separation
            });

            // Set parsed data to state
            setParsedData(data.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const [rowsToShow, setRowsToShow] = useState(10); // State to track number of rows to display
    const [search, setSearch] = useState('')

    const handleDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'Full') {
            setRowsToShow(parsedData.length); // Show all rows
        } else {
            setRowsToShow(parseInt(value)); // Show selected number of rows
        }
    };


    return (
        <div>
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to="/adminMain" >
                        <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                    </Link>
                    <div className="d-flex" style={{ width: "500px" }}>
                        <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">User</li>
                                <li className="me-2">Branch</li>
                                <li className="me-2">Branch Code</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2"> : {user.employee ? user.employee.fullname : 'N/A'}</li>
                                <li className="me-2"> : {user.branchDetails ? user.branchDetails.branch_name : 'N/A'}</li>
                                <li className="me-2"> : {user.branchDetails ? user.branchDetails.branchCode : 'N/A'}</li>
                                <li className="me-2">:{currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <NavBar />
            <div className="container border rounded  mt-4">
                <div className="mt-3">
                    <center>
                        <h2>EXPENSE SHEET</h2>
                    </center>
                </div>

                <div>
                    <div className="App">
                        <div className="circle-buttons-container">
                            <div className="mr-2">
                                <label htmlFor="referenceNumber">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="branch"
                                    name="branch"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Enter Search"
                                />
                            </div>
                            <div style={{ marginRight: "600px" }}>
                                <label>RD No</label>
                                <select className="form-control " value={rowsToShow === parsedData.length ? 'Full' : rowsToShow.toString()} onChange={handleDropdownChange}>
                                    <option value="Full">Full</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
                        </div>
                    </div>

                    {/* Table list section */}
                    <center>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SL NO</th>
                                    <th>DATE</th>
                                    <th>BRANCH NAME</th>
                                    <th>CATEGORY</th>
                                    <th>AMOUNT</th>
                                    <th>DESCRIPTION</th>
                                    <th>VOUCHER NUMBER</th>
                                    <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData
                                    .filter(expense => {
                                        const branchNameMatch = expense.branchName && expense.branchName.toLowerCase().includes(search.toLowerCase());
                                        const categoryMatch = expense.category && expense.category.toLowerCase().includes(search.toLowerCase());
                                        const amountMatch = expense.amount && expense.amount.toString().toLowerCase().includes(search.toLowerCase());
                                        const voucherNumberMatch = expense.voucherNumber && expense.voucherNumber.toString().toLowerCase().includes(search.toLowerCase());
                                        const descriptionMatch = expense.description && expense.description.toLowerCase().includes(search.toLowerCase());

                                        return search.toLowerCase() === '' || branchNameMatch || categoryMatch || amountMatch || voucherNumberMatch || descriptionMatch;

                                    })
                                    .reverse()
                                    .slice(0, rowsToShow === 'Full' ? parsedData.length : parseInt(rowsToShow))
                                    .map((expense, index) => (
                                        <tr key={expense._id}>
                                            <td>{index + 1}</td>
                                            <td>{expense.date}</td>
                                            <td>{expense.branchName}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.amount}</td>
                                            <td>{expense.description}</td>
                                            <td>{expense.voucherNumber}</td>
                                            <td>{expense.remarks}</td>
                                        </tr>
                                    ))}
                                {/* .filter(rdData => {
                    const customerNameMatch = rdData.customerName.toLowerCase().includes(search.toLowerCase());
                                const membershipIdMatch = rdData.membershipId && rdData.membershipId.toString().toLowerCase().includes(search.toLowerCase());
                                const rdNumberMatch = rdData.RDNumber && rdData.RDNumber.toString().toLowerCase().includes(search.toLowerCase());
                                const referenceMobileMatch = rdData.referenceMobile && rdData.referenceMobile.toLowerCase().includes(search.toLowerCase());
                                const branchCodeMatch = rdData.branchcode && rdData.branchcode.toLowerCase().includes(search.toLowerCase());

                                return search.toLowerCase() === '' || customerNameMatch || membershipIdMatch || rdNumberMatch || referenceMobileMatch || branchCodeMatch;
                })
                                .reverse() // Reverse the order of the filtered data
                                .slice(0,  rowsToShow === 'Full' ? newRDdata.length : parseInt(rowsToShow)) // Use slice to limit the number of rows displayed
                
                .map(rdData => (
                                <tr key={rdData._id} onClick={() => handleRowClick(rdData)} className={selectedRow === rdData ? 'selected-row' : ''}>
                                    <td>{rdData.membershipId}</td>
                                    <td>{rdData.customerName}</td>
                                    <td>{rdData.membershipId}</td>
                                    <td>{rdData.customerName}</td>
                                    <td>{rdData.RDNumber}</td>
                                    <td>{rdData.referenceMobile}</td>
                                    <td>{rdData.branchcode}</td>
                                </tr>
                ))} */}
                            </tbody>
                        </Table>
                    </center>
                </div>
            </div>
        </div>
    );
};

export default ExpenseViewAdmin