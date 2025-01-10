
import React, { useEffect, useState, useMemo } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";

function SwarnaEmiModal({ show, onHide }) {
  const [schemesData, setSchemesData] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [amount, setAmount] = useState(1000);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("https://api.malabarbank.in/api/getswarna")
      .then((response) => response.json())
      .then((data) => setSchemesData(data.schemes || []))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSchemesData([]); // Ensure it's always an array
      });
  }, []);

  const schemeIds = useMemo(() => {
    if (!schemesData || !Array.isArray(schemesData)) return [];

    const ids = [];
    schemesData.forEach((scheme) => {
      if (scheme.members) {
        scheme.members.forEach((member) => {
          if (!ids.includes(member.schemeId)) {
            ids.push(member.schemeId);
          }
        });
      }
    });
    return ids.map((id) => ({ value: id, label: id }));
  }, [schemesData]);

  
  // const handleSchemeIdChange = (option) => {
  //   if (option && option.value) {
  //     setSelectedSchemeId(option.value);
  
  //     const memberDetails = schemesData
  //       .flatMap((scheme) => scheme.members || [])
  //       .find((member) => member.schemeId === option.value);
  
  //     if (memberDetails) {
  //       setSelectedMembershipId(memberDetails.membershipId);
  //       setSelectedCustomerName(memberDetails.customerName);
  //       setSelectedMobileNumber(memberDetails.customerNumber);
  //     } else {
  //       // Reset the fields if no matching member is found
  //       setSelectedMembershipId("");
  //       setSelectedCustomerName("");
  //       setSelectedMobileNumber("");
  //     }
  //   } else {
  //     // Handle the case where option is null or undefined
  //     setSelectedSchemeId(null);
  //     setSelectedMembershipId("");
  //     setSelectedCustomerName("");
  //     setSelectedMobileNumber("");
  //   }
  // };

  const handleSchemeIdChange = (option) => {
    if (option && option.value) {
      setSelectedSchemeId(option.value);
  
      const memberDetails = schemesData
        .flatMap((scheme) => scheme.members || [])
        .find((member) => member.schemeId === option.value);
  
      if (memberDetails) {
        setSelectedMembershipId(memberDetails.membershipId);
        setSelectedCustomerName(memberDetails.customerName);
        setSelectedMobileNumber(memberDetails.customerNumber);
        
        // Format the date consistently
        const formattedDate = moment(memberDetails.date).format('DD/MM/YYYY');
        setSelectedDate(formattedDate);
      } else {
        setSelectedMembershipId("");
        setSelectedCustomerName("");
        setSelectedMobileNumber("");
        setSelectedDate(""); // Reset the date if no matching member is found
      }
    } else {
      setSelectedSchemeId(null);
      setSelectedMembershipId("");
      setSelectedCustomerName("");
      setSelectedMobileNumber("");
      setSelectedDate(""); // Reset the date when clearing the form
    }
  };
  
  
  

  const clearForm = () => {
    setSelectedSchemeId(null);
    setSelectedMembershipId("");
    setSelectedCustomerName("");
    setSelectedMobileNumber("");
    setSelectedDate("");
    setAmount(1000);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
       // Check if we're already submitting
       if (isSubmitting) return; // Prevent duplicate submissions

       // Disable the submit button
       setIsSubmitting(true); // Set submitting state to true

    // Convert the date to ISO format if it's not already
    // const formattedDate = moment(selectedDate).toISOString();

    const formattedDate = moment(selectedDate).format('DD/MM/YYYY');

    try {
        const response = await fetch(
            `https://api.malabarbank.in/api/swarnaInstallment/${selectedSchemeId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount, date: formattedDate }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("Success:", data);
            alert(data.message || "Installment added successfully");
            clearForm(); // Clear all input fields
            onHide();
            window.location.reload() 

        } else {
            // Handle non-200 status codes
            alert(data.message || "There was a problem adding the installment.");
            setIsSubmitting(false); // Re-enable the submit button
          }
    } catch (error) {
        console.error("Error:", error);
        alert("There was a problem adding the installment.");
        setIsSubmitting(false); // Re-enable the submit button
    }
};

  

  return (
    <Modal show={show} onHide={onHide} dialogClassName="custom-modal-width">
      <Modal.Body className="p-0">
        <div className="Member form" style={{ maxWidth: "1800px" }}>
          <div className="card mt-0">
            <div className="justify-content-center">
              <div className="card mt-0">
                <div className="card-header text-light">
                  <h4>EMI</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="customerName">Customer Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            name="customerName"
                            placeholder="Customer Name"
                            value={selectedCustomerName}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="emi">EMI</label>
                          <input
                            type="number"
                            className="form-control"
                            id="emiAmount"
                            name="emiAmount"
                            placeholder="EMI Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="customerNumber">Customer Mobile</label>
                          <input
                            type="text"
                            className="form-control"
                            id="customerNumber"
                            name="customerNumber"
                            placeholder="Customer Mobile"
                            value={selectedMobileNumber}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group mt-1">
                          <label>Scheme Id</label>
                          <Select
                            options={schemeIds}
                            value={
                              selectedSchemeId
                                ? { value: selectedSchemeId, label: selectedSchemeId }
                                : null
                            }
                            onChange={handleSchemeIdChange}
                            isClearable={true}
                            placeholder="Select Scheme ID"
                            isSearchable={true}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="membershipId">Membership ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="membershipId"
                            name="membershipId"
                            placeholder="Membership ID"
                            value={selectedMembershipId}
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
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}

                            // onChange={(e) => {
                            //   const newDate = moment(e.target.value).format('DD/MM/YYYY');
                            //   setSelectedDate(newDate);
                            // }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary m-2"
                        onClick={clearForm}
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
      </Modal.Body>
    </Modal>
  );
}

export default SwarnaEmiModal;

