import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import "../style/BranchCreation.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import {Link} from 'react-router-dom'
// import branchData from "../Datafiles/Branch.json";
import axios from 'axios';
import NavbarSection from '../User/OtherUser/EmpNavBar';
import logo  from '../style/logo.png'
function BranchCreation() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState({});

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

    const handleBranchChange = (event) => {
        const selectedBranch = branches.find(
            (branches) => branches.branchName=== event.target.value
        );
        setSelectedBranch(selectedBranch);
        console.log(selectedBranch);
    };

    // server side code

    const [formData, setFormData] = useState({
        designation: '',
        
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const clearForm = () => {
        setFormData({
          designation: '',
          
        });
      };
    
      const saveData = async () => {
        try {
          const response = await axios.post('https://api.malabarbank.in/designation', formData);
          console.log(response.data.message);
          console.log(formData);
          alert("Successfully Added New Designation")
          clearForm(); // Clear form after successful save
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };
      
          // branch name fetching

    useEffect(() => {
        // Fetch branches from your server
        fetch("https://api.malabarbank.in/api/branches")
            .then((response) => response.json())
            .then((data) => setBranches(data))
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);

  return (
    <div className="container-fluid px-0">
    <nav className="navbar navbar-light ">
        <div className="container-fluid">
                <Link className="navbar-brand ms-5 d-flex align-items-center" to="/adminMain">
                    <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top"/>
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
                        <li className="me-2">Branch</li>
                        <li className="me-2">Branch Code</li>
                        <li>Date</li>
                    </ul>
                    <ul className="list-unstyled mb-1 me-5">
                        <li className="me-2">: Admin</li>
                        <select onChange={handleBranchChange}>
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch.branch_name}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>
                                <li className="me-2">: {selectedBranch.branchCode}</li>
                        <li className="me-2">:{currentDate.toLocaleString()}</li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <div className="marquee  px-5 m-2">
        <marquee className="text-white" behavior="scroll" direction="left">
            New Updates : Welcome to Malabar Bank....Have a nice day....
        </marquee>
    </div>
    <NavbarSection/>
    <div className="branchBox container">
        <form  className="container flex-column ">
            <div className="form-group colorc branchhead d-grid justify-content-center">
                <div className="text-white fs-4 m-2">
                    <label>Add New Designation </label>
                </div>
            </div>
            <div className="form-group d-flex flex-row ">
                <div className="col d-flex ">
                    <div className="labels"><label>Designation :</label></div>
                    <div className="labels d-grid "><input type="text" name="designation" value={formData.designation} onChange={handleChange} /></div>
                </div>
            </div>
            <div className="form-group d-grid justify-content-center">
                <div className="d-flex flex-row">
                    <div type="button" className="btns  d-grid justify-content-center" onClick={clearForm}>Clear</div>
                    <div type="button" className="btns  d-grid justify-content-center" onClick={saveData}>Save</div>
                    <Link to="/adminMain"><div type="button " className="btns d-grid justify-content-center">Close</div></Link>
                </div>
            </div>
        </form>
    </div>

   
</div>
  )
}

export default BranchCreation
