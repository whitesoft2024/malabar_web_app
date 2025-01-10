import React, { useState, useEffect, useContext } from "react";
import "../../style/Rd.css";
import axios from "axios";
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { UserContext } from "../../Others/UserContext";
import moment from 'moment';
import numberToWords from 'number-to-words';
import Nav from '../../Others/Nav';

function RDSwithdraw() {

    const [newRDSdata, setNewRDSdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [alertMsg, setAlertMsg] = useState('');
    const loginBranchCode = user.branchDetails.branchCode;
    const loginBranchUser = user.employee.fullname;
    const loginUserTime = currentDate.toLocaleString()
    const [formData, setFormData] = useState({
        branchCodeUser: loginBranchCode,
        branchUser: loginBranchUser,
        userTime: loginUserTime,
        schemeType: "",
        accountType: '',
        membershipId: "",
        RDSNumber: "",
        customerName: "",
        customerNumber: "",
        address: "",
        referenceName: "",
        addreferenceName: "",
        depositwords: '',
        date: "",
        Date: "",
        amount: "",
        newAmount: "",
        withdrawRdsBill: "",
        accountStatus: '',
        withdrawTransactionId: '',
        withdrawalAmount: "",
        total: 0,
        time: '',
    });

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const handleChangeRDS = (e) => {
        const { name, value } = e.target;
        let parsedValue = value !== '' ? parseInt(value.replace(/,/g, '')) : 0; // Convert string to integer, removing commas

        let updatedFormData = { ...formData, [name]: parsedValue };

        // if (name === 'withdrawalAmount') {
        //     const amountInWords = parsedValue !== '' && !isNaN(parsedValue) ? numberToWords.toWords(parsedValue) : '';
        //     updatedFormData = { ...updatedFormData, depositwords: amountInWords };

        //     // Calculate balanceAmount by adding newAmount to total, both converted to cents
        //     const balanceAmountCents = (parseInt(formData.total.replace(/,/g, '')) * 100) - (parsedValue * 100);
        //     updatedFormData.balanceAmount = balanceAmountCents / 100; // Convert back to dollars for display
        // }
        if (name === 'withdrawalAmount') {
            const amountInWords = parsedValue!== '' &&!isNaN(parsedValue)? numberToWords.toWords(parsedValue) : '';
            updatedFormData = {...updatedFormData, depositwords: amountInWords };

            // Calculate balanceAmount by subtracting withdrawalAmount from total, both converted to cents
            const balanceAmountCents = (parseInt(formData.total.replace(/,/g, '')) * 100) - (parsedValue * 100);
            updatedFormData.balanceAmount = balanceAmountCents / 100; // Convert back to dollars for display

            // Check if withdrawal amount exceeds available balance
            if (balanceAmountCents < 0) {
                setErrorMessage('Insufficient funds in the account.');
            } else {
                setErrorMessage('');
            }
        }

        setFormData({ ...formData, [name]: value,
            ...updatedFormData, });
    };

    const handleChangeDate = (event) => {
        const Date = moment(event.target.value).format('DD/MM/YYYY');
        setFormData({ ...formData, Date });
    };

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
        return `ETRDS${lastNumber.toString().padStart(14, '0')}`;
    }
    function generateRDSbill(recipt) {
        const branchCode = user.branchDetails.branchCode;
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
        return `EWRDS${branchCode}${lastNumber.toString().padStart(8, '0')}`;
    }

    const submitFormData = async (item) => {
        try {
            const transactionId = generateTransactionId('recipt');
            const rdsbill = generateRDSbill('recipt');
            const { _id, ...formDataWithoutId } = formData;
            const updatedFormData = {
                ...formDataWithoutId,
                _id: formData._id,
                withdrawRdsBill: rdsbill,
                withdrawTransactionId: transactionId,
                withdrawalAmount: formData.withdrawalAmount,
                newDate: formData.Date, // Ensure Date field is included
                referenceName: formData.referenceName, // Include referenceName
                User: formData.branchUser, // Include user data
                userTime: formData.userTime, // Include userTime
                branchCode: user.branchDetails.branchCode, // Include branchCode
                Type: "Withdraw",// Include Type
                time: getCurrentTime(),
                // balanceAmount: item.balanceAmount,
            };
            const groupId = formData._id;
            const response = await axios.post(`https://api.malabarbank.in/api/rds/WithdrawEmiData/${groupId}`, { ...item, emiData: updatedFormData });
            console.log('Form data saved:', response.data);
            setAlertMsg('Withdrawal successfully');
            setTimeout(() => {
                setAlertMsg('');
            }, 3000); // Hide the alert after 3 seconds
        } catch (error) {
            console.error('Error saving form data or updating RDS amount:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const withdrawalAmount = parseFloat(formData.withdrawalAmount);
        const totalAmount = parseFloat(formData.total);
        if (totalAmount - withdrawalAmount < 200) {
            setAlertMsg('Insufficient amount. Withdrawal not allowed.');
            setTimeout(() => {
                setAlertMsg('');
            }, 3000);
            return;
        }
        try {
            await submitFormData();
            setFormData({ ...formData, addreferenceName: '' });
            handleReset();
            window.location.reload();
            console.log('Form data saved/updated successfully');
        } catch (error) {
            console.error('Error saving/updating form data:', error);
        }
    };
    const handleReset = () => {
        setFormData({
            // Reset all form fields to their initial state
            branchCodeUser: user.branchDetails.branchCode,
            branchUser: user.employee.fullname,
            userTime: currentDate.toLocaleString(),
            schemeType: "",
            accountType: '',
            membershipId: "",
            RDSNumber: "",
            customerName: "",
            customerNumber: "",
            address: "",
            referenceName: "",
            addreferenceName: "",
            date: "",
            Date: "",
            amount: "",
            newAmount: "",
            rdsBill: "",
            accountStatus: '',
            transactionId: '',
            withdrawalAmount: "",
            depositwords:'',
            total: 0,
        });
    };


    const [searchRDS, setSearchRDS] = useState('');

    const branch = user?.branchDetails?.branchCode;
    useEffect(() => {

        fetchRDSData(currentPage, pageSize, branch, searchRDS);
    }, [currentPage, pageSize, branch, searchRDS]);
    useEffect(() => {
        if (searchRDS) {
            fetchRDSData(currentPage, pageSize, branch, searchRDS);
        }
    }, [searchRDS]);

    const fetchRDSData = async (page, size, branch, searchRDS = '') => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://api.malabarbank.in/api/RDSdata?page=${page}&limit=${size}&branch=${branch}&searchRDS=${searchRDS}`);

            // Initialize sum
            let totalSum = 0;

            // Iterate over response data to find the sum for the specific RDS number
            response.data.data.forEach(obj => {
                if (obj.RDSNumber === searchRDS) { // Check if the RDSNumber matches the searchRDS
                    let sum = parseFloat(obj.amount); // Initialize sum with amount field
                    obj.EmiData.forEach(emi => {
                        if (emi.newAmount) {
                            sum += parseFloat(emi.newAmount);
                        }
                        if (emi.withdrawalAmount) {
                            sum -= parseFloat(emi.withdrawalAmount);
                        }
                    });
                    totalSum += sum; // Add sum to totalSum for the specific RDSNumber
                }
            });

            // Set the total sum into state
            setFormData(prevState => ({
                ...prevState,
                total: totalSum.toFixed(2)
            }));

            setNewRDSdata(response.data.data)
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRDSNumberSelect = (value) => {
        fetchData(value);
        setFormData(prevFormData => ({
            ...prevFormData,
            RDSNumber: value,
            branchUser: loginBranchUser,
            userTime: loginUserTime,
            time: getCurrentTime(),
        }));
        setSearchRDS(value);
        setShowDropdown(false);
    };

    const fetchData = (mobile) => {
        const filteredCustomers = newRDSdata.filter(
            (customer) => customer.RDSNumber === mobile
        );
        if (filteredCustomers.length > 0) {
            setFormData(filteredCustomers[0]);
            setSearchRDS(filteredCustomers[0].RDSNumber);
        } else {
            setFormData(null);
        }
    };

    return (
        <div>
            <Nav />
            <div className="container Member form" style={{ maxWidth: "1000px" }}>
                <div className="card mt-0">
                    <div className="card-header text-light">
                        <h4>RDS WITHDRAWAL FORM</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="ms-3 mt-3">
                            <div className="row ms-5">
                                <div className="col-6">
                                    <div className="form-group ">
                                        <div className="dropdown-wrapper">
                                            <Form.Label>RDS Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search..."
                                                style={{ width: "15rem" }}
                                                value={searchRDS}
                                                onChange={(e) => setSearchRDS(e.target.value)}
                                                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                                            />
                                            {showDropdown && searchRDS && (
                                                <ul className="dropdown-menu2">
                                                    {newRDSdata
                                                        .filter((customer) =>
                                                            (customer.RDSNumber && customer.RDSNumber.toLowerCase().includes(searchRDS.toLowerCase()))
                                                        )
                                                        .map((customer, index) => (
                                                            <li key={index} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleRDSNumberSelect(customer.RDSNumber); setShowDropdown(false); }}>
                                                                {customer.customerName} - {customer.RDSNumber}
                                                            </li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <label htmlFor="membershipId"> Membership ID :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="duration"
                                            name="duration"
                                            value={formData.membershipId}
                                            onChange={handleChangeRDS}
                                            placeholder=""
                                            required
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paidDate">Paid Days :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="paidDate"
                                            name="paidDate"
                                            value={formData.date}
                                            onChange={handleChangeRDS}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paidDate">Amount in Words :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="depositwords"
                                            value={formData.depositwords}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="accountHolderName">
                                            Account Holder Name :
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="customerName"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChangeRDS}
                                            placeholder=""
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="labels" htmlFor="date">
                                            Date :
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="Date"
                                            name="Date"
                                            value={moment(formData.Date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                                            onChange={handleChangeDate}
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="totalAmount">Total Amount :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="total"
                                            name="total"
                                            value={formData.total}
                                            onChange={handleChangeRDS}
                                            placeholder=""
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="amount">Withdrawal Amount :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="withdrawalAmount"
                                            name="withdrawalAmount"
                                            value={formData.withdrawalAmount}
                                            onChange={handleChangeRDS}
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <center>
                                <div className="form-group mt-5">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                    <button type="button" className="btn btn-secondary m-2">
                                        Reset
                                    </button>

                                    <Button variant="danger" >
                                        <Link to='/rds'>Close</Link>
                                    </Button>
                                </div>
                                {alertMsg && (
                                    <div className="alert alert-success" role="alert">
                                        {alertMsg}
                                    </div>
                                )}

                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RDSwithdraw