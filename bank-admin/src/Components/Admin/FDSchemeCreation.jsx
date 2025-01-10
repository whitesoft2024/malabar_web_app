import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTableList, faList } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from '../Others/UserContext';
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const FDSchemeCreation = () => {



  const [fdScheme, setfdScheme] = useState({
    schemeType: "",
    durationYear: 0,
    durationMonth: 0,
    interest: 0,
    interestCutBefore: 0,
    interestCutAfter: 0,
    commissionPercentageBefore: 0,
    commissionPercentageAfter: 0
})

const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the value is less than zero, if so, set it to zero
    const sanitizedValue = value < 0 ? 0 : value;
    setfdScheme({
        ...fdScheme,
        [name]: sanitizedValue
    });
}


const [showScheme, setShowScheme] = useState(false)

const handleViewScheme = () => {
    setShowScheme(true)
}

const handleCloseModal = () => {
    setShowScheme(false)
}

// Example of a form submission handler with validation
const handleSubmit = async (e) => {
  // console.log("hallo gays")
  e.preventDefault();
  // Check if all required fields are filled
  console.log(fdScheme)
  console.log(Object.values(fdScheme))  
  //This line logs the values of the fdScheme object to the console. It extracts the values of all properties in the fdScheme object and logs them as an array.
  if (Object.values(fdScheme).every(field => field !== "")) {
    //This line checks if all values in the fdScheme object are not empty strings. It uses the every array method to iterate over all values and returns true only if all values are not empty strings.
     try {
       const response = await axios.post("https://api.malabarbank.in/fds/auth/fdScheme", fdScheme);
       //This line sends a POST request to the specified URL (https://api.malabarbank.in/fds/auth/fdScheme) using the Axios library. It sends the fdScheme object as the request body.
       console.log("Data saved:", response.data);
       alert(response.data.message)
       // Clear form fields after successful submission
       setfdScheme({
         schemeType: "",
         durationYear: 0,
         durationMonth: 0,
         interest: 0,
         interestCutBefore: 0,
         interestCutAfter: 0,
         commissionPercentageBefore: 0,
         commissionPercentageAfter: 0
       });
       //setfdScheme({ ... });: After successful submission, this line resets the fdScheme object to its initial state, clearing all form fields.
     }
     // This block of code wraps the asynchronous operation of sending a POST request to the server in a try-catch block. It attempts to execute the code inside the try block and catches any errors that may occur during execution
     catch (error) {
       console.error("Error saving data:", error);
     }
  } else {
     alert("Please fill all required fields.");
  }
 };
 


return (
    <div>
        <div className='container border rounded mt-4'>
            <div className="Member form">
                <div className="card mt-0">
                    <div className=" justify-content-center">
                        <div className="card-header text-light">
                            <h4>FIXED DEPOSIT SCHEME</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit="">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="schemeType">Scheme Type :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="schemeType"
                                                name="schemeType"
                                                value={fdScheme.schemeType}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="durationYear">Duration In Year :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="durationYear"
                                                name="durationYear"
                                                value={fdScheme.durationYear===0?"":fdScheme.durationYear}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="interestCutBefore">Interest Cut Before 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="interestCutBefore"
                                                name="interestCutBefore"
                                                value={fdScheme.interestCutBefore}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageBefore">Commision Before 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="commissionPercentageBefore"
                                                name="commissionPercentageBefore"
                                                value={fdScheme.commissionPercentageBefore}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="interest">Interest Percentage :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="interest"
                                                name="interest"
                                                value={fdScheme.interest}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="durationMonth">Duration In Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="durationMonth"
                                                name="durationMonth"
                                                value={fdScheme.durationMonth}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="interestCutAfter">Interest Cut After 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="interestCutAfter"
                                                name="interestCutAfter"
                                                value={fdScheme.interestCutAfter}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageAfter">Commision After 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="commissionPercentageAfter"
                                                name="commissionPercentageAfter"
                                                value={fdScheme.commissionPercentageAfter}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group d-grid justify-content-center mt-3">
                                    <div className="d-flex flex-row">
                                        <button type="button" className="btn btn-secondary mr-2" onClick={handleViewScheme}>View</button>
                                        {/* <button type="submit" className="btn btn-primary mr-2" >Create New</button> */}
                                        <button className="btn btn-primary mr-2"  onClick={(e)=>handleSubmit(e)}>Create New</button>

                                        <Link to="/adminMain" className="btn btn-danger">Close</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Scheme modal section */}
            <Modal show={showScheme} onHide={handleCloseModal} dialogClassName="custom-modal-width2">
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "1800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>SCHEME LIST</h4>
                            </div>
                            <div className='px-2'>
                                <center>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>SL NO</th>
                                                <th>SCHEME TYPE</th>
                                                <th>SCHEME AMOUNT</th>
                                                <th>DURATION</th>
                                                <th>INTEREST PERCENTAGE</th>
                                                <th>INTEREST AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </center>
                            </div>

                            <center>
                                <div className="form-group mt-5">
                                    <Button variant="danger" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </div>
                            </center>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    </div>
)

}

export default FDSchemeCreation