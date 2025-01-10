

import React, { useEffect, useState,useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Select from 'react-select';
import { UserContext } from "../../Others/UserContext";
import moment from 'moment'; // Import moment if you're using it




function SwarnaAddMemberModal({ show, onHide }) {
  const [groups, setGroups] = useState([]); // State to store fetched groups
  const [selectedGroupId, setSelectedGroupId] = useState(""); // State to manage the selected group ID
  const [query, setQuery] = useState("");


  const [formData, setFormData] = useState({
    GroupName: "",
    duration: "",
    numberofMember: "",
    schemeType: "",
    emi: "",
    amount: "",
    interest: "",
    finalInterest: "",
    membershipId: "",
    customerName: "",
    customerNumber: "",

    referenceName: "",
    // date: "",
     date: moment().format('DD/MM/YYYY'),
    totalAmount: "",
    accountStatus: "",
    branchCode: "",
    selectedEmployee: '',
  });

  const [employees, setEmployees] = useState([]);

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:2000/api/getEmpList");
      setEmployees(response.data.getEmployees.map(employee => ({
        value: employee.fullname,
        label: employee.fullname,
        referenceName:  formData.referenceName || '' // Use referenceName
      })));
      console.log("emp's",employees)
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]); // Clear employees array on error
    }
  };

  fetchEmployees();
}, []);



  // Fetch groups when the component mounts
   // Fetch groups data from the API
   useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://api.malabarbank.in/api/getswarna");
        setGroups(response.data.schemes || []); // Set the groups data
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    if (show) {
      fetchGroups();
    }
  }, [show]);
  // Handle group selection
  const handleGroupChange = (e) => {
    setSelectedGroupId(e.target.value);
    // Additional logic can be added here if needed
  };


  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  useEffect(() => {
    // const branchCode = user?.branchDetails?.branchCode;
    if (query) {
      console.log("qury:", query);
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(
            `https://api.malabarbank.in/api/fetchMemberDetails?phoneNumber=${query}`
          );
          // setPhoneNumbers(response.data);
          const options = response.data.map((number) => ({
            value: number.customerMobile,
            label: number.customerMobile,
          }));
          console.log(options,"pari")
          setPhoneNumbers(options);
          console.log(response.data);
          console.log("tam", query);
          console.log("shiii", phoneNumbers);
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchPhoneNumbers();
    } else {
      setPhoneNumbers([]);
    }
  }, [query]);

  const handlePhoneNumberSelection = (option) => {
    console.log("option",option);
    if (option === null) {
      // Handle the case where the selection is cleared
      setSelectedPhoneNumber(null);
      setQuery(""); // Reset the query if necessary
      setPhoneNumbers([{ value: "", label: "" }]); // Clear the options if needed

      
      // Reset the formData to remove any data associated with the previously selected phone number
    setFormData({});
    } else {
      // Existing logic for when an option is selected
      setSelectedPhoneNumber(option.value);
      console.log("selected phno xxxx",selectedPhoneNumber);
      fetchMemberDetails(option.value);
      setFormData((prevFormData) => ({
      ...prevFormData,
        customerNumber: option.value,
      }));
      setQuery(option.value);
      setPhoneNumbers([]); // Optionally clear the options after selection
    }
  };
  
  const { user, setUser } = useContext(UserContext);
  const [branchCode, setBranchCode] = useState("");
  const [empDesignation,setEmpDesignation] = useState("");
  const [empName,setEmpName] = useState("");

  // Update branchCode state when user changes
  useEffect(() => {
    if (user?.branchDetails?.branchCode) {
      console.log("User",user)
      setBranchCode(user.branchDetails.branchCode);
    } 
    // if (user?.branchDetails?.employee) {
    //   setEmpName(user.employee.fullname);
    //   setEmpDesignation(user.employee.designation);
    //   console.log("empDesignation",empDesignation)
    //   console.log("empDesignation",empDesignation)

    // }
  }, [user]);

  useEffect(() => {
    if (user?.employee) {
      setEmpName(user.employee.fullname);
      setEmpDesignation(user.employee.designation);
      console.log("Employee Fullname:", user.employee.fullname);
      console.log("Employee Designation:", user.employee.designation);
    }
  }, [user]);
  


  const fetchMemberDetails = async (selectedPhoneNumber) => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/fetchMemberDetails?phoneNumber=${selectedPhoneNumber}`
      );

      const {
        membershipId,
        customerName,
        customerMobile,
        phoneNumber,
        // branchName,
        duration,
        address,
        // referenceName,
      } = response.data;

      setFormData({
        duration,
        membershipId,
        customerName,
        customerNumber: customerMobile,
        phoneNumber,
        // date: moment(date).format('DD/MM/YYYY'), // Format the date here,
        emi: "1000", // Default to 1000
        numberofMember: "1000", // Default to 1000
        address,
        //  fdBill,
         branchCode,
      });
      console.log("FormData", formData);
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  const handleDateChange = (e) => {
    // Convert the date from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = moment(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY');
    setFormData({
      ...formData,
      date: formattedDate
    });
  };

  
const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Check if we're already submitting
  if (formData.submitting) return;

  // Disable the submit button
  setFormData(prev => ({...prev, submitting: true}));

  try {
    // Format the date in dd/mm/yyyy
    const formattedDate = moment(formData.date).format('DD/MM/YYYY');

    // Gather form data
    const postData = {
      ...formData,
      date: formData.date, // Use the formatted date
      groupId: selectedGroupId, // Include the selected group ID
      branchCode: branchCode,
      userName: empName,
      userDesignation: empDesignation,
      referenceName: formData.referenceName,
    };

    // First POST request to add a member
    const response = await axios.post(`http://localhost:2000/api/swarnaAddmem/${selectedGroupId}`, postData);

    // Check if the response is successful and schemeId is present in the response
    if (response.status === 200 && response.data.schemeId) {
      alert(response.data.message || 'Member added successfully');
      console.log("response.data.message", response.data.message);
      alert(`Customer Scheme ID: ${response.data.schemeId}`);

      // Second POST request to add an installment
      const installmentPostData = {
        amount: formData.emi || "1000",
        date: formData.date,
      };

      const installmentResponse = await axios.post(
        `https://api.malabarbank.in/api/swarnaInstallment/${response.data.schemeId}`,
        installmentPostData
      );

      if (installmentResponse.status === 200) {
        alert("Installment added successfully");
        console.log("Installment response:", installmentResponse.data);
      } else {
        throw new Error("Failed to add installment");
      }
    }

    // Clear the form data after successful submission
    setFormData({
      groupName: "",
      duration: "",
      numberofMember: "",
      emi: "",
      membershipId: "",
      customerName: "",
      customerNumber: "",
      date: "",
      branchCode: "",
      submitting: false // Explicitly set submitting to false
    });

    // Close the modal
    onHide();
    window.location.reload();

  } catch (error) {
    console.error('Error:', error.response?.data?.message || error.message);
    alert(error.response?.data?.message || 'Failed to add member'); // Show error message

    // Enable the button again on failure
    setFormData(prev => ({...prev, submitting: false}));
  }
};

  
  return (
    <div>
      <Modal show={show} dialogClassName="custom-modal-width">
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>SWARNANIDHI NEW GROUP MEMBER CREATION</h4>
              </div>
              <div className="card-body">
              <form onSubmit={handleSubmit}>

                  <div className="row">
                    <div className="col-6">
                      {/* All Groups */}
                      <div className="form-group">
                        <label htmlFor="allGroups">All Groups</label>
                        <select
                          className="form-control"
                          id="allGroups"
                          onChange={handleGroupChange}
                          value={selectedGroupId}
                          required
                        >
                          <option value="">Select Group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.groupName || "Unnamed Group"}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Number of Members */}
                      <div className="form-group">
                        <label htmlFor="numberOfMembers">Number of Members</label>
                        <input
                          type="text"
                          className="form-control"
                          id="numberOfMembers"
                          name="numberOfMembers"
                          placeholder=""
                          readOnly
                          required
                          value={formData.numberofMember || "1000"}
                        />
                      </div>
                      {/* GDCS Number */}
                      <div className="form-group">
                        <label htmlFor="gdcsNumber">EMI Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          id="EMI"
                          name="EMI"
                          placeholder="EMI Amount"
                          required
                          value={formData.emi || "1000"} // Default to 1000
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="CurrentDate">Current Date</label>
                        <input
                          type="date"
                          className="form-control"
                          required
                          // value={formData.date}
                          value={moment(formData.date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                          onChange={handleDateChange}
                        />
                      </div>

{/* <div className="form-group">
  <label htmlFor="CurrentDate">Current Date</label>
  <input
    type="text"
    className="form-control"
    id="currentDate"
    name="currentDate"
    placeholder="DD/MM/YYYY"
    required
    value={formData.date} // Display formatted date in DD/MM/YYYY
    onChange={(e) => {
      // Directly set the value in the desired format
      setFormData({
        ...formData,
        date: moment(e.target.value, 'DD/MM/YYYY').isValid()
          ? moment(e.target.value, 'DD/MM/YYYY').format('DD/MM/YYYY')
          : formData.date, // Only set if valid
      });
    }}
  />
</div> */}

                      {/* <div className="form-group">
                      <label htmlFor="CurrentDate">Current Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="CurrentDate"
                        name="CurrentDate"
                        readOnly
                        required
                        value={formData.date}
                      />
                    </div> */}
                    </div>
                    <div className="col-6">
                      {/* Account Holder Name */}
                      <div className="form-group">
                        <label htmlFor="customerName">Account Holder Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="customerName"
                          name="customerName"
                          placeholder="Enter Account Holder Name"
                          required
                          readOnly
                          value={formData.customerName || ""}
                        />
                      </div>
                      {/* Customer Phone Number */}
                     
                      <div className="form-group">
                          <div className="dropdown-wrapper">
                            <label htmlFor="customerName">
                              Customer Phone Number
                            </label>
                            <Select
 value={selectedPhoneNumber?{ value: selectedPhoneNumber, label: selectedPhoneNumber } : null} 
     onChange={handlePhoneNumberSelection}
    onInputChange={(inputValue) => setQuery(inputValue)}
    options={phoneNumbers}
    placeholder="Enter phone number"
    isClearable={true}
    required
  />
                          </div>
                        </div>
                      {/* Membership ID */}
                      <div className="form-group">
                        <label htmlFor="membershipId">Membership ID</label>
                        <input
                          type="text"
                          className="form-control"
                          id="membershipId"
                          name="membershipId"
                          placeholder="Enter Membership ID"
                          required
                          readOnly
                          value={formData.membershipId || ""}
                        />
                      </div>
                      {/* Reference Name */}

                       {/* Customer Address */}
                    <div className="form-group">
                      <label htmlFor="customerAddress">Customer Address</label>
                      <textarea
                        className="form-control"
                        id="customerAddress"
                        name="customerAddress"
                        readOnly
                        value={formData.address}
                      />
                    </div>
                    <div className="form-group">
  <label htmlFor="employee">Select Employee</label>
  <Select
    options={employees}
    onChange={(option) => {
      setFormData(prev => ({
        ...prev,
        referenceName: option ? option.value : ''
      }));
    }}
    placeholder="Select Employee"
    isClearable={true}
    getOptionLabel={(option) => option.label || ''}
    getOptionValue={(option) => option.value || ''}
  />
</div>

                      
                    </div>

                    
                  </div>
                  <div className="form-group">
                    {/* <button type="submit" className="btn btn-primary">
                      Submit
                    </button> */}

<button 
  type="submit" 
  className="btn btn-primary"
  disabled={formData.submitting}
>
  {formData.submitting ? 'Submitting...' : 'Submit'}
</button>

                    <button type="reset" className="btn btn-secondary m-2">
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
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SwarnaAddMemberModal;
