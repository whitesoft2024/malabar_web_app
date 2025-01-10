import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Button, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTableList, faList, } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UserContext } from "../Others/UserContext";
import { faUser, faHouse, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


function MatureWithdrawFD() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [query, setQuery] = useState("");
    const [phoneNumbers, setPhoneNumbers] = useState([""]);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
    const [rdNumbers, setRDNumbers] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const [formData, setFormData] = useState({

        schemeType: "",
        accountType: '',
        duration: "",
        amount: "",
        interest: "",
        finalInterest: "",
        membershipId: "",
        RDNumber: "",
        customerName: "",
        customerNumber: "",
        address: "",
        referenceName: "",
        date: "",
        totalAmount: "",
        rdBill: "",
        accountStatus: '',
        transactionId: '',
    });


    const handleReset = () => {
        setFormData({
            schemeType: "",
            accountType: "",
            duration: "",
            amount: "",
            interest: "",
            finalInterest: "",
            membershipId: "",
            FDNumber: "",
            customerName: "",
            customerNumber: "",
            address: "",
            referenceName: "",
            date: "",
            totalAmount: "",
            fdBill: "",
            accountStatus: "",
            transactionId: ""
        });
    };

    const handleChangeRd = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //   const handleSubmitFd = (e) => {
    //     e.preventDefault();
    //     submitFormData();
    //   };

    const fetchPhoneNumbers = async () => {
        try {
            const response = await axios.get(`https://api.malabarbank.in/searchRDNumbers?query=${query}`);
            setRDNumbers(response.data);
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };

    const fetchMemberDetails = async (rdNumber) => {
        try {
            const response = await axios.get(`https://api.malabarbank.in/RDfetchMemberDetails?rdNumber=${rdNumber}`);
            const memberData = response.data;
            if (memberData) {
                setFormData({
                    ...memberData,
                    newAmount: '',
                    addreferenceName: '',
                });
            } else {
                console.log("No member details found for RDS number:", rdNumber);
            }
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    };

    useEffect(() => {
        if (query) {
            fetchPhoneNumbers();
        } else {
            setRDNumbers([]);
        }
    }, [query]);

    const handleRDNumber = async (RDNumber) => {
        setSelectedPhoneNumber(RDNumber);
        fetchMemberDetails(RDNumber);
        setQuery(RDNumber);
        setRDNumbers([]);
    };

    //generate Transaction id

    function generateTransactionId(recipt) {
        // Retrieve the last used number for the branch code from local storage
        let lastNumber = localStorage.getItem(`lastNumber_${recipt}`);

        if (!lastNumber) {
            lastNumber = 1; // Start with 00000001
            localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
        } else {
            lastNumber = parseInt(lastNumber) + 1; // Increment by one
            localStorage.setItem(`lastNumber_${recipt}`, lastNumber);
        }

        // Generate the ID with the format "MS" + lastNumber with padding
        return `T${lastNumber.toString().padStart(17, '0')}`;
    }
    const updateMemberDetails = async (phoneNumber, updatedData) => {
        try {
            const response = await axios.put(`https://api.malabarbank.in/updateMemberDetails/${phoneNumber}`, updatedData);
            console.log(response.data);
        } catch (error) {
            console.error("Error updating member details:", error);
        }
    };

    const handleSubmitFd = async (e) => {
        e.preventDefault();
        // Generate a transaction ID
        const transactionId = generateTransactionId("yourRecipientCode");
        // Update the form data with the generated transaction ID
        const updatedData = { ...formData, transactionId };
        // Call the update function with the updated data
        await updateMemberDetails(formData.customerNumber, updatedData);
        // Optionally, provide feedback to the user
        alert("Member details updated successfully!");
    }

    return (
        <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
                <div className=" justify-content-center">
                    <div className="">
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>RD MATURITY WITHDRAWAL FORM</h4>
                            </div>
                            <div className="card-body">
                                <form >
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="accountHolderName">
                                                    RD Number
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter RDnumber"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                />
                                                {rdNumbers.length > 0 && (
                                                    <ul className="dropdown-menu2">
                                                        {rdNumbers
                                                            .filter((number, index, self) => self.findIndex(n => n.RDNumber === number.RDNumber) === index)
                                                            .map((number, index) => (
                                                                <li
                                                                    key={index}
                                                                    onClick={() => handleRDNumber(number.RDNumber)}
                                                                >
                                                                    {number.RDNumber}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="accountType">Account Type*</label>
                                                <select
                                                    className="form-control"
                                                    id="accountType"
                                                    name="accountType"
                                                    // value={formData.accountType}
                                                    // onChange={handleChange}
                                                    required
                                                >
                                                    <option value=""> RD</option>
                                                    <option value="Savings">Mahila RD</option>
                                                    <option value="Current">Little Star</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="duration">
                                                    Duration in Month*
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="duration"
                                                    name="duration"
                                                    // value={formData.duration}
                                                    // onChange={handleChange}
                                                    placeholder="Enter Duration in Month"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="interest">Commision</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="interest"
                                                    name="interest"
                                                    // value={formData.interest}
                                                    // onChange={handleChange}
                                                    placeholder="Enter Commision"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="billNumber">Bill Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="billNumber"
                                                    name="billNumber"
                                                    // value={formData.billNumber}
                                                    // onChange={handleChange}
                                                    placeholder="Enter Bill Number"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="referenceNumber">Paid Month</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="branch"
                                                    name="branch"
                                                    // value={formData.branch}
                                                    // onChange={handleChange}
                                                    placeholder="Enter Paid Month"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="form-group ">
                                                <label htmlFor="membershipId">
                                                    Membership ID*
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="membershipId"
                                                    name="membershipId"
                                                    // value={formData.membershipId}
                                                    // onChange={handleChange}
                                                    placeholder="Enter Membership ID"
                                                    required
                                                />

                                                <div className="form-group mt-3">
                                                    <label htmlFor="rdNumber">RD Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="rdNumber"
                                                        name="rdNumber"
                                                        // value={formData.rdNumber}
                                                        // onChange={handleChange}
                                                        placeholder="Enter RD Number"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="Mobile-number">
                                                        Monthly Amount
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="mobile-number"
                                                        name="mobile-number"
                                                        // value={formData.mobileNumber}
                                                        // onChange={handleChange}
                                                        placeholder="Enter Monthly Amount"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="amount">Paid Amount</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="amount"
                                                        name="amount"
                                                        // value={formData.amount}
                                                        // onChange={handleChange}
                                                        placeholder="Enter Paid Amount"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="date">Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="date"
                                                        name="date"
                                                    // value={formData.date}
                                                    // onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="referenceNumber">
                                                        W Slip Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="referenceNumber"
                                                        name="referenceNumber"
                                                        // value={formData.referenceNumber}
                                                        // onChange={handleChange}
                                                        placeholder="Enter Reference Number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group ">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                        <button
                                            type="reset"
                                            className="btn btn-secondary m-2"
                                        >
                                            Reset
                                        </button>

                                        <Button variant="danger" onClick={handleCloseModalMatu}>
                                            Close
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatureWithdrawFD
