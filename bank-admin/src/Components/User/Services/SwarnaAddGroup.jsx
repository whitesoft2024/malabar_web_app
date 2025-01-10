import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';

function SwarnaAddGroup({ show, onHide }) {
  // Initial form data state
  const [formData, setFormData] = useState({
    groupName: '',
    EMI: '', // Assuming EMI is a fixed value or calculated elsewhere
    date: '',
    numberOfMembers: '1000',
    price: '1 Pavan Gold', // Default value
    duration: '50',
  });

  // Handler for input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//   // Handler for form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     try {
//       const response = await axios.post('https://api.malabarbank.in/api/swarna1/addgroup', formData);
//       console.log(response.data); // Log the response data
//       // Clear the form or perform additional actions as needed
//       setFormData({
//         groupName: '',
//         EMI: '',
//         date: '',
//         numberOfMembers: '1000',
//         price: '1 Pavan Gold',
//         duration: '50',
//       });
//       onHide(); // Close the modal
//     } catch (error) {
//       console.error(error); // Log any errors
//     }
//   };

// Handler for form submission
// const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     try {
//         const response = await axios.post('https://api.malabarbank.in/api/swarna1/addgroup', formData);
        
//         // Log the response data
//         console.log(response.data);

//         // Show success message from the backend as an alert
//         alert(response.data.message);

//         // Clear the form or perform additional actions as needed
//         setFormData({
//             groupName: '',
//             EMI: '',
//             date: '',
//             numberOfMembers: '1000',
//             price: '1 Pavan Gold',
//             duration: '50',
//         });

//         onHide(); // Close the modal
//     } catch (error) {
//         console.error(error); // Log any errors

//         // Check if the error response has a message from the backend
//         if (error.response && error.response.data && error.response.data.message) {
//             alert(`Error: ${error.response.data.message}`);
//         } else {
//             alert('An unexpected error occurred. Please try again.');
//         }
//     }
// };



const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission
    // Check if we're already submitting
    if (formData.submitting) return;

    // Disable the submit button
    setFormData(prev => ({...prev, submitting: true}));
  
  // Format the date in dd/mm/yyyy format
  const [year, month, day] = formData.date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  // Prepare the updated formData with the formatted date
  const updatedFormData = { 
      ...formData, 
      date: formattedDate 
  };

  try {
      const response = await axios.post('https://api.malabarbank.in/api/swarna1/addgroup', updatedFormData);
      
      // Log the response data
      console.log(response.data);

      // Show success message from the backend as an alert
      alert(response.data.message);

      // Clear the form or perform additional actions as needed
      setFormData({
          groupName: '',
          EMI: '',
          date: '',
          numberOfMembers: '1000',
          price: '1 Pavan Gold',
          duration: '50',
      });

      onHide(); // Close the modal
      window.location.reload() 
  } catch (error) {
      console.error(error); // Log any errors

      // Check if the error response has a message from the backend
      if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
              // Enable the button again on failure
    setFormData(prev => ({...prev, submitting: false}));
      } else {
          alert('An unexpected error occurred. Please try again.');
      }
          // Enable the button again on failure
    setFormData(prev => ({...prev, submitting: false}));
  }
};


  return (
    <div>
      <Modal show={show} onHide={onHide} dialogClassName="custom-modal-width">
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>NEW SWARNANIDHI GROUP</h4>
              </div>
              <div className="card-body ">
                <form onSubmit={handleSubmit} className="ms-5 mt-3">
                  <div className="form-group d-flex flex-row">
                    <div className="col-6">
                      <label htmlFor="groupName">Group Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="groupName"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleChange}
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="emi">EMI Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        id="EMI"
                        name="EMI"
                        value={formData.EMI}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="date">Start Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="randomField4">Number of Members</label>
                      <input
                        type="number"
                        className="form-control"
                        id="randomField4"
                        name="numberOfMembers"
                        value={formData.numberOfMembers}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="Price">Price </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="duration">Duration in Month</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                  <center>
                    <div className="form-group mt-5 me-5">
                      <button type="submit" className="btn btn-primary" disabled={formData.submitting}>
                        {formData.submitting ? 'Submitting...' : 'Create'}
                      </button>
                      <Button variant="danger" onClick={onHide}>
                        Close
                      </Button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SwarnaAddGroup;
