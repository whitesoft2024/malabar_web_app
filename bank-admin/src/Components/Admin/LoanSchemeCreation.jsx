import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import { Link } from 'react-router-dom';

const LoanSchemeCreation = () => {
  const [loanScheme, setLoanScheme] = useState({
    schemeName: "",
    requestedLoanAmount: '',
    tenure: '',
    interestPercentage: '',
    recoveryMode: '',
    totalLoanAmount: '',
    processingFee: '',
    documentationCharge: '',
    interestHolding: '',
    balanceDisburse: '',
    emi: ''
  });

  const [loanSchemes, setLoanSchemes] = useState([]);
  const [showScheme, setShowScheme] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanScheme({
      ...loanScheme,
      [name]: value < 0 ? 0 : value // Ensure non-negative values
    });
  };




  const validateValue = (value) => {
    return Math.min(Math.max(value, 0), 100); // Clamp value between 0 and 100
  };
  
  const updateLoanScheme = (name, value) => {
    setLoanScheme({
     ...loanScheme,
      [name]: value,
    });
  };
  
  const handleIntrestChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateValue(Number(value));
    updateLoanScheme(name, validatedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(loanScheme).every(field => field !== "")) {
      try {
        const response = await axios.post("https://api.malabarbank.in/api/loanScheme", loanScheme);
        alert(response.data.message);
        setLoanScheme({
          schemeName: "",
          requestedLoanAmount: '',
          tenure: '',
          interestPercentage: '',
          recoveryMode: '',
          totalLoanAmount: '',
          processingFee: '',
          documentationCharge: '',
          interestHolding: '',
          balanceDisburse: 0,
          emi: ''
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleViewScheme = async () => {
    try {
      const response = await axios.get("https://api.malabarbank.in/api/loanScheme");
      setLoanSchemes(response.data);
      setShowScheme(true);
    } catch (error) {
      console.error("Error fetching loan schemes:", error);
    }
  };

  const handleCloseModal = () => {
    setShowScheme(false);
  };
//total loan amount calculation
  const calculateTotalLoanAmount = () => {
    const { requestedLoanAmount, interestPercentage } = loanScheme;
    return (parseFloat(requestedLoanAmount) * (parseFloat(interestPercentage)/100)+parseFloat(requestedLoanAmount)) ;
  };
// balance disburse calculation
  const calculateBalanceDisburse = () => {
    const { requestedLoanAmount, processingFee, documentationCharge,interestHolding } = loanScheme;
    return (parseFloat(requestedLoanAmount) - parseFloat(interestHolding)- parseFloat(processingFee) - parseFloat(documentationCharge) ) ;
  };
  //calculate emi
  const calculateEmi=()=>{
    const{totalLoanAmount,tenure,interestHolding}=loanScheme;
    return (parseFloat(totalLoanAmount-interestHolding)/parseFloat(tenure))
  }

  useEffect(() => {
    const newTotalLoanAmount = calculateTotalLoanAmount();
    const newBalanceDisburse = calculateBalanceDisburse();
    const newEmi=calculateEmi();

    setLoanScheme(prevState => ({
      ...prevState,
      totalLoanAmount: newTotalLoanAmount,
      balanceDisburse: newBalanceDisburse,
      emi:newEmi

    }));
  }, [loanScheme.requestedLoanAmount, loanScheme.interestPercentage, loanScheme.processingFee, loanScheme.documentationCharge, loanScheme.interestHolding,loanScheme.totalLoanAmount]);

  return (
    <div>
      <div className='container border rounded mt-4'>
        <div className="Member form">
          <div className="card mt-0">
            <div className=" justify-content-center">
              <div className="card-header text-light">
                <h4>LOAN SCHEME</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="schemeName">Scheme Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="schemeName"
                          name="schemeName"
                          value={loanScheme.schemeName}
                          onChange={handleChange}
                          placeholder="Enter the Scheme Name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="requestedLoanAmount">Requested Loan Amount:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="requestedLoanAmount"
                          name="requestedLoanAmount"
                          value={loanScheme.requestedLoanAmount === 0 ? "" : loanScheme.requestedLoanAmount}
                          onChange={handleChange}
                          placeholder="Enter the Requested Loan Amount"
                          required
                        />
                      </div>

    

                      <div className="form-group">
                        <label htmlFor="tenure">Tenure:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="tenure"
                          name="tenure"
                          value={loanScheme.tenure}
                          onChange={handleChange}
                          placeholder="Enter the Tenure"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="processingFee">Processing Fee:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="processingFee"
                          name="processingFee"
                          value={loanScheme.processingFee}
                          onChange={handleChange}
                          placeholder="Enter the Processing Fee"
                        />
                      </div>

                      
                      <div className="form-group">
                        <label htmlFor="documentationCharge">Documentation Charge:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="documentationCharge"
                          name="documentationCharge"
                          value={loanScheme.documentationCharge}
                          onChange={handleChange}
                          placeholder="Enter the Documentation Charge"
                        />
                      </div>
     
                    </div>
                    <div className="col-6">
                    <div className="form-group">
                        <label htmlFor="recoveryMode">Recovery Mode:</label>
                           <select
                             className="form-control"
                             id="recoveryMode"
                             name="recoveryMode"
                             value={loanScheme.recoveryMode}
                              onChange={handleChange}
    >
                        <option value="other">---choose the option---</option>
                        <option value="daily">Daily</option>
                        <option value="daily">Monthly</option>


                          </select>
                        </div>

                      <div className="form-group">
                        <label htmlFor="interestPercentage">Interest Percentage:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="interestPercentage"
                          name="interestPercentage"
                          value={loanScheme.interestPercentage}
                          onChange={handleIntrestChange}
                          placeholder="Enter the Interest Percentage"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="totalLoanAmount">Total Loan Amount:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="totalLoanAmount"
                          name="totalLoanAmount"
                          value={loanScheme.totalLoanAmount}
                          onChange={handleChange}
                          placeholder=""
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="interestHolding">Interest Holding:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="interestHolding"
                          name="interestHolding"
                          value={loanScheme.interestHolding}
                          onChange={handleChange}
                          placeholder="Enter the Interest Holding"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="balanceDisburse">Balance Disburse:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="balanceDisburse"
                          name="balanceDisburse"
                          value={loanScheme.balanceDisburse}
                          onChange={handleChange}
                          placeholder="Enter the Balance Disburse"
                        />
                      </div>
   
                      <div className="form-group">
                        <label htmlFor="emi">EMI:</label>
                        <input
                          type="number"
                          className="form-control"
                          id="emi"
                          name="emi"
                          value={loanScheme.emi}
                          onChange={handleChange}
                          placeholder=""
                        />
                      </div>

                    </div>

                  </div>
                  <div className="form-group d-grid justify-content-center mt-3">
                    <div className="d-flex flex-row">
                      <button type="button" className="btn btn-secondary mr-2" onClick={handleViewScheme}>View</button>
                      <button type="submit" className="btn btn-primary mr-2">Create New</button>
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
                          <th>SCHEME NAME</th>
                          <th>LOAN AMOUNT</th>
                          <th>DURATION</th>
                          <th>INTEREST PERCENTAGE</th>
                          <th>TOTAL LOAN AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanSchemes.map((scheme, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{scheme.schemeName}</td>
                            <td>{scheme.requestedLoanAmount}</td>
                            <td>{scheme.tenure}</td>
                            <td>{scheme.interestPercentage}</td>
                            <td>{scheme.totalLoanAmount}</td>
                          </tr>
                        ))}
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
  );
};

export default LoanSchemeCreation;
