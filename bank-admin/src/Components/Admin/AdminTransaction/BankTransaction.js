import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Table, Button, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faPlus } from "@fortawesome/free-solid-svg-icons";
// import "../style/BranchTransfer.css";
import axios from "axios";
import { UserContext } from '../../Others/UserContext';
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import NavBar from "../adminOthers/AdminNavbar";

function BankTransaction() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const { user } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const loginBranchUser = user.employee ? user.employee.fullname : 'N/A';

    const [transactionData, setTransactionData] = useState({
        branchUser: loginBranchUser,
        amount: '',
        description: '',
        transactionType: '',
        credit: '',
        debit: '',
        date: '',
        remarks: '',
        openingBalance: '',
        closingBalance: ''
    });

    const handleChangeTransaction = (e) => {
        const { name, value } = e.target;
        const safeValue = value === null || value === undefined ? "" : value;

        // Format the current date to DD/MM/YYYY format
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        const formattedTime = `${(currentDate.getHours() % 12).toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;

        setTransactionData(prevState => ({
            ...prevState,
            [name]: safeValue,
            date: `${formattedDate}, ${formattedTime}`
        }));
    };


    const [showTransaction, setShowTransaction] = useState(false);

    const transactionTypeCategory = [
        { value: "Credit", label: "Credit" },
        { value: "Debit", label: "Debit" },
    ];


    const handlePlusIcon = () => {
        setShowTransaction(true);
    };

    const handleCloseModal = () => {
        setShowTransaction(false);
    };


    // Move the logic that depends on 'user' inside a useEffect hook
    useEffect(() => {
        // Set fromBranch to user's branch name or 'N/A' if not available
        const loginBranchUser = user.employee ? user.employee.fullname : 'N/A';

        setTransactionData(prevState => ({
            ...prevState,
            branchUser: loginBranchUser,
        }));
    }, [user]);

    const handleReset = () => {
        setTransactionData({
            branchUser: loginBranchUser,
            amount: '',
            description: '',
            transactionType: '',
            credit: '',
            debit: '',
            date: '',
            remarks: ''
        });
    };

    //fetch transactions made by admin side 
    const [parsedData, setParsedData] = useState([]);

    const [openingBalanceInput, setOpeningBalanceInput] = useState('');
    const [openingBalanceSet, setOpeningBalanceSet] = useState(false);

    // Check and set openingBalance on component mount
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-GB'); // Get today's date in DD/MM/YYYY format
        const storedDate = localStorage.getItem('openingBalanceDate');
        if (storedDate === today) {
            setOpeningBalanceInput(localStorage.getItem('openingBalance'));
            setOpeningBalanceSet(true); // Set to true if opening balance is already set for today
        }
    }, []);

    const handleOpeningBalanceChange = (e) => {
        setOpeningBalanceInput(e.target.value);
    };

    // Adjusted handleSetOpeningBalance function to ensure openingBalanceSet remains true
    const handleSetOpeningBalance = () => {
        if (!isNaN(openingBalanceInput) && openingBalanceInput !== '') {
            const today = new Date().toLocaleDateString('en-GB'); // Get today's date in DD/MM/YYYY format
            localStorage.setItem('openingBalance', openingBalanceInput);
            localStorage.setItem('openingBalanceDate', today); // Store the current date
            setTransactionData(prevState => ({
                ...prevState,
                openingBalance: openingBalanceInput
            }));
            setOpeningBalanceSet(true); // Ensure this remains true
        } else {
            alert('Please enter a valid number for opening balance.');
        }
    };

    // Clear openingBalance when the day changes
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-GB'); // Get today's date in DD/MM/YYYY format
        const storedDate = localStorage.getItem('openingBalanceDate');
        if (storedDate !== today) {
            // The day has changed, reset the opening balance
            localStorage.removeItem('openingBalance');
            localStorage.removeItem('openingBalanceDate');
            setOpeningBalanceSet(false);
            setOpeningBalanceInput(''); // Optionally, clear the input field
        }
    }, []); // This effect runs once on component mount

    // When setting the initial state of closingBalance, ensure it's a number
    const [closingBalance, setClosingBalance] = useState(() => {
        const storedClosingBalance = localStorage.getItem('closingBalance');
        // Convert storedClosingBalance to a number if it's not already
        return storedClosingBalance ? parseFloat(storedClosingBalance) : 0;
    });

    useEffect(() => {
        const calculateClosingBalance = () => {
            // Ensure credit and debit are treated as numbers
            const totalCredit = parsedData.reduce((acc, transaction) => acc + (parseFloat(transaction.credit) || 0), 0);
            const totalDebit = parsedData.reduce((acc, transaction) => acc + (parseFloat(transaction.debit) || 0), 0);

            // Calculate the closing balance
            const closingBalance = totalCredit - totalDebit;

            // Update the state with the calculated closing balance
            setClosingBalance(closingBalance);
        };

        // Only calculate if parsedData is not empty
        if (parsedData.length > 0) {
            calculateClosingBalance();
        }
    }, [parsedData]);

    // Update localStorage when closingBalance changes
    useEffect(() => {
        localStorage.setItem('closingBalance', closingBalance);
    }, [closingBalance]);

    //post the transactions to database
    const handleTransactionSubmit = async (e) => {
        e.preventDefault();

        // Validate form data here
        try {
            // Prepare the transactionData object
            const transactionDataToSubmit = {
                ...transactionData,
                // Set credit or debit based on the transactionType
                credit: transactionData.transactionType === "Credit" ? transactionData.amount : 0,
                debit: transactionData.transactionType === "Debit" ? transactionData.amount : 0,
                closingBalance: closingBalance.toFixed(2),
                openingBalance: openingBalanceInput // Include openingBalance in the submission
            };
            // Submit the form data to the database
            const response = await axios.post('https://api.malabarbank.in/api/bank-transaction/banktra', transactionDataToSubmit);
            // Handle successful response
            console.log(response.data);
            alert(response.data.message);
            // Optionally, close the modal and reset form state
            handleCloseModal();
            handleReset();
            setTransactionData({
                branchUser: loginBranchUser,
                amount: '',
                description: '',
                transactionType: '',
                credit: '',
                debit: '',
                date: '',
                remarks: '',
                openingBalance: openingBalanceSet ? '' : openingBalanceInput,
                closingBalance: ''
            });
            fetchTransactions();
            setOpeningBalanceSet(true);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/bank-transaction/banktra');
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
        fetchTransactions();
    }, []);

    const [rowsToShow, setRowsToShow] = useState(10); // State to track number of rows to display
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const [pageInput, setPageInput] = useState('')
    const [filteredData, setFilteredData] = useState('')
    const [search, setSearch] = useState('')

    const handleDropdownChange = (event) => {
        const value = parseInt(event.target.value);
        setRowsToShow(value);
        setCurrentPage(1); // Reset current page when changing number of rows
    };
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ensure currentPage doesn't go below 1
    };

    const totalPages = () => {
        const totalRows = search === '' ? parsedData.length : filteredData.length;
        return Math.ceil(totalRows / rowsToShow);
    };

    const handlePageInputChange = (event) => {
        const value = event.target.value;
        setPageInput(value); // Store the input value in a separate state
        // Check if the input value is a valid number and within the range of total pages
        if (!isNaN(value) && value >= 1 && value <= totalPages()) {
            setCurrentPage(parseInt(value)); // Update the currentPage state only if the input value is valid
        }
    };

    const getSLNo = (index) => {
        return (currentPage - 1) * rowsToShow + index + 1;
    }

    return (
        <div>
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to="/main" >
                        <img src="http://139.84.130.134:81/IMAGES/logo.png" alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">MALABAR BANK</strong>
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
                                <li className="me-2">: {currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <NavBar />
            <div className="container border rounded p-4 mt-4">
                <div className="mt-3">
                    <center>
                        <h2>BANK TRANSACTION</h2>
                    </center>
                </div>

                <div>
                    <div className="App">
                        <div className="circle-buttons-container">
                            <div className="mr-2">
                                <label htmlFor="openingBalance"><strong>Opening Balance :</strong></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="openingBalance"
                                    name="openingBalance"
                                    value={openingBalanceInput}
                                    onChange={handleOpeningBalanceChange}
                                    placeholder="Enter Opening Balance"
                                    readOnly={openingBalanceSet} // Controlled by openingBalanceSet
                                />
                                {!openingBalanceSet && (
                                    <button type="button" className="btn btn-primary mt-2" onClick={handleSetOpeningBalance}>
                                        Set Opening Balance
                                    </button>
                                )}

                            </div>
                            <div className="mr-2">
                                <label htmlFor="">Search :</label>
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
                                <label>Page :</label>
                                <select className="form-control " value={rowsToShow.toString()} onChange={handleDropdownChange}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <div className="circle-button" onClick={handlePlusIcon}><FontAwesomeIcon icon={faPlus} /></div>
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
                                    {/* <th>AMOUNT</th> */}
                                    <th>DESCRIPTION</th>
                                    <th>CREDIT</th>
                                    <th>DEBIT</th>
                                    <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData
                                    .filter(transaction => {
                                        // const amountMatch = transaction.amount && transaction.amount.toString().toLowerCase().includes(search.toLowerCase());
                                        const descriptionMatch = transaction.description && transaction.description.toLowerCase().includes(search.toLowerCase());
                                        const creditMatch = transaction.credit && transaction.credit.toString().toLowerCase().includes(search.toLowerCase());
                                        const debitMatch = transaction.debit && transaction.debit.toString().toLowerCase().includes(search.toLowerCase());
                                        const dateMatch = transaction.date && transaction.date.toLowerCase().includes(search.toLowerCase());
                                        return search.toLowerCase() === '' || creditMatch || debitMatch || descriptionMatch || dateMatch;
                                    })
                                    .reverse()
                                    .slice((currentPage - 1) * rowsToShow, currentPage * rowsToShow)
                                    .map((transaction, index) => (
                                        <tr key={transaction._id}>
                                            <td>{getSLNo(index)}</td>
                                            <td>{transaction.date}</td>
                                            {/* <td>{transaction.amount}</td> */}
                                            <td>{transaction.description}</td>
                                            <td>{transaction.credit}</td>
                                            <td>{transaction.debit}</td>
                                            <td>{transaction.remarks}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        <div className="circle-buttons-container">
                            <div className="">
                                <label htmlFor="closingBalance"><strong>Closing Balance :</strong></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="closingBalance"
                                    name="closingBalance"
                                    value={(closingBalance || 0).toFixed(2)}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Button onClick={prevPage} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <span>
                                <b>Go to:</b>
                                <input type="number" value={pageInput} onChange={handlePageInputChange} style={{ width: "4rem", textAlign: "center" }} ></input>
                                <b>Page:</b> {currentPage} of {totalPages()}
                            </span>
                            <Button
                                onClick={nextPage}
                                disabled={
                                    currentPage * rowsToShow >= parsedData.length ||
                                    currentPage * Math.min(rowsToShow, 50) >= parsedData.length
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </center>
                </div>
            </div>

            {/* New request modal section */}
            <Modal show={showTransaction} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "1800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>ADD NEW BANK TRANSACTION</h4>
                            </div>
                            <div className="card-body ">
                                <form onSubmit={handleTransactionSubmit} className=" mt-3">
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="amount">Amount :</label>
                                            <input type="number" className="form-control" id="amount" name="amount" value={transactionData.amount || ""} onChange={handleChangeTransaction} placeholder="" required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="transactionType">Credit / Debit :</label>
                                            <select type="text" className="form-control" id="transactionType" name="transactionType" value={transactionData.transactionType || ""} onChange={handleChangeTransaction} required>
                                                <option value="">...Select...</option>
                                                {transactionTypeCategory.map((transactionType) => (
                                                    <option key={transactionType.value} value={transactionType.value}>
                                                        {transactionType.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="description">Description :</label>
                                            <textarea type="text" className="form-control" id="description" name="description" value={transactionData.description || ""} onChange={handleChangeTransaction} placeholder="" required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="date">Date :</label>
                                            <div className="form-control">
                                                {currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {(currentDate.getHours() % 12).toString().padStart(2, '0')}:{currentDate.getMinutes().toString().padStart(2, '0')}:{currentDate.getSeconds().toString().padStart(2, '0')} {currentDate.getHours() >= 12 ? 'PM' : 'AM'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="remarks">Remarks :</label>
                                            <textarea type="text" className="form-control" id="remarks" name="remarks" value={transactionData.remarks || ""} onChange={handleChangeTransaction} required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor=""></label>
                                        </div>
                                    </div>
                                    <center>
                                        <div className="form-group mt-5 ">
                                            <button type="button" className="btn" onClick={handleReset}>
                                                Reset
                                            </button>
                                            <button type="submit" className="btn btn-primary ms-2">
                                                Submit
                                            </button>
                                            <Button variant="danger" className="btn btn-secondary ms-2" onClick={handleCloseModal}>
                                                Close
                                            </Button>
                                        </div>
                                    </center>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default BankTransaction