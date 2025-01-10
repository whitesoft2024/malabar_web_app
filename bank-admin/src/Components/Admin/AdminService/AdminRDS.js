import React, { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import NavbarSection from '../adminOthers/AdminNavbar'
import { UserContext } from "../../Others/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../style/logo.png"

const RDS = () => {
    const [branchCode, setBranchCode] = useState("");
    const [selectedRowEdit, setSelectedRowEdit] = useState(null);
    const [newRDSdata, setNewRDSdata] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user, setUser } = useContext(UserContext);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Fetch branches from your server
        fetch("https://api.malabarbank.in/api/branches")
            .then((response) => response.json())
            .then((data) => setBranches(data))
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "branch_name") {
            const selectedBranch = branches.find(branch => branch.branch_name === value);
            setFormData(prevData => ({
                ...prevData,
                branch_name: value,
                branchCode: selectedBranch ? selectedBranch.branchCode : ''
            }));
            console.log("Selected branch code:", selectedBranch ? selectedBranch.branchCode : '');
        } else {
            // For other inputs, update as usual
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location = (`/`);
    };

    const [formData, setFormData] = useState({
        membershipId: "",
        customerName: "",
        accountNumber: "",
        address: "",
        newDate: "",
        deposit: "",
        depositwords: "",
        customerNumber: "",
        type: "Initial",
        remarks: "",
        branchcode: user?.branchDetails?.branchCode,
        loginUser: "",
        loginUserTime: "",
        transactionId: "",
        savingsBill: "",
        branchUser: "",
        branchUserDate: "",
        branchUserTime: "",
        branch_name: '',
        branchCode: '',
    });

    // fetch by mobile

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [nextPage, setNextPage] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [searchSavings, setSearchSavings] = useState("");
    const [pageNumber, setPageNumber] = useState("");

    useEffect(() => {
        fetchRDSData(currentPage, pageSize,formData.branchCode, searchSavings);
    }, [currentPage, pageSize,formData.branchCode, searchSavings]);

    const fetchRDSData = async (
        page,
        size,
        pageNumber = 1
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://api.malabarbank.in/api/RDSdata?page=${page}&limit=${size}&branch=${formData.branchCode}&searchTerm=${searchTerm}&pageNumber=${pageNumber}`
            );

            const cleanedData = response.data.data.map(({ _id, ...rest }) => rest);
            setNewRDSdata(cleanedData);

            setNextPage(response.data.nextPage);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchSavings(value);
        fetchRDSData(1, pageSize, formData.branchCode, value);
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
            fetchRDSData(currentPage + 1, pageSize,formData.branchCode); // Include branchCode
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchRDSData(currentPage - 1, pageSize,formData.branchCode); // Include branchCode
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1);
        fetchRDSData(1, newSize);
    };
    const handlePageNumberChange = (e) => {
        setPageNumber(e.target.value);
    };

    const goToPage = () => {
        const pageNumberInt = parseInt(pageNumber);
        if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
            setCurrentPage(pageNumberInt);
            fetchRDSData(pageNumberInt, pageSize, formData.branchCode, searchTerm);
            fetchRDSData("");
        } else {
            const inputBox = document.getElementById("pageNumberInput");
            inputBox.classList.add("input-error");

            const errorMessage = document.createElement("div");
            errorMessage.innerText = "Please enter a valid page number.";
            errorMessage.classList.add("error-message");
            inputBox.parentNode.insertBefore(errorMessage, inputBox.nextSibling);

            setTimeout(() => {
                inputBox.classList.remove("input-error");
                errorMessage.remove();
            }, 3000);
        }
    };
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <div className="container-fluid border rounded ">
                <nav className="navbar navbar-light ">
                    <div className="container-fluid">
                        <Link className="navbar-brand ms-5 d-flex align-items-center" to='/adminMain'>
                            <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                            <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                        </Link>
                        <div className="d-flex" style={{ width: "600px" }}>
                            <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
                            <FontAwesomeIcon
                                icon={faPowerOff}
                                onClick={handleLogout}
                                className="text-danger me-5 mt-4"
                            />
                            <div className="d-flex">
                                <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                                <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                    <li className="me-2">User</li>
                                    <li>Date</li>
                                    <li>Branch</li>
                                </ul>
                                <ul className="list-unstyled mb-1 me-5">
                                    <li className="me-2">: Admin</li>
                                    <li className="me-2">: {currentDate.toLocaleString()}</li>
                                    <li className="me-2">:<select
                                        className="form-group"
                                        id="branch_name"
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map((branch) => (
                                            <option key={branch._id} value={branch.branch_name}>
                                                {branch.branch_name}
                                            </option>
                                        ))}
                                    </select> </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <NavbarSection />
                <center>
                    <h2>RECCURING DEPOSIT SPECIAL</h2>
                </center>
                <div className="">
                    <div className="circle-buttons-container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-0 ">
                                    <label htmlFor="referenceNumber" className="mr-2">
                                        Search:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="branch"
                                        name="branch"
                                        onChange={handleSearch}
                                        placeholder="Enter Search"
                                        style={{ width: "20rem" }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <div className="form-group mb-0" style={{ marginLeft: "5rem" }}>
                                    <div>
                                        <label htmlFor="pageNumber" className="mr-2">
                                            Row No:
                                        </label>
                                    </div>
                                    <div>
                                        <select
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                            className="form-control"
                                            style={{ width: "3rem" }}
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <center>
                    <div className="table-container">
                        {isLoading ? (
                            <div className="loading-animation">Loading...</div>
                        ) : (
                            <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th style={{ textAlign: "center" }}>SL NO</th>
                                <th style={{ textAlign: "center" }}>RDS JOIN DATE</th>
                                <th style={{ textAlign: "center" }}>MEMBERSHIP ID</th>
                                <th style={{ textAlign: "center" }}>CUSTOMER NAME</th>
                                <th style={{ textAlign: "center" }}>RDS NUMBER</th>
                                <th style={{ textAlign: "center" }}>REFERENCE NAME</th>
                                <th style={{ textAlign: "center" }}>BALANCE</th>
                              </tr>
                            </thead>
            
                            <tbody>
                              {newRDSdata.map((rdsData) => {
                                let balance = parseFloat(rdsData.amount) || 0; // Initialize balance with amount
            
                                if (rdsData.EmiData && rdsData.EmiData.length > 0) {
                                  rdsData.EmiData.forEach((emi) => {
                                    // Add newAmount and subtract withdrawalAmount for each EmiData entry
                                    balance += (parseFloat(emi.newAmount) || 0) - (parseFloat(emi.withdrawalAmount) || 0);
                                  });
                                }
            
                                return (
                                  <tr
                                    key={rdsData._id}
                                    className={selectedRowEdit === rdsData ? "selected-rowEdit" : ""}
                                  >
                                    <td>{rdsData.sl_no}</td>
                                    <td>{rdsData.Date || rdsData.newDate || rdsData.date}</td>
                                    <td>{rdsData.membershipId}</td>
                                    <td>{rdsData.customerName}</td>
                                    <td>{rdsData.RDSNumber}</td>
                                    <td>{rdsData.referenceName}</td>
                                    <td>{balance}</td> {/* Display the calculated balance */}
                                  </tr>
                                );
                              })}
            
                            </tbody>
                          </Table>
                        )}
                        <div className="pagination-buttons">
                            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Previous
                            </Button>
                            <span>Page {currentPage}</span>
                            <Button onClick={handleNextPage} disabled={!nextPage}>
                                Next <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                            <select value={pageSize} onChange={handlePageSizeChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <nav aria-label="Page navigation example col">
                            <ul class="pagination justify-content-end">
                                <li class="page-item disabled">Enter page number:</li>
                                <li class="page-item">
                                    <input
                                        id="pageNumberInput"
                                        type="number"
                                        value={pageNumber}
                                        style={{
                                            width: "50px",
                                            padding: "5px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                        onChange={handlePageNumberChange}
                                        aria-label="Page number input"
                                    />
                                </li>
                                <li class="page-item">
                                    <Button onClick={goToPage} disabled={!nextPage}>
                                        Go
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </center>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RDS;
