import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, Modal,Table } from 'react-bootstrap'
// import "../GdcsGroupEmiDetails.css"
function GdcsGroupEmiDetails({ show, onHide,groupId }) {

    // const [groupEmiDetails, setGroupEmiDetails] = useState([]);
    const [groupEmiDetails, setGroupEmiDetails] = useState({ members: [] });
    const [numberOfMembers, setNumberOfMembers] = useState(0); 
    const [initialEmiAmount,setInitialEmiAmount]=useState('')
    const [amounts,setAmounts]=useState('')
    const [dates,setDates]=useState('')



   useEffect(() => {
    const fetchGroupEmiDetails = async () => {
        console.log("dilip",groupId);
      if (!groupId) return; // Exit if no group ID is selected

      try {
        const response = await fetch(`https://api.malabarbank.in/api/group/${groupId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch group EMI details");
        }
        const data = await response.json();
        console.log("cm",data);
        setGroupEmiDetails(data.data); // Update the state with the fetched EMI details
         console.log("jibin",groupEmiDetails)
         setNumberOfMembers(data.data.numberofMember); // Extract and store the numberOfMembers property
         setInitialEmiAmount(data.data.members.amount)
         console.log("manesh",numberOfMembers)
         console.log("amal",initialEmiAmount)


         
      const extractedAmounts = data.data.members.map(({ amount }) => amount);
      const extractedDates = data.data.members.map(({ date }) => date);

      setAmounts(extractedAmounts);
      setDates(extractedDates);
      console.log("marmam",amounts)
      console.log("ranga",dates);
      } catch (error) {
        console.error("Failed to fetch group EMI details:", error);
      }
    };

    fetchGroupEmiDetails();
 }, [show]);



 // Function to generate table headers

 const generateTableHeaders = () => {
    const headers = ['GDCS NUMBER', 'MEMBER NAME'];

 
    // Check if groupEmiDetails and groupEmiDetails.members are defined
    if (groupEmiDetails && Array.isArray(groupEmiDetails.members)) {
       const maxEmis = groupEmiDetails.members.reduce((max, member) => {
         // Ensure member.monthlyEmi is defined and is an array before accessing its length
         const emiCount = member.monthlyEmi ? member.monthlyEmi.length : 0;
         return Math.max(max, emiCount);
       }, 0);
       for (let i = 1; i <= maxEmis; i++) {
         headers.push(`EMI ${i}`);
         headers.push(`DATE OF PAYMENT ${i}`);
       }
    }
    return headers;
   };
   
   

 // Function to generate table rows
 const generateTableRows = () => {
    if (!Array.isArray(groupEmiDetails.members)) {
       return []; // Return an empty array if members is not an array
    }
    return groupEmiDetails.members.map((member, memberIndex) => {
       const row = [member.GDCSNumber, member.customerName];
       if (Array.isArray(member.monthlyEmi)) {
         member.monthlyEmi.forEach((emiDetail, emiIndex) => {
           row.push(emiDetail.payableAmount);
           row.push(emiDetail.date);
         });
       }
       return row;
    });
   };

 
   

  return (
    <>
<Modal show={show} onHide={onHide} fullscreen>
 <Modal.Header closeButton>
    <Modal.Title>Group Member's EMI Details</Modal.Title>
 </Modal.Header>
 <Modal.Body style={{ maxWidth: '100%', overflowY: 'auto' }}>
    <Table  
    striped bordered hover style={{ width: '100%', maxHeight: '500px', overflowY: 'auto' }}>
      <thead>
        <tr>
          {generateTableHeaders().map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {generateTableRows().map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
 </Modal.Body>
 <Modal.Footer>
    <Button variant="secondary" onClick={onHide}>
      Close
    </Button>
 </Modal.Footer>
</Modal>



    </>
  )
}

export default GdcsGroupEmiDetails