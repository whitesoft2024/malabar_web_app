import React from 'react'
import { Table, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faPrint } from '@fortawesome/free-solid-svg-icons';
import './style/Memberlist.css';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Others/UserContext';
import { faHouse, faPowerOff, faUser, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from './style/logo.png';
import axios from "axios";

function Memberlist() {

    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({});
    const [filteredMemberships, setFilteredMemberships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, setUser } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [memberships, setMemberships] = useState([]);


    // console.log(employee);
    const handleRowClick = (membership) => {
        setSelectedRow(membership);
    };

    const handleCloseModal = () => {
        setSelectedRow(null);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const branchCode = user?.branchDetails?.branchCode;
    useEffect(() => {
        fetchMemberships(currentPage, pageSize, branchCode);
    }, [currentPage, pageSize, branchCode]);

    const fetchMemberships = async (page, size, branchCode) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:2000/api/membership?page=${page}&limit=${size}&branchCode=${branchCode}`);
            setMemberships(response.data.data);
            setNextPage(response.data.nextPage);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
            const branchCode = user?.branchDetails?.branchCode;
            fetchMemberships(currentPage + 1, pageSize, branchCode); // Include branchCode
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            const branchCode = user?.branchDetails?.branchCode;
            fetchMemberships(currentPage - 1, pageSize, branchCode); // Include branchCode
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to the first page when page size changes
        fetchMemberships(1, newSize); // Fetch data for the first page with new page size
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    //Update  membership form

    const handleSaveChanges = () => {
        // Send a PUT or PATCH request to update the data in the database
        fetch(`http://localhost:2000/api/membership/${selectedRow._id}`, {
            method: 'PUT', // or 'PATCH' if partial update is supported
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                handleCloseModal();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    // Logout function
    const handleLogout = () => {
        // Clear user data from local storage and reset user state
        localStorage.removeItem('user');
        setUser(null);
        // Redirect to login page or any other page as needed
        window.location = (`/`);
    };


    const [rowsToShow, setRowsToShow] = useState(10); // State to track number of rows to display
    const [pageInput, setPageInput] = useState(''); // State to track input for page number

    const totalPages = () => {
        const totalRows = searchTerm === '' ? memberships.length : filteredMemberships.length;
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

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = memberships.filter(membership => {
            // Perform case-insensitive search
            const membershipId = membership.membershipId ? membership.membershipId.toLowerCase() : '';
            const customerName = membership.customerName ? membership.customerName.toLowerCase() : '';
            const date = membership.date ? membership.date.toLowerCase() : '';
            const address = membership.address ? membership.address.toLowerCase() : '';
            const customerMobile = membership.customerMobile ? membership.customerMobile.toLowerCase() : '';
            const referenceName = membership.referenceName ? membership.referenceName.toLowerCase() : '';

            return (
                membershipId.includes(term) ||
                customerName.includes(term) ||
                date.includes(term) ||
                address.includes(term) ||
                customerMobile.includes(term) ||
                referenceName.includes(term)
            );
        });
        setFilteredMemberships(filtered);
    };

    const handleDropdownChange = (event) => {
        const value = parseInt(event.target.value);
        if (value > 50) {
            setRowsToShow(50); // Show 50 rows
        } else {
            setRowsToShow(value); // Show selected number of rows
        }
    };

    // Function to determine if there are more pages to display
    const hasNextPage = () => {
        const totalRows = searchTerm === '' ? memberships.length : filteredMemberships.length;
        const totalPages = Math.ceil(totalRows / rowsToShow);
        return currentPage < totalPages;
    };

    const getSLNo = (index) => {
        return (currentPage - 1) * rowsToShow + index + 1;
    };

    const handlePrint = () => {
        const input = document.getElementById("print-content");

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "PNG", 0, 0);

            // Open a new window with PDF content for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write('<html><head><title>Print</title></head><body><img src="' + imgData + '" /></body></html>');
            printWindow.document.close();

            // Wait for the window to load, then trigger print
            printWindow.onload = () => {
                printWindow.print();
            };
        });
    };




    return (
        <div>
            <div className="container border rounded p-4 mt-4 mb-4">
                <nav className="navbar navbar-light ">
                    <div className="container-fluid">
                        <Link className="navbar-brand ms-5 d-flex align-items-center" to='/main'>
                            <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                            <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                        </Link>
                        <div className="d-flex" style={{ width: "400px" }}>
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
                <div className="marquee  px-5 m-2">
                    <marquee className="text-white" behavior="scroll" direction="left">
                        New Updates : Welcome to MALABAR BANK....Have a nice day....
                    </marquee>
                </div>
                <center>
                    <h2>MEMBERSHIP LIST</h2>
                </center>
                <div className="">
                    <div className="circle-buttons-container">
                        <div className="row">
                            <div className="col-md-6 d-flex align-items-center">
                                <div className="form-group mb-0">
                                    <label htmlFor="referenceNumber" className="mr-2">Search:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="branch"
                                        name="branch"
                                        // value={formData.branch}
                                        onChange={handleSearch}
                                        placeholder="Enter Search"
                                        style={{ width: "250px" }} // Adjust the width as needed
                                    />
                                </div>
                                <div className="form-group mb-0">
                                <label htmlFor="referenceNumber" className="mr-4">Size:</label>
                                    <select value={pageSize} onChange={handlePageSizeChange} className='form-group'>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            {/* <div className="col-md-6 d-flex align-items-center">
                                <div className="form-group mb-0" style={{ marginLeft: "5rem" }}>
                                    <label htmlFor="pageNumber" className="mr-2">Row No:</label>
                                    <select className="form-control" style={{ width: "4rem" }} onChange={handleDropdownChange}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div> */}
                        </div>

                        <Link to="/memberform"><div className="circle-button " style={{ marginLeft: "25rem" }}><FontAwesomeIcon icon={faPlus} /></div></Link>
                        <div className="circle-button "><FontAwesomeIcon icon={faPrint} onClick={handlePrint} /></div>

                    </div>
                </div>

                {/* <center>
        <div className="table-container">
            {isLoading ? (
                <div className="loading-animation">Loading...</div>
            ) : (
                <Table striped bordered hover id='print-content'>
                    <thead>
                        <tr>
                            <th>Sl NO</th>
                            <th>CUSTOMER NAME</th>
                            <th>MEMBERSHIP TYPE</th>
                            <th>MEMBERSHIP JOIN DATE</th>
                            <th>ADDRESS</th>
                            <th>PHONE NUMBER</th>
                            <th>REFERENCE NAME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberships.map((membership, index) => (
                            <tr key={membership._id} onClick={() => handleRowClick(membership)} className={selectedRow === membership ? 'selected-row' : ''}>
                                <td>{index + 1}</td>
                                <td>{membership.customerName}</td>
                                <td>{membership.membershipId}</td>
                                <td>{membership.date}</td>
                                <td>{membership.address}</td>
                                <td>{membership.phoneNumber}</td>
                                <td>{membership.referenceName}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <div className="pagination-buttons">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage} disabled={!nextPage}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                <select value={pageSize} onChange={handlePageSizeChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
    </center> */}
                <center>
                    <div className="table-container">
                        {isLoading ? (
                            <div className="loading-animation">Loading...</div>
                        ) : (
                            <Table striped bordered hover id='print-content'>
                                <thead>
                                    <tr>
                                        <th>Sl NO</th>
                                        <th>CUSTOMER NAME</th>
                                        <th>MEMBERSHIP TYPE</th>
                                        <th>MEMBERSHIP JOIN DATE</th>
                                        <th>ADDRESS</th>
                                        <th>PHONE NUMBER</th>
                                        <th>REFERENCE NAME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberships.map((membership, index) => (
                                        <tr key={membership._id} onClick={() => handleRowClick(membership)} className={selectedRow === membership ? 'selected-row' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{membership.customerName}</td>
                                            <td>{membership.membershipType}</td>
                                            <td>{membership.joinDate}</td>
                                            <td>{membership.address}</td>
                                            <td>{membership.phoneNumber}</td>
                                            <td>{membership.referenceName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <div className="pagination-buttons">
                            <Button onClick={handlePreviousPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeft} /> Previous</Button>
                            <span>Page {currentPage}</span>
                            <Button onClick={handleNextPage} disabled={!nextPage}>Next <FontAwesomeIcon icon={faArrowRight} /></Button>

                        </div>
                    </div>
                </center>


                {/* Modal */}
                <Modal show={selectedRow !== null} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                    <Modal.Header closeButton>
                        <Modal.Title>Membership Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRow && (
                            //  <p>Membership ID: {selectedRow.membershipId}</p>
                            //  <p>Customer Name: {selectedRow.customerName}</p> 

                            <div className="Member form">
                                <div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">MEMBERSHIP TYPE :</label>
                                            <input
                                                id="inputState"
                                                className="form-control"
                                                name="membershipType"
                                                // value={selectedRow.membershipType}
                                                value={formData.membershipType || selectedRow.membershipType}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label className="label">MEMBERSHIP ID :</label>
                                            <input
                                                name="membershipId"
                                                className="form-control"
                                                // style={{ width: "70%" }}
                                                // value={selectedRow.membershipId}
                                                value={formData.membershipId || selectedRow.membershipId}
                                                onChange={handleInputChange}

                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row ">
                                        <div className="form-group col-md-4">
                                            <label className="label">CUSTOMER NAME :</label>
                                            <input
                                                name="customerName"
                                                value={formData.customerName || selectedRow.customerName}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">DATE :</label>
                                            <input
                                                name="date"
                                                value={formData.date || selectedRow.date}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="form-control"
                                                id="inputAddress"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">GUARDIAN NAME :</label>
                                            <input
                                                name="guardianName"
                                                value={formData.guardianName || selectedRow.guardianName}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="form-control"
                                                id="inputAddress"
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">RELATION :</label>
                                            <input
                                                name="relation"
                                                id="inputState"
                                                className="form-control"
                                                value={formData.relation || selectedRow.relation}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">ADDRESS :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputEmail4"
                                                style={{ height: "70px" }}
                                                name="address"
                                                value={formData.address || selectedRow.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">CUSTOMER MOBILE :</label>
                                            <input
                                                className="form-control"
                                                id="inputPassword4"
                                                name="customerMobile"
                                                value={formData.customerMobile || selectedRow.customerMobile}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">TELEPHONE NO :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputEmail4"
                                                value={formData.telephoneNo || selectedRow.telephoneNo}
                                                onChange={handleInputChange}
                                                name="telephoneNo"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">RELIGION :</label>
                                            <input
                                                className="form-control"
                                                id="inputPassword4"
                                                value={formData.religion || selectedRow.religion}
                                                onChange={handleInputChange}
                                                name="religion"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">REFERENCE NAME :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="inputEmail4"
                                                value={formData.referenceName || selectedRow.referenceName}
                                                onChange={handleInputChange}
                                                name="referenceName"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">REFERENCE MOBILE :</label>
                                            <input
                                                className="form-control"
                                                id="inputPassword4"
                                                value={formData.referenceMobile || selectedRow.referenceMobile}
                                                onChange={handleInputChange}
                                                name="referenceMobile"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">DATE OF BIRTH :</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.dateOfBirth || selectedRow.dateOfBirth}
                                                onChange={handleInputChange}
                                                name="dateOfBirth"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">AGE :</label>
                                            <input
                                                className="form-control"
                                                value={formData.age || selectedRow.age}
                                                onChange={handleInputChange}
                                                name="age"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">BLOOD GROUP :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.bloodGroup || selectedRow.bloodGroup}
                                                onChange={handleInputChange}
                                                name="bloodGroup"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">PROFESSION :</label>
                                            <input
                                                className="form-control"
                                                value={formData.profession || selectedRow.profession}
                                                onChange={handleInputChange}
                                                name="profession"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">DISTRICT :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.district || selectedRow.district}
                                                onChange={handleInputChange}
                                                name="district"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">TALUK :</label>
                                            <input
                                                className="form-control"
                                                value={formData.taluk || selectedRow.taluk}
                                                onChange={handleInputChange}
                                                name="taluk"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">CITY/VILLAGE NAME :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.cityVillageName || selectedRow.cityVillageName}
                                                onChange={handleInputChange}
                                                name="cityVillageName"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">PANCHAYATH NAME :</label>
                                            <input
                                                className="form-control"
                                                value={formData.panchayathName || selectedRow.panchayathName}
                                                onChange={handleInputChange}
                                                name="panchayathName"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">POSTAL CITY NAME :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.postalCityName || selectedRow.postalCityName}
                                                onChange={handleInputChange}
                                                name="postalCityName"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">PIN CODE :</label>
                                            <input
                                                className="form-control"
                                                value={formData.pinCode || selectedRow.pinCode}
                                                onChange={handleInputChange}
                                                name="pinCode"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">E-MAIL ::</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email || selectedRow.email}
                                                onChange={handleInputChange}
                                                name="email"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">ANNUAL INCOME :</label>
                                            <input
                                                className="form-control"
                                                value={formData.annualIncome || selectedRow.annualIncome}
                                                onChange={handleInputChange}
                                                name="annualIncome"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">CASTE :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.caste || selectedRow.caste}
                                                onChange={handleInputChange}
                                                name="caste"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">SUB CASTE :</label>
                                            <input
                                                className="form-control"
                                                value={formData.subCaste || selectedRow.subCaste}
                                                onChange={handleInputChange}
                                                name="subCaste"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group col-md-4">
                                            <label className="label">GENDER :</label>
                                            <input
                                                id="inputState"
                                                name="gender"
                                                className="form-control"
                                                value={formData.gender || selectedRow.gender}
                                                onChange={handleInputChange}
                                            />


                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">MARITAL STATUS :</label>
                                            <input
                                                id="inputState"
                                                className="form-control"
                                                value={formData.maritalStatus || selectedRow.maritalStatus}
                                                onChange={handleInputChange}
                                                name="maritalStatus"

                                            />
                                        </div>
                                    </div>
                                    <div className="form-row row d-flex flex-row">
                                        <div className="form-group  col-md-4">
                                            <label className="label">NOMINEE NAME :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                name="nomineeName"
                                                value={formData.nomineeName || selectedRow.nomineeName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group  col-md-4">
                                            <label className="label">NOMINEE MOBILE :</label>
                                            <input
                                                className="form-control"
                                                placeholder="Mobile number"
                                                value={formData.nomineeMobile || selectedRow.nomineeMobile}
                                                onChange={handleInputChange}
                                                name="nomineeMobile"

                                            />
                                        </div>
                                        <div className="form-group  col-md-3">
                                            <label className="label">NOMINEE RELATION :</label>
                                            <input
                                                id="inputState"
                                                className="form-control"
                                                value={formData.nomineeRelation || selectedRow.nomineeRelation}
                                                onChange={handleInputChange}
                                                name="nomineeRelation"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row row d-flex flex-row">
                                        <div className="form-group  col-md-4">
                                            <label className="label">PAYMENT METHOD :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                name="nomineeName"
                                                value={formData.selectedPaymentMethod || selectedRow.selectedPaymentMethod}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group  col-md-4">
                                            <label className="label">TRANSACTION ID:</label>
                                            <input
                                                className="form-control"
                                                placeholder="Transaction Id"
                                                // value={formData.transactionId || selectedRow.transactionId || ''}
                                                value={formData.transactionId ? formData.transactionId : (selectedRow.transactionId || selectedRow.cashTransactionId)}
                                                onChange={handleInputChange}
                                                name="transactionId"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group  col-md-3">
                                            <label className="label">TRANSACTION TIME:</label>
                                            <input
                                                id="inputState"
                                                className="form-control"
                                                placeholder='Time'
                                                value={formData.transactionTime || selectedRow.transactionTime}
                                                onChange={handleInputChange}
                                                name="nomineeRelation"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row d-flex flex-row">
                                        <div className="form-group  col-md-3">
                                            <label className="label">User Name:</label>
                                            <input
                                                id="inputState"
                                                className="form-control"
                                                placeholder='Time'
                                                value={formData.userName || selectedRow.userName}
                                                onChange={handleInputChange}
                                                name="nomineeRelation"
                                            />
                                        </div>
                                        <div className="form-group pl-3 col-md-4">
                                            <label className="label">Receipt Number:</label>
                                            <input
                                                className="form-control"
                                                value={formData.receiptNumber || selectedRow.receiptNumber}
                                                onChange={handleInputChange}
                                                name="subCaste"
                                            />
                                        </div>
                                    </div>


                                </div>
                                <form className="mt-4">
                                    {/* Aadhar section */}
                                    <div className="row px-2">
                                        <label htmlFor="aadhaar">
                                            AADHAAR CARD NUMBER :
                                            <input className='form-control mt-3' type="text" placeholder="" name="aadharNumber" value={formData.aadharNumber || selectedRow.aadharNumber} onChange={handleInputChange} />
                                        </label>

                                        <div className="col-md-6 mb-4">
                                            <div className="file-input-box border rounded p-3">
                                                <label htmlFor="frontAadhaar" className="form-label">
                                                    Front side of Aadhaar :
                                                </label>

                                                <div className=" card image-preview-box border rounded mt-2">
                                                    <div className='card-body' style={{ width: '100%', height: '200px' }}>

                                                        <img
                                                            alt=""
                                                            style={{ width: '100%', height: '100%' }}
                                                            name="aadharFrontImage"
                                                            src={selectedRow.aadharFrontImage}
                                                        />

                                                    </div>
                                                </div>



                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <div className="file-input-box border rounded p-3">
                                                <label htmlFor="backAadhaar" className="form-label">
                                                    Back side of Aadhaar :
                                                </label>

                                                <div className=" card image-preview-box border rounded mt-2">
                                                    <div className='card-body' style={{ width: '100%', height: '200px' }}>

                                                        <img
                                                            name="aadharBackImage"
                                                            src={selectedRow.aadharBackImage}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%' }}
                                                        />

                                                    </div>
                                                </div>



                                            </div>
                                        </div>
                                    </div>

                                    {/* PAN section */}
                                    <div className='row px-2'>

                                        <label htmlFor="panCard">
                                            PAN CARD NUMBER :
                                            <input className='form-control mt-3' type="text" name='panNumber' value={formData.panNumber || selectedRow.panNumber} onChange={handleInputChange} />
                                        </label>
                                        <div style={{ color: 'red', marginTop: '5px' }}>
                                        </div>

                                        <div className="col-md-6 mb-4">
                                            <div className="file-input-box border rounded p-3">
                                                <label htmlFor="panCard" className="form-label">
                                                    Pan card image :
                                                </label>

                                                <div className=" card image-preview-box border rounded mt-2">
                                                    <div className='card-body' style={{ width: '100%', height: '200px' }}>

                                                        <img
                                                            name="panImage"
                                                            src={selectedRow.panImage}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%' }}
                                                        />

                                                    </div>
                                                </div>



                                            </div>
                                        </div>
                                    </div>

                                    {/* signature section */}
                                    <div className='row px-2'>
                                        <label htmlFor="signature">
                                            SIGNATURE :
                                        </label>
                                        <div className="col-md-6 mt-3 mb-4">
                                            <div className="file-input-box border rounded p-3">
                                                <label htmlFor="signature" className="form-label">
                                                    Signature image :
                                                </label>
                                                <div className=" card image-preview-box border rounded mt-2">
                                                    <div className='card-body' style={{ width: '100%', height: '200px' }}>

                                                        <img
                                                            name="signatureImage"
                                                            src={selectedRow.signatureImage}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%' }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default Memberlist



// fetch(`http://localhost:2000/api/membership`)
// useEffect(() => {
//     fetch(`http://localhost:2000/api/membership`)
//         .then((response) => response.json())
//         .then((data) => {
//             if (Array.isArray(data)) {
//                 const matchingMemberships = [];
//                 const branchCodes = data.map(item => {
//                     if (item.membershipId) {
//                         const branchCode = item.membershipId.substring(5, 8);
//                         if (branchCode === user.branchDetails?.branchCode) {
//                             matchingMemberships.push(item);
//                         }
//                         return branchCode;
//                     }
//                     return undefined;
//                 });
//                 setMemberships(matchingMemberships);
//                 setLoading(false);
//             } else {
//                 console.error('Error: Response data is not an array');
//             }
//         })
//         .catch((error) => console.error('Error fetching data:', error));
// }, []);

// const fetchMemberships = (pageNumber) => {
//   setLoading(true);
//   fetch(`http://localhost:2000/api/membership?branchCode=${user.branchDetails?.branchCode}&page=${pageNumber}`)
//     .then((response) => response.json())
//     .then((data) => {
//       setMemberships(data);
//       setLoading(false);
//     })
//     .catch((error) => console.error('Error fetching data:', error));
// };

// useEffect(() => {
//   fetchMemberships(page);
// }, [page]);

// const handleNextPage = () => {
//   setPage(page + 1);
// };

// const handlePreviousPage = () => {
//   if (page > 1) {
//     setPage(page - 1);
//   }
// };




// Function to handle next page
// const handleNextPage = () => {
//     if (hasNextPage()) {
//         setCurrentPage(currentPage + 1);
//     }
// };

// Function to determine if there are previous pages to display
// const hasPreviousPage = () => {
//     return currentPage > 1;
// };

// Function to handle previous page
// const handlePreviousPage = () => {
//     if (hasPreviousPage()) {
//         setCurrentPage(currentPage - 1);
//     }
// };


  {/* <center>
                    <Table striped bordered hover id='print-content'>
                        <thead>
                            <tr>
                                <th>Sl NO</th>
                                <th>CUSTOMER NAME</th>
                                <th>MEMBERSHIP TYPE</th>
                                <th>MEMBERSHIP JOIN DATE</th>
                                <th>ADDRESS</th>
                                <th>PHONE NUMBER</th>
                                <th>REFERENCE NAME</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                (searchTerm === '' ? memberships : filteredMemberships)
                                
                                .sort((a, b) => {
                                    const dateA = new Date(
                                        a.date.split(/[\/-]/).reverse().join('-') // Convert "dd/mm/yyyy" or "dd-mm-yyyy" to "yyyy-mm-dd"
                                    );
                                    const dateB = new Date(
                                        b.date.split(/[\/-]/).reverse().join('-')
                                    );
                                    return dateB - dateA; // Sort by date in descending order
                                })
                                    .slice((currentPage - 1) * rowsToShow, currentPage * rowsToShow)
                                    
                                    .map((membership,index) => (
                                        <tr key={membership._id} onClick={() => handleRowClick(membership)} className={selectedRow === membership ? 'selected-row' : ''}>
                                            <td>{getSLNo(index)}</td>
                                            <td>{membership.customerName}</td>
                                            <td>{membership.membershipId}</td>
                                            <td>{membership.date}</td>
                                            <td>{membership.address}</td>
                                            <td>{membership.customerMobile}</td>
                                            <td>{membership.referenceName}</td>
                                        </tr>
                                    ))
                            }

                        </tbody>
                    </Table>
                    <div>
                    <Button onClick={handlePreviousPage} disabled={!hasPreviousPage()}>Back</Button>
                    <span><b>Go to:</b> <input type="number" value={pageInput} onChange={handlePageInputChange} style={{ width: "4rem", textAlign: "center" }} ></input><b>Page:</b> {currentPage} of {totalPages()}</span>
                    <Button onClick={handleNextPage}  disabled={!hasNextPage()}>Next</Button>
                    
                    </div>

                </center> */}