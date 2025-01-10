import axios from 'axios'
import React, { useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const GDCSSchemeCreation = () => {
    


  const [gdcsScheme, setgdcsScheme] = useState({
    // schemeType: "",
    // durationYear: "",
    // durationMonth: "",
    // interest: "",
    // interestCutBefore: "",
    // interestCutAfter: "",
    // commissionPercentageBefore: "",
    // commissionPercentageAfter: ""


    schemeName:"",
    schemeAmount:"",
    numberofMember:"",
    duration:"",
    emi:"",
    companyComisionPercentage:"",
    priceMoney:"",
    auctionSlabPercent:""
})

// const handleChange = (e) => {
//     const { name, value } = e.target
//     setgdcsScheme({
//       ...gdcsScheme,
//       [name]: value
//   })
//     console.log(e.target.value)
//     // if(name==="schemeType"){
//     //   setgdcsScheme({
//     //     ...gdcsScheme,
//     //     [name]: value
//     // })
//     // }
//     // else{
//     //   setgdcsScheme({
//     //     ...gdcsScheme,
//     //     [name]: Number(value)
//     // })
//     // }
   
// }
const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the value is less than zero, if so, set it to zero
    const sanitizedValue = value < 0 ? 0 : value;

    setgdcsScheme({
        ...gdcsScheme,
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
  console.log(gdcsScheme)
  console.log(Object.values(gdcsScheme))  
  //This line logs the values of the gdcsScheme object to the console. It extracts the values of all properties in the gdcsScheme object and logs them as an array.
  if (Object.values(gdcsScheme).every(field => field !== "")) {
    //This line checks if all values in the gdcsScheme object are not empty strings. It uses the every array method to iterate over all values and returns true only if all values are not empty strings.
     try {
       const response = await axios.post("https://api.malabarbank.in/gdcs/auth", gdcsScheme);
       //This line sends a POST request to the specified URL (https://api.malabarbank.in/fds/auth/gdcsScheme) using the Axios library. It sends the gdcsScheme object as the request body.
       console.log("Data saved:", response.data);
       alert(response.data.message)
       // Clear form fields after successful submission
       setgdcsScheme({
        //  schemeType: "",
        //  durationYear: "",
        //  durationMonth: "",
        //  interest: "",
        //  interestCutBefore: "",
        //  interestCutAfter: "",
        //  commissionPercentageBefore: "",
        //  commissionPercentageAfter: ""
        schemeName:"",
        schemeAmount:"",
        numberofMember:"",
        duration:"",
        emi:"",
        companyComisionPercentage:"",
        priceMoney:"",
        auctionSlabPercent:""
       });
       //setgdcsScheme({ ... });: After successful submission, this line resets the gdcsScheme object to its initial state, clearing all form fields.
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
        <div className='container rounded mt-4'>
            <div className="Member form">
                <div className="card mt-0">
                    <div className=" justify-content-center">
                        <div className="card-header text-light">
                            <h4>GDCS SCHEME CREATION</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit="">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="schemeName">Scheme Name :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="schemeName"
                                                name="schemeName"
                                                value={gdcsScheme.schemeName}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="durationYear">Number of Members :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="numberofMember"
                                                name="numberofMember"
                                                value={gdcsScheme.numberofMember===0?"":gdcsScheme.numberofMember}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="emi">EMI :</label>
                                            <input
                                                type="emi"
                                                className="form-control"
                                                id="emi"
                                                name="emi"
                                                value={gdcsScheme.emi}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="priceMoney">Price Money :</label>
                                        
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="priceMoney"
                                                name="priceMoney"
                                                value={gdcsScheme.priceMoney}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="interest">Scheme Amount :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="schemeAmount"
                                                name="schemeAmount"
                                                value={gdcsScheme.schemeAmount}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="duration">Duration :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="duration"
                                                name="duration"
                                                value={gdcsScheme.duration}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="interestCutAfter">Company  Commision Percentage :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="companyComisionPercentage"
                                                name="companyComisionPercentage"
                                                value={gdcsScheme.companyComisionPercentage}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageAfter">Auction slab Percentage :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="auctionSlabPercent"
                                                name="auctionSlabPercent"
                                                value={gdcsScheme.auctionSlabPercent}
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

export default GDCSSchemeCreation