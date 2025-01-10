import React, { useState, useEffect ,useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import {UserContext} from './UserContext';
import { Link } from "react-router-dom";
import logo from '../style/logo.png'

function Nav() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user,setUser } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);
    
// Logout function
const handleLogout = () => {
    // Clear user data from local storage and reset user state
    localStorage.removeItem('user');
    setUser(null);
    // Redirect to login page or any other page as needed
    window.location = (`/`);
};
  return (

    <div>
      <nav className="navbar navbar-light ">
                <div className="container">
                    <Link className="navbar-brand d-flex justify-content-between" to='/main'>
                        <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top"/>
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
    </div>
  )
}

export default Nav
