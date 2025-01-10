import React, { useState,useContext, useEffect  } from 'react'
import Nav from '../../Others/Nav';
import { faUser, faHouse, faPowerOff, faE, faCalendarDays, faCalendarPlus,faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import LoanEmMImodal from '../Services/LoanEMImodal'
import { UserContext } from "../../Others/UserContext";
import axios from "axios";
import LoanEMIHistoryModal from './LoanEMIHistoryModal';

function LoanEMI() {
    const [showEmiModal, setShowEmiModal] = useState(false);
    const [showEmiHistoryModal, setShowEmiHistoryModal] = useState(false);

    const [loan, setLoan] = useState([]); 
    const [loanScheme, setLoanScheme] = useState([]);
    const [branchCode, setBranchCode] = useState('');
    const { user, setUser } = useContext(UserContext);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loanSearchTerm, setLoanSearchTerm] = useState('');




    useEffect(() => {
      fetchLoanScheme();
      
    }, []);
    useEffect(() => {
 
      fetchLoanData();
    }, [currentPage, itemsPerPage,loanSearchTerm]);
    
    const fetchLoanScheme = async () => {
      try {
        const response = await fetch('https://api.malabarbank.in/api/loanScheme');
        const { totalPages, loanData } = response.data; // Destructure the response
        setLoanScheme(loanData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    const fetchLoanData = async () => {
      const branchCode = user?.branchDetails?.branchCode;
      const loanNumber = loanSearchTerm; // Assuming loanSearchTerm is a state variable holding the user's search term

      try {
        const response = await axios.get(`https://api.malabarbank.in/getBranchLoanDetailsPG?branchCode=${branchCode}&loanNumber=${loanNumber}&page=${currentPage}&limit=${itemsPerPage}`);
        const { totalPages, loanData } = response.data; // Destructure the response
        setLoan(loanData); // Set the loan data
        setTotalPages(totalPages); // Set the total pages
      } catch (error) {
        console.error('Error fetching loan data:', error);
      }
    };
  


    function handleEmiClick() {
        setShowEmiModal(true)
      }


      
  ///membergroup  selection 
  function handleEmiDetailsClick(formData) {
    console.log("nte endi", formData);
    setSelectedGroupId(formData._id); // Assuming each group object has a group_id property
    console.log("firstman", selectedGroupId)
    setShowEmiHistoryModal(true); // Assuming you have a state to control the modal visibility
  }



   

  return (
    <div>
        <Nav/>
        <div className='container'>
            <h2>LOAN EMI</h2>
            <div>
           
            <div className="App">
            <div className="me-5">
              <input type="text" className="form-control" size="1" style={{ width: 'auto', height: '40px',width:'250px',marginRight:'500px' }} placeholder="Enter Loan Number" value={loanSearchTerm} onChange={(e) => setLoanSearchTerm(e.target.value)} />
{/*  <button className="btn btn-primary" onClick={() => fetchLoanData()}>Search</button> */}
</div>
              <div className="circle-buttons-container">
             {/* <div className="circle-button" onClick={handlePlusIconScheme}>
                  <FontAwesomeIcon icon={faPlus} />
                </div> */}
             
                <div className="circle-button">
                  <FontAwesomeIcon icon={faCalendarPlus} onClick={handleEmiClick} />

                </div>
                {/* <div className="circle-button">
                  <FontAwesomeIcon icon={faCalendarDays} />

                </div>

                */}
                <div className="circle-button">
                  <FontAwesomeIcon icon={faE} onClick={handleEmiDetailsClick} />
                </div> 

                   <div className="circle-button">
                  <FontAwesomeIcon icon={faPrint} />
                </div> 
              </div>
            </div>
            <center>
              <div className="table-container">
              <Table striped bordered hover>
          <thead>
            <tr>
              <th>SL NO</th>
              <th>LOAN SANCTION DATE</th>
              <th>MEMBERSHIP ID</th>
              <th>CUSTOMER NAME</th>
              <th>LOAN NUMBER</th>
              <th>REFERENCE NAME</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            
          {Array.isArray(loan) && loan.map((formData, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{formData.date}</td>
    <td>{formData.membershipId}</td>
    <td>{formData.customerName}</td>
    <td>{formData.loanNumber}</td>
    <td>{formData.referenceName}</td>
    <td>{formData.amount}</td>
  </tr>
  
))}

          </tbody>
        </Table>

        <div class="d-flex justify-content-center align-items-center mb-5">
  <button class="btn btn-sm btn-outline-secondary me-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
  <span class="me-2">Page {currentPage} of {totalPages}</span>
  <button class="btn btn-sm btn-outline-secondary ms-2" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>

  <select class="form-select me-2 ms-2 "  size="1" style={{ width: 'auto', height: '36px' }} value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
    <option value="50">100</option>

  </select>
</div>
              </div>



            </center>
          </div>
        </div>

        <LoanEmMImodal
          show={showEmiModal}
          onHide={() => setShowEmiModal(false)}
        />

<LoanEMIHistoryModal
show={showEmiHistoryModal}
onHide={()=>setShowEmiHistoryModal(false)}
groupId={selectedGroupId}


/>

        
    </div>
  )
}

export default LoanEMI