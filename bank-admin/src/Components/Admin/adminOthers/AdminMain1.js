import React, { useState, useEffect, useContext } from "react";
import NavbarSection from './AdminNavbar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../../Others/UserContext.js';
import { Link } from "react-router-dom";
import "../../style/Main.css";
import logo from "../../style/logo.png";
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
    const [branches, setBranches] = useState([]);


    const [formData, setFormData] = useState({
        branch_name: '',
        branchCode: '',
    });

    useEffect(() => {
        // Fetch branches from your server
        fetch("https://api.malabarbank.in/api/branches")
            .then((response) => response.json())
            .then((data) => setBranches(data))
            .catch((error) => console.error("Error fetching branches:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "branch_name") {
            const selectedBranch = branches.find(branch => branch.branch_name === value);
            setFormData(prevData => ({
                ...prevData,
                branch_name: value,
                branchCode: selectedBranch ? selectedBranch.branchCode : ''
            }));
            console.log("Selected branch code:", selectedBranch ? selectedBranch.branchCode : '');
        } else {
            // For other inputs, update as usual
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`https://api.malabarbank.in/api/membership?branchCode=${formData.branchCode}`);

                if (response.data && Array.isArray(response.data.data)) {
                    setMemberships(response.data.total);
                } else {
                    setMemberships([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setMemberships([]);
            }
        }
        fetchData();
    }, [formData.branchCode])

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get(`https://api.malabarbank.in/api/savings?branchCode=${formData.branchCode}`);
    
            if (response.data && Array.isArray(response.data.data)) {
                setSavings(response.data.total);
            } else {
                setSavings([]);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setSavings([]);
          }
        }
        fetchData();
      }, [formData.branchCode])

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?page=${1}&limit=${10}&branch=${formData.branchCode}`);
    
            if (response.data && Array.isArray(response.data.data)) {
                setRDSData(response.data.total);
            } else {
                setRDSData([]);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setRDSData([]);
          }
        }
        fetchData();
      }, [formData.branchCode])

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
                                <li>Branch</li>
                            </ul>
                            <ul className="list-unstyled mb-1 me-5">
                                <li className="me-2">: Admin</li>
                                <li className="me-2">: {currentDate.toLocaleString()}</li>
                                <li className="me-2">:<select
                                        className="form-group"
                                        id="branch_name"
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map((branch) => (
                                            <option key={branch._id} value={branch.branch_name}>
                                                {branch.branch_name}
                                            </option>
                                        ))}
                                    </select> </li>
                                
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
                                        <Link to='/AdminMembership' style={{ textDecoration: 'none', color: 'inherit' }}>MEMBERSHIP</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/ClosingDenoAdmin' style={{ textDecoration: 'none', color: 'inherit' }}>CLOSING DENOMINATION</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/AdminRDS' style={{ textDecoration: 'none', color: 'inherit' }}>RDS ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        <Link to='/Adminfd' style={{ textDecoration: 'none', color: 'inherit' }}>FIXED DEPOSIT</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/dailyreport' style={{ textDecoration: 'none', color: 'inherit' }}>DAY BOOK</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='' style={{ textDecoration: 'none', color: 'inherit' }}>RD ACCOUNT</Link>
                                    </button>
                                </div>
                                <div className="col-4 d-grid gap-2">
                                    <button className="btn btn-block" type="button">
                                        <Link to='/adminLoan' style={{ textDecoration: 'none', color: 'inherit' }}>LOAN</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/Adminsavings' style={{ textDecoration: 'none', color: 'inherit' }}>SAVINGS ACCOUNT</Link>
                                    </button>
                                    <br />
                                    <button className="btn btn-block" type="button">
                                        <Link to='/AdminGDCS' style={{ textDecoration: 'none', color: 'inherit' }}>GDCS</Link>
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
                                maxValue={100000}
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
                                maxValue={100000}
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
                                maxValue={100000}
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