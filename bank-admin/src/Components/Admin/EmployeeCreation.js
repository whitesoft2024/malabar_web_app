import React from 'react'
import { Table, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Others/UserContext';
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import logo  from '../style/logo.png'

function EmployeeCreation() {

    const [selectedRow, setSelectedRow] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [document1, setDocument1Image] = useState(null);
    const [document2, setDocument2Image] = useState(null);
    const [document3, setDocument3Image] = useState(null);
    const [signatureImage, setSignatureImage] = useState(null);
    const [designationData, setDesignationData] = useState([]);
    const [branches, setBranches] = useState([]);
    // console.log(employee);

    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleEditClick = () => {
        if (selectedRow) {
            setFormData(selectedRow);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const handleCreateNewClick = () => {
        setShowModal(true); // Set showModal state to true to display the modal
    };
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const [formData, setFormData] = useState({
        employeeName: '',
        employeeAddress: '',
        branch_name: '',
        branchCode: '',
        designation: '',
        joinDate: '',
        mobile: '',
        alternativeMobile: '',
        employeeId: '',
        
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setFormData({
        //     ...formData,
        //     [name]: value
        // });
        if (name === "branch_name") {
            // Find the selected branch from the branches array
            const selectedBranch = branches.find(branch => branch.branch_name === value);
            // Update branch code in the signUpData state
            const generatedID = generateID(selectedBranch.branchCode); // Generate ID based on branch code
            setFormData(prevData => ({
                ...prevData,
                branch_name: value,
                branchCode: selectedBranch ? selectedBranch.branchCode : '',
                employeeId: generatedID // Include branch code in employeeId
            }));
        } else {
            // For other inputs, update as usual
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    //generate EmployeeId

    function generateID(branchCode) {
        // Retrieve the last used number for the branch code from local storage
        let lastNumber = localStorage.getItem(`lastNumber_${branchCode}`);
        if (!lastNumber) {
            // Initialize the last used number if it doesn't exist
            lastNumber = 100;
            localStorage.setItem(`lastNumber_${branchCode}`, lastNumber);
        } else {
            // Increment the last used number for the branch code
            lastNumber = parseInt(lastNumber) + 1;
            localStorage.setItem(`lastNumber_${branchCode}`, lastNumber);
        }
    
        // Generate the ID with the format "EMP" + branchCode + last three digits
        return `EMP${branchCode}${lastNumber.toString().padStart(3, '0')}`;
    }


    useEffect(() => {
        // Fetch branches from your server
        fetch("https://api.malabarbank.in/designation")
            .then((response) => response.json())
            .then((data) => setDesignationData(data))
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);

    useEffect(() => {
        // Fetch branches from your server
        fetch("https://api.malabarbank.in/api/branches")
            .then((response) => response.json())
            .then((data) => setBranches(data))
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);

    // set image
    const TARGET_PIXELS = 1.5 * 1000 * 1000;
    const handleImageChange = (event, setImageState) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate the scale factor to maintain aspect ratio while fitting within the target pixel count
                    const scaleFactor = Math.min(1, Math.sqrt(TARGET_PIXELS / (img.width * img.height)));
                    canvas.width = img.width * scaleFactor;
                    canvas.height = img.height * scaleFactor;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert the canvas content to base64 and set as state
                    setImageState(canvas.toDataURL('image/jpeg'));
                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDocument1Change = (event) => {
        handleImageChange(event, setDocument1Image);
    };
    const handleDocument2Change = (event) => {
        handleImageChange(event, setDocument2Image);
    };
    const handleDocument3Change = (event) => {
        handleImageChange(event, setDocument3Image);
    };
    const handleSignatureChange = (event) => {
        handleImageChange(event, setSignatureImage);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://api.malabarbank.in/auth/api/empoyeeCreate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    document1,
                    document2,
                    document3,
                    signatureImage,
                }),
            });
            console.log(formData);
            if (response.ok) {
                console.log("Form data sent successfully");
                console.log(formData);
                alert("Successful")
                window.location.href = "/employeeCreate";
            } else {
                console.error(
                    "Failed to send form data. Server returned:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
          const response = await fetch('https://api.malabarbank.in/api/employee'); 
          const data = await response.json();
          setEmployees(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };

    return (
        <div className='container'>
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
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">User</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: Admin</li>
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
                <h2>EMPLOYEE LIST</h2>
            </center>
            <div className="App">
                <div className="circle-buttons-container">
                    <div className="circle-button" onClick={handleCreateNewClick}><FontAwesomeIcon icon={faPlus} /></div>
                    <div className="circle-button"><FontAwesomeIcon icon={faEdit} onClick={handleEditClick} /></div>
                    <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>
                </div>
            </div>
            <center>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Si_no</th>
                            <th>EMPLOYEE NAME</th>
                            <th>EMPLOYEE ID</th>
                            <th>EMPLOYEE JOIN DATE</th>
                            <th>BRANCH CODE</th>
                            <th>PHONE NUMBER</th>
                            <th>DESIGNATION</th>
                        </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee, index) => (
                        <tr key={employee.id}>
                            <td>{employee.si_no}</td>
                            <td>{employee.employeeName}</td>
                            <td>{employee.employeeId}</td>
                            <td>{employee.joinDate}</td>
                            <td>{employee.branchCode}</td>
                            <td>{employee.mobile}</td>
                            <td>{employee.designation}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

            </center>
            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal-width">
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Employee Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="Employee form">
                            <div>
                                <div className="form-row d-flex flex-row">
                                    <div className="form-group col-md-4">
                                        <label className="label">Employee Name:</label>
                                        <input
                                            id="inputState"
                                            className="form-control"
                                            name="employeeName"
                                            // value={selectedRow.membershipType}
                                            value={formData.employeeName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="label">Address :</label>
                                        <input
                                            name="employeeAddress"
                                            className="form-control"
                                            // style={{ width: "70%" }}
                                            // value={selectedRow.membershipId}
                                            value={formData.employeeAddress}
                                            onChange={handleInputChange}

                                        />
                                    </div>
                                </div>
                                <div className="form-row d-flex flex-row ">
                                    <div className="form-group col-md-4">
                                        <label className="label">Branch Name :</label>
                                        <select
                                            className="form-select "
                                            id="branch_name"
                                            name="branch_name"
                                            value={formData.branch_name}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Branch</option>
                                            {branches.map((branch) => (
                                                <option key={branch._id} value={branch.branch_name}>
                                                    {branch.branch_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group pl-3 col-md-4">
                                        <label className="label">Branch Code</label>
                                        <input
                                            className="form-control "
                                            id="branchCode"
                                            name="branchCode"
                                            value={formData.branchCode}
                                            onChange={handleInputChange}
                                            readOnly
                                        >{branches.branchCode}
                                        </input>
                                    </div>
                                </div>
                                <div className="form-row d-flex flex-row">
                                    <div className="form-group col-md-4">
                                        {/* <label className="label">Designation :</label>
                                            <input
                                                name="guardianName"
                                                value={formData.designation}
                                                onChange={handleInputChange}
                                                type="text"
                                                className="form-control"
                                                id="inputAddress"
                                                placeholder=""
                                            /> */}
                                        <label className="label">Designation :</label>
                                        <select
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        >
                                            <option value="">Select Designation</option>
                                            {designationData.map((designationObj, index) => (
                                                <option key={index} value={designationObj.designation}>{designationObj.designation}</option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="form-group pl-3 col-md-4">
                                        <label className="label">Join Date :</label>
                                        <input
                                            name="joinDate"
                                            id="inputState"
                                            className="form-control"
                                            value={formData.joinDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row d-flex flex-row">
                                    <div className="form-group col-md-4">
                                        <label className="label">Mobile Number :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group pl-3 col-md-4">
                                        <label className="label">Alternate Mobile :</label>
                                        <input
                                            className="form-control"
                                            id="alternativeMobile"
                                            name="alternativeMobile"
                                            value={formData.alternativeMobile}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row d-grid flex-row">
                                    <div className="form-group col-md-4">
                                        <label className="label">Employee Id :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            <div className="form-row row">
                                <div className='col p-3'>
                                    <label htmlFor="document1">
                                        <strong>Document1</strong>
                                    </label>
                                    <div className="col">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="document1" className="form-label">
                                                Document1 image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="document1"
                                                onChange={handleDocument1Change}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {document1 && (
                                                        <img
                                                            src={document1}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!document1 && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {document1 && (
                                                <div id="cancel-btn" onClick={() => setDocument1Image(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='col p-3'>
                                    <label htmlFor="document2">
                                        <strong>Document2</strong>
                                    </label>
                                    <div className="col">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="document2" className="form-label">
                                                Document2 image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="document2"
                                                onChange={handleDocument2Change}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {document2 && (
                                                        <img
                                                            src={document2}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!document2 && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {document2 && (
                                                <div id="cancel-btn" onClick={() => setDocument2Image(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row row">
                                <div className='col p-3'>
                                    <label htmlFor="signature">
                                        <strong>Document3</strong>
                                    </label>
                                    <div className="col">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="document3" className="form-label">
                                                Documente image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="signature"
                                                onChange={handleDocument3Change}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {document3 && (
                                                        <img
                                                            src={document3}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!document3 && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {document3 && (
                                                <div id="cancel-btn" onClick={() => setDocument3Image(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='col p-3'>
                                    <label htmlFor="signature">
                                        <strong>Signature</strong>
                                    </label>
                                    <div className="col">
                                        <div className="file-input-box border rounded p-3">
                                            <label htmlFor="signature" className="form-label">
                                                Signature image :
                                            </label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="signature"
                                                onChange={handleSignatureChange}
                                            />
                                            <div className=" card image-preview-box border rounded mt-2">
                                                <div className='card-body' style={{ width: '100%', height: '200px' }}>
                                                    {signatureImage && (
                                                        <img
                                                            src={signatureImage}
                                                            alt="Pan Card Preview"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    )}
                                                    {!signatureImage && <div className="no-file-chosen-label">img preview</div>}
                                                </div>
                                            </div>
                                            {signatureImage && (
                                                <div id="cancel-btn" onClick={() => setSignatureImage(null)}>
                                                    <i className="fas fa-times"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Save changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default EmployeeCreation
