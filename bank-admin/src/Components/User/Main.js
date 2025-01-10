import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarSection from './OtherUser/EmpNavBar.js'
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../Others/UserContext.js';
import { Link } from "react-router-dom";
import "../style/Main.css";
import logo from "../style/logo.png";
import axios from "axios";
import ReactSpeedometer from "react-d3-speedometer"

function Main() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const [memberships, setMemberships] = useState(0);
    const [savings, setSavings] = useState(0);
    const [rdsData, setRDSData] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const branchCode = user?.branchDetails?.branchCode;
    useEffect(() => {
        if (branchCode) {
            fetchMemberships(branchCode);
            fetchSavingsData(branchCode);
            fetchRDSData(branchCode);
        }
    }, [branchCode]);

    const fetchMemberships = async (branchCode) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://api.malabarbank.in/api/membership?branchCode=${branchCode}`);
            setMemberships(response.data.total);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchSavingsData = async (branchCode) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://api.malabarbank.in/api/savings?branchCode=${branchCode}`);
            setSavings(response.data.total);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchRDSData = async (branchCode) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?page=${1}&limit=${10}&branch=${branchCode}`);
            setRDSData(response.data.total);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalValue = 5000;

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location = (`/`);
    };

    return (
        <div className="container-fluid px-0">
            <nav className="navbar navbar-light ">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5 d-flex align-items-center" to='/main'>
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
                                <li className="me-2">EMPLOYEE</li>
                                <li className="me-2">Branch</li>
                                <li className="me-2">Branch Code</li>
                                <li>Date</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: {user ? user.employee.fullname : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branch_name : 'N/A'}</li>
                                <li className="me-2">: {user ? user.branchDetails.branchCode : 'N/A'}</li>
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
                <div className="col-lg-5 col-md-12">
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
                                        <Link to='/dailyreportemp' style={{ textDecoration: 'none', color: 'inherit' }}>DAY BOOK</Link>
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
                                        <Link to='/gdcs' style={{ textDecoration: 'none', color: 'inherit' }}>GDCS</Link>
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
                                        <td>$</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>$</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>$</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>$</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>$</td>
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
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>1st</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>2nd</h5>
                                            <p className="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>3rd</h5>
                                            <p className="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>4th</h5>
                                            <p className="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>5th</h5>
                                            <p className="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card">
                                        <img src="..." className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: '30px' }}>6th</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="container-box col-lg-7 col-md-12">
                    <div className='row'>
                        <div className="col box-meter">
                            <ReactSpeedometer
                                maxValue={5000}
                                currentValueText={'MEMBERSHIP COUNT: ${value}'}
                                value={memberships}
                                needleColor="red"
                                startColor="green"
                                segments={5}
                                endColor="blue"
                            />
                        </div>
                        <div className="col box-meter">
                            <ReactSpeedometer
                                maxValue={5000}
                                currentValueText={'SAVINGS COUNT: ${value}'}
                                value={savings}
                                needleColor="red"
                                startColor="green"
                                segments={5}
                                endColor="blue"
                            />
                        </div>
                        <div className="col box-meter">
                            <ReactSpeedometer
                                maxValue={5000}
                                currentValueText={'RDS COUNT: ${value}'}
                                value={rdsData}
                                needleColor="red"
                                startColor="green"
                                segments={5}
                                endColor="blue"
                            />
                        </div>
                    </div>
                    <div className="deposit-table">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th id="thead" className="text-center" colSpan={4}>
                                        FIXED DEPOSIT STATUS
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
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>&#8377;</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>&#8377;</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>&#8377;</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>&#8377;</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    {/* <div id="legenda" className="row d-flex justify-content-start mb-3">
                        <div className="entry me-3">
                            <div id="color-black" className="entry-color"></div>
                            <div className="entry-text">MEMBERSHIP = {memberships}</div>
                        </div>
                        <div className="entry">
                            <div id="color-brown" className="entry-color"></div>
                            <div className="entry-text">TOTAL = {totalValue}</div>
                        </div>
                    </div> */}

                </div>

            </div>
        </div>
    );
}

export default Main;




// import NavbarSection from './OtherUser/EmpNavBar.js'
// import React, { useState, useEffect, useContext } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
// import { UserContext } from '../Others/UserContext.js';
// import { Link } from "react-router-dom";
// import "../style/Main.css";
// import logo from "../style/logo.png";
// import axios from "axios";
// import {
//     GaugeContainer,
//     GaugeValueArc,
//     GaugeReferenceArc,
//     useGaugeState,
//   } from '@mui/x-charts/Gauge';
//   function GaugePointer() {
//     const { valueAngle, outerRadius, cx, cy } = useGaugeState();

//     if (valueAngle === null) {
//         return null;
//     }

//     const target = {
//         x: cx + outerRadius * Math.sin(valueAngle),
//         y: cy - outerRadius * Math.cos(valueAngle),
//     };

//     return (
//         <g>
//             <circle cx={cx} cy={cy} r={5} fill="red" />
//             <path
//                 d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
//                 stroke="red"
//                 strokeWidth={3}
//             />
//         </g>
//     );
// }
// function Main() {
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const { user, setUser } = useContext(UserContext);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             setCurrentDate(new Date());
//         }, 1000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const [memberships, setMemberships] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const branchCode = user?.branchDetails?.branchCode;

//     useEffect(() => {
//         fetchMemberships(branchCode);
//     }, [branchCode]);

//     const fetchMemberships = async (branchCode) => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(`https://api.malabarbank.in/api/membership?branchCode=${branchCode}`);
//             setMemberships(response.data.total);
//         } catch (error) {
//             console.error('Error fetching memberships data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const totalValue = 5000;

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         setUser(null);
//         window.location = (`/`);
//     };

//     return (
//         <div className="container-fluid px-0">
//             <nav className="navbar navbar-light ">
//                 <div className="container-fluid">
//                     <Link className="navbar-brand ms-5 d-flex align-items-center" to='/main'>
//                         <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
//                         <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
//                     </Link>
//                     <div className="d-flex" style={{ width: "600px" }}>
//                         <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
//                         <FontAwesomeIcon
//                             icon={faPowerOff}
//                             onClick={handleLogout}
//                             className="text-danger me-5 mt-4"
//                         />
//                         <div className="d-flex">
//                             <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
//                             <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
//                                 <li className="me-2">EMPLOYEE</li>
//                                 <li className="me-2">Branch</li>
//                                 <li className="me-2">Branch Code</li>
//                                 <li>Date</li>
//                             </ul>
//                             <ul className="list-unstyled mb-1 me-5">
//                                 <li className="me-2">: {user ? user.employee.fullname : 'N/A'}</li>
//                                 <li className="me-2">: {user ? user.branchDetails.branch_name : 'N/A'}</li>
//                                 <li className="me-2">: {user ? user.branchDetails.branchCode : 'N/A'}</li>
//                                 <li className="me-2">: {currentDate.toLocaleString()}</li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//             <div className="marquee  px-5 m-2">
//                 <marquee className="text-white" behavior="scroll" direction="left">
//                     New Updates : Welcome to The Malabar Multi State Agro Co-operative Society Limited....Have a nice day....
//                 </marquee>
//             </div>
//             <NavbarSection />
//             <div className="row">
//                 <div className="col-lg-6 col-md-12">
//                     <ul className="nav nav-pills p-3" id="pills-tab" role="tablist">
//                         <li className="nav-item" role="presentation">
//                             <button
//                                 className="nav-link active"
//                                 id="pills-home-tab"
//                                 data-bs-toggle="pill"
//                                 data-bs-target="#pills-home"
//                                 type="button"
//                                 role="tab"
//                                 aria-controls="pills-home"
//                                 aria-selected="true"
//                             >
//                                 FAVOURITES
//                             </button>
//                         </li>
//                         <li className="nav-item" role="presentation">
//                             <button
//                                 className="nav-link"
//                                 id="pills-profile-tab"
//                                 data-bs-toggle="pill"
//                                 data-bs-target="#pills-profile"
//                                 type="button"
//                                 role="tab"
//                                 aria-controls="pills-profile"
//                                 aria-selected="false"
//                             >
//                                 BANK POSITION
//                             </button>
//                         </li>
//                     </ul>

//                     <div className="tab-content p-3" id="pills-tabContent">
//                         <div
//                             className="tab-pane fade show active"
//                             id="pills-home"
//                             role="tabpanel"
//                             aria-labelledby="pills-home-tab"
//                         >
//                             <div className="row">
//                                 <div className="col-4 d-grid gap-2">
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/memberform' style={{ textDecoration: 'none', color: 'inherit' }}>MEMBERSHIP</Link>
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/ClosingDenomination' style={{ textDecoration: 'none', color: 'inherit' }}>CLOSING DENOMINATION</Link>
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/rds' style={{ textDecoration: 'none', color: 'inherit' }}>RDS ACCOUNT</Link>
//                                     </button>
//                                 </div>
//                                 <div className="col-4 d-grid gap-2">
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/fd' style={{ textDecoration: 'none', color: 'inherit' }}>FIXED DEPOSIT</Link>
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/dailyreportemp' style={{ textDecoration: 'none', color: 'inherit' }}>DAY BOOK</Link>
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/rd' style={{ textDecoration: 'none', color: 'inherit' }}>RD ACCOUNT</Link>
//                                     </button>
//                                 </div>
//                                 <div className="col-4 d-grid gap-2">
//                                     <button className="btn btn-block" type="button">
//                                         LOAN
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/savings' style={{ textDecoration: 'none', color: 'inherit' }}>SAVINGS ACCOUNT</Link>
//                                     </button>
//                                     <br />
//                                     <button className="btn btn-block" type="button">
//                                         <Link to='/gdcs' style={{ textDecoration: 'none', color: 'inherit' }}>GDCS</Link>
//                                     </button>
//                                 </div>
//                             </div>
//                             <table className="table table-striped table-hover">
//                                 <thead>
//                                     <tr>
//                                         <th id="thead" className="text-center" colSpan={4}>
//                                             LOAN STATUS
//                                         </th>
//                                     </tr>
//                                     <tr>
//                                         <th colSpan={4}></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <th id="thead">Customer Name</th>
//                                         <th id="thead">A/C No.</th>
//                                         <th id="thead">Amount</th>
//                                         <th id="thead">Mobile No.</th>
//                                     </tr>
//                                     <tr>
//                                         <td></td>
//                                         <td></td>
//                                         <td></td>
//                                         <td></td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                         <div
//                             className="tab-pane fade"
//                             id="pills-profile"
//                             role="tabpanel"
//                             aria-labelledby="pills-profile-tab"
//                         >
//                             <div class="row row-cols-1 row-cols-md-2 g-4">
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>1st</h5>

//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>2nd</h5>
//                                             <p class="card-text">

//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>3rd</h5>
//                                             <p class="card-text">

//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>4th</h5>
//                                             <p class="card-text">

//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>5th</h5>
//                                             <p class="card-text">

//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <div class="card">
//                                         <img src="..." class="card-img-top" alt="..." />
//                                         <div class="card-body">
//                                             <h5 class="card-title" style={{ fontSize: '30px' }}>6th</h5>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <table className="table table-striped table-hover">
//                         <thead>
//                             <tr>
//                                 <th id="thead" className="text-center" colSpan={4}>
//                                     DEPOSIT STATUS
//                                 </th>
//                             </tr>
//                             <tr>
//                                 <th colSpan={4}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <th id="thead">Customer Name</th>
//                                 <th id="thead">A/C No.</th>
//                                 <th id="thead">Amount</th>
//                                 <th id="thead">Mobile No.</th>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                                 <td></td>
//                                 <td>&#8377;</td>
//                                 <td></td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="pie-box container-box col-lg-6 col-md-12">
//                     <div className='row'>
//                         <h1 className='entry-text-head d-flex justify-content-center'>MEMBERSHIP COUNT</h1>
//                         <GaugeContainer
//                             width={200}
//                             height={200}
//                             startAngle={-110}
//                             endAngle={110}
//                             value={30}
//                         >
//                             <GaugeReferenceArc />
//                             <GaugeValueArc />
//                             <GaugePointer />
//                         </GaugeContainer>

//                     </div>

//                     <div id="legenda" className="row d-flex justify-content-start mb-3">
//                         <div className="entry me-3">
//                             <div id="color-black" className="entry-color"></div>
//                             <div className="entry-text">MEMBERSHIP = {memberships}</div>
//                         </div>
//                         <div className="entry">
//                             <div id="color-brown" className="entry-color"></div>
//                             <div className="entry-text">TOTAL = {totalValue}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Main;