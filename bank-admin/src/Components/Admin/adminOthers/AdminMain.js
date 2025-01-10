import NavbarSection from './AdminNavbar'
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../../Others/UserContext';
import { Link } from "react-router-dom";
import "../../style/Main.css";
import logo  from "../../style/logo.png";

function Main() {
    const [currentDate, setCurrentDate] = useState(new Date());
    // const {user} = useContext(UserContext);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const [memberships, setMemberships] = useState([]);
    const [matchingMembershipsCount, setMatchingMembershipsCount] = useState(0);
    const [cashMemberships, setCashMemberships] = useState([]);
    const [upiMemberships, setUpiMemberships] = useState([]);

    useEffect(() => {
        fetch(`https://api.malabarbank.in/api/membership`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const matchingMemberships = [];
                    const cashMemberships = [];
                    const upiMemberships = [];
                    data.forEach(item => {
                        if (item.membershipId) {
                            const branchCode = item.membershipId.substring(5, 8);
                            if (branchCode) {
                                matchingMemberships.push(item);
                                if (item.selectedPaymentMethod === "Cash") {
                                    cashMemberships.push(item.membershipId);
                                } else if (item.selectedPaymentMethod === "UPI") {
                                    upiMemberships.push(item.membershipId);
                                }
                            }
                        }
                    });
                    setMemberships(matchingMemberships);
                    setMatchingMembershipsCount(matchingMemberships.length);
                    setCashMemberships(cashMemberships.length);
                    setUpiMemberships(upiMemberships.length);
                } else {
                    console.error('Error: Response data is not an array');
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

   
    
    //fd data
    const [newFDdata, setFdNewdata] = useState([]);
    const [fdtotalAmount, setFdTotalAmount] = useState(0);

    useEffect(() => {
        fetch(`https://api.malabarbank.in/api/fd`)
          .then((response) => response.json())
          .then((data) => {
            // Initialize an array to store matching memberships
            const matchingFdMemberships = [];
            let fdsum = 0; // Initialize sum for total amount
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              if (item.totalAmount) {
                fdsum += parseFloat(item.amount);
              }
            }
            setFdNewdata(matchingFdMemberships);
            setFdTotalAmount(fdsum); // Set total amount
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, [user.branchDetails?.branchCode]);
     

    // savings account details
    const [newSvdata, setSvNewdata] = useState([]);
    const [svtotalAmount, setSvTotalAmount] = useState(0);

    useEffect(() => {
        fetch(`https://api.malabarbank.in/api/savings`)
          .then((response) => response.json())
          .then((data) => {
            // Initialize an array to store matching memberships
            const matchingMemberships = [];
            let svsum = 0; // Initialize sum for total amount
    
            // Loop through the data to extract the branch code from each RDNumber and compare with user's branch code
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              if (item.membershipId) {
                // const branchCode = item.membershipId.substring(5, 8);
                svsum += parseFloat(item.deposit);
              }
            }
    
            setSvNewdata(matchingMemberships);
            setSvTotalAmount(svsum); // Set total amount
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, [user.branchDetails?.branchCode]);

    // Rd collection 
    const [newRDdata, setNewRDdata] = useState([]);
    const [rdtotalAmount, setRdTotalAmount] = useState(0);

    useEffect(() => {
        fetch(`https://api.malabarbank.in/api/rd`)
          .then((response) => response.json())
          .then((data) => {
            // Initialize an array to store matching memberships
            const matchingMemberships = [];
            let rdsum = 0; 
    
            // Loop through the data to extract the branch code from each RDNumber and compare with user's branch code
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              if (item.membershipId) {
                rdsum += parseFloat(item.amount);
              }
            }
            setNewRDdata(matchingMemberships);
            setRdTotalAmount(rdsum);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, [user.branchDetails?.branchCode]);

    // total
      let totalMembershipAmount = cashMemberships*100+upiMemberships*100+svtotalAmount + rdtotalAmount+fdtotalAmount;
    // Logout function
    const handleLogout = () => {
        // Clear user data from local storage and reset user state
        localStorage.removeItem('user');
        setUser(null);
        // Redirect to login page or any other page as needed
        window.location = (`/`);
    };



    return (
        <div className="container-fluid px-0">
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to='/adminMain'>
                       <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
                        <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
                    </Link>
                    <div className="d-flex" style={{ width: "600px" }}>
                        <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            onClick={handleLogout}
                            className="text-danger me-5 mt-4"
                        />
                        <div className="d-flex">
                            <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
                            <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
                                <li className="me-2">User</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: Admin</li>
                                
                                <li className="me-2">: {currentDate.toLocaleString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="marquee  px-5 m-2">
                <marquee className="text-white" behavior="scroll" direction="left">
                    New Updates : Welcome to The Malabar Multi State Agro Co-operative Society Limited....Have a nice day....
                </marquee>
            </div>
            <NavbarSection />
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <ul className="nav nav-pills p-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                            >
                                FAVOURITES
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                            >
                                BANK POSITION
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content p-3" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                        >
                            {/* <div className="row">
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                    <Link to='/memberform' style={{ textDecoration: 'none', color: 'inherit' }}>MEMBERSHIP</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        MANAGER PASSING
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/rds' style={{ textDecoration: 'none', color: 'inherit' }}>RDS ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        <Link to='/fd' style={{ textDecoration: 'none', color: 'inherit' }}>FIXED DEPOSIT</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        USER ACCOUNT DETAILS
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/rd' style={{ textDecoration: 'none', color: 'inherit' }}>RD ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        LOAN CALCULATOR
                                    </button>
                                    <br />
                                    <Link to='/dailyReport'><button className="btn btn-block" type="button">
                                        DAY BOOK
                                    </button></Link>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        GOLD LOAN
                                    </button>
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                    <Link to='/memberform' style={{ textDecoration: 'none', color: 'inherit' }}>MEMBERSHIP</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/ClosingDenomination' style={{ textDecoration: 'none', color: 'inherit' }}>CLOSING DENOMINATION</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/rds' style={{ textDecoration: 'none', color: 'inherit' }}>RDS ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        <Link to='/fd' style={{ textDecoration: 'none', color: 'inherit' }}>FIXED DEPOSIT</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/dailyReport' style={{ textDecoration: 'none', color: 'inherit' }}>DAY BOOK</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/rd' style={{ textDecoration: 'none', color: 'inherit' }}>RD ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        LOAN
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/savings' style={{ textDecoration: 'none', color: 'inherit' }}>SAVINGS ACCOUNT</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                         <Link to='/gdc' style={{ textDecoration: 'none', color: 'inherit' }}>GDCS</Link>
                                    </button>
                                </div>
                            </div>
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th id="thead" className="text-center" colSpan={4}>
                                            LOAN STATUS
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={4}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th id="thead">Customer Name</th>
                                        <th id="thead">A/C No.</th>
                                        <th id="thead">Amount</th>
                                        <th id="thead">Mobile No.</th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                        >
                            <div class="row row-cols-1 row-cols-md-2 g-4">
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                            <h5 class="card-title" style={{fontSize:'30px'}}>1st</h5>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                        <h5 class="card-title" style={{fontSize:'30px'}}>2nd</h5>
                                            <p class="card-text">
                                                
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                        <h5 class="card-title" style={{fontSize:'30px'}}>3rd</h5>
                                            <p class="card-text">
                                                
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                        <h5 class="card-title" style={{fontSize:'30px'}}>4th</h5>
                                            <p class="card-text">
                                                
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                        <h5 class="card-title" style={{fontSize:'30px'}}>5th</h5>
                                            <p class="card-text">
                                                
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <img src="..." class="card-img-top" alt="..." />
                                        <div class="card-body">
                                            6th
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-12 px-md-5">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th id="thead" className="text-center" colSpan={2}>
                                    BRANCH POSITIONS
                                </th>
                            </tr>
                            <tr>
                                <th colSpan={2}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="thead">Particulars</th>
                                <th id="thead">Amount</th>
                            </tr>
                            <tr>
                                <td>CASH BALANCE</td>
                                <td>{cashMemberships*100}</td>
                                {/* <td>&#8377;</td> */}
                            </tr>
                            <tr>
                                <td>BANK BALANCE</td>
                                <td>{upiMemberships*100}</td>
                            </tr>
                            <tr>
                                <td>TOTAL BALANCE</td>
                                <td>{totalMembershipAmount}</td>
                            </tr>
                            <tr>
                                <td>MEMBERSHIP COUNT</td>
                                <td>{matchingMembershipsCount}</td>
                            </tr>
                            <tr>
                                <td>RECCURING DEPOSIT</td>
                                <td>{rdtotalAmount}</td>
                            </tr>
                            <tr>
                                <td>SAVINGS ACCOUNT</td>
                                <td>{svtotalAmount}</td>
                            </tr>
                            <tr>
                                <td>FIXED DEPOSIT</td>
                                <td>{fdtotalAmount}</td>
                            </tr>
                            <tr>
                                <td>GDCS</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>LOAN</td>
                                <td>&#8377;</td>
                            </tr>
                            <tr>
                                <td>RDS</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th id="thead" className="text-center" colSpan={4}>
                                    DEPOSIT STATUS
                                </th>
                            </tr>
                            <tr>
                                <th colSpan={4}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="thead">Customer Name</th>
                                <th id="thead">A/C No.</th>
                                <th id="thead">Amount</th>
                                <th id="thead">Mobile No.</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>&#8377;</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th id="thead" className="text-center" colSpan={4}>
                                    LOAN STATUS
                                </th>
                            </tr>
                            <tr>
                                <th colSpan={4}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th id="thead">Customer Name</th>
                                <th id="thead">A/C No.</th>
                                <th id="thead">Amount</th>
                                <th id="thead">Mobile No.</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>
    );
}

export default Main;