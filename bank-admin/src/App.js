import React from 'react';
import './App.css';
import Login from './Components/loginRegister';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Main from './Components/User/Main.js';
import BranchCreate from './Components/Admin/BranchCreation.js';
import RD from "./Components/User/Services/RDForm.js";
// import RDS from './Components/Services/RDSFrom1.js';
import RDS from './Components/User/Services/RDSFrom1.js';
import RDSmultiCollection from './Components/User/Services/RdsCollection.js';
import FIXED from './Components/User/Services/FixedDeposits.js';
import Loan from './Components/User/Services/LoanProduct.js';
import GDCS from './Components/User/Services/Gdcs.jsx';
import Savings from './Components/User/Services/Savings1.js';
import SwarnaNidhi from './Components/User/Services/SwarnaNidhi.jsx';
import SwarnaNidhiPassbook from './Components/Reports/SwarnaNidhiPassbook.js';

import Memberform from './Components/MemberForm';
import List from './Components/MemberList1.js';
import {UserProvider} from './Components/Others/UserContext.js';
import AdminLogReg from './Components/Admin/AdminLogReg.js';
import EmployeeCreate from './Components/Admin/EmployeeCreation.js';
import DesignationCreate from './Components/Admin/DesignationCreation.js';
import FdSchemeCreate from './Components/Admin/FDSchemeCreation.jsx';
import RDSchemeCreate from './Components/Admin/RDSchemeCreation.jsx';
import MatureWithdrawFD from './Components/User/Services/MatureWithdrawFD.js';
import PrematureFDwithdraw from './Components/User/Services/PrematureFDwithdraw.js';
import ExpenseBook from './Components/ExpenseBook.js';
// import ExpenseBookView from './Components/Admin/ExpenseViewAdmin1.js';
import AdminMain from './Components/Admin/adminOthers/AdminMain1.js'
import AdminSavings from './Components/Admin/AdminService/AdminSavings.js';
import AdminRDS from './Components/Admin/AdminService/AdminRDS.js';
import AdminMembership from './Components/Admin/AdminService/AdminMembership.js';
import AdminFIXED from './Components/Admin/AdminService/AdminFIXED.js';
import AdminGDCS from './Components/Admin/AdminService/AdminGDCS.js';
import AdminLoan from './Components/Admin/AdminService/AdminLoan.js';
import GdcsScheme from './Components/Admin/GDCSSchemeCreation.jsx'
import Svdeposit from './Components/User/Services/SavingsDeposit.js'
import SvWithdrawal from './Components/User/Services/SavingsWithdrawal.js' 
import DailyReports from './Components/Reports/DailyReport.js'
import Cashbook from './Components/Reports/CashBook.js'
import Bankbook from './Components/Reports/BankBook.js'
import Passbook from './Components/Reports/passbook.js'
import Branchtransfer from './Components/Admin/AdminTransaction/BranchTransfer.js'
import BranchFundrequest from './Components/Admin/BranchFundRequests.js'
import RDSwithdrawal from './Components/User/Services/RDSwithdrawal.js';
import EMI from './Components/User/Services/RDEmi.js'
import LoanScheme from './Components/Admin/LoanSchemeCreation.jsx'
import PaymentLedger from './Components/PaymentLedger1.js'
import ReceiptLedger from './Components/ReceiptLedger1.js'
import ExpenseViewAdmin from './Components/Admin/ExpenseViewAdmin.js';
import PaymentLedgerAdmin from './Components/Admin/PaymentLedgerViewAdmin.js'
import ReceiptLedgerViewAdmin from './Components/Admin/ReceiptLedgerViewAdmin.js';
import BankTransaction from './Components/Admin/AdminTransaction/BankTransaction.js';
import DailyReportEMP from './Components/Reports/DailyReportEmp.js'
import ClosingDenominationAdmin from './Components/Admin/AdminTransaction/closingDenominationAdmin.js';
import ClosingDenomination from './Components/Others/ClosingDenomination.js';
import NotFound from './Components/Others/NotFound.js';
import LoanEMI from './Components/User/Services/LoanEMI.jsx';
import FdBond from './Components/Admin/FdBond.jsx';
import FdBondReq from './Components/User/Services/FdBondReq.jsx';
import FdIntWithdrawal from './Components/User/Services/FdIntWithdrawal.jsx';
// import ListN from './Components/MemberList4.js'
function App() {

return (  
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/main' element={<Main />} />
          <Route path='/memberform' element={<Memberform />} />
          <Route path="*" element={<NotFound/>} />
          <Route path='/list' element={<List />} />
          {/* <Route path='/list2' element={<ListN />} /> */}
          <Route path='/branchCreate' element={<BranchCreate />} />
          <Route path='/rd' element={<RD/>} />
          <Route path='/fd' element={<FIXED/>} />
          <Route path='/loan' element={<Loan/>} />
          <Route path='/loanEmi' element={<LoanEMI/>} />
          <Route path='/SwarnaNidhi' element={<SwarnaNidhi/>}/>
          <Route path='/swarnamPassbook' element={<SwarnaNidhiPassbook/>}/>

          <Route path='/gdcs' element={<GDCS/>} />
          <Route path="/admin" element={<AdminLogReg/>} />
          <Route path='/savings' element={<Savings/>} />
          <Route path='/employeeCreate' element={<EmployeeCreate/>} />
          <Route path='/designationCreate' element={<DesignationCreate/>} />
          <Route path='/fdSchemeCreate' element={<FdSchemeCreate/>} />
          {/* Rds */}
          {/* <Route path='/rds' element={<RDS/>} /> */}
          <Route path='/rds' element={<RDS/>} />
          <Route path='/RDSwithdraw' element={<RDSwithdrawal/>} />
          <Route path="/RDSmultiCollection" element={<RDSmultiCollection/>} />
          <Route path='/RDSchemeCreate' element={<RDSchemeCreate/>} />
          <Route path="/matureFDwithdraw" element={<MatureWithdrawFD/>} />
          <Route path="/PrematureFDwithdraw" element={<PrematureFDwithdraw/>} />
          <Route path="/expenseBook" element={<ExpenseBook/>} />
          <Route path="/dailyReport" element={<DailyReports/>} />
          <Route path="/cashbook" element={<Cashbook/>} />
          <Route path="/passbook" element={<Passbook/>} />
          <Route path="/bankbook" element={<Bankbook/>} />
          <Route path="/branchtransfer" element={<Branchtransfer/>} />
          <Route path="/svdeposit" element={<Svdeposit/>} />
          <Route path='/rdemi' element={<EMI/>}/>
          <Route path="/SvWithdraw" element={<SvWithdrawal/>}/>
          <Route  path="/paymentledger" element={<PaymentLedger/>}/>
          <Route  path="/receiptledger" element={<ReceiptLedger/>}/>
          <Route path='/dailyreportemp' element={<DailyReportEMP/>}/>
          <Route path='/ClosingDenoAdmin' element={<ClosingDenominationAdmin/>}/>
          <Route path='/ClosingDenomination' element={<ClosingDenomination/>}/>
          {/* Admin Routing */}
          <Route path='/adminMain' element={<AdminMain />} />
          <Route path="/gdcsScheme" element={<GdcsScheme />}/>
          <Route path="/branchfundrquest" element={<BranchFundrequest />}/>
          <Route path="/loanScheme" element={<LoanScheme />}/>
          <Route path='/bankTransaction' element= {<BankTransaction />} />
          <Route path='/adminPaymentLedger' element={<PaymentLedgerAdmin/>}/>
          <Route path='/adminReceiptLedger' element={<ReceiptLedgerViewAdmin/>}/>
          <Route path='/adminExpenseBook' element={<ExpenseViewAdmin/>}/>
          <Route path='/Adminsavings' element={<AdminSavings/>} />
          <Route path='/AdminRDS' element={<AdminRDS/>} />
          <Route path='/AdminMembership' element={<AdminMembership/>} />
          <Route path='/Adminfd' element={<AdminFIXED/>} />
          <Route path='/AdminGDCS' element={<AdminGDCS/>} />
          <Route path='/AdminLoan' element={<AdminLoan/>} />
          <Route path='/FdBondReq'   element={<FdBondReq/>} />
          <Route path='/fdbondAdmin' element={<FdBond/>}/>
          <Route path='/FdIntWithdrawal' element={<FdIntWithdrawal/>}/>

          

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
