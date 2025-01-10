import React from 'react';
import Nav from '../Others/Nav';
import {Table,Button} from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import logo  from '../style/logo.png'
function CashBook() {
    const handlePrint = () => {
        const input = document.getElementById('printable');
    
        html2canvas(input)
        .then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 page width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            // Set minimum height for the table image
            const minHeight = 50; // Adjust as needed
            const tableHeight = Math.max(imgHeight, minHeight);
    
            // Calculate margin
            const margin = 10; // Set your desired margin in mm
            const boxWidth = imgWidth - margin * 2;
    
            // Calculate startY to position the table at the top of the page
            const startY = margin; // Adjust as needed
    
            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', margin, startY, boxWidth, tableHeight);
    
            // Save or print the PDF
            pdf.autoPrint(); // Automatically opens the print dialog
            window.open(pdf.output('bloburl'), '_blank'); // Opens the PDF in a new tab
          });
    };
    const transactions = [
        { slNo: 1, date: '2024-03-30', description: 'Balance b/d', rNo: '1234', description2: "Salary", amount: 500, vNo: 'V001', expense: 400,date2:"2024-03-31" },
        { slNo: 2, date: '2024-03-30', description: 'Membership', rNo: '1235', description2: "Stationary", amount: 600, vNo: 'V002', expense: 200,date2:"2024-03-31" },
        { slNo: 2, date: '2024-03-30', description: 'Membership', rNo: '1236', description2: "Bank", amount: 300, vNo: 'V003', expense: 150,date2:"2024-03-31" },
        // Add more transactions here as needed
    ];

    const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpense = transactions.reduce((acc, transaction) => acc + transaction.expense, 0);
    const balanceCarriedForward = totalAmount - totalExpense;

    return (
        <div>
            <Nav />
            <Button className="primary" style={{float:"right",marginRight:"10rem"}}><FontAwesomeIcon icon={faPrint} onClick={handlePrint}/></Button>
            <div id='printable'>
            <div style={{ textAlign: "center" }}>
                <div style={{ marginLeft: "12rem" }}>
                    <img src={logo} alt="logo" width="100px" />
                </div>
                <h2 style={{ marginLeft: "12rem" }}>Cash Book</h2>
                <h6>Branch Name</h6>
            </div>
            
            
            <Table striped bordered hover>
                <thead>
                <tr>
                        <th colSpan={5} style={{ textAlign: 'center' }}>Receipt Side</th>
                        <th colSpan={4} style={{ textAlign: 'center' }}>Payment Side</th>
                    </tr>
                    <tr>
                        <th>Sl No</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>R.No</th>
                        
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Description</th>
                        
                        <th>V.No</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.slNo}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.rNo}</td>
                            
                            <td>{transaction.amount}</td>
                            <td>{transaction.date2}</td>
                            <td>{transaction.description2}</td>
                            <td>{transaction.vNo}</td>
                            <td>{transaction.expense}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={6}></td>
                        <td colSpan={2} style={{ textAlign:"end" }}><b>Balance c/d :</b></td>
                        <td colSpan={0}>{balanceCarriedForward}</td>
                        
                    </tr>
                    <tr>
                    <td colSpan={3}></td>
                        <td colSpan={0} style={{ textAlign: 'end' }}><b>Total:</b> </td>
                        
                        <td colSpan={5}>{totalAmount}</td> 
                    </tr>
                </tbody>
                <tfoot>
                    
                    <tr>
                    <td colSpan={2} style={{ textAlign: 'end' }}><b>Balance b/d:</b>   </td>
                        <td colSpan={7}> {balanceCarriedForward}</td>

                    </tr>
                </tfoot>
            </Table>
            </div>
        </div>
    );
}

export default CashBook;
