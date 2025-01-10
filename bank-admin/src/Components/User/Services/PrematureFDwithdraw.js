import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Popover } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

function PrematureFDwithdraw() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [formData, setFormData] = useState({

    schemeType: "",
    accountType: '',
    duration: "",
    amount: "",
    interest: "",
    finalInterest: "",
    membershipId: "",
    FDNumber: "",
    customerName: "",
    customerNumber: "",
    commissionInterest: '',
    interestCutBefore: '',
    interestCutAfter: '',
    interestCutAmount:'',
    commissionAmount:'',
    address: "",
    referenceName: "",
    date: "",
    totalAmount: "",
    fdBill: "",
    accountStatus: '',
    transactionId: '',
  });


  const handleReset = () => {
    setFormData({
      schemeType: "",
      accountType: "",
      duration: "",
      amount: "",
      interest: "",
      finalInterest: "",
      membershipId: "",
      FDNumber: "",
      customerName: "",
      customerNumber: "",
      commissionIntrest: '',
      address: "",
      referenceName: "",
      interestCutAmount: "",
      date: "",
      totalAmount: "",
      fdBill: "",
      accountStatus: "",
      transactionId: ""
    });
  };
  

  const handleChangeFd = (e) => {
    const { name, value } = e.target;
   
    // Update the form data with the new value
    setFormData(prevFormData => ({
       ...prevFormData,
       [name]: value
    }));
   
    // Recalculate the interest if necessary fields are provided
    if (name === 'amount' && formData.commissionInterest && formData.duration) {
      const amount = parseFloat(value);
      const interest = parseFloat(formData.interest);
      const duration = parseFloat(formData.duration.split(' ')[0]); // Extracting duration in years
      console.log(amount, interest, duration);
      // Calculate interest amount
      const interestAmount = (amount * (interest / 100))*duration;
      const finalAmount = amount + interestAmount;
      // Update the final interest amount in the form data
      setFormData(prevState => ({
        ...prevState,
        finalInterest: interestAmount.toFixed(2),
        totalAmount: finalAmount.toFixed(2),
        date: currentDate.toLocaleString(),
      }));
       // Update the final interest amount in the form data
       setFormData(prevState => ({
         ...prevState,
         interest: interestAmount.toFixed(2), // Optionally update interest value in the formData if needed
         interestCutAmount: interestAmount.toFixed(2),
         date: currentDate.toLocaleString(),
       }));
    }
   };
   
  
  
  const handlePhoneNumberSelection = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    fetchMemberDetails(phoneNumber);
    setFormData(prevFormData => ({
      ...prevFormData,
      customerNumber: phoneNumber
    }));
    setQuery(phoneNumber);
    setPhoneNumbers([]);
  };

  useEffect(() => {
    if (query) {
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(
            `https://api.malabarbank.in/fdsearchPhoneNumbers?query=${query}`
          );
          setPhoneNumbers(response.data);
          console.log(response.data);
          console.log(query);
          console.log(phoneNumbers);
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchPhoneNumbers();
    } else {
      setPhoneNumbers([]);
    }
  }, [query]);
  useEffect(() => {
    console.log(phoneNumbers); // Ensure phoneNumbers is updated here
  }, [phoneNumbers]);

  const fetchMemberDetails = async (phoneNumber) => {
    try {
      const response = await axios.get(`https://api.malabarbank.in/fdfetchMemberDetails?phoneNumber=${phoneNumber}`);
      const memberData = response.data;
      setFormData({
        ...memberData, // Assuming response.data contains the form data
        // Assuming response.data contains the form data
        customerMobile: phoneNumber,
        // Assuming customerMobile is a field in your form
      });
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  //generate Transaction id

  function generateTransactionId(recipt) {
    // Retrieve the last used number for the branch code from local storage
    let lastNumber = localStorage.getItem(`lastNumber_${recipt}`);

    if (!lastNumber) {
      lastNumber = 1; // Start with 00000001
      localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
    } else {
      lastNumber = parseInt(lastNumber) + 1; // Increment by one
      localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
    }

    // Generate the ID with the format "MS" + lastNumber with padding
    return `T${lastNumber.toString().padStart(17, '0')}`;
  }
  const updateMemberDetails = async (phoneNumber, updatedData) => {
    try {
      const response = await axios.put(`https://api.malabarbank.in/updateMemberDetails/${phoneNumber}`, updatedData);
      console.log(response.data);
    } catch (error) {
      console.error("Error updating member details:", error);
    }
  };

  const handleSubmitFd = async (e) => {
    e.preventDefault();
    // Generate a transaction ID
    const transactionId = generateTransactionId("yourRecipientCode");
    // Update the form data with the generated transaction ID
    const updatedData = { ...formData, transactionId };
    // Call the update function with the updated data
    await updateMemberDetails(formData.customerNumber, updatedData);
    // Optionally, provide feedback to the user
    alert("Member details updated successfully!");
  }

  return (
    <div className='container'>
      <div className="Member form" style={{ maxWidth: "1800px" }}>
        <div className="card mt-0">
          <div className="card-header text-light">
            <h4>PRE MATURITY WITHDRAWAL FORM</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitFd} className="ms-3 mt-3">
              <div className="row ms-5">
                <div className="col-6">
                  <div className="form-group ">
                    <div className="dropdown-wrapper">
                      <label htmlFor="membershipId"> Phone Number :</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter phone number"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      {phoneNumbers.length > 0 && (
                        <ul className="dropdown-menu2">
                          {phoneNumbers.map((number, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handlePhoneNumberSelection(
                                  number.customerNumber
                                )
                              }
                            >
                              {number.customerNumber}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="form-group ">
                    <label htmlFor="membershipId"> Membership ID :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="membershipId"
                      name="membershipId"
                      value={formData.membershipId}
                      onChange={handleChangeFd}
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">Duration :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChangeFd}
                      placeholder=""
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="paidDate">Paid Date :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="paidDate"
                      name="paidDate"
                      value={formData.date}
                      onChange={handleChangeFd}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="interest">Interest Percentage :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="commissionPercentage">
                      Commision in Percentage :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="commissionInterest"
                      name="commissionInterest"
                      value={formData.schemeType === 'before' ? formData.interestCutBefore : formData.interestCutAfter}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="commissionAmount">
                      Commission Amount :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="commissionAmount"
                      name="commissionAmount"
                      value={formData.commissionAmount}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="schemeType">Select Duration</label>
                    <select
                      className="form-control"
                      id="schemeType"
                      name="schemeType"
                      onChange={handleChangeFd}
                      value={formData.schemeType}
                    >
                      <option value="">-- Select --</option>
                      <option value="before">Before 6 Months</option>
                      <option value="after">After 6 Months</option>
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="schemeType">Scheme Type :</label>
                    <input
                      className="form-control"
                      id="schemeType"
                      name="schemeType"
                      value={formData.accountType}
                      onChange={handleChangeFd} >
                    </input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="accountHolderName">
                      Account Holder Name :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={formData.customerName}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">Amount :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date :</label>
                    <div className="form-control">
                      {currentDate.toLocaleString()}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="finalInterestAmount">
                      Final Interest Amount :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="totalAmount"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="interestCutter">
                      Interest Cutter :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="interestCutAmount"
                      name="interestCutAmount"
                      value={formData.interestCutAmount}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="referenceName">Reference Name :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="referenceName"
                      name="referenceName"
                      value={formData.referenceName}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="finalAmount">Final Amount :</label>
                    <input
                      type="text"
                      className="form-control"
                      id="finalAmount"
                      name="finalAmount"
                      value={formData.finalAmount}
                      onChange={handleChangeFd}
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <center>
                <div className="form-group ">
                  <Button type="submit" className="btn btn-primary">
                    Submit
                  </Button>
                  <Button type="reset" onClick={handleReset}>
                    Reset
                  </Button >

                  <Button variant="danger">
                    <Link to='/fd'>Close</Link>
                  </Button>
                </div>
              </center>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrematureFDwithdraw
