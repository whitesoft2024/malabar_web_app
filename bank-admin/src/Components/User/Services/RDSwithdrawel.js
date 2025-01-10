import React, { useState,useEffect } from "react";
import { Button } from "react-bootstrap";
import "../../style/Rd.css";
import axios from "axios";
import { Link } from "react-router-dom";

function RDSwithdrawel() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [query, setQuery] = useState("");
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
    const [rdSNumbers, setRDSNumbers] = useState([]);
    const [formData, setFormData] = useState({
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
        amount: "",
        newAmount: "",
        rdsBill: "",
        accountStatus: '',
        transactionId: '',
        withdrawalAmount:"",
    });

    const handleChangeRDS = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchPhoneNumbers = async () => {
        try {
            const response = await axios.get(`http://localhost:2000/rdSsearchRDSNumbers?query=${query}`);
            setRDSNumbers(response.data);
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };

    const fetchMemberDetails = async (rdsNumber) => {
        try {
            const response = await axios.get(`http://localhost:2000/rdSfetchMemberDetails?rdsNumber=${rdsNumber}`);
            const memberData = response.data;
            if (memberData) {
                setFormData({
                    ...memberData,
                });
                console.log("data"+memberData);
            } else {
                console.log("No member details found for RDS number:", rdsNumber);
            }
        } catch (error) {
            console.error("Error fetching member details:", error);
        }
    };


    const handlePhoneNumberSelection = async (RDSNumber) => {
        setSelectedPhoneNumber(RDSNumber);
        fetchMemberDetails(RDSNumber);
        setQuery(RDSNumber);
        setRDSNumbers([]);
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
        return `W${lastNumber.toString().padStart(17, '0')}`;
    }
    const submitFormData = async () => {
        try {
            const transactionId = generateTransactionId('recipt'); 

            const { _id, ...formDataWithoutId } = formData;

            const formattedDate = currentDate.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const updatedFormData = {
                // ...formData,
                ...formDataWithoutId,
                transactionId: transactionId,
                withdrawalAmount: formData.withdrawalAmount,
                date: formattedDate,
            };
    
            const response = await axios.post('http://localhost:2000/api/rdsEmi',updatedFormData);
            console.log('Form data saved to rdsEmi collection:', response.data);

            const putResponse = await axios.put(`http://localhost:2000/api/rdsDataSub/${formData.RDSNumber}`, {
                transactionId: transactionId,
                amount: formData.withdrawalAmount 
            });
            console.log('RDS data updated in rdsData collection:', putResponse.data);
            alert('Withdrawal successfully.');
            window.location.href = "/RDSwithdrawel";
        } catch (error) {
            console.error('Error saving form data or updating RDS amount:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFormData();
            setFormData({ ...formData, addreferenceName: '' });
            console.log('Form data saved/updated successfully');
        } catch (error) {
            console.error('Error saving/updating form data:', error);
        }
    };

    useEffect(() => {
        if (query) {
            fetchPhoneNumbers();
        } else {
            setRDSNumbers([]);
        }
    }, [query]);

    return (
        <div>
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
                                            <label htmlFor="membershipId"> RDS Number :</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter phone number"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                            {rdSNumbers.length > 0 && (
                                                <ul className="dropdown-menu2">
                                                    {rdSNumbers
                                                        .filter((number, index, self) => self.findIndex(n => n.RDSNumber === number.RDSNumber) === index)
                                                        .map((number, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={() => handlePhoneNumberSelection(number.RDSNumber)}
                                                            >
                                                                {number.RDSNumber}
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
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endDate">End Date :</label>
                                        <div className="form-control">
                                            {currentDate.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="totalAmount">Total Amount :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount} 
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
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RDSwithdrawel



   // const handleSubmitRDS = async (e) => {
    //     e.preventDefault();
    //     const transactionId = generateTransactionId("yourRecipientCode");
    //     const updatedData = { ...formData, transactionId };
    //     await updateMemberDetails(formData.customerNumber, updatedData);
    //     alert("Member details updated successfully!");
    // }

    // const updateMemberDetails = async (phoneNumber, updatedData) => {
    //     try {
    //         const response = await axios.put(`http://localhost:2000/updateMemberDetails/${phoneNumber}`, updatedData);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error("Error updating member details:", error);
    //     }
    // };