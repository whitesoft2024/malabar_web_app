import React, { useState } from 'react'
import { Link } from 'react-router-dom';
// import "../style/RdScheme.css"
import { Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
const RDSchemeCreation = () => {
    const [rdScheme, setRdScheme] = useState({
        schemeType: "",
        durationYear: "",
        durationMonth: "",
        interest: "",
        interestBefore: "",
        interestAfter: "",
        commissionPercentageBefore: "",
        commissionPercentageAfter: "",
        amount:'',
        finalAmount: '', // Added state for final amount
    })

        // Define the initial state for form fields
        const initialRdSchemeState = {
            schemeType: "",
            durationYear: "",
            durationMonth: "",
            interest: "",
            interestBefore: "",
            interestAfter: "",
            commissionPercentageBefore: "",
            commissionPercentageAfter: "",
            amount: '',
            finalAmount: '', // Added state for final amount
        };
    

    const handleChange = (e) => {
        
        console.log('handleChange called', e); // Add this line
        const { name, value } = e.target;
    
        // Check if the value is less than zero, if so, set it to zero
        const sanitizedValue = value < 0 ? 0 : value;
    
        setRdScheme({
            ...rdScheme,
            [name]: sanitizedValue
        });

        ///new calculation
          // Calculate final amount if necessary fields are updated
          if (name === 'amount' || name === 'durationMonth' || name === 'interest') {
            // calculateFinalAmount();
            calculateFinalAmount({
                ...rdScheme,
                [name]: sanitizedValue
            });
        }
    }

//new calc
    // const calculateFinalAmount = () => {
    //     const { amount, durationMonth, interest } = rdScheme;
    //     const maturityAmount = (parseFloat(amount) * parseFloat(interest) * parseFloat(durationMonth) / 100).toFixed(2);
    //     setRdScheme({...rdScheme, finalAmount: maturityAmount });
    // };
    // const calculateFinalAmount = (updatedScheme) => {
    //     const { amount, durationMonth, interest } = updatedScheme;
    //     if (amount && durationMonth && interest) {
    //         const principal = parseFloat(amount);
    //         const rate = parseFloat(interest) / 100 / 12; // Monthly interest rate
    //         const time = parseFloat(durationMonth);

    //         const maturityAmount = principal * ((Math.pow(1 + rate, time) - 1) / rate) * (1 + rate);
    //         setRdScheme(prevState => ({
    //             ...prevState,
    //             finalAmount: maturityAmount.toFixed(2)
    //         }));
    //     }
    // };
//     const calculateFinalAmount = (updatedScheme) => {
//     const { amount, durationMonth, interest } = updatedScheme;
//     if (amount && durationMonth && interest) {
//         const P = parseFloat(amount); // Monthly installment
//         const r = parseFloat(interest) / 100; // Annual interest rate
//         const t = parseFloat(durationMonth) / 12; // Duration in years

//         // Calculate the number of complete quarters in the duration
//         const numberOfCompleteQuarters = Math.floor(t * 4);

//         // Calculate the remaining months after accounting for complete quarters
//         const remainingMonths = (t * 12) % 12;

//         // Calculate the effective interest rate per compounding period
//         const rPerCompoundingPeriod = r / 4; // Assuming quarterly compounding

//         // Calculate the total amount after compounding quarterly for complete quarters
//         const totalAfterCompoundingForQuarters = P * Math.pow(1 + rPerCompoundingPeriod, numberOfCompleteQuarters);

//         // Calculate the total amount after compounding for the remaining months
//         const totalAfterCompoundingForRemainingMonths = P * remainingMonths * (1 + r / 12);

//         // Combine the totals to get the final maturity amount
//         const maturityAmount = totalAfterCompoundingForQuarters + totalAfterCompoundingForRemainingMonths;

//         setRdScheme(prevState => ({
//          ...prevState,
//             finalAmount: maturityAmount.toFixed(2)
//         }));
//     }
// };

const calculateFinalAmount = (updatedScheme) => {
    const { amount, durationMonth, interest } = updatedScheme;
    if (amount && durationMonth && interest) {
        const P = parseFloat(amount); // Monthly installment
        const r = parseFloat(interest) / 100; // Annual interest rate
        const t = parseFloat(durationMonth) / 12; // Duration in years

        // Variables to keep track of total contributions and interest
        let totalContributions = 0;
        let totalInterestAccrued = 0;

        // Loop through each month of the duration
        for (let month = 0; month < t * 12; month++) {
            // Calculate the monthly contribution
            const monthlyContribution = P;

            // Accumulate the total contributions
            totalContributions += monthlyContribution;

            // Calculate the interest for this month
            const interestForMonth = totalContributions * r / 12;

            // Accumulate the total interest
            totalInterestAccrued += interestForMonth;

            // Check if this is the end of a quarter
            if ((month + 1) % 3 === 0) {
                // At the end of a quarter, compound the interest
                totalContributions += totalInterestAccrued;
                totalInterestAccrued = 0; // Reset interest for the next quarter
            }
        }

        // Calculate the final maturity amount
        const maturityAmount = totalContributions + totalInterestAccrued;

        setRdScheme(prevState => ({
           ...prevState,
            finalAmount: maturityAmount.toFixed(2)
        }));
    }
};


    
    
    const [showScheme, setShowScheme] = useState(false)

    const handleViewScheme = () => {
        setShowScheme(true)
    }

    const handleCloseModal = () => {
        setShowScheme(false)
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(rdScheme)
        console.log(Object.values(rdScheme))

        try {
            const response= await axios.post("https://api.malabarbank.in/api/auth/rdscheme",rdScheme)
            console.log("data saved",response.data);
             alert(response.data.message)
             // Clear the form after successful submission
            setRdScheme(initialRdSchemeState);
        } catch (error) {
            console.error("error saving data",error)
        }

    }

      // Function to clear the form
      const handleClear = () => {
        setRdScheme(initialRdSchemeState);
    };


    return (
        <div>
        <div className='container border rounded mt-4'>
            <div className="Member form">
                <div className="card mt-0">
                    <div className=" justify-content-center">
                        <div className="card-header text-light">
                            <h4>RECCURING DEPOSIT SCHEME</h4>
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
                                                value={rdScheme.schemeType}
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
                                                id="interestBefore"
                                                name="interestBefore"
                                                value={rdScheme.interestBefore}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageBefore">Commision Before 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="commissionPercentageBefore"
                                                name="commissionPercentageBefore"
                                                value={rdScheme.commissionPercentageBefore}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageAfter">EMI Amount :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="amount"
                                                name="amount"
                                                value={rdScheme.amount}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
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
                                                value={rdScheme.interest}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="durationMonth">Duration In Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="durationMonth"
                                                name="durationMonth"
                                                value={rdScheme.durationMonth}
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
                                                id="interestAfter"
                                                name="interestAfter"
                                                value={rdScheme.interestAfter}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="commissionPercentageAfter">Commision After 6 Month :</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="commissionPercentageAfter"
                                                name="commissionPercentageAfter"
                                                value={rdScheme.commissionPercentageAfter}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                        <label htmlFor="finalAmount">Maturity Amount:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="finalAmount"
                                            name="finalAmount"
                                            value={rdScheme.finalAmount}
                                            readOnly // Make it read-only since it's calculated
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                        
                                    </div>
                                </div>
                                <div className="form-group d-grid justify-content-center mt-3">
                                    <div className="d-flex flex-row">
                                        <button type="button" className="btn btn-secondary mr-2" onClick={handleViewScheme}>View</button>
                                        {/* <button type="submit" className="btn btn-primary mr-2" >Create New</button> */}
                                        <button className="btn btn-primary mr-2"  onClick={(e)=>handleSubmit(e)}>Create New</button>
                                        <button type="button" className="btn btn-warning mr-2" onClick={handleClear}>Clear</button>
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

export default RDSchemeCreation