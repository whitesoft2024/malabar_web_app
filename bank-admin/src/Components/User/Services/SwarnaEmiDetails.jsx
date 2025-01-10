// // 

// import React, { useState } from 'react';
// import { Modal, Table, Button, Pagination, Form } from 'react-bootstrap';

// function SwarnaEmiDetails({ show, onHide, groupData }) {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [membersPerPage, setMembersPerPage] = useState(5);

//     const members = groupData?.members || [];

//     const indexOfLastMember = currentPage * membersPerPage;
//     const indexOfFirstMember = indexOfLastMember - membersPerPage;
//     const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

//     const totalPages = Math.ceil(members.length / membersPerPage);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const handleMembersPerPageChange = (event) => {
//         setMembersPerPage(Number(event.target.value));
//         setCurrentPage(1);
//     };

//     const renderPaginationItems = () => {
//         let items = [];
//         let startPage, endPage;

//         if (totalPages <= 5) {
//             startPage = 1;
//             endPage = totalPages;
//         } else {
//             if (currentPage <= 3) {
//                 startPage = 1;
//                 endPage = 5;
//             } else if (currentPage + 2 >= totalPages) {
//                 startPage = totalPages - 4;
//                 endPage = totalPages;
//             } else {
//                 startPage = currentPage - 2;
//                 endPage = currentPage + 2;
//             }
//         }

//         for (let number = startPage; number <= endPage; number++) {
//             items.push(
//                 <Pagination.Item
//                     key={number}
//                     active={number === currentPage}
//                     onClick={() => handlePageChange(number)}
//                 >
//                     {number}
//                 </Pagination.Item>
//             );
//         }

//         return items;
//     };

//     const generateTableHeaders = () => {
//         const headers = ['Scheme ID', 'MEMBER NAME'];

//         if (currentMembers.length > 0) {
//             const maxEmis = currentMembers.reduce((max, member) => {
//                 const emiCount = member.installments ? member.installments.length : 0;
//                 return Math.max(max, emiCount);
//             }, 0);
//             for (let i = 1; i <= maxEmis; i++) {
//                 headers.push(`EMI ${i}`);
//                 headers.push(`DATE OF PAYMENT ${i}`);
//             }
//         }
//         return headers;
//     };

//     const generateTableRows = () => {
//         return currentMembers.map((member) => {
//             const row = [member.schemeId, member.customerName];
//             if (Array.isArray(member.installments)) {
//                 member.installments.forEach((emiDetail) => {
//                     row.push(emiDetail.amount);
//                     row.push(emiDetail.date);
//                 });
//             }
//             return row;
//         });
//     };

//     return (
//         <Modal show={show} onHide={onHide} fullscreen>
//             <Modal.Header closeButton>
//                 <Modal.Title>Group Member's EMI Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body style={{ maxWidth: '100%', overflowY: 'auto' }}>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Members per page:</Form.Label>
//                     <Form.Select value={membersPerPage} onChange={handleMembersPerPageChange} style={{ maxWidth: '5%'}}>
//                         <option value="5">5</option>
//                         <option value="10">10</option>
//                         <option value="20">20</option>
//                         <option value="50">50</option>
//                         <option value="100">100</option>

//                     </Form.Select>
//                 </Form.Group>

//                 <Table striped bordered hover style={{ width: '100%', maxHeight: '500px', overflowY: 'auto' }}>
//                     <thead>
//                         <tr>
//                             {generateTableHeaders().map((header, index) => (
//                                 <th key={index}>{header}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {generateTableRows().map((row, index) => (
//                             <tr key={index}>
//                                 {row.map((cell, cellIndex) => (
//                                     <td key={cellIndex}>{cell}</td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>

//                 <Pagination>
//                     <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                     {renderPaginationItems()}
//                     <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                     <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
//                 </Pagination>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onHide}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// export default SwarnaEmiDetails;


import React, { useState } from 'react';
import { Modal, Table, Button, Pagination, Form } from 'react-bootstrap';

function SwarnaEmiDetails({ show, onHide, groupData }) {
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

    const generateTableHeaders = () => {
        const headers = ['Index', 'Scheme ID', 'Member Name'];

        if (currentMembers.length > 0) {
            const maxEmis = currentMembers.reduce((max, member) => {
                const emiCount = member.installments ? member.installments.length : 0;
                return Math.max(max, emiCount);
            }, 0);
            for (let i = 1; i <= maxEmis; i++) {
                headers.push(`EMI ${i}`);
                headers.push(`Date of Payment ${i}`);
            }
        }
        return headers;
    };

    const generateTableRows = () => {
        return currentMembers.map((member, index) => {
            const row = [(indexOfFirstMember + index + 1), member.schemeId, member.customerName];
            if (Array.isArray(member.installments)) {
                member.installments.forEach((emiDetail) => {
                    row.push(emiDetail.amount);
                    row.push(emiDetail.date);
                });
            }
            return row;
        });
    };

    return (
        <Modal show={show} onHide={onHide} fullscreen>
            <Modal.Header closeButton>
                <Modal.Title>{groupData?.groupName} MEMBER'S EMI DETAILS  </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxWidth: '100%', overflowY: 'auto' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Members per page:</Form.Label>
                    <Form.Select value={membersPerPage} onChange={handleMembersPerPageChange} style={{ maxWidth: '5%' }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </Form.Select>
                </Form.Group>

                <Table striped bordered hover style={{ width: '100%', maxHeight: '500px', overflowY: 'auto' }}>
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

                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {renderPaginationItems()}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SwarnaEmiDetails;
