import React, { useEffect, useState, useContext } from "react";
import { Modal, Button,Pagination  } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../Others/UserContext";
import { faUser, faHouse, faPowerOff, faA, faCalendarDays, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../style/logo.png";
import Select from 'react-select';
import SwarnaAddGroup from "./SwarnaAddGroup";
import SwarnaEmiModal from "./SwarnaEmiModal";
import SwarnaAddMemberModal from "./SwarnaAddMemberModal";
import SwarnaGroupMembersModal from "./SwarnaGroupMembersModal";
import SwarnaAuction from "./SwarnaAuction";
import SwarnaAuctionDetails from "./SwarnaAuctionDetails";


const SwarnaNidhi = () => {

 //membergroup states
 const [showMemberGroupModal, setShowMemberGroupModal] = useState(false);
 const [selectedMemberGroup, setSelectedMemberGroup] = useState(null);
 const [showEmiModal, setShowEmiModal] = useState(false);
 const [showAddMemModal, setShowAddMemModal] = useState(false);
 const [groupData, setGroupData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
  const[showAuctionModal,setShowAuctionModal]= useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setUser } = useContext(UserContext);
  const currentDate = new Date().toLocaleDateString();
  const [visiblePages, setVisiblePages] = useState([]);
  const[showAuctionDetailModal,setShowAuctionDetailModal]=useState(false);



 const [gdcsNumber, setGdcsNumber] = useState('');

 const [selectedOption, setSelectedOption] = useState("group");

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handlePlusIconScheme = () => {
    setShowMemberGroupModal(true);
  };

  function handleEmiClick() {
    setShowEmiModal(true)
  }

  function handleAuctionDetailClick () {
    setShowAuctionDetailModal(true)
  }

  const handlePlusIconClick = () => {
    setShowAddMemModal(true);
  };

  const handleAuctionClick = () => {
    setShowAuctionModal(true);
    console.log("FYUNDA");
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get('https://api.malabarbank.in/api/getswarna');
        setGroupData(response.data.schemes);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
  
    fetchGroupData();
  }, []);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowMemberDetailsModal(true);
  };


  const filteredData = groupData.flatMap(group => 
    group.members.filter(member => 
      member.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.schemeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.customerNumber.includes(searchTerm) ||
      member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredData.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // useEffect(() => {
  //   const pages = [];
  //   for (let i = Math.max(currentPage - 4, 1); i <= Math.min(currentPage + 4, Math.ceil(filteredData.length / itemsPerPage)); i++) {
  //     pages.push(i);
  //   }
  //   setVisiblePages(pages);
  // }, [currentPage]);


  useEffect(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    setVisiblePages(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
  }, [currentPage, totalItems, itemsPerPage]);
  

  
  return (
    <div>
    <nav className="navbar navbar-light ">
      <div className="container-fluid">
        <Link
          className="navbar-brand ms-5 d-flex align-items-center"
          to="/main"
        >
          <img
            src={logo}
            alt="logo"
            width="100px"
            className="d-inline-block align-text-top"
          />
          <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
        </Link>
        <div className="d-flex" style={{ width: "500px" }}>
          <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
          <FontAwesomeIcon
            icon={faPowerOff}
            // onClick={handleLogout}
            className="text-danger me-5 mt-4"
          />
          <div className="d-flex">
            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
              <li className="me-2">User</li>
              <li className="me-2">Branch</li>
              <li className="me-2">Branch Code</li>
              <li>Date</li>
            </ul>
            <ul className="list-unstyled mb-1 me-5">
               <li className="me-2">
                : {user ? user.employee.fullname : "N/A"}
              </li>
              <li className="me-2">
                : {user ? user.branchDetails.branch_name : "N/A"}
              </li>
              <li className="me-2">
                : {user ? user.branchDetails.branchCode : "N/A"}
              </li> 
               <li className="me-2">: {currentDate}</li> 
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div className="container border rounded p-4 mt-4 mb-4" style={{ overflow: 'hidden' }}>
      <div>
        <center>
          <h2>SWARNANIDHI SCHEME</h2>
        </center>
      </div>

      <div>
        <center>
          <div>
            <input
              type="radio"
              id="group"
              name="tableOption"
              value="group"
              // checked={selectedOption === "group"}
              onChange={handleRadioChange}
            />
            <label htmlFor="group"> Add New Group</label>

            <input
              type="radio"
              className="ms-3"
              id="scheme"
              name="tableOption"
              value="scheme"
              // checked={selectedOption === "scheme"}
              onChange={handleRadioChange}
            />
            <label htmlFor="scheme">Add Group Member</label>
          </div>
        </center>
      </div>

      {selectedOption === "group" && (



        <div>
          <div className="App">
            <div className="circle-buttons-container">
              <div className="circle-button"
              onClick={handlePlusIconScheme}
              >
                <FontAwesomeIcon icon={faPlus} />
              </div>
              {/* <div className="circle-button">
                <FontAwesomeIcon icon={faPrint} />
              </div> */}
              <div className="circle-button">
                <FontAwesomeIcon icon={faCalendarPlus}  
                onClick={handleEmiClick}
                 />

              </div>
               <div className="circle-button">
                <FontAwesomeIcon icon={faCalendarDays}
                onClick={handleAuctionDetailClick}
                
                />

              </div> 
              <div className="circle-button">
                <FontAwesomeIcon icon={faA}
                                onClick={handleAuctionClick}

                />
              </div>
            </div>
          </div>
          {/* <center>
          <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr
           
            >
              <th>SL NO</th>
              <th>GROUP NAME</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {groupData.map((group, index) => (
              <tr
              
              onClick={() => handleGroupSelect(group)}
              style={{ cursor: 'pointer' }}
              key={group._id}>
                <td>{index + 1}</td>
                <td>{group.groupName}</td>
                <td>{group.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>



          </center> */}
        </div>
      )} 

     





{selectedOption === "group" && (
    <div>
      <center>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>GROUP NAME</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((group, index) => (
                <tr
                  key={group._id}
                  onClick={() => handleGroupSelect(group)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{index + 1}</td>
                  <td>{group.groupName}</td>
                  <td>{group.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </center>
    </div>
  )}

  {selectedOption === "scheme" && (
    <div>

        <div className="circle-buttons-container">
              {/* <div className="circle-button" onClick={handlePlusIconGroup} ><FontAwesomeIcon icon={faPlus} /></div> */}
              <div className="circle-button" 
              
              onClick={handlePlusIconClick}
              
              >
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div className="circle-button">
                <FontAwesomeIcon icon={faPrint} />
              </div>
            </div>
          
      <center>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SL NO</th>
                <th>CUSTOMER NAME</th>
                <th>SCHEME ID</th>
                <th>CONTACT NUMBER</th>
                <th>MEMBERSHIP ID</th>
                <th>DATE OF JOIN</th>
                <th>GROUP NAME</th>
                <th>EMI-TOTAL</th>
                <th>AUCTION STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((member, index) => (
                <tr key={member._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{member.customerName}</td>
                  <td>{member.schemeId}</td>
                  <td>{member.customerNumber}</td>
                  <td>{member.membershipId}</td>
                  <td>{(member.date)}</td>
                  <td>
                    {groupData.find((group) =>
                      group.members.some((m) => m._id === member._id)
                    )?.groupName}
                  </td>
                  <td>
                    {member.installments[member.installments.length - 1]?.emiTotal || 0}
                  </td>
                  <td>
                    {groupData.find((group) =>
                      group.auctionDetails[0]?.firstPrice.some(
                        (p) => p.schemeId === member.schemeId
                      ) ||
                      group.auctionDetails[0]?.secondPrice.some(
                        (p) => p.schemeId === member.schemeId
                      ) ||
                      group.auctionDetails[0]?.thirdPrice.some(
                        (p) => p.schemeId === member.schemeId
                      )
                    )
                      ? "Auctioned"
                      : "Not Auctioned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
        </div>
        
      </center>

      
    </div>
  )}
<div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem 0",
        overflowX: "auto", // Horizontal scrolling for overflow
        whiteSpace: "nowrap", // Prevent pagination items from wrapping
        maxWidth: "100%", // Ensure the pagination fits within the container
      }}
    >
      {/* <Pagination>
        {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map(
          (number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
              style={{ margin: "0.2rem" }}
            >
              {number + 1}
            </Pagination.Item>
          )
        )}
      </Pagination> */}

 <div>
 <Pagination>
    {visiblePages.map((number) => (
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => paginate(number)}
        style={{ margin: "0.2rem" }}
      >
        {number}
      </Pagination.Item>
    ))}
  </Pagination>
 </div>
    </div>

    </div>

    <SwarnaAddGroup  
    show={showMemberGroupModal}
    onHide={() => setShowMemberGroupModal(false)} />

    <SwarnaEmiModal
     show={showEmiModal}
     onHide={() => setShowEmiModal(false)}
    />
<SwarnaAddMemberModal
    show={showAddMemModal}
    onHide={() => setShowAddMemModal(false)}

/>

<SwarnaGroupMembersModal
show={showMemberDetailsModal}
onHide={() => setShowMemberDetailsModal(false)}
groupData={selectedGroup}
/>

<SwarnaAuction
show={showAuctionModal}
onHide={() => setShowAuctionModal(false)}
// groupData={selectedGroup}
/>

<SwarnaAuctionDetails
show={showAuctionDetailModal}
onHide={() => setShowAuctionDetailModal(false)}/>


    </div>




)
}

export default SwarnaNidhi

