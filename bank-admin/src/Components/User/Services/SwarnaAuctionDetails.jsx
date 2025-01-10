

import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Pagination, Form } from 'react-bootstrap';

function SwarnaAuctionDetails({ show, onHide }) {
  const [activeTab, setActiveTab] = useState('firstPrice');
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchAuctionData = () => {
    fetch(`https://api.malabarbank.in/api/getswarnaPaginated`)
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.schemes || []);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    if (show) {
      fetchAuctionData();
    }
  }, [show]);

  const getActivePriceData = (scheme) => {
    if (!scheme.auctionDetails || scheme.auctionDetails.length === 0) {
      return [];
    }
    
    const activeDetails = scheme.auctionDetails[0];
    
    switch (activeTab) {
      case 'firstPrice':
        return activeDetails.firstPrice || [];
      case 'secondPrice':
        return activeDetails.secondPrice || [];
      case 'thirdPrice':
        return activeDetails.thirdPrice || [];
      default:
        return [];
    }
  };

  const getPaginatedData = () => {
    const allData = apiData.flatMap(scheme => {
      const priceData = getActivePriceData(scheme);
      return priceData.map(item => ({...item, groupName: scheme.groupName}));
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  const renderTable = () => {
    const paginatedData = getPaginatedData();
    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan="7">No data available</td>
        </tr>
      );
    }
  
    return paginatedData.map((item, index) => {
      const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
      return (
        <tr key={`${item.schemeId}-${index}`}>
          <td>{globalIndex}</td>
          <td>{item.customerName || '-'}</td>
          <td>{item.customerNumber || '-'}</td>
          <td>{item.membershipId || '-'}</td>
          <td>{item.schemeId || '-'}</td>
          <td>{item.groupName || '-'}</td>
          <td>{item.date || '-'}</td>
        </tr>
      );
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getTotalItems = () => {
    return apiData.reduce((total, scheme) => {
      return total + getActivePriceData(scheme).length;
    }, 0);
  };

  const totalItems = getTotalItems();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Auction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tabs mb-3">
          <Button 
            variant={activeTab === 'firstPrice' ? "primary" : "outline-primary"} 
            className="me-1" 
            onClick={() => { setActiveTab('firstPrice'); setCurrentPage(1); }}
          >
            First Price
          </Button>
          <Button 
            variant={activeTab === 'secondPrice' ? "primary" : "outline-primary"} 
            className="me-1" 
            onClick={() => { setActiveTab('secondPrice'); setCurrentPage(1); }}
          >
            Second Price
          </Button>
          <Button 
            variant={activeTab === 'thirdPrice' ? "primary" : "outline-primary"} 
            onClick={() => { setActiveTab('thirdPrice'); setCurrentPage(1); }}
          >
            Third Price
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <Form.Label style={{ marginRight: '1rem', marginBottom: 0 }}>Items per page:</Form.Label>
          <Form.Select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange} 
            style={{ width: '80px' }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Select>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Customer Number</th>
              <th>Membership ID</th>
              <th>Scheme ID</th>
              <th>Group Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </Table>

        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {renderPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </Modal.Body>
    </Modal>
  );
}

export default SwarnaAuctionDetails;