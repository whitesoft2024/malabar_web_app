
import React, { useState } from 'react';
import { Modal, Table, Button, Pagination, Form } from 'react-bootstrap';
import SwarnaEmiDetails from './SwarnaEmiDetails';

function SwarnaGroupMembersModal({ show, onHide, groupData }) {
    const [showEmiDetails, setShowEmiDetails] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [membersPerPage, setMembersPerPage] = useState(5);

    const members = groupData?.members || [];

    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    const totalPages = Math.ceil(members.length / membersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMembersPerPageChange = (event) => {
        setMembersPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const renderPaginationItems = () => {
        let items = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>GROUP MEMBERS - {groupData?.groupName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Members per page:</Form.Label>
                        <Form.Select value={membersPerPage} onChange={handleMembersPerPageChange} style={{ maxWidth: '10%'}}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>

                        </Form.Select>
                    </Form.Group>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>SL NO</th>
                                <th>Customer Name</th>
                                <th>Membership ID</th>
                                <th>Scheme ID</th>
                                <th>Branch Code</th>
                                <th>Reference Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={member._id}>
                                    <td>{indexOfFirstMember + index + 1}</td>
                                    <td>{member.customerName}</td>
                                    <td>{member.membershipId}</td>
                                    <td>{member.schemeId}</td>
                                    <td>{member.branchCode}</td>
                                    <td>{member.referenceName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowEmiDetails(true)}>
                        EMI Details
                    </Button>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {showEmiDetails && (
                <SwarnaEmiDetails
                    show={showEmiDetails}
                    onHide={() => setShowEmiDetails(false)}
                    groupData={groupData}
                />
            )}
        </>
    );
}

export default SwarnaGroupMembersModal;

// import React, { useEffect, useState, useContext } from "react";
// import { Table, Pagination, Dropdown } from "react-bootstrap";
// import axios from "axios";
// import { UserContext } from "../../Others/UserContext";

// const SwarnaNidhi = () => {
//   const [groupData, setGroupData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
//   const [searchTerm, setSearchTerm] = useState("");
//   const [visiblePages, setVisiblePages] = useState([]);
//   const { user } = useContext(UserContext);
  
//   // Fetch group data
//   useEffect(() => {
//     const fetchGroupData = async () => {
//       try {
//         const response = await axios.get('https://api.malabarbank.in/api/getswarna');
//         setGroupData(response.data.schemes);
//       } catch (error) {
//         console.error('Error fetching group data:', error);
//       }
//     };
//     fetchGroupData();
//   }, []);

//   // Filter data based on search term
//   const filteredData = groupData.flatMap(group =>
//     group.members.filter(member =>
//       member.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       member.schemeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       member.customerNumber.includes(searchTerm) ||
//       member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // Pagination logic
//   const totalItems = filteredData.length;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   // Change the number of items per page
//   const handleItemsPerPageChange = (value) => {
//     setItemsPerPage(value);
//     setCurrentPage(1); // Reset to first page when items per page changes
//   };

//   // Update pagination numbers to show only 5 at a time
//   useEffect(() => {
//     const startPage = Math.max(1, currentPage - 2);
//     const endPage = Math.min(totalPages, startPage + 4);

//     setVisiblePages(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
//   }, [currentPage, totalItems, itemsPerPage]);

//   // Handle pagination change
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div>
//       <h2>SWARNANIDHI SCHEME</h2>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {/* Dropdown for selecting items per page */}
//       <Dropdown onSelect={handleItemsPerPageChange}>
//         <Dropdown.Toggle variant="secondary">
//           Items per page: {itemsPerPage}
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           {[10, 20, 30, 50, 100].map((num) => (
//             <Dropdown.Item key={num} eventKey={num}>
//               {num}
//             </Dropdown.Item>
//           ))}
//         </Dropdown.Menu>
//       </Dropdown>

//       {/* Table */}
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>SL NO</th>
//             <th>CUSTOMER NAME</th>
//             <th>SCHEME ID</th>
//             <th>CONTACT NUMBER</th>
//             <th>MEMBERSHIP ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.map((member, index) => (
//             <tr key={member._id}>
//               <td>{indexOfFirstItem + index + 1}</td>
//               <td>{member.customerName}</td>
//               <td>{member.schemeId}</td>
//               <td>{member.customerNumber}</td>
//               <td>{member.membershipId}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//       <Pagination>
//         {currentPage > 1 && <Pagination.Prev onClick={() => paginate(currentPage - 1)} />}
//         {visiblePages.map((page) => (
//           <Pagination.Item
//             key={page}
//             active={page === currentPage}
//             onClick={() => paginate(page)}
//           >
//             {page}
//           </Pagination.Item>
//         ))}
//         {currentPage < totalPages && <Pagination.Next onClick={() => paginate(currentPage + 1)} />}
//       </Pagination>
//     </div>
//   );
// };

// export default SwarnaNidhi;

