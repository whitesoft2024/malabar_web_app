import React, { useState,useContext } from 'react'
import { useEffect } from 'react';
import { Button, Modal,Table } from 'react-bootstrap'
import { UserContext } from "../../Others/UserContext";
import axios from 'axios';

function LoanEMIHistoryModal({ show, onHide,groupId }) {
    const [branchCode, setBranchCode] = useState('');
    const { user, setUser } = useContext(UserContext);
    const[loanEmiDetails,setLoanEmiDetails]=useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loanSearchTerm, setLoanSearchTerm] = useState('');



    
    useEffect(() => {
        fetchLoanMemberData();
      }, [currentPage, itemsPerPage,loanSearchTerm]);
    

      const fetchLoanMemberData = async () => {
        const branchCode = user?.branchDetails?.branchCode;
        const loanNumber = loanSearchTerm; // Assuming loanSearchTerm is a state variable holding the user's search term

        try {
          const response = await axios.get(`https://api.malabarbank.in/getBranchLoanDetailsPG?branchCode=${branchCode}&loanNumber=${loanNumber}&page=${currentPage}&limit=${itemsPerPage}`);
          // setLoanEmiDetails(response.data); 
          // console.log("wtf",loanEmiDetails);

          const { totalPages, loanData } = response.data; // Destructure the response
          setLoanEmiDetails(loanData); // Set the loan data
          setTotalPages(totalPages); // Set the total pages
        } catch (error) {
          console.error('Error fetching loan data:', error);
        }
      };
    


     // Function to generate table headers

//  const generateTableHeaders = () => {
//     const headers = ['LOAN NUMBER', 'MEMBER NAME'];

 
//     // Check if groupEmiDetails and groupEmiDetails.members are defined
//     if (fetchLoanMemberData && Array.isArray(fetchLoanMemberData.members)) {
//        const maxEmis = fetchLoanMemberData.members.reduce((max, member) => {
//          // Ensure member.monthlyEmi is defined and is an array before accessing its length
//          const emiCount = member.monthlyEmi ? member.monthlyEmi.length : 0;
//          return Math.max(max, emiCount);
//        }, 0);
//        for (let i = 1; i <= maxEmis; i++) {
//          headers.push(`EMI ${i}`);
//          headers.push(`DATE OF PAYMENT ${i}`);
//        }
//     }
//     return headers;
//    };
   
   

 // Function to generate table rows
//  const generateTableRows = () => {
//     if (!Array.isArray(fetchLoanMemberData.members)) {
//        return []; // Return an empty array if members is not an array
//     }
//     return fetchLoanMemberData.members.map((member, memberIndex) => {
//        const row = [member.GDCSNumber, member.customerName];
//        if (Array.isArray(member.monthlyEmi)) {
//          member.monthlyEmi.forEach((emiDetail, emiIndex) => {
//            row.push(emiDetail.payableAmount);
//            row.push(emiDetail.date);
//          });
//        }
//        return row;
//     });
//    };


 const generateTableHeaders = () => {
    const headers = ['CUSTOMER NAME', 'LOAN NUMBER'];
    const maxEmis = loanEmiDetails.reduce((max, member) => {
      return Math.max(max, member.loanEMI.length);
    }, 0);
    for (let i = 1; i <= maxEmis; i++) {
      headers.push(`EMI ${i} AMOUNT`);
      headers.push(`EMI ${i} DATE`);
    }
    return headers;
  };

  const generateTableRows = () => {
    return loanEmiDetails.map((member, memberIndex) => {
      const row = [member.customerName, member.loanNumber];
      member.loanEMI.forEach((emi, emiIndex) => {
        row.push(emi.amount);
        row.push(emi.date);
      });
      return row;
    });
  };

  return (
   <>

<Modal show={show} onHide={onHide} size="lg" centered fullscreen>
 <Modal.Header closeButton>
    <Modal.Title> Member EMI History</Modal.Title>
 </Modal.Header>
 <Modal.Body  style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div  style={{ 
        width: '100%', 
        overflow: 'auto', 
        maxHeight: 'calc(100% - 60px)', // Adjust maxHeight to fit the modal body minus the space for pagination controls
        boxSizing: 'border-box',
        minHeight: '500px', // Set a minimum height to ensure the div expands vertically
        border: '1px solid #ccc' //
        
    }}>
    <Table  striped bordered hover style={{  overflowY: 'hidden', overflowX: 'hidden', maxHeight: 'none',maxWidth: 'none',marginTop:'0px'}}>
      <thead>
        <tr>
          {generateTableHeaders().map((header, index) => (
            <th key={index} style={{ backgroundColor: '#b3e6fc' }}>{header}</th>
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
    </div>
    

    <div className="d-flex justify-content-between align-items-center mt-3 w-100">
  {/* Spacer Element to Push Search Input to the Left */}
  <div className="flex-grow-1"></div>

  {/* Search Input Box */}
  <div className="me-5">
    <input type="text" className="form-control border-dark" size="1" style={{ width: '250px' }} placeholder="Enter Loan Number" value={loanSearchTerm} onChange={(e) => setLoanSearchTerm(e.target.value)} />
  </div>

  {/* Centered Pagination and Select Controls */}
  <div className="d-flex justify-content-center align-items-center" style={{ marginRight: '500px' }}>
    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span className="me-2">Page {currentPage} of {totalPages}</span>
    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>

    <select className="form-select me-2 ms-2" size="1" style={{ width: 'auto', height: '36px' }} value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
</div>

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

export default LoanEMIHistoryModal