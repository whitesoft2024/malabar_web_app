import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { jsPDF } from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import fdBondImage from "../Assets/fdbond.jpg"; // Adjust path if needed.
import "jspdf-autotable";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed and imported

const FdBond = () => {
  const [percentage, setPercentage] = useState(0);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchNames, setBranchNames] = useState([]);
  const [fdBranchReqData, setFdBranchReqData] = useState([]);
  const [selectedBranchData, setSelectedBranchData] = useState([]);
  const [pendingCounts, setPendingCounts] = useState({});
  const [fdBonds, setFdBonds] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [data, setData] = useState("");
  const [approvedFdBond, setApprovedFdBond] = useState(null);
  const [approvedFdBonds, setApprovedFdBonds] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:2000/api/branches")
      .then((response) => {
        const branchData = response.data.map((branch) => ({
          value: branch.branchCode,
          label: branch.branch_name,
        }));
        setBranches(branchData);
        setBranchNames(response.data.map((branch) => branch.branch_name));
      })
      .catch((error) => console.error("Error fetching branches:", error));

    axios
      .get("http://localhost:2000/api/fdBranchReq")
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setFdBranchReqData(response.data.data);
          calculatePendingCounts(response.data.data);
        } else {
          console.error(
            "Expected an array from the API but got",
            typeof response.data
          );
        }
      })
      .catch((error) =>
        console.error("Error fetching FD branch requests:", error)
      );
  }, []);

  const calculatePendingCounts = (data) => {
    const counts = data.reduce((acc, curr) => {
      if (curr.status === "pending") {
        acc[curr.branch_name] = (acc[curr.branch_name] || 0) + 1;
      }
      return acc;
    }, {});

    setPendingCounts(counts);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPercentage(value);
    }
  };

  const handleSubmit = () => {
    if (!selectedBranch) {
      alert("Please select a branch.");
      return;
    }

    const postData = {
      percentage: percentage,
      branchCode: selectedBranch.value,
      branchName: selectedBranch.label,
    };

    axios
      .post("http://localhost:2000/api/fd-bond", postData)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const handleBranchClick = (branchName) => {
    const filteredData = fdBranchReqData.filter(
      (data) => data.branch_name === branchName
    );
    setSelectedBranchData(filteredData);
  };

  // Handle Approve button click
  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:2000/api/approve-fd-bond/${id}`
      );

      const approvedData = response.data;

      setSelectedBranchData((prevData) =>
        prevData.map((bond) =>
          bond._id === id ? { ...bond, status: "approved" } : bond
        )
      );

      // Store the complete data needed for PDF generation
      const originalBond = selectedBranchData.find((bond) => bond._id === id);
      const completeData = {
        ...approvedData,
        fdModelDetails: {
          ...originalBond?.fdModelDetails,
          ...approvedData.fdModelDetails,
        },
      };

      // Store both the response data and the original bond data
      //  setApprovedFdBonds((prevApproved) => ({
      //   ...prevApproved,
      //   [id]: {
      //     ...approvedData,
      //     originalData: selectedBranchData.find(bond => bond._id === id)
      //   }

      // }));
      console.log("xxxx", approvedData);

      // Store in local storage for persistence
      const storedApprovals = JSON.parse(
        localStorage.getItem("approvedFdBonds") || "{}"
      );
      const updatedApprovals = {
        ...storedApprovals,
        [id]: completeData,
      };
      localStorage.setItem("approvedFdBonds", JSON.stringify(updatedApprovals));
      // Update state
      setApprovedFdBonds(updatedApprovals);
      // Display backend message as alert
      setAlertMessage(response.data.message);
      alert(response.data.message);
      setData(response.data);
      console.log(data, "xxxdata");
      // Set the approved FD bond state
      //  setApprovedFdBond({ ...response.data });
      // Trigger PDF generation
      //  handleGeneratePDF(approvedFdBond);
    } catch (error) {
      console.error("Error approving FD bond:", error);
      setAlertMessage("An error occurred while approving the FD bond.");
      alert("An error occurred while approving the FD bond.");
    }
  };

  const handleClose = (id) => {
    setSelectedBranchData((prev) => prev.filter((data) => data._id !== id));
  };

  // Enhanced PDF generation function
  const handleGeneratePDF = async (id) => {
    try {
      // First try to get data from state
      let bondData = approvedFdBonds[id];

      // If not in state, try to get from localStorage
      if (!bondData) {
        const storedApprovals = JSON.parse(
          localStorage.getItem("approvedFdBonds") || "{}"
        );
        bondData = storedApprovals[id];
      }

      // If still no data, try to fetch from backend
      if (!bondData) {
        const response = await axios.get(
          `http://localhost:2000/api/approvedfd-details/${id}`
        );
        bondData = response.data;
      }

      if (!bondData) {
        throw new Error("No data found for this FD bond");
      }

      const doc = new jsPDF("landscape");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Load image
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = fdBondImage;

        img.onload = () => {
          try {
            doc.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
            doc.setFontSize(10);

            // Safely add text with null checks and default values
            const addSafeText = (text, x, y) => {
              doc.text(text?.toString() || "N/A", x, y);
            };

            const details = bondData.fdModelDetails || {};

            // Add all regular text elements
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); // Reset to black for regular text

            // Define colors (using the green from your template)
            const brandGreen = "#5D6A73"; // Adjust this hex code to match your exact green

            // Function to safely add text with line breaks if the text exceeds a certain width
            const addWrappedText = (text, x, y, maxWidth) => {
              // Split text into lines based on the maximum width
              const lines = doc.splitTextToSize(text, maxWidth);

              // Add each line with a vertical increment (height between lines)
              lines.forEach((line, index) => {
                doc.text(line, x, y + index * 4); // Adjust 4px for line spacing
              });
            };

            // Add all text elements with safe defaults
            doc.setFont(undefined, "bold"); // Set font to bold
            addSafeText(details.customerName, 95, 51);
            // addSafeText(details.address, 95, 56);
            // For the address, use the wrapped text function with a smaller font size
            // doc.setFontSize(8);
            addWrappedText(details.address, 95, 56, 100); // 100 is the max width of the address field
            addSafeText(details.customerNumber, 95, 95);
            addSafeText(details.nomineeName, 95, 102);
            addSafeText(details.nomineeRelationship, 95, 115);
            doc.setFont(undefined, "normal"); // Reset to normal font
            addSafeText(details.fdBill, 238, 52);
            doc.setFontSize(8);

            addSafeText(details.accountType, 218, 73);
            doc.setFontSize(10);
            addSafeText(details.branchName, 238, 93);
            addSafeText(details.newDate, 51, 160);
            addSafeText(`${details.amount}/-`, 85, 160);
            addSafeText(`${details.interest}%`, 122, 160);
            addSafeText(details.durationInMonths, 152, 160);
            addSafeText(details.matureDate, 180, 160);
            addSafeText(`${details.totalAmount}/-`, 215, 160);
            // addSafeText(details.amountInWords, 65, 175);
            // addSafeText(details.totalAmountInWords, 65, 185);

            // Define the color you want to use for the labels
            const nomineeLabelColor = "#6C757D"; // This is the hex code for the desired color
            const labelFontSize = 10; // Estimate of font size (10px)
            // Function to add label and value with consistent formatting, font size, and color
            const addLabeledText = (
              label,
              value,
              labelX,
              textX,
              y,
              labelColor,
              fontSize
            ) => {
              // Set properties for label (assuming it's bold in the image)
              doc.setFont(undefined, "bold");
              doc.setFontSize(fontSize); // Set smaller font size
              doc.setTextColor(labelColor); // Set color for label
              doc.text(label, labelX, y);

              // Reset to normal font for the value
              doc.setFont(undefined, "normal");
              doc.setTextColor(0, 0, 0); // Reset to black for value text
              doc.text(value?.toString() || "N/A", textX, y);
            };

            // Add labeled text for Amount in Words and Interest Payment with updated font size and color
            addLabeledText(
              "Amount in Word:",
              `${details.amountInWords} only****`, // Concatenate "only****" to the value
              25, // x position for label
              56, // x position for value
              175, // y position
              nomineeLabelColor, // Pass the lighter label color
              labelFontSize // Pass the smaller font size
            );

            addLabeledText(
              "Interest Payment:",
              `${details.totalAmountInWords} only****`, // Concatenate "only****" to the value
              25, // x position for label
              56, // x position for value
              185, // y position
              nomineeLabelColor, // Pass the lighter label color
              labelFontSize // Pass the smaller font size
            );

            // Reset text properties to default after all text is added
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont(undefined, "normal");

            // Generate unique filename with timestamp
            const timestamp = new Date().getTime();
            doc.save(`fd_bond_${details.FDNumber || id}_${timestamp}.pdf`);
            // Show success message
            setSuccessMessage("PDF generated successfully!");

            // Remove success message after 3 seconds
            setTimeout(() => {
              setSuccessMessage("");
            }, 3000);

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = reject;
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Load approved bonds from localStorage on component mount
  useEffect(() => {
    const storedApprovals = JSON.parse(
      localStorage.getItem("approvedFdBonds") || "{}"
    );
    setApprovedFdBonds(storedApprovals);
  }, []);

  return (
    <div>
      <div className="row">
        <div
          className="col-3"
          style={{ backgroundColor: "#e9ecef", overflowY: "scroll" }}
        >
          <div className="d-flex justify-content-center mt-5">
            <div
              className="card p-4 shadow-lg"
              style={{
                width: "300px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",
              }}
            >
              <h4 className="text-center mb-4">FD Bond Percentage</h4>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  value={percentage}
                  onChange={handleInputChange}
                  placeholder="Enter Percentage"
                  min="0"
                  style={{
                    height: "38px", // Height of the input
                    lineHeight: "38px", // Vertically centers the text
                    padding: "0 12px", // Padding to add spacing from the edges
                  }}
                />
              </div>
              <Select
                className="mb-3"
                value={selectedBranch}
                onChange={setSelectedBranch}
                options={branches}
                placeholder="Select Branch"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "38px", // Matching height of the input field
                  }),
                }}
              />
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div
            className="container mt-4"
            style={{ height: "790px", width: "1250px" }}
          >
            <div
              className="border p-3"
              style={{ height: "790px", width: "1250px" }}
            >
              <h2 className="text-center mb-4">FD Bond Requests</h2>
              <div className="row" style={{ height: "100%", display: "flex" }}>
                <div
                  className="col-3"
                  style={{
                    height: "93%",
                    overflowY: "scroll",
                    backgroundColor: "#f0f2f5",
                  }}
                >
                  <div className="p-4 text-center">
                    <h4 className="mb-3 ">Select Branch</h4>
                    {branchNames.length === 0 ? (
                      <p>No branches available</p>
                    ) : (
                      branchNames.map((name, index) => (
                        <div
                          key={index}
                          className="p-2 mb-2 border rounded bg-light branch-name-box"
                          onClick={() => handleBranchClick(name)}
                        >
                          {name}
                          {pendingCounts[name] && (
                            <span
                              className="badge bg-danger ms-2"
                              style={{ width: "40px", height: "auto" }}
                            >
                              {pendingCounts[name]}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div
                  className="col-9"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  {selectedBranchData.length === 0 ? (
                    <div style={{ marginTop: "300px", marginLeft: "250px" }}>
                      <h3 className="justify-content-center">
                        No FD Bond data available
                      </h3>
                    </div>
                  ) : (
                    selectedBranchData.map((data) => (
                      <div key={data._id} className="card p-3 mb-3">
                        <div className="d-flex">
                          <div className="col-6">
                            <p>
                              <strong>Customer Name:</strong>{" "}
                              {data.customerName}
                            </p>
                            <p>
                              <strong>Date:</strong> {data.Date}
                            </p>
                            <p>
                              <strong>Time:</strong> {data.Time}
                            </p>
                            <p>
                              <strong>FD Number:</strong> {data.fdNumber}
                            </p>
                            <p>
                              <strong>Mobile Number:</strong>{" "}
                              {data.mobileNumber}
                            </p>
                            <p>
                              <strong>FD Amount:</strong> {data.fdAmount}
                            </p>
                            <p>
                              <strong>FD Bond Percentage:</strong>{" "}
                              {data.fdBondPercentage}%
                            </p>
                            <p>
                              <strong>Bond Transfer Amount:</strong>{" "}
                              {data.bondTransferAmount}
                            </p>
                            <p>
                              <strong>Recipient Bank Account:</strong>{" "}
                              {data.recipientBankAccount}
                            </p>
                          </div>
                          <div className="col-6">
                            <img
                              src={data.image}
                              alt="FD Bond"
                              style={{
                                width: "300px",
                                height: "200px",
                                objectFit: "cover",
                                marginLeft: "100px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <button
                            className={`btn ${
                              data.status === "approved"
                                ? "btn-primary"
                                : "btn-success"
                            } me-2`}
                            disabled={data.status === "approved"}
                            onClick={() => handleApprove(data._id)}
                          >
                            {data.status === "approved"
                              ? "Approved"
                              : "Approve"}
                          </button>
                          <button
                            className="btn btn-danger me-2"
                            onClick={() => handleClose(data._id)}
                          >
                            Close
                          </button>

                          {(data.status === "approved" ||
                            approvedFdBonds[data._id]) && (
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleGeneratePDF(data._id)}
                            >
                              Generate PDF
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FdBond;
