import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
import "./Savings.css";
import axios from "axios";


const Savings = () => {
    const [formData, setFormData] = useState({
        membershipId: "",
        accountHolderName: "",
        accountType: "",
        duration: "",
        interest: "",
        billNumber: "",
        accountHolderAddress: "",
        rdNumber: "",
        amount: "",
        date: "",
        referenceNumber: "",
        branch: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("", formData);
            console.log("Data saved:", response.data);
            // Clear form fields after successful submission
            setFormData({
                membershipId: "",
                accountHolderName: "",
                branch: "",
                accountHolderAddress: "",
                accountNumber: "",
                date: "",
                remarks: "",
                initialDeposit: ""
            });
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handlePlusIconClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // const isOtherBranchSelected = formData.branch === "Other Branch";

    return (
        <div>
            <div className="container border rounded p-4 mt-4 mb-4">
                <center>
                    <h2>SAVINGS ACCOUNT</h2>
                </center>
                <div className="App">
                    <div className="circle-buttons-container">
                        <div className="circle-button" onClick={handlePlusIconClick} ><FontAwesomeIcon icon={faPlus} /></div>
                        <div className="circle-button"><FontAwesomeIcon icon={faPrint} /></div>

                    </div>
                </div>
                <center>
                    <div className="table-container">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SL NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CUSTOMER NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MEMBERSHIP ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ACCOUNT NUMBER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                </center>
            </div>

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                dialogClassName="custom-modal-width"
            >
                <Modal.Body className="p-0">
                    <div className="Member form" style={{ maxWidth: "1800px" }}>
                        <div className="card mt-0">
                            <div className="card-header text-light">
                                <h4>Add New SB Account</h4>
                            </div>
                            <div className="card-body ">
                                <form onSubmit={handleSubmit} className="ms-5 mt-3">
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="membershipId">Membership ID :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="membershipId"
                                                name="membershipId"
                                                value={formData.membershipId}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="branch">Branch :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="branch"
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="accountHolderName">Account Holder Name :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="accountHolderName"
                                                name="accountHolderName"
                                                value={formData.accountHolderName}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="accountNumber">Account Number :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="accountNumber"
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="date">Date :</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="accountHolderAddress">Address :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="accountHolderAddress"
                                                name="accountHolderAddress"
                                                value={formData.accountHolderAddress}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="initialDeposit">Initial Deposit :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="initialDeposit"
                                                name="initialDeposit"
                                                value={formData.initialDeposit}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="labels" htmlFor="initialDeposit">Initial Deposit (In Words) :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="initialDeposit"
                                                name="initialDeposit"
                                                value={formData.initialDeposit}
                                                onChange={handleChange}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-row">
                                        <div className="col">
                                            <label className="labels" htmlFor="remarks">Remarks :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="remarks"
                                                name="remarks"
                                                value={formData.date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label className="labels"></label>
                                        </div>
                                    </div>
                                </form>
                                <center>
                                    <div className="form-group mt-5">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                        <button type="reset" className="btn btn-secondary m-2" >
                                            Reset
                                        </button>
                                        <Button variant="danger" onClick={handleCloseModal}>
                                            Close
                                        </Button>
                                    </div>
                                </center>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Savings