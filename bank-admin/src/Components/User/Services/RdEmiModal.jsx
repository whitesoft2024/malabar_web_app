import React from 'react'
import { useEffect, useState,useContext } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../../Others/UserContext";
import axios from "axios";
import moment from 'moment';


function RdEmiModal({show,onHide}) {
  const [branchCode, setBranchCode] = useState('');
  const [RDNumber,setRDNumber]=useState('');
  const[rdData,setRdData]=useState('')
  const { user, setUser } = useContext(UserContext);
  const [query, setQuery] = useState('');
  const[RDNumbers,setRDNumbers]=useState([''])
  const [selectedRDNumber, setSelectedRDNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const[Rd,setSd]=useState([])
  const[amount,setAmount]=useState('')
  


  
   //current time 
   function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  const handleChangeDate = (event) => {
    const xl = moment(event.target.value).format("DD/MM/YYYY");
    setFormData({ ...formData, date:xl });
  };





  const [formData, setFormData] = useState({
    customerNumber:'',
    customerName:'',
    LOANtype:'',
    duration:'',
    emi:'',
    amount:'',
    RDNumber:'',
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
    amountPaid:'',
    emiAmount:''

  });



  useEffect(() => {
    const branchcode = user?.branchDetails?.branchCode;
    console.log("branchCode", branchcode);
    if (branchcode && query) {
      console.log("branchCodeXXX", branchcode);
      console.log("queryXXX", query);
      const fetchRDNumbers = async () => {
        try {
          const response = await axios.get(`https://api.malabarbank.in/api/getRdDetails?branchcode=${branchcode}&RDNumber=${query}`);
          console.log("xxxrespo", response);
          const options = response.data.map((number) => ({
            value: number.RDNumber,
            label: number.RDNumber,
          }));
          setRDNumbers(options);
          const customerDetails = response.data.find(
            (number) => number.RDNumber === query
          );
          if (customerDetails) {
            setFormData((prevFormData) => ({
             ...prevFormData,
              RDNumber: customerDetails.RDNumber,
              customerName: customerDetails.customerName,
              customerNumber: customerDetails.customerNumber,
              _id:customerDetails._id,
              outStandingAmount:customerDetails.pendingEmiAmount,
              amountPaid:customerDetails.amountPaidtillDate,
              membershipId:customerDetails.membershipId,
              emiAmount:customerDetails.emiAmount,
              emiNumber: customerDetails.emi.length + 1, // Assuming emi is an array
              currentBalance: customerDetails.AmountTillDate // Assuming this is the correct field for current balance
            }));
          }
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchRDNumbers();
    } else {
      setRDNumbers([]);
    }
  }, [query]);
  // console.log("jumid",formData._id);


  const handleRDNumberSelection = (option) => {
    if (option) {
      setSelectedRDNumber(option);
      console.log("selected loan no:", selectedRDNumber);
      // fetchMemberDetails(option.value);
      setFormData((prevFormData) => ({
       ...prevFormData,
        RDNumber: option.value, // Update the phone number field
      }));
      setQuery(option.value);
      setRDNumbers([]);
    } else {
      setSelectedRDNumber(null);
      setFormData((prevFormData) => ({
       ...prevFormData,
        RDNumber: null, // Reset the phone number field
        
      }));
      setQuery('');
      setRDNumbers([]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData._idxxxxx:', formData._id); // Add this line to check the value of formData._id
    const groupId = formData._id;
              // Get branchUser from UserContext
              const branchUser = user?.employee?.fullname || '';
    const payload = { emiData: [{ amount: parseFloat(formData.emiAmount), date: formData.date,branchUser }] };    try {
      const response = await axios.post(`http://localhost:2000/api/add-emi/${groupId}`, payload);
      console.log('Loan posted successfully:', response.data);
      alert(response.data.message || 'EMI added successfully'); // Display success message
      // Clear the form input fields by resetting the state
  setAmount('');
  setSelectedDate('');
  setSelectedRDNumber(null); // Assuming you want to clear the loan number selection as well
  setSd(prevRd => [...prevRd, formData]);
      setFormData({
        amount: '',
        date: ''
      });
      onHide();
    } catch (error) {
      console.error('Error posting RD:', error);
       // Display error message from the backend if available
    const errorMessage = error.response?.data?.message || 'Error adding EMI';
      alert(errorMessage);
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
      amountPaid: '',
      emiAmount:''
    });
    // setEmi('');
    setSelectedDate('');
    setSelectedRDNumber(null);
    setRDNumbers([]);
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
                <h4>RD MONTHLY COLLECTION</h4>
              </div>
              <div className="card-body">
                <form
                 onSubmit={handleSubmit}
                 >
                 <div className="row">
                    <div className="col-6">
                      {/* <div className="form-group">
                        <label>All Groups</label>
                        <select
                          className="form-control"
                          id="allGroups"
                          onChange={handleGroupChange}
                          value={selectedGroupId}
                        >
                          <option value="">Select Group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.GroupName}
                            </option>
                          ))}
                        </select>
                      </div> */}
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
                        <label htmlFor="emi">Customer Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder=" Phone Number"
                          value={formData.customerNumber}
                          // onChange={(e) => setEmi(e.target.value)}
                          required
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="Date">Date</label>
                        <input
 type="date"
 className="form-control"
 id="Date"
 name="Date"
//  value={selectedDate} // Use the state variable for value
value={moment(formData.date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
onChange={handleChangeDate}

//  onChange={(e) => setSelectedDate(e.target.value)} // Update the state on change
 required
/>

                      </div>
                      <div className="form-group">
  <label htmlFor="emiNumber">EMI Number</label>
  <input
    type="text"
    className="form-control"
    id="emiNumber"
    name="emiNumber"
    placeholder="Enter EMI Number"
    value={formData.emiNumber}
    readOnly
  />
</div>
                      {/* <div className="form-group">
                        <label htmlFor="dividend">Dividend</label>
                        <input
                          type="text"
                          className="form-control"
                          id="dividend"
                          name="dividend"
                          placeholder="Enter Dividend"
                          // value={dividend}
                          // onChange={(e) => setDividend(e.target.value)}
                          required
                        />
                      </div> */}
                    </div>
                    <div className="col-6">
                    <div className="form-group mt-1">
                    <label>Customer RD Number</label>
                    <Select
                        value={selectedRDNumber}
                        options={RDNumbers}
                        onChange={handleRDNumberSelection}
                        onInputChange={(inputValue) => setQuery(inputValue)}
                        isClearable={true}
                        placeholder="Select Loan Number"
                        isSearchable={true}
                      />
                    </div>
                      <div className="form-group">
                        <label htmlFor="membershipId">
                          Membership ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="membershipId"
                          name="membershipId"
                          placeholder="Enter Membership ID"
                          value={formData.membershipId}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="payableAmount">
                          Monthly Amount
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="MonthlyAmount"
                          name="MonthlyAmount"
                          placeholder="Enter Monthly Amount"
                          value={formData.emiAmount}
                          onChange={(e) => setAmount(e.target.value)}
                          readOnly
                          required
                        />
                      </div>
                     
<div className="form-group">
  <label htmlFor="currentBalance">Current Balance</label>
  <input
    type="text"
    className="form-control"
    id="currentBalance"
    name="currentBalance"
    placeholder="Enter Current Balance"
    value={formData.currentBalance}
    readOnly
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
//  onClick={resetForm} 
 // Call resetForm on click
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
    
    
    </>
  )
}

export default RdEmiModal