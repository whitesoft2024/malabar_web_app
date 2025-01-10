import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Popover, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faList, faMoneyBillTransfer, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
// import "../style/BranchTransfer.css";
import axios from "axios";
import { UserContext } from '../Others/UserContext';
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import NavBar from "./adminOthers/AdminNavbar";


function BranchFundRequests() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const { user } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const [selectedOption, setSelectedOption] = useState("send");

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const loginBranch = user.branchDetails ? user.branchDetails.branch_name : 'N/A';

    const [requestData, setRequestData] = useState({
        fromBranch: loginBranch,
        toBranch: '',
        amount: '',
        reason: '',
        date: '',
    });

    const [transferData, setTransferData] = useState({
        fromBranch: loginBranch,
        toBranch: '',
        amount: '',
        reason: '',
        date: '',
        selectedPaymentMethod: '',
        transactionId: '',
        cashTransactionId: '',
        beneficiaryName: '',
        bankName: '',
        ifsc: '',
        accountNumber: '',
        amountWord: ''
    });

    const handleChangeRequest = (e) => {
        const { name, value } = e.target;
        // Ensure value is never null or undefined, use an empty string instead
        const safeValue = value === null || value === undefined ? "" : value;
        setRequestData(prevState => ({
            ...prevState,
            [name]: safeValue,
        }));
    };

    const handleChangeTransfer = (e) => {
        const { name, value } = e.target;
        // Ensure value is never null or undefined, use an empty string instead
        const safeValue = value === null || value === undefined ? "" : value;
        setTransferData(prevState => ({
            ...prevState,
            [name]: safeValue,
        }));
    };

    const [showRequest, setShowRequest] = useState(false);
    const [showMoney, setShowMoney] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const [tempTransferData, setTempTransferData] = useState({});

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
    const [cashTransactionId, setcashTransactionId] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [bankName, setBankName] = useState("");
    const [amountWord, setAmountWord] = useState("")
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");

    const handleSendIcon = () => {
        setShowRequest(true);
    };

    const handleMoneyIcon = () => {
        setShowMoney(true);
    }

    const handlePaymentClick = () => {
        // Save the current fund transfer data to tempTransferData
        setTempTransferData(transferData);
        setShowPayment(true);
        setShowMoney(false);
    };

    const handleMoneyBack = () => {
        setShowPayment(false);
        setShowMoney(true);
    }

    const handleCloseModal = () => {
        setShowRequest(false);
        setShowMoney(false);
        setShowPayment(false);
    };

    const generateTransactionId = () => {
        let cashtransactionId = '';
        for (let i = 0; i < 16; i++) {
            cashtransactionId += Math.floor(Math.random() * 10);
        }
        return cashtransactionId;
    };
    useEffect(() => {
        setcashTransactionId(generateTransactionId());
    }, []);

    // Move the logic that depends on 'user' inside a useEffect hook
    useEffect(() => {
        // Set fromBranch to user's branch name or 'N/A' if not available
        const loginBranch = user.branchDetails ? user.branchDetails.branch_name : 'N/A';

        setRequestData(prevState => ({
            ...prevState,
            fromBranch: loginBranch,
        }));

        setTransferData(prevState => ({
            ...prevState,
            fromBranch: loginBranch,
        }));
    }, [user]);

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState({});

    useEffect(() => {
        fetch("https://api.malabarbank.in/api/branches")
            .then((response) => response.json())
            .then((data) => {
                console.log("Branches data:", data); // Add this line to check the data
                setBranches(data);
            })
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);


    const handleBranchChange = (event) => {
        const selectedBranch = branches.find(
            (branch) => branch.branch_name === event.target.value
        );
        setSelectedBranch(selectedBranch);
        // Update the transferData state to reflect the selected branch
        setTransferData(prevState => ({
            ...prevState,
            toBranch: selectedBranch.branch_name, // Ensure this matches the branch object structure
        }));
    };


    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        // Validate form data here
        try {
            // Submit the form data to the database
            const response = await axios.post('https://api.malabarbank.in/api/admin-money-request/areq', requestData);
            // Handle successful response
            console.log(response.data);
            alert(response.data.message);
            // Optionally, close the modal and reset form state
            handleCloseModal();
            setRequestData({
                fromBranch: loginBranch,
                toBranch: '',
                amount: '',
                reason: '',
                date: '',
            });

        } catch (error) {
            // Handle error
            console.error(error);
        }
    };

    //fetch requests made by admin side to branch side
    const [sendData, setSendData] = useState([])

    const getRequests = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/admin-money-request/areq')
            const data = await response.json()

            // Iterate through each object and print it
            data.data.forEach((obj, index) => {
                console.log(`Object ${index + 1}:`)
                console.log()
            })

            setSendData(data.data)
        } catch (error) {
            console.log('Error fetching data', error)
        }
    }

    useEffect(() => {
        getRequests()
    }, [])

    //fetch requests made by other branch side to admin side
    const [parsedData, setParsedData] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/transfer-requests/breq');
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
        fetchRequests();
    }, []);


    //Post fund transfers into database
    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        // Temporarily save the data
        setTempTransferData(transferData);
        // Close the modal and reset form state
        handleCloseModal();
        setTransferData({
            fromBranch: '',
            toBranch: '',
            amount: '',
            reason: '',
            date: '',
        });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Merge tempTransferData with payment details
        const allData = {
            ...tempTransferData,
            // Assuming you have payment details in state variables
            paymentMethod: selectedPaymentMethod,
            transactionId: transactionId,
            cashTransactionId: cashTransactionId,
            beneficiaryName: beneficiaryName,
            bankName: bankName,
            ifsc: ifsc,
            accountNumber: accountNumber,
            amountWord: amountWord,
        };
        try {
            // Submit all data to the database
            const response = await axios.post('https://api.malabarbank.in/api/admin-money-transfer/atra', allData);
            console.log(response.data);
            alert(response.data.message);
            // Optionally, close the modal and reset form state
            handleCloseModal();
            setTempTransferData({}); // Reset tempTransferData
            setTransferData({
                fromBranch: '',
                toBranch: '',
                amount: '',
                reason: '',
                date: '',
                // Add other fields as necessary
            });
        } catch (error) {
            console.error(error);
        }
    };

    //Fetch the fund transfer data 

    const [fundData, setFundData] = useState([]);

    const fetchTransfers = async () => {
        try {
            const response = await fetch('https://api.malabarbank.in/api/admin-money-transfer/atra')
            const data = await response.json()

            // Iterate through each object and print it
            data.data.forEach((obj, index) => {
                console.log(`Object ${index + 1}:`)
                console.log() // Add an empty line for separation
            })

            //set parsed data to state
            setFundData(data.data)
        } catch (error) {
            console.error('Error fetching data', error)
        }
    }

    useEffect(() => {
        fetchTransfers()
    }, [])

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
                                <li className="me-2">:{currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <NavBar />
            <div className="container border rounded p-4 mt-4 mb-4">
                <div className="mt-3">
                    <center>
                        <h2>FUND TRANSFER REQUESTS</h2>
                    </center>
                </div>
                <div>
                    <center>
                        <div>
                            <input type="radio" id="send" name="tableOption" value="send" checked={selectedOption === "send"} onChange={handleRadioChange} />
                            <label htmlFor="send">Request to Branch</label>
                            <input type="radio" className="ms-3" id="received" name="tableOption" value="received" checked={selectedOption === "received"} onChange={handleRadioChange} />
                            <label htmlFor="received">Requests Received</label>
                            <input type="radio" className="ms-3" id="transfer" name="tableOption" value="transfer" checked={selectedOption === "transfer"} onChange={handleRadioChange} />
                            <label htmlFor="transfer">Transfer History</label>
                        </div>
                    </center>
                </div>

                {selectedOption === "send" && (
                    <div>
                        <div className="App">
                            <div className="circle-buttons-container">
                                <div className="circle-button" onClick={handleSendIcon}><FontAwesomeIcon icon={faPaperPlane} /></div>
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
                                        {/* <th>FROM BRANCH</th> */}
                                        <th>TO BRANCH</th>
                                        <th>AMOUNT</th>
                                        <th>REASON</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sendData
                                    .reverse()
                                    .map((request, index) => (
                                        <tr key={request._id}>
                                            <td>{index + 1}</td>
                                            <td>{request.date}</td>
                                            {/* <td>{request.fromBranch}</td> */}
                                            <td>{request.toBranch}</td>
                                            <td>{request.amount}</td>
                                            <td>{request.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </center>
                    </div>
                )}


                {selectedOption === "received" && (
                    <div>
                        <div className="App">
                            <div className="circle-buttons-container">
                                <div className="circle-button" onClick={handleMoneyIcon}><FontAwesomeIcon icon={faMoneyBillTransfer} /></div>
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
                                        <th>REQUESTED BRANCH</th>
                                        {/* <th>TO BRANCH</th> */}
                                        <th>AMOUNT</th>
                                        <th>REASON</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.map((request, index) => (
                                        <tr key={request._id}>
                                            <td>{index + 1}</td>
                                            <td>{request.date}</td>
                                            <td>{request.fromBranch}</td>
                                            {/* <td>{request.toBranch}</td> */}
                                            <td>{request.amount}</td>
                                            <td>{request.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </center>
                    </div>
                )}

                {selectedOption === "transfer" && (
                    <div>
                        <div className="App">
                            <div className="circle-buttons-container">
                                <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
                            </div>
                        </div>

                        {/* Table list section */}
                        <center>
                            <Table striped bordered hover>
                                <thead>
                                    <tr >
                                        <th colSpan={5} className="text-center">TRANSFER HISTORY</th>
                                    </tr>
                                    <tr>
                                        <th>SL NO</th>
                                        <th>DATE</th>
                                        <th>TO BRANCH</th>
                                        <th>AMOUNT</th>
                                        <th>REASON</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fundData.map((request, index) => (
                                        <tr key={request._id}>
                                            <td>{index + 1}</td>
                                            <td>{request.date}</td>
                                            <td>{request.toBranch}</td>
                                            <td>{request.amount}</td>
                                            <td>{request.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </center>
                    </div>
                )}
            </div>

            {/* New request modal section */}
            <Modal show={showRequest} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "1800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4> ADD REQUEST FOR FUND TRANSFER</h4>
                            </div>
                            <div className="card-body ">
                                <form onSubmit={handleRequestSubmit} className=" mt-3">
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="">From Branch :</label>
                                            <input type="text" className="form-control" id="fromBranch" name="fromBranch" value={requestData.fromBranch || ""} onChange={handleChangeRequest} placeholder="" readOnly />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="toBranch">To Branch :</label>
                                            <select type="text" className="form-control" id="toBranch" name="toBranch" value={requestData.toBranch || ""} onChange={handleChangeRequest} required>
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch._id} value={branch.branch_name}>
                                                        {branch.branch_name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="amount">Amount :</label>
                                            <input type="number" className="form-control" id="amount" name="amount" value={requestData.amount || ""} onChange={handleChangeRequest} placeholder="" required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="reason">Reason :</label>
                                            <textarea type="text" className="form-control" id="reason" name="reason" value={requestData.reason || ""} onChange={handleChangeRequest} placeholder="" required />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="date">Date :</label>
                                            <input type="date" className="form-control" id="date" name="date" value={requestData.date || ""} onChange={handleChangeRequest} />

                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor=""></label>
                                        </div>
                                    </div>
                                    <center>
                                        <div className="form-group mt-5 ">
                                            <button type="submit" className="btn btn-primary">
                                                Send Request
                                            </button>
                                            <Button variant="danger" className="btn btn-secondary m-2" onClick={handleCloseModal}>
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

            {/* New money transfer modal section */}
            <Modal show={showMoney} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "1800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>FUND TRANSFER</h4>
                            </div>
                            <div className="card-body ">
                                <form onSubmit={handleTransferSubmit} className=" mt-3">
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="fromBranch">From Branch :</label>
                                            <input type="text" className="form-control" id="fromBranch" name="fromBranch" value={transferData.fromBranch || ""} onChange={handleChangeTransfer} placeholder="" readOnly />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="toBranch">To Branch :</label>
                                            <select type="text" className="form-control" id="toBranch" name="toBranch" value={transferData.toBranch || ""} onChange={handleBranchChange} required>
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch._id} value={branch.branch_name}>
                                                        {branch.branch_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="amount">Amount :</label>
                                            <input type="text" className="form-control" id="amount" name="amount" value={transferData.amount || ""} onChange={handleChangeTransfer} placeholder="" required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="reason">Reason :</label>
                                            <textarea type="text" className="form-control" id="reason" name="reason" value={transferData.reason || ""} onChange={handleChangeTransfer} placeholder="" required />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="date">Date :</label>
                                            <input type="date" className="form-control" id="date" name="date" value={transferData.date || ""} onChange={handleChangeTransfer} required />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor=""></label>
                                        </div>
                                    </div>
                                    <center>
                                        <div className="form-group mt-5 ">
                                            <button type="button" className="btn btn-primary" onClick={handlePaymentClick}>
                                                Payment Gateway
                                            </button>
                                            <Button variant="danger" className="btn btn-secondary m-2" onClick={handleCloseModal}>
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

            {/* New payment modal section */}
            <Modal show={showPayment} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>PAYMENT GATEWAY</h4>
                            </div>
                            <div className="card-body ">
                                <form onSubmit={handlePaymentSubmit} className=" mt-3">
                                    <div className="Cash form">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12 col-12">
                                                <div className="card card0">
                                                    <div className="d-flex" id="wrapper">
                                                        {/* <!-- Sidebar --> */}
                                                        <div className="bg-light border-right" id="sidebar-wrapper">
                                                            <div className="sidebar-heading pt-5 pb-4"><strong>PAY WITH</strong></div>
                                                            <div className="list-group list-group-flush">
                                                                <a
                                                                    data-toggle="tab"
                                                                    href="#menu1"
                                                                    id="tab1"
                                                                    name="Cash"
                                                                    className={`tabs list-group-item ${selectedPaymentMethod === "Cash" ? "active1" : ""}`}
                                                                    onClick={() => setSelectedPaymentMethod("Cash")}
                                                                >
                                                                    <div className="list-div my-2">
                                                                        <div className="fa-solid fa-money-bill-1"></div> &nbsp;&nbsp; CASH
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    data-toggle="tab"
                                                                    href="#menu2"
                                                                    id="tab2"
                                                                    name="UPI"
                                                                    className={`tabs list-group-item ${selectedPaymentMethod === "UPI" ? "active1" : ""}`}
                                                                    onClick={() => setSelectedPaymentMethod("UPI")}
                                                                >
                                                                    <div className="list-div my-2">
                                                                        <div className="fa fa-credit-card"></div> &nbsp;&nbsp; UPI
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    data-toggle="tab"
                                                                    href="#menu3"
                                                                    id="tab3"
                                                                    name="Bank"
                                                                    className={`tabs list-group-item ${selectedPaymentMethod === "Bank" ? "active1" : ""}`}
                                                                    onClick={() => setSelectedPaymentMethod("Bank")}
                                                                >
                                                                    <div className="list-div my-2">
                                                                        <div className="fa-solid fa-building-columns"></div> &nbsp;&nbsp; BANK
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div id="page-content-wrapper">
                                                            <div className="tab-content">
                                                                <div id="menu1" className="tab-pane in active">
                                                                    <div className="row justify-content-center">
                                                                        <div className="col-12">
                                                                            <div className="form-card">
                                                                                <h3 className="mt-5 mb-4 text-center">Enter Cash details</h3>
                                                                                <form onsubmit="event.preventDefault()">
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="cashTransactionId" name="cashTransactionId" placeholder="" minLength="16" maxLength="16" value={cashTransactionId}
                                                                                                onChange={(e) => setcashTransactionId(e.target.value)} />
                                                                                                <label>TRANSACTION ID</label>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="amount" name="amount" placeholder="" value={tempTransferData.amount || ""} onChange={handleChangeTransfer} /> <label>AMOUNT </label> </div>
                                                                                        </div>
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="amountWord" name="amountWord" placeholder="" value={tempTransferData.amountWord || ""} onChange={handleChangeTransfer} /> <label>AMOUNT IN WORDS</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="menu2" className="tab-pane">
                                                                    <div className="row justify-content-center">
                                                                        <div className="col-12">
                                                                            <div className="form-card">
                                                                                <h3 className="mt-5 mb-4 text-center">Enter UPI details</h3>
                                                                                <form onsubmit="event.preventDefault()">
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="transactionId" name="transactionId" placeholder="" minLength="16" maxLength="16" value={tempTransferData.transactionId}
                                                                                                onChange={(e) => {
                                                                                                    const newTransactionId = e.target.value;
                                                                                                    setTransactionId(newTransactionId);
                                                                                                    if (newTransactionId) {
                                                                                                        setcashTransactionId(null); // Set cashTransactionId to null if transactionId has a value
                                                                                                    }
                                                                                                }} /> <label>TRANSACTION ID</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" name="beneficiaryName" placeholder="" value={tempTransferData.beneficiaryName || ""} onChange={handleChangeTransfer} /> <label>BENEFICIARY NAME</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" name="amount" id="amount" placeholder="" value={tempTransferData.amount || ""} onChange={handleChangeTransfer} /> <label>AMOUNT</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="amountWord" name="amountWord" placeholder="" value={tempTransferData.amountWord || ""} onChange={handleChangeTransfer} /> <label>AMOUNT IN WORDS</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="menu3" className="tab-pane">
                                                                    <div className="row justify-content-center">
                                                                        <div className="col-12">
                                                                            <div className="form-card">
                                                                                <h3 className="mt-5 mb-4 text-center">Enter Bank Details</h3>
                                                                                <form onsubmit="event.preventDefault()">
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="bankName" name="bankName" placeholder="" value={tempTransferData.bankName || ""} onChange={handleChangeTransfer} /> <label>BANK NAME & BRANCH</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="accountNumber" name="accountNumber" placeholder="" value={tempTransferData.accountNumber || ""} onChange={handleChangeTransfer} /> <label>ACCOUNT NUMBER</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="ifsc" name="ifsc" placeholder="" value={tempTransferData.ifsc || ""} onChange={handleChangeTransfer} /> <label>IFSC</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" name="amount" id="amount" placeholder="" value={tempTransferData.amount || ""} onChange={handleChangeTransfer} /> <label>AMOUNT</label> </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <div className="input-group"> <input type="text" id="amountWord" name="amountWord" placeholder="" value={tempTransferData.amountWord || ""} onChange={handleChangeTransfer} /> <label>AMOUNT IN WORDS</label> </div>
                                                                                        </div>
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
                                            </div>
                                        </div>
                                    </div>
                                    <center>
                                        <div className="form-group mt-5 ">
                                            <button type="submit" className="btn btn-primary" onSubmit={handleTransferSubmit}>
                                                Transfer Money
                                            </button>
                                            <Button variant="danger" className="btn btn-secondary m-2" onClick={handleMoneyBack}>
                                                Back
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
    );
};

export default BranchFundRequests