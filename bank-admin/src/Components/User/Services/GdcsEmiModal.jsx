import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState,useContext } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../../Others/UserContext";
import moment from "moment";


function GdcsEmiModal({ show, onHide, onNextClick }) {
  // const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  // const [numberOfMembers, setNumberOfMembers] = useState("");
  const [query, setQuery] = useState("");
  // const [phoneNumbers, setPhoneNumbers] = useState([""]);
  // const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
    const [emi, setEmi] = useState("");
  const [dividend, setDividend] = useState(""); // Add state for dividend
  const [payableAmount, setPayableAmount] = useState(""); // Add state for payable amount
  const[gdcsNumber,setGDCSNumber]=useState("")
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState({
    customerName: "",
    membershipId: "",
  });

  //  const dropdownRef = useRef(null);

  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [selectedgdcsNumber, setSelectedGdcsNumber] = useState(null);
  const dropdownRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const [branchCode, setBranchCode] = useState("");
   // Update branchCode state when user changes
   useEffect(() => {
    if (user?.branchDetails?.branchCode) {
      setBranchCode(user.branchDetails.branchCode);
    }
  }, [user]);

  //fetch modal

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    const fetchAllGroups = async () => {
      try {
        const response = await fetch(`https://api.malabarbank.in/api//branchGroups?branchCode=${branchCode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();

        setGroups(data.data);
        console.log("yem", data);
        console.log("eldorado", groups);
        // setGroups(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchAllGroups();
  }, [branchCode]);


  // Use useEffect to watch for changes in EMI and dividend, and update payable amount
  useEffect(() => {
    // Ensure both EMI and dividend are numbers before calculating
    const emiNumber = parseFloat(emi);
    const dividendNumber = parseFloat(dividend);

    if (!isNaN(emiNumber) && !isNaN(dividendNumber)) {
      const calculatedPayableAmount = emiNumber - dividendNumber;
      setPayableAmount(calculatedPayableAmount.toFixed(2)); // Format to 2 decimal places
    } else {
      setPayableAmount(""); // Reset payable amount if EMI or dividend is not a number
    }
  }, [emi, dividend]); // Depend on EMI and dividend

  const handleGroupChange = (event) => {
    const selectedId = event.target.value;
    console.log("bang", selectedId);

    setSelectedGroupId(selectedId);

    // Make sure the groups array is not empty
    if (groups.length === 0) {
      console.error("Groups array is empty");
      return;
    }

    // Find the selected group in the groups array
    const selectedGroup = groups.find((group) => group._id === selectedId);

    if (selectedGroup) {
      // Extract the phone numbers of themembers in the selected group
      const phoneNumbers = selectedGroup.members.map(
        (member) => member.phoneNumber
      );
      setPhoneNumbers(phoneNumbers);


      const gdcsNumber=selectedGroup.members.map(
        (member)=>member.GDCSNumber
      );
      setGDCSNumber(gdcsNumber)

      // Extract the EMI value from the selected group
      const emi = selectedGroup.emi;

      // Update the EMI input field with the extracted EMI value
      setEmi(emi);
    } else {
      console.error("Selected group not found in groups array");
    }
  };

  const handlePhoneNumberSelection = (selectedOption) => {
 // Check if selectedOption is null before accessing its value
 if (selectedOption) {
    setSelectedGdcsNumber(selectedOption.value);

    // Your existing logic to find the selected group and customer details
    // Make sure the groups array is not empty
    if (groups.length === 0) {
      console.error("Groups array is empty");
      return;
    }

    // Find the selected group in the groups array
    const selectedGroup = groups.find((group) => group._id === selectedGroupId);
    if (selectedGroup) {
      // Find the customer details corresponding to the selected phone number
      const selectedCustomer = selectedGroup.members.find(
        (member) => member.GDCSNumber === selectedOption.value
      );

      if (selectedCustomer) {
        // Update the selectedCustomerDetails state with the new customer details
        setSelectedCustomerDetails({
          customerName:selectedCustomer.customerName,
          membershipId:selectedCustomer.membershipId,
        });
      } else {
        console.error("Customer not found for selected phone number");
        setSelectedCustomerDetails({
          customerName: "",
          membershipId: "",
        });
      }
    } else {
      console.error("Selected group not found in groups array");
    }
 } else {
    // If selectedOption is null, clear the selected phone number and customer details
    setSelectedPhoneNumber(null);
    setSelectedCustomerDetails({
      customerName: "",
      membershipId: "",
    });
 }
};


  ///posting ppdikal



  const handleSubmit = async (event) => {
    event.preventDefault();


     // Assuming date is in 'yyyy-mm-dd' format as per your initial setup
   let formattedDate = moment(event.target.Date.value, 'YYYY-MM-DD').format('DD/MM/YYYY');
    // const date = event.target.Date.value;
    const emi = event.target.emi.value;
    const dividend = event.target.dividend.value;
    const payableAmount = event.target.payableAmount.value;

    // Corrected URL structure
    const apiUrl = `https://api.malabarbank.in/api/groupMember/${selectedGroupId}/member/emi`;

    const requestBody = {
      date:formattedDate,
      emiAmount: emi,
      dividend,
      payableAmount,
      gdcNumber:selectedgdcsNumber
    };

    try {
      const response = await axios.post(apiUrl, requestBody);
      if (response.status === 200) {
        // Display success message
        window.alert("EMI data added successfully");
        // Optionally, clear the form or navigate away
        onHide()
      } else {
        // Display error message
        window.alert("Failed to add EMI data. Please try again.");
      }
    } catch (error) {
      // Display error message
      window.alert("Error adding EMI data: " + error.message);
    }
  };


  // reset all
  const resetForm = () => {
    setSelectedGroupId("");
    setSelectedGdcsNumber(null);
    setEmi("");
    setDividend("");
    setPayableAmount("");
    setSelectedCustomerDetails({
       customerName: "",
       membershipId: "",
    });
    setSelectedDate(""); // Reset the date
    // If you have any other state variables that need to be reset, add them here
   };
   

  return (
    <>
     
      <Modal
 show={show && !showPaymentModal}
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
                <h4>EMI</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                 <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>All Groups</label>
                        <select
                          className="form-control"
                          id="allGroups"
                          onChange={handleGroupChange}
                          value={selectedGroupId}
                        >
                          <option value="">Select Group</option>
                          {groups && Array.isArray(groups) &&  groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.GroupName}
                            </option>
                          ))}
                        </select>
                      </div>
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
                          value={selectedCustomerDetails.customerName}
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
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dividend">Dividend</label>
                        <input
                          type="text"
                          className="form-control"
                          id="dividend"
                          name="dividend"
                          placeholder="Enter Dividend"
                          value={dividend}
                          onChange={(e) => setDividend(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                    <div className="form-group mt-1">
                    <label>Customer GDCS Number</label>
                     <Select
                        ref={dropdownRef}
                        options={gdcsNumber?gdcsNumber.map((number) => ({
                          value: number,
                          label: number,
                        })):[]}
                        value={
                          selectedgdcsNumber
                            ? {
                                value: selectedgdcsNumber,
                                label: selectedgdcsNumber,
                              }
                            : null
                        }
                        onChange={handlePhoneNumberSelection}
                        isClearable={true}
                        placeholder="Select GDCS Number"
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
                          value={selectedCustomerDetails.membershipId}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="payableAmount">
                          Payable Amount
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="payableAmount"
                          name="payableAmount"
                          placeholder="Enter payableAmount"
                          value={payableAmount}
                          readOnly
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="Date">Date</label>
                        {/* <input
                          type="date"
                          className="form-control"
                          id="Date"
                          name="Date"
                          required
                        /> */}
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
 onClick={resetForm} // Call resetForm on click
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
  );
}

export default GdcsEmiModal;
