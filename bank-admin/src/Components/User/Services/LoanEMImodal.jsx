import { Button, Modal } from 'react-bootstrap'
import Select from "react-select";
import React, { useRef, useState,useContext, useEffect } from "react";
import { UserContext } from "../../Others/UserContext";
import axios from 'axios';
import LoanEMIHistoryModal from './LoanEMIHistoryModal';

const LoanEMImodal = ({ show, onHide, onNextClick }) => {
  const [branchCode, setBranchCode] = useState('');
  const[loanNumbers,setLoanNumbers]=useState([''])
  const [query, setQuery] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedLoanNumber, setSelectedLoanNumber] = useState('');
  const[emi,setEmi]=useState('')
  const[loan,setLoan]=useState([])
  const [selectedDate, setSelectedDate] = useState('');
  
  const [formData, setFormData] = useState({
    customerMobile:'',
    customerName:'',
    LOANtype:'',
    duration:'',
    emi:'',
    amount:'',
    loanNumber:'',
    referenceName:'',
    interestHolding:'',
    balanceDisburse:'',
    processingFee:'',
    interest:'',
    membershipId: '',
    recoveryMode:'',
    loanNumber:'',
    _id:'',
    date:'',
    outStandingAmount:'',
    amountPaid:''

  });

    const dropdownRef = useRef(null);
    const { user, setUser } = useContext(UserContext);
   
    useEffect(() => {
      const branchCode = user?.branchDetails?.branchCode;
      console.log("branchCode", branchCode);
      if (branchCode && query) {
        console.log("branchCodeXXX", branchCode);
        console.log("queryXXX", query);
        const fetchLoanNumbers = async () => {
          try {
            const response = await axios.get(`https://api.malabarbank.in/getLoanDetails?branchCode=${branchCode}&loanNumber=${query}`);
            console.log("xxxrespo", response);
            const options = response.data.map((number) => ({
              value: number.loanNumber,
              label: number.loanNumber,
            }));
            setLoanNumbers(options);
            const customerDetails = response.data.find(
              (number) => number.loanNumber === query
            );
            if (customerDetails) {
              setFormData((prevFormData) => ({
               ...prevFormData,
                loanNumber: customerDetails.loanNumber,
                customerName: customerDetails.customerName,
                customerMobile: customerDetails.customerMobile,
                _id:customerDetails._id,
                outStandingAmount:customerDetails.pendingEmiAmount,
                amountPaid:customerDetails.amountPaidtillDate
              }));
            }
          } catch (error) {
            console.error("Error fetching phone numbers:", error);
          }
        };
        fetchLoanNumbers();
      } else {
        setLoanNumbers([]);
      }
    }, [query]);
    console.log("jumid",formData._id);

    const handleLoanNumberSelection = (option) => {
      if (option) {
        setSelectedLoanNumber(option);
        console.log("selected loan no:", selectedLoanNumber);
        // fetchMemberDetails(option.value);
        setFormData((prevFormData) => ({
         ...prevFormData,
          loanNumber: option.value, // Update the phone number field
        }));
        setQuery(option.value);
        setLoanNumbers([]);
      } else {
        setSelectedLoanNumber(null);
        setFormData((prevFormData) => ({
         ...prevFormData,
          loanNumber: null, // Reset the phone number field
          
        }));
        setQuery('');
        setLoanNumbers([]);
      }
    };




    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('formData._idxxxxx:', formData._id); // Add this line to check the value of formData._id
      const groupId = formData._id;
      const payload = {  amount: parseFloat(emi), date: selectedDate }; // Create a new object with only amount and date
      try {
        const response = await axios.post(`https://api.malabarbank.in/emi/${groupId}`, payload);
        console.log('Loan posted successfully:', response.data);
        alert('EMI added successfully')
        // Clear the form input fields by resetting the state
    setEmi('');
    setSelectedDate('');
    setSelectedLoanNumber(null); // Assuming you want to clear the loan number selection as well
        setLoan(prevLoan => [...prevLoan, formData]);
        setFormData({
          amount: '',
          date: ''
        });
        onHide();
      } catch (error) {
        console.error('Error posting loan:', error);
        alert("failed to add EMI")
      }
    };
  

    const handleClear = () => {
      setFormData({
        customerMobile: '',
        customerName: '',
        LOANtype: '',
        duration: '',
        emi: '',
        amount: '',
        loanNumber: '',
        referenceName: '',
        interestHolding: '',
        balanceDisburse: '',
        processingFee: '',
        interest: '',
        membershipId: '',
        recoveryMode: '',
        loanNumber: '',
        _id: '',
        date: '',
        outStandingAmount: '',
        amountPaid: ''
      });
      setEmi('');
      setSelectedDate('');
      setSelectedLoanNumber(null);
      setLoanNumbers([]);
      setQuery('');
    };
  


  return (
    <>
    <Modal
 show={show}
 onHide={onHide}
 dialogClassName="custom-modal-width"
>
 <Modal.Body className="p-0">
    <div className="Member form" style={{ maxWidth: "1800px" }}>
      <div className="card mt-0">
        <div className="justify-content-center">
          <div className="">
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>PAY EMI</h4>
              </div>
              <div className="card-body">
                <form 
                onSubmit={handleSubmit}
                >
                 <div className="row">
                    <div className="col-6">
                     
                      <div className="form-group">
                        <label htmlFor="accountHolderName">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="accountHolderName"
                          name="accountHolderName"
                          placeholder="Enter Account Holder Name"
                          value={formData.customerName}
                          required
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="emi">EMI</label>
                        <input
                          type="text"
                          className="form-control"
                          id="emi"
                          name="emi"
                          placeholder=" EMI Amount"
                          value={emi}
                          onChange={(e) => setEmi(e.target.value)}
                          required
                         
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="TotalAmountPaid">Total Amount Paid</label>
                        <input
                          type="text"
                          className="form-control"
                          id="amountPaid"
                          name="amountPaid"
                          value={formData.amountPaid}
                          // onChange={(e) => setDividend(e.target.value)}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-6">
                    <div className="form-group mt-1">
                    <label>Loan Number</label>
                     <Select
                        value={selectedLoanNumber}
                        options={loanNumbers}
                        onChange={handleLoanNumberSelection}
                        onInputChange={(inputValue) => setQuery(inputValue)}
                        isClearable={true}
                        placeholder="Select Loan Number"
                        isSearchable={true}
                      />
                    </div>
                      {/* <div className="form-group">
                        <label htmlFor="membershipId">
                          Membership ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="membershipId"
                          name="membershipId"
                          placeholder="Enter Membership ID"
                          value={selectedCustomerDetails.membershipId}
                          readOnly
                        />
                      </div> */}
                    
                      <div className="form-group">
                        <label htmlFor="Date">Date</label>
                     
                        <input
 type="date"
 className="form-control"
 id="Date"
 name="Date"
 value={selectedDate} // Use the state variable for value
 onChange={(e) => setSelectedDate(e.target.value)} // Update the state on change
 required
/>

                      </div>
                        <div className="form-group">
                        <label htmlFor="OutStandingAmount">
                        Outstanding EMI Amount
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="outStandingAmount"
                          name="outStandingAmount"
                          value={formData.outStandingAmount}
                          readOnly
                          required
                        />
                      </div>
                    </div>
                 </div>
                 <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                    <button
 type="button" // Change type to "button" to prevent form submission
 className="btn btn-secondary m-2"
 onClick={handleClear} // Call resetForm on click
>
 Clear
</button>

                    <Button variant="danger" onClick={onHide}>
                      Close
                    </Button>
                 </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 </Modal.Body>
</Modal>

<LoanEMIHistoryModal/>

    </>
  )
}

export default LoanEMImodal