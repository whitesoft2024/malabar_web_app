import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

function SwarnaAuction({ show, onHide }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [schemeIds, setSchemeIds] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedApi, setSelectedApi] = useState(""); // New state for API selection
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://api.malabarbank.in/api/getswarna");
        setGroups(response.data.schemes || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    if (show) {
      fetchGroups();
      setSelectedGroupId("");
      setSelectedGroup(null);
      setSchemeIds([]);
      setSelectedSchemeId("");
      setSelectedMember(null);
      setSelectedApi(""); // Reset API selection when modal opens
      setCurrentDate(new Date().toISOString().split("T")[0]); // Set current date
    }
  }, [show]);

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);

    const group = groups.find((grp) => grp._id === groupId);
    setSelectedGroup(group);

    if (group) {
      const schemes = group.members
        .map((member) => member.schemeId)
        .filter((id) => id);
      setSchemeIds(schemes);
    } else {
      setSchemeIds([]);
    }

    setSelectedSchemeId("");
    setSelectedMember(null);
  };

  const handleSchemeChange = (e) => {
    const schemeId = e.target.value;
    setSelectedSchemeId(schemeId);

    if (selectedGroup) {
      const member = selectedGroup.members.find(
        (mem) => mem.schemeId === schemeId
      );
      setSelectedMember(member || null);
    } else {
      setSelectedMember(null);
    }
  };

  const handleApiChange = (e) => {
    setSelectedApi(e.target.value);
  };

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };


  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if we're already submitting
    if (isSubmitting) return; // Prevent duplicate submissions

    // Disable the submit button
    setIsSubmitting(true); // Set submitting state to true

    if (!selectedApi || !selectedGroupId) {
      alert("Please select an API and a group.");
      return;
    }

    const apiUrl = `https://api.malabarbank.in/api/${selectedApi}/${selectedGroupId}`;
    
    const formattedDate = formatDate(currentDate);

    try {
      const response = await axios.post(apiUrl, {
        // Include any additional payload data here
        membershipId: selectedMember.membershipId,
        customerName: selectedMember.customerName,
        customerNumber: selectedMember.customerNumber,
        schemeId: selectedSchemeId,
        date: formattedDate, // Include formatted date in the payload
      });

      alert(response.data.message || "Request successful!");
      onHide(); // Close the modal on success
      window.location.reload() 

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("There was an error submitting the data.");
    }
    setIsSubmitting(false); // Re-enable the submit button

  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title>SWARNANIDHI AUCTION</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
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
              <div className="form-group">
                <label htmlFor="apiSelection">Select Price</label>
                <select
                  className="form-control"
                  id="apiSelection"
                  onChange={handleApiChange}
                  value={selectedApi}
                  required
                >
                  <option value="">Select Price</option>
                  <option value="addFirstPrice">Add First Price</option>
                  <option value="addSecondPrice">Add Second Price</option>
                  <option value="addThirdPrice">Add Third Price</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="numberOfMembers">Number of Members</label>
                <input
                  type="text"
                  className="form-control"
                  id="numberOfMembers"
                  value={selectedGroup?.numberOfMembers || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentDate">Current Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="currentDate"
                  value={currentDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="customerSchemeId">Customer Scheme ID</label>
                <select
                  className="form-control"
                  id="customerSchemeId"
                  onChange={handleSchemeChange}
                  value={selectedSchemeId}
                  required
                  // disabled={!schemeIds.length}
                >
                  <option value="">Select Scheme ID</option>
                  {schemeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="membershipId">Membership ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="membershipId"
                  value={selectedMember?.membershipId || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountHolderName">Account Holder Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="accountHolderName"
                  value={selectedMember?.customerName || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="customerMobile">Customer Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  id="customerMobile"
                  value={selectedMember?.customerNumber || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="primary" type="submit" disabled={!selectedMember || !selectedApi|| isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default SwarnaAuction;
