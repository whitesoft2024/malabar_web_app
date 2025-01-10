
import NavBar from "../../User/OtherUser/EmpNavBar";
import axios from "axios";
import { UserContext } from "../../Others/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useContext } from "react";
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from '../../style/logo.png';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async";
import Select from "react-select";

function FdIntWithdrawal() {
    const { user, setUser } = useContext(UserContext);
    const [currentDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5); // Default items per page
    const [searchTerm, setSearchTerm] = useState("");
    const [searchReceipt, setSearchReceipt] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [fdData, setFdData] = useState([]); // For FD Numbers
    const [selectedFDNumber, setSelectedFDNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
     const [selectedFD, setSelectedFD] = useState(null);
     const [fdSearchTerm, setFdSearchTerm] = useState("");
     const[fdNumbers,setFdNumbers]=useState("")
     const [fdNumber, setFdNumber] = useState("");

    const fetchData = async () => {
        try {
            const branch = user?.branchDetails?.branchCode || "";
            
            // Dynamically build query parameters
            const queryParams = new URLSearchParams({
                page,
                limit: size,
                branch,
            });

            if (searchTerm.trim()) queryParams.append("searchTerm", searchTerm.trim());
            if (searchReceipt.trim()) queryParams.append("searchReceipt", searchReceipt.trim());

            const response = await axios.get(`http://localhost:2000/api/fd?${queryParams.toString()}`);
            const { data: fetchedData, totalPages } = response.data;
            setData(fetchedData);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

  


    const fetchFdNumbers = async (inputValue) => {
        try {
            const branch = user?.branchDetails?.branchCode || "";
            if (!inputValue.trim()) return []; // Don't fetch if input is empty
    
            const response = await axios.get(
                `http://localhost:2000/api/fdDataS/${branch}/${inputValue.trim()}`
            );
            // console.log("resp",response.data.data.data.FDNumber)
            const data = await response.json();
            console.log(data,"dataxxx")

            // Safely handle undefined or missing FDNumber properties
            const fdNumbers = data
                .filter((item) => item.FDNumber) // Ensure FDNumber exists
                .map((item) => item.FDNumber.trim()); // Safely call trim()
            
            setFdNumbers(fdNumbers);
 
    
            // Map the response data to the format expected by AsyncSelect
            return response.data.map((fd) => ({
                value: fd.FDNumber,
                label: `${fd.FDNumber} - ${fd.customerName}`,
                customerName: fd.customerName,
            }));
        } catch (error) {
            console.error("Error fetching FD numbers:", error);
            return [];
        }
    };
    
    const handleFDNumberChange = (selectedOption) => {
        setSelectedFDNumber(selectedOption?.value || "");
        setCustomerName(selectedOption?.customerName || "");
    };

    useEffect(() => {
        fetchData();
    }, [page, size, searchTerm, searchReceipt]);
  
   

    const handleFDSearchChange = (e) => {
        const searchValue = e.target.value.trim();
        setFdSearchTerm(searchValue); // Update search term state
        fetchFdNumbers(searchValue); // Fetch FD data based on input
    };
    
    const handleFDNumberSelect = (e) => {
        const selectedValue = e.target.value;
        setSelectedFDNumber(selectedValue); // Set the selected FD number
    
        const selectedFD = fdData.find(fd => fd.FDNumber === selectedValue);
        if (selectedFD) {
            setCustomerName(selectedFD.customerName || ""); // Set customer name if found
        }
    };
    








  // Handle FD selection
  const handleFDChange = (selectedOption) => {
    setSelectedFD(selectedOption.value);
    setCustomerName(selectedOption.customerName);
  };

    const handleInputChange = (e) => {
        setFdNumber(e.target.value); // Update state with the input value
    };

   
    // const handleSubmit = async () => {
    //     try {
    //         const payload = {
    //             branchUser: user.employee.fullname,
    //             userDate: selectedDate.toLocaleDateString("en-GB"),
    //             userTime: selectedDate.toLocaleTimeString("en-US", { hour12: true }),
    //             withdrawalAmount,
    //         };
    
    //         await axios.post(`http://localhost:2000/api/withdrawInterest/${fdNumbers}`, payload);
    //         alert("Interest withdrawn successfully.");
    //         setShowModal(false);
    //         setWithdrawalAmount("");
    //         setSelectedFDNumber("");
    //         setCustomerName("");
    //     } catch (error) {
    //         console.error("Error submitting withdrawal:", error);
    //         alert("Failed to withdraw interest.");
    //     }
    // };
    
    const handleSubmit = async () => {
        try {
            if (!fdNumber.trim()) {
                alert("Please enter a valid FD Number.");
                return;
            }

            const payload = {
                branchUser: user.employee.fullname,
                date: selectedDate.toLocaleDateString("en-GB"),
                userTime: selectedDate.toLocaleTimeString("en-US", { hour12: true }),
                amount:withdrawalAmount,
                fdNumber: fdNumber.trim(),
            };

            await axios.post(`http://localhost:2000/api/withdrawInterest/${fdNumber}`, payload);
            alert("Interest withdrawn successfully.");
            setShowModal(false);
            setWithdrawalAmount("");
            setFdNumber("");
        } catch (error) {
            console.error("Error submitting withdrawal:", error);
            alert("Failed to withdraw interest.");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location = `/`;
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to the first page after search
    };

    const handleReceiptSearch = (e) => {
        setSearchReceipt(e.target.value);
        setPage(1); // Reset to the first page after search
    };

    const handleLimitChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        if (newSize > 0) {
            setSize(newSize);
            setPage(1); // Reset to the first page after changing limit
        }
    };

    return (
        <div>
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to='/main'>
                        <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2">MALABAR CO-OPERATIVE SOCIETY</strong>
                    </Link>
                    <div className="d-flex" style={{ width: "600px" }}>
                        <FontAwesomeIcon icon={faHouse} className="me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            onClick={handleLogout}
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">EMPLOYEE</li>
                                <li className="me-2">Branch</li>
                                <li className="me-2">Branch Code</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: {user ? user.employee.fullname : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branch_name : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branchCode : 'N/A'}</li>
                                <li className="me-2">: {currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <h3 className="text-center mb-4">Interest Withdrawal</h3>
  {/* Button to open modal */}
  <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary" onClick={() => { setShowModal(true); fetchFdNumbers(); }}>
                        Open Withdrawal Modal
                    </button>
                </div>




                 {/* Modal */}
                 {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Interest Withdrawal</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                  

<div className="mb-3">
                                        <label className="form-label">FD Number</label>
                                     
 <input
                type="text"
                id="fdNumberInput"
                value={fdNumber}
                onChange={handleInputChange}
                placeholder="Enter FD Number"
                className="form-control"
            />

        
                                    </div>
                                    {/* <div className="mb-3">
                                        <label className="form-label">Customer Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={customerName}
                                            readOnly
                                        />
                                    </div> */}

                                  
                                    <div className="mb-3">
                                        <label className="form-label">Withdrawal Date</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Withdrawal Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={withdrawalAmount}
                                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Limit Controls */}
                <div className="d-flex mb-3">
                    <input
                        type="text"
                        placeholder="Search by Customer Name"
                        className="form-control me-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <input
                        type="text"
                        placeholder="Search by Receipt Number"
                        className="form-control me-2"
                        value={searchReceipt}
                        onChange={handleReceiptSearch}
                    />
                    <input
                        type="number"
                        placeholder="Items per page"
                        className="form-control"
                        min="1"
                        value={size}
                        onChange={handleLimitChange}
                    />
                </div>

                {/* Data Table */}
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Sl. No.</th>
                            <th>Customer Name</th>
                            <th>FD Number</th>
                            <th> Date</th>
                            <th>Total Amount</th>
                            <th>Mature Date</th>
                            <th>Total Interest Balance</th>
                            <th>Interest Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{(page - 1) * size + index + 1}</td>
                                    <td>{item.customerName}</td>
                                    <td>{item.FDNumber}</td>
                                    <td>{item.newDate}</td>
                                    <td>{item.totalAmount}</td>
                                    <td>{item.matureDate}</td>
                                    <td>{item.totalIntFdBal ? parseFloat(item.totalIntFdBal).toFixed(2) : "0.00"}</td>
                                    <td>{item.interestBalance ? parseFloat(item.interestBalance).toFixed(2) : "0.00"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn btn-secondary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}


export default FdIntWithdrawal;
