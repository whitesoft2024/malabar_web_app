import React, { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import NavbarSection from '../adminOthers/AdminNavbar'
import { UserContext } from "../../Others/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../style/logo.png"
import GroupMemberDetailsModal from "../../User/Services/GdcsMemberDetailsModal";

const GDCS = () => {
    const [groups, setGroups] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user, setUser } = useContext(UserContext);
    const [branches, setBranches] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [showMemberGroupModal, setShowMemberGroupModal] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location = (`/`);
    };

    const [formData, setFormData] = useState({
        membershipId: "",
        customerName: "",
        accountNumber: "",
        address: "",
        newDate: "",
        deposit: "",
        depositwords: "",
        customerNumber: "",
        type: "Initial",
        remarks: "",
        branchcode: user?.branchDetails?.branchCode,
        loginUser: "",
        loginUserTime: "",
        transactionId: "",
        savingsBill: "",
        branchUser: "",
        branchUserDate: "",
        branchUserTime: "",
        branch_name: '',
        branchCode: '',
    });
   
    // fetch by mobile

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [nextPage, setNextPage] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [searchSavings, setSearchSavings] = useState("");
    const [pageNumber, setPageNumber] = useState("");

    useEffect(() => {
        fetchGDCS(currentPage, pageSize, formData.branchCode, searchSavings);
    }, [currentPage, pageSize, formData.branchCode, searchSavings]);

    const fetchGDCS = async (
        page,
        size,
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `https://api.malabarbank.in/api/Gdcs/fetchGDCSGroup?page=${page}&limit=${size}&branchCode=${formData.branchCode}`
                );

            setGroups(response.data.data);

            setNextPage(response.data.nextPage);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchSavings(value);
        fetchGDCS(1, pageSize, formData.branchCode, value);
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
            fetchGDCS(currentPage + 1, pageSize, formData.branchCode); // Include branchCode
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchGDCS(currentPage - 1, pageSize, formData.branchCode); // Include branchCode
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1);
        fetchGDCS(1, newSize);
    };
    const handlePageNumberChange = (e) => {
        setPageNumber(e.target.value);
    };

    const goToPage = () => {
        const pageNumberInt = parseInt(pageNumber);
        if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
            setCurrentPage(pageNumberInt);
            fetchGDCS(pageNumberInt, pageSize, formData.branchCode, searchTerm);
            fetchGDCS("");
        } else {
            const inputBox = document.getElementById("pageNumberInput");
            inputBox.classList.add("input-error");

            const errorMessage = document.createElement("div");
            errorMessage.innerText = "Please enter a valid page number.";
            errorMessage.classList.add("error-message");
            inputBox.parentNode.insertBefore(errorMessage, inputBox.nextSibling);

            setTimeout(() => {
                inputBox.classList.remove("input-error");
                errorMessage.remove();
            }, 3000);
        }
    };

    function handleRowClick(group) {
        console.log("Row clicked:", group);
        setSelectedGroupId(group._id); 
        console.log("Selected Group ID:", group._id);
        setShowMemberGroupModal(true);
    }


    const [searchTerm, setSearchTerm] = useState("");
    let serialNumber = 1;
    return (
        <div>
            <div className="container-fluid border rounded ">
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
                <NavbarSection />
                <center>
                    <h2>GDCS</h2>
                </center>
                <div className="">
                    <div className="circle-buttons-container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-0 ">
                                    <label htmlFor="referenceNumber" className="mr-2">
                                        Search:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="branch"
                                        name="branch"
                                        onChange={handleSearch}
                                        placeholder="Enter Search"
                                        style={{ width: "20rem" }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <div className="form-group mb-0" style={{ marginLeft: "5rem" }}>
                                    <div>
                                        <label htmlFor="pageNumber" className="mr-2">
                                            Row No:
                                        </label>
                                    </div>
                                    <div>
                                        <select
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                            className="form-control"
                                            style={{ width: "3rem" }}
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <center>
                    <div className="table-container">
                        {isLoading ? (
                            <div className="loading-animation">Loading...</div>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>SL NO</th>
                                        <th>GROUP NAME</th>
                                        <th>DURATION</th>
                                        <th>TOTAL AMOUNT</th>
                                        <th>INSTALMENT AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group, index) => (
                                        <tr key={index} onClick={() => handleRowClick(group)}>
                                            <td>{index + 1}</td>
                                            <td>{group.GroupName}</td>
                                            <td>{group.duration}</td>
                                            <td>{group.priceMoney}</td>
                                            <td>{group.emi}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        <div className="pagination-buttons">
                            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Previous
                            </Button>
                            <span>Page {currentPage}</span>
                            <Button onClick={handleNextPage} disabled={!nextPage}>
                                Next <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                            <select value={pageSize} onChange={handlePageSizeChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <nav aria-label="Page navigation example col">
                            <ul className="pagination justify-content-end">
                                <li className="page-item disabled">Enter page number:</li>
                                <li className="page-item">
                                    <input
                                        id="pageNumberInput"
                                        type="number"
                                        value={pageNumber}
                                        style={{
                                            width: "50px",
                                            padding: "5px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                        onChange={handlePageNumberChange}
                                        aria-label="Page number input"
                                    />
                                </li>
                                <li className="page-item">
                                    <Button onClick={goToPage} disabled={!nextPage}>
                                        Go
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </center>
            </div>
            <ToastContainer />

            <GroupMemberDetailsModal
                show={showMemberGroupModal}
                onHide={() => setShowMemberGroupModal(false)}
                groupId={selectedGroupId}
            />
        </div>
    );
};

export default GDCS;



// import React, { useState, useContext, useEffect } from "react";
// import { Button } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
// import { faHouse, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import { Table } from "react-bootstrap";
// import axios from "axios";
// import NavbarSection from '../adminOthers/AdminNavbar'
// import { UserContext } from "../../Others/UserContext";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../style/logo.png"
// import GroupMemberDetailsModal from "../../User/Services/GdcsMemberDetailsModal";

// const GDCS = () => {
//     const [groups, setGroups] = useState([]);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const { user, setUser } = useContext(UserContext);
//     const [branches, setBranches] = useState([]);
//     const [selectedGroupId, setSelectedGroupId] = useState("");
//     const [showMemberGroupModal, setShowMemberGroupModal] = useState(false);
//     const [numberOfMembers, setNumberOfMembers] = useState("");

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             setCurrentDate(new Date());
//         }, 1000);
//         return () => clearInterval(intervalId);
//     }, []);

//     useEffect(() => {
//         // Fetch branches from your server
//         fetch("https://api.malabarbank.in/api/branches")
//             .then((response) => response.json())
//             .then((data) => setBranches(data))
//             .catch((error) => console.error("Error fetching branches:", error));
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "branch_name") {
//             const selectedBranch = branches.find(branch => branch.branch_name === value);
//             setFormData(prevData => ({
//                 ...prevData,
//                 branch_name: value,
//                 branchCode: selectedBranch ? selectedBranch.branchCode : ''
//             }));
//             console.log("Selected branch code:", selectedBranch ? selectedBranch.branchCode : '');
//         } else {
//             // For other inputs, update as usual
//             setFormData(prevData => ({
//                 ...prevData,
//                 [name]: value
//             }));
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         setUser(null);
//         window.location = (`/`);
//     };

//     const [formData, setFormData] = useState({
//         membershipId: "",
//         customerName: "",
//         accountNumber: "",
//         address: "",
//         newDate: "",
//         deposit: "",
//         depositwords: "",
//         customerNumber: "",
//         type: "Initial",
//         remarks: "",
//         branchcode: user?.branchDetails?.branchCode,
//         loginUser: "",
//         loginUserTime: "",
//         transactionId: "",
//         savingsBill: "",
//         branchUser: "",
//         branchUserDate: "",
//         branchUserTime: "",
//         branch_name: '',
//         branchCode: '',
//     });
//     const currentDate2 = new Date();

//     const dateOptions = {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//     };

//     const timeOptions = {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: false, // 24-hour format
//     };
//     const loginBranchUser = user.employee.fullname;
//     const loginUserDate = currentDate2.toLocaleDateString("en-GB", dateOptions);
//     const loginUserTime = currentDate2.toLocaleTimeString("en-GB", timeOptions);
//     //generate RD Number
//     const [accountTypeCounts, setAccountTypeCounts] = useState({});

//     const updateSavingsNumber = (branchCode) => {
//         let accountType = formData.accountType || "S";

//         if (!accountTypeCounts[accountType]) {
//             setAccountTypeCounts((prevCounts) => ({
//                 ...prevCounts,
//                 [accountType]: 1,
//             }));
//         } else {
//             setAccountTypeCounts((prevCounts) => ({
//                 ...prevCounts,
//                 [accountType]: prevCounts[accountType] + 1,
//             }));
//         }

//         const newNumber = accountTypeCounts[accountType] || 1;
//         const newSavingsNumber = `S${branchCode}${newNumber
//             .toString()
//             .padStart(5, "0")}`;
//         console.log(newSavingsNumber);
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             accountNumber: newSavingsNumber,
//             accountType: formData.accountType,
//             transactionId: formData.transactionId,
//             savingsBill: formData.savingsBill,
//             branchUser: loginBranchUser,
//             branchUserDate: loginUserDate,
//             branchUserTime: loginUserTime,
//             type: "Initial",
//         }));
//         console.log("Updated RDNumber:", newSavingsNumber);
//     };

//     useEffect(() => {
//         if (formData.accountType && formData.branchCode) {
//             updateSavingsNumber(formData.branchCode);
//         }
//     }, [formData.accountType, formData.branchCode]);

//     // fetch by mobile

//     const [isLoading, setIsLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1); // Track current page
//     const [nextPage, setNextPage] = useState(null);
//     const [pageSize, setPageSize] = useState(10);
//     const [searchSavings, setSearchSavings] = useState("");
//     const [pageNumber, setPageNumber] = useState("");

//     useEffect(() => {
//         fetchGDCS(currentPage, pageSize, formData.branchCode, searchSavings);
//     }, [currentPage, pageSize, formData.branchCode, searchSavings]);

//     const fetchGDCS = async (
//         page,
//         size,
//     ) => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(
//                 `https://api.malabarbank.in/api/Gdcs/fetchGDCSGroup?page=${page}&limit=${size}&branchCode=${formData.branchCode}`
//                 );

//             const cleanedData = response.data.data.map(({ _id, ...rest }) => rest);
//             setGroups(cleanedData);

//             setNextPage(response.data.nextPage);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     const handleSearch = (e) => {
//         const value = e.target.value;
//         setSearchSavings(value);
//         fetchGDCS(1, pageSize, formData.branchCode, value);
//     };

//     const handleNextPage = () => {
//         if (nextPage) {
//             setCurrentPage(currentPage + 1);
//             fetchGDCS(currentPage + 1, pageSize, formData.branchCode); // Include branchCode
//         }
//     };

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//             fetchGDCS(currentPage - 1, pageSize, formData.branchCode); // Include branchCode
//         }
//     };

//     const handlePageSizeChange = (e) => {
//         const newSize = parseInt(e.target.value, 10);
//         setPageSize(newSize);
//         setCurrentPage(1);
//         fetchGDCS(1, newSize);
//     };
//     const handlePageNumberChange = (e) => {
//         setPageNumber(e.target.value);
//     };

//     const goToPage = () => {
//         const pageNumberInt = parseInt(pageNumber);
//         if (!isNaN(pageNumberInt) && pageNumberInt > 0) {
//             setCurrentPage(pageNumberInt);
//             fetchGDCS(pageNumberInt, pageSize, formData.branchCode, searchTerm);
//             fetchGDCS("");
//         } else {
//             const inputBox = document.getElementById("pageNumberInput");
//             inputBox.classList.add("input-error");

//             const errorMessage = document.createElement("div");
//             errorMessage.innerText = "Please enter a valid page number.";
//             errorMessage.classList.add("error-message");
//             inputBox.parentNode.insertBefore(errorMessage, inputBox.nextSibling);

//             setTimeout(() => {
//                 inputBox.classList.remove("input-error");
//                 errorMessage.remove();
//             }, 3000);
//         }
//     };

//     function handleRowClick(group) {
//         console.log("nte endi", group);
//         setSelectedGroupId(group._id); // Assuming each group object has a group_id property
//         console.log("firstman", selectedGroupId)
//         setShowMemberGroupModal(true); // Assuming you have a state to control the modal visibility
//     }

//     const handleGroupChange = (event) => {
//         const selectedId = event.target.value;
//         console.log("bang", selectedId)
    
//         setSelectedGroupId(selectedId);
    
//         // Find the selected group in the groups array
//         const selectedGroup = groups.find((group) => group._id === selectedId);
//         console.log("her", selectedGroup.numberofMember)
//         if (selectedGroup) {
//           setNumberOfMembers(selectedGroup.numberofMember);
//         }
//       };

//     const [searchTerm, setSearchTerm] = useState("");
//     let serialNumber = 1;
//     return (
//         <div>
//             <div className="container-fluid border rounded ">
//                 <nav className="navbar navbar-light ">
//                     <div className="container-fluid">
//                         <Link className="navbar-brand ms-5 d-flex align-items-center" to='/adminMain'>
//                             <img src={logo} alt="logo" width="100px" className="d-inline-block align-text-top" />
//                             <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
//                         </Link>
//                         <div className="d-flex" style={{ width: "600px" }}>
//                             <FontAwesomeIcon icon={faHouse} className=" me-5 mt-4" />
//                             <FontAwesomeIcon
//                                 icon={faPowerOff}
//                                 onClick={handleLogout}
//                                 className="text-danger me-5 mt-4"
//                             />
//                             <div className="d-flex">
//                                 <FontAwesomeIcon icon={faUser} className="me-3 mt-4" />
//                                 <ul className="list-unstyled mb-1" style={{ width: "150px" }}>
//                                     <li className="me-2">User</li>
//                                     <li>Date</li>
//                                     <li>Branch</li>
//                                 </ul>
//                                 <ul className="list-unstyled mb-1 me-5">
//                                     <li className="me-2">: Admin</li>
//                                     <li className="me-2">: {currentDate.toLocaleString()}</li>
//                                     <li className="me-2">:<select
//                                         className="form-group"
//                                         id="branch_name"
//                                         name="branch_name"
//                                         value={formData.branch_name}
//                                         onChange={handleInputChange}
//                                     >
//                                         <option value="">All Branches</option>
//                                         {branches.map((branch) => (
//                                             <option key={branch._id} value={branch.branch_name}>
//                                                 {branch.branch_name}
//                                             </option>
//                                         ))}
//                                     </select> </li>

//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </nav>
//                 <NavbarSection />
//                 <center>
//                     <h2>GDCS</h2>
//                 </center>
//                 <div className="">
//                     <div className="circle-buttons-container">
//                         <div className="row">
//                             <div className="col-md-6">
//                                 <div className="form-group mb-0 ">
//                                     <label htmlFor="referenceNumber" className="mr-2">
//                                         Search:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="branch"
//                                         name="branch"
//                                         onChange={handleSearch}
//                                         placeholder="Enter Search"
//                                         style={{ width: "20rem" }}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-6 ">
//                                 <div className="form-group mb-0" style={{ marginLeft: "5rem" }}>
//                                     <div>
//                                         <label htmlFor="pageNumber" className="mr-2">
//                                             Row No:
//                                         </label>
//                                     </div>
//                                     <div>
//                                         <select
//                                             value={pageSize}
//                                             onChange={handlePageSizeChange}
//                                             className="form-control"
//                                             style={{ width: "3rem" }}
//                                         >
//                                             <option value="10">10</option>
//                                             <option value="20">20</option>
//                                             <option value="50">50</option>
//                                             <option value="100">100</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <center>
//                     <div className="table-container">
//                         {isLoading ? (
//                             <div className="loading-animation">Loading...</div>
//                         ) : (
//                             <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>SL NO</th>
//                       <th>GROUP NAME</th>
//                       <th>DURATION</th>
//                       <th>TOTAL AMOUNT</th>
//                       <th>INSTALMENT AMOUNT</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {groups.map((group, index) => (
//                       <tr key={index} onClick={() => handleRowClick(group)}>
//                         <td>{index + 1}</td>
//                         <td>{group.GroupName}</td>
//                         <td>{group.duration}</td>
//                         <td>{group.priceMoney}</td>
//                         <td>{group.emi}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//                         )}
//                         <div className="pagination-buttons">
//                             <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
//                                 <FontAwesomeIcon icon={faArrowLeft} /> Previous
//                             </Button>
//                             <span>Page {currentPage}</span>
//                             <Button onClick={handleNextPage} disabled={!nextPage}>
//                                 Next <FontAwesomeIcon icon={faArrowRight} />
//                             </Button>
//                             <select value={pageSize} onChange={handlePageSizeChange}>
//                                 <option value="10">10</option>
//                                 <option value="20">20</option>
//                                 <option value="50">50</option>
//                                 <option value="100">100</option>
//                             </select>
//                         </div>
//                         <nav aria-label="Page navigation example col">
//                             <ul class="pagination justify-content-end">
//                                 <li class="page-item disabled">Enter page number:</li>
//                                 <li class="page-item">
//                                     <input
//                                         id="pageNumberInput"
//                                         type="number"
//                                         value={pageNumber}
//                                         style={{
//                                             width: "50px",
//                                             padding: "5px",
//                                             border: "1px solid #ccc",
//                                             borderRadius: "4px",
//                                         }}
//                                         onChange={handlePageNumberChange}
//                                         aria-label="Page number input"
//                                     />
//                                 </li>
//                                 <li class="page-item">
//                                     <Button onClick={goToPage} disabled={!nextPage}>
//                                         Go
//                                     </Button>
//                                 </li>
//                             </ul>
//                         </nav>
//                     </div>
//                 </center>
//             </div>
//             <ToastContainer />

//             <GroupMemberDetailsModal
//         show={showMemberGroupModal}
//         onHide={() => setShowMemberGroupModal(false)}
//         groupId={selectedGroupId}
//       />
//         </div>
//     );
// };

// export default GDCS;