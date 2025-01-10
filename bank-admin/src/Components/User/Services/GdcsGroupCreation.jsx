import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Nav from "../Others/Nav";
// import NavBar from "../Others/NavBar";
import { UserContext } from "../Others/UserContext";

const GdcsGroupCreation = () => {
 let result = 0;
 const [showModal, setShowModal] = useState(false);
 const [showPaymentModal, setShowPaymentModal] = useState(false);
 const { user, setUser } = useContext(UserContext);

 const handleNextClick = () => {
    setShowModal(false);
    setShowPaymentModal(true);
 };
 const handleMoneyBack = () => {
    setShowPaymentModal(false);
    setShowModal(true);
 };
 const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setShowModal(true);
 };

 const handlePlusIconClick = () => {
    setShowModal(true);
 };

 const handleCloseModal = () => {
    setShowModal(false);
 };

 const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
 const [transactionId, setTransactionId] = useState("");
 const [cashTransactionId, setcashTransactionId] = useState("");
 const [beneficiaryName, setBeneficiaryName] = useState("");
 const [bankName, setBankName] = useState("");
 const [ifsc, setIfsc] = useState("");
 const [accountNumber, setAccountNumber] = useState("");
 const [schemeNames, setSchemeNames] = useState([]);
 const [selectedSchemeName, setSelectedSchemeName] = useState("");
 const [schemeDetails, setSchemeDetails] = useState({});
 const [selectedSchemeDetails, setSelectedSchemeDetails] = useState({});
 const [selectedMobileNumber, setselectedMobileNumber] = useState("");
 const [selectedAccountDetails, setSelectedAccountDetails] = useState({});

 useEffect(() => {
    const fetchSchemeNames = async () => {
      try {
        const response = await fetch("https://api.malabarbank.in/gdcs/api/gdcsCreateFetch");
        const text = await response.text();
        const data = JSON.parse(text);
        setSchemeNames(data);
      } catch (error) {
        console.error("Error fetching scheme names:", error);
      }
    };

    fetchSchemeNames();
 }, []);

 const handleSchemeChange = (selectedSchemeName) => {
    setSelectedSchemeName(selectedSchemeName);
    const scheme = schemeNames.find(scheme => scheme.schemeName === selectedSchemeName);
    setSelectedSchemeDetails(scheme || {});
 };

 const [currentDate, setCurrentDate] = useState(new Date());

 useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
 }, []);

 return (
    <div>
      <Nav></Nav>
      {/* <NavBar></NavBar> */}
      <div>
        <div className="circle-button" onClick={handlePlusIconClick}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div>
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          dialogClassName="custom-modal-width"
        >
          <Modal.Body className="p-0">
            <div className="Member form" style={{ maxWidth: "1800px" }}>
              <div className="card mt-0">
                <div className="card-header text-light">
                 <h4>GDCS NEW GROUP CREATION</h4>
                </div>
                <div className="card-body">
                 <form>
                    {/* Your form content here */}
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleNextClick}
                      >
                        Next
                      </button>
                      <button
                        type="reset"
                        className="btn btn-secondary m-2"
                      >
                        Clear
                      </button>
                      <Button variant="danger" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </div>
                 </form> {/* Closing tag for the first form */}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <Modal
        show={showPaymentModal}
        onHide={handleClosePaymentModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>PAYMENT GATEWAY</h4>
              </div>
              <div className="card-body ">
                <form onSubmit="" className=" mt-3">
                 {/* Your form content here */}
                 <center>
                    <div className="form-group mt-5 ">
                      <button type="submit" className="btn btn-primary">
                        Make Payment
                      </button>
                      <Button
                        variant="danger"
                        className="btn btn-secondary m-2"
                        onClick={handleMoneyBack}
                      >
                        Back
                      </Button>
                    </div>
                 </center>
                </form> {/* Closing tag for the second form */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
 );
};

export default GdcsGroupCreation;
