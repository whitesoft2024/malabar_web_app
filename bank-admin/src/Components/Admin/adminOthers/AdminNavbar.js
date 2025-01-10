import React from 'react'
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <Navbar expand="lg" className="navbar2">
                <Nav className="mr-auto">
                    <NavDropdown className="navdrop" title="ADMIN" id="dropdown">
                        <NavDropdown.Item className="navdropitem" href="#">
                            Company
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" >
                            <Link to="/branchCreate" style={{ textDecoration: 'none', color: 'inherit' }}>Branch Creation</Link>
                        </NavDropdown.Item>
                        <NavDropdown className="submenu" title="Director" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                New Director
                            </NavDropdown.Item>

                        </NavDropdown>
                        <NavDropdown className="submenu" title="Scheme" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/RDSchemeCreate' style={{ textDecoration: 'none', color: 'inherit' }}>RD Scheme Creation</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/fdSchemeCreate' style={{ textDecoration: 'none', color: 'inherit' }}>Fixed Deposit Scheme Creation</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                 <Link to='/gdcsScheme' style={{ textDecoration: 'none', color: 'inherit' }}> GDCS Scheme Creation</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/loanScheme' style={{ textDecoration: 'none', color: 'inherit' }}> Loan Scheme Creation</Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Head" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Account Group
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Account Head
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Fee Settings
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Gold Gram Rate
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                TDS Settings
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Requests" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to="/branchfundrquest" style={{ textDecoration: 'none', color: 'inherit' }}>Branch Money Transfer Requests </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                ...
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                ...
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item className="navdropitem" href="#">
                            Change Cashier
                        </NavDropdown.Item>
                        <NavDropdown className="submenu" title="User" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Reset Password
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                User Branch Change
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                User Rights
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Group Rights
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                User Status
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Change Designation
                            </NavDropdown.Item>

                        </NavDropdown>
                        <NavDropdown className="submenu" title="Employee Managment" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" >
                                <Link to='/employeeCreate' style={{ textDecoration: 'none', color: 'inherit' }}>Create Employee</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" >
                                <Link to='/designationCreate' style={{ textDecoration: 'none', color: 'inherit' }}>Create Designation</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Employee Active/Deactivate
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Payroll" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Pay Head
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Employee
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Pay Settings
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Salary Posting and Report
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Payslip
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Promoter" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Submenu Item 1
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Submenu Item 2
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Interest Settings" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Master
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Report
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* <NavDropdown className="submenu" title="Reminder" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Reminder
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Reminder Revoke
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                General Reminder
                            </NavDropdown.Item>
                        </NavDropdown> */}
                        <NavDropdown className="submenu" title="Fixed Asset" id="submenu-teller" drop="end">
                            {/* <NavDropdown.Item className="navdropitem" href="#">
                                Asset Group
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Asset Master
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Purchase
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Sales
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Transfer
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Auction
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Damage
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Asset Stock Report
                            </NavDropdown.Item> */}
                        </NavDropdown>
                        <NavDropdown.Item >
                        <Link to='/adminExpenseBook' style={{ textDecoration: 'none', color: 'inherit' }}>Expense Report</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" >
                            <Link to="/adminPaymentLedger" style={{ textDecoration: 'none', color: 'inherit' }}>Payment Ledger</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" >
                            <Link to="/adminReceiptLedger" style={{ textDecoration: 'none', color: 'inherit' }}>Receipt Ledger</Link>
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* <NavDropdown className="navdrop" title="TELLER/CASHIER" id="dropdown">
                        <NavDropdown className="submenu" title="Teller" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Status
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Allotment/Refund
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Balance
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller to Teller Cash Exchange
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Customer Cash Exchange
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Analysis Report
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Cash Exchange Report
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Teller Report
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="Cashier" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                Cashier Vault Position
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Cashier Allotment
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Delete Allotment Refund
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Cash Analysis Report
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                Cashier Allotment and Refund Report
                            </NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown> */}

                    <NavDropdown className="navdrop" title="TRANSACTION" id="dropdown">
                        <NavDropdown className="submenu" title="Fund Transfer" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                PAYMENT GATEWAY
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to="/branchtransfer" style={{ textDecoration: 'none', color: 'inherit' }}>BRANCH MONEY TRANSFER</Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Item className="navdropitem" href="#">
                                <Link to="/bankTransaction" style={{ textDecoration: 'none', color: 'inherit' }}>BANK TRANSACTION</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                                <Link to="/fdbondAdmin" style={{ textDecoration: 'none', color: 'inherit' }}>FD BOND </Link>
                        </NavDropdown.Item>
                        <NavDropdown className="submenu" title="CARD" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                CREATE
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="UPI CREATION" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                CREATE
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown className="submenu" title="SHARE" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/list' style={{ textDecoration: 'none', color: 'inherit' }}>MEMBER DETAILS</Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown className="submenu" title="LOAN" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                EMI
                            </NavDropdown.Item>
                            
                        </NavDropdown>
                       
                        {/* <NavDropdown className="submenu" title="Account Closure" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                SUBMENU ITEM 1
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                SUBMENU ITEM 2
                            </NavDropdown.Item>
                        </NavDropdown> */}
                        
                    </NavDropdown>

                    <NavDropdown className="navdrop" title="LEDGERS" id="dropdown">
                    <NavDropdown.Item className="navdropitem" >
                            <Link to="/adminExpenseBook" style={{ textDecoration: 'none', color: 'inherit' }}>EXPENSE LEDGER</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" >
                            <Link to="/paymentledger" style={{ textDecoration: 'none', color: 'inherit' }}>PAYMENT LEDGER</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" >
                            <Link to="/receiptledger" style={{ textDecoration: 'none', color: 'inherit' }}>RECEIPT LEDGER</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            PERSONAL LEDGER
                        </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown className="navdrop" title="LOAN APPLICATION" id="dropdown">
                        <NavDropdown className="submenu" title="LOAN" id="submenu-teller" drop="end">
                        <NavDropdown.Item className="navdropitem" href="#">
                              LOAN APPLICATION FORM
                            </NavDropdown.Item>
                             <NavDropdown.Item className="navdropitem" href="#">
                             <Link to="/loan" style={{ textDecoration: 'none', color: 'inherit' }}>LOAN SANCTION</Link>  
                            </NavDropdown.Item> 
                            
                            <NavDropdown.Item className="navdropitem" href="#">
                            </NavDropdown.Item>
                        </NavDropdown>
                        
                        <NavDropdown className="submenu" title="Security" id="submenu-teller" drop="end">
                            
                            <NavDropdown.Item className="navdropitem" href="#">
                                Documents Upload
                            </NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown>

                    <NavDropdown className="navdrop" title="REPORTS" id="dropdown">
                        
                        
                        <NavDropdown className="submenu" title="CUSTOMER" id="submenu-teller" drop="end">
                            <NavDropdown.Item className="navdropitem" href="#">
                                INDIVIDUAL REPORT
                            </NavDropdown.Item>
                            
                        </NavDropdown>
                        <NavDropdown className="submenu" title="FINANCIAL REPORT" id="submenu-teller" drop="end">
                            
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/cashbook' style={{ textDecoration: 'none', color: 'inherit' }}>CASH BOOK REPORT</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                <Link to='/bankbook' style={{ textDecoration: 'none', color: 'inherit' }}>BANK BOOK REPORT</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                TRIAL BALANCE
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                PROFIT AND LOSS ACCOUNT
                            </NavDropdown.Item>
                            <NavDropdown.Item className="navdropitem" href="#">
                                BALANCE SHEET
                            </NavDropdown.Item>
                        </NavDropdown>

                    </NavDropdown>

                    {/* <NavDropdown className="navdrop" title="PRINTING" id="dropdown">
                        
                        <NavDropdown.Item className="navdropitem" href="#">
                            CHEQUE PRINTING
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            DUPLICATE PRINTING
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            BOND PRINTING
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            SHARE CERTIFICATE
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            LOAN AGREEMENT REPORT
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to='/passbook' style={{ textDecoration: 'none', color: 'inherit' }}>PASSBOOK</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            INTEREST RECIEVED AND PAID REPORT
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            INTEREST CERTIFICATE
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            LOAN NOC REPORT
                        </NavDropdown.Item>
                    </NavDropdown> */}

                    <NavDropdown className="navdrop" title="DAILY PROCESS" id="dropdown">
                        <NavDropdown.Item className="navdropitem" href="#">
                        <Link to='/dailyReport' style={{ textDecoration: 'none', color: 'inherit' }}>DAY BOOK</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/ClosingDenomination" style={{ textDecoration: 'none', color: 'inherit' }}>CLOSING DENOMINATION</Link>
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* <NavDropdown className="navdrop" title="ASSOCIATE" id="dropdown">
                       
                        <NavDropdown.Item className="navdropitem" href="#">
                            ASSOCIATE USER
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            COMMISSION CHART
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            ASSOCIATE BANK MASTER
                        </NavDropdown.Item>
                       
                        <NavDropdown.Item className="navdropitem" href="#">
                            CHANGE ASSOCIATE
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            ASSOCIATE ACTIVATE/DEACTIVATE
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            COMMISSION PAYMENT
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            COLLECTION REPORT
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            COMMISSION REPORT
                        </NavDropdown.Item>
                        
                    </NavDropdown> */}
                    
                    {/* <NavDropdown className="navdrop" title="ACCOUNT CREATION" id="dropdown">
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/rd" style={{ textDecoration: 'none', color: 'inherit' }}> RECURRING DEPOSIT</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/savings" style={{ textDecoration: 'none', color: 'inherit' }}> SAVINGS ACCOUNT</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/fd" style={{ textDecoration: 'none', color: 'inherit' }}>  FIXED DEPOSIT</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/gdcs" style={{ textDecoration: 'none', color: 'inherit' }}>  GDCS</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/loan" style={{ textDecoration: 'none', color: 'inherit' }}>  LOAN</Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="navdropitem" href="#">
                            <Link to="/rds" style={{ textDecoration: 'none', color: 'inherit' }}> RDS</Link>
                        </NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
            </Navbar>
        </div>
    )
}

export default NavBar


