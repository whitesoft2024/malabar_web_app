import { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import GdcsGroupEmiDetails from './GdcsGroupEmiDetails';
function GroupMemberDetailsModal({ show, onHide, groupId }) {
  const [showGroupEmiModal, setShowGroupEmiModal] = useState(false);

    const [groupMembers, setGroupMembers] = useState([]); 

       // Depend on selectedGroupId to refetch when it changes
        console.log("first things first",groupId)
       useEffect(() => {
        const fetchGroupMembers = async () => {
          if (!groupId) return; // Exit if no group ID is selected
    
          try {
            const response = await fetch(`https://api.malabarbank.in/api/group/${groupId}/members`);
            if (!response.ok) {
              throw new Error("Failed to fetch group members");
            }
            const data = await response.json();
            console.log("Datas",data);
    
            setGroupMembers(data.data); // Update the state with the fetched group members
          } catch (error) {
            console.error("Failed to fetch group members:", error);
          }
        };
    
        fetchGroupMembers();
      }, [groupId]); // Depend on groupId to refetch when it changes


    //emi group detail modal
function handleEmiClick(){
  setShowGroupEmiModal(true)
}

 return (
   <>
    


    
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Group Member Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Customer Mobile</th>
              <th>Membership Id</th>
              <th>Date of Join</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {groupMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.customerName}</td>
                <td>{member.phoneNumber}</td>
                <td>{member.membershipId}</td>
                <td>{member.date}</td>
                {/* Add more data as needed */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary"  onClick={handleEmiClick}>
          EMI Details
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>




    {/* //group member emi details modal */}   
    <GdcsGroupEmiDetails
 show={showGroupEmiModal}
 onHide={() => setShowGroupEmiModal(false)}
 groupId={groupId} // Pass the groupId here
/>


    </>
 );
}


export default GroupMemberDetailsModal;