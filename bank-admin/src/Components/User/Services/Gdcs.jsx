import React, { useEffect, useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";
// import "../style/Gdcs.css";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../Others/UserContext";
import { faUser, faHouse, faPowerOff, faA, faCalendarDays, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../style/logo.png";
import GroupMemberDetailsModal from "./GdcsMemberDetailsModal";
import GdcsEmiModal from "./GdcsEmiModal";
import Select from 'react-select';

import GdcsGroupEmiDetails from "./GdcsGroupEmiDetails";
// import GdcsEmiPaymentModal from "./GdcsEmiPaymentModal";
const Gdcs = () => {


  //membergroup states
  const [showMemberGroupModal, setShowMemberGroupModal] = useState(false);
  const [selectedMemberGroup, setSelectedMemberGroup] = useState(null);
  const [showEmiModal, setShowEmiModal] = useState(false);

  const [gdcsNumber, setGdcsNumber] = useState('');

  // Function to handle input change
  const handleGdcsNumberChange = (event) => {
    setGdcsNumber(event.target.value);
  }

  //emi modal
  function handleEmiClick() {
    setShowEmiModal(true)
  }

  //emi payment modal stuff
  // function handleEmiPayNextClick(){
  //   setShowEmiModal(false)
  //   setShowPaymentModal(true)
  // }
  // const handleEmiPaymentModalClose = () => setShowEmiPaymentModal(false);


  ///membergroup  selection 
  function handleRowClick(group) {
    console.log("grp", group);
    setSelectedGroupId(group._id); // Assuming each group object has a group_id property
    console.log("firstman", selectedGroupId)
    setShowMemberGroupModal(true); // Assuming you have a state to control the modal visibility
  }



  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);   // Function to handle date change
  const handleDateChange = (event) => {
    setCurrentDate(event.target.value); // Update currentDate state with the selected date
  };
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentDate(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  // Logout function
  const handleLogout = () => {
    // Clear user data from local storage and reset user state
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to login page or any other page as needed
    window.location = `/`;
  };

  const { user, setUser } = useContext(UserContext);
  const [branchCode, setBranchCode] = useState("");

  // Update branchCode state when user changes
  useEffect(() => {
    if (user?.branchDetails?.branchCode) {
      setBranchCode(user.branchDetails.branchCode);
    }
  }, [user]);

  const generatedgdcsdBills = new Set();

  const [groupData, setGroupData] = useState({
    groupName: "",
    durationMonth: "",
    membersToAdd: "",
    totalAmount: "",
    monthlyAmount: "",
    date: "",
  });

  const [schemeData, setSchemeData] = useState({
    schemeName: "",
    durationMonth: "",
    membersToAdd: "",
    schemeAmount: "",
    startDate: "",
    endDate: "",
  });

  const [selectedOption, setSelectedOption] = useState("group");

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChangeGroup = (e) => {
    const { name, value } = e.target;
    setGroupData({
      ...groupData,
      [name]: value,
    });
  };

  const handleChangeScheme = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSchemeData({
      ...schemeData,
      [name]: value,
    });
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("", groupData);
      console.log("Data saved:", response.data);
      // Clear form fields after successful submission
      setGroupData({
        groupName: "",
        durationMonth: "",
        membersToAdd: "",
        totalAmount: "",
        monthlyAmount: "",
        date: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("", schemeData);
      console.log("Data saved:", response.data);
      // Clear form fields after successful submission
      setSchemeData({
        schemeName: "",
        durationMonth: "",
        membersToAdd: "",
        schemeAmount: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const [showGroup, setShowGroup] = useState(false);
  const [showScheme, setShowScheme] = useState(false);

  const handlePlusIconGroup = () => {
    setShowGroup(true);
  };

  const handlePlusIconScheme = () => {
    setShowScheme(true);
  };

  const handleCloseModal = () => {
    setShowGroup(false);
    setShowScheme(false);
    setShowModal(false);
  };

  /// sar data
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [schemeNames, setSchemeNames] = useState([]);
  const [selectedSchemeName, setSelectedSchemeName] = useState("");
  const [schemeDetails, setSchemeDetails] = useState({});
  const [selectedSchemeDetails, setSelectedSchemeDetails] = useState({});
  const [selectedMobileNumber, setselectedMobileNumber] = useState("");
  const [mobiData, setMobiData] = useState([]);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState({});
  const [query, setQuery] = useState("");

  const handleMobileNumberChange = (selectedMobileNumber) => {
    console.log("anju", selectedMobileNumber);
    const selectedMobi = mobiData.find(
      (ac) => ac.customerMobile === selectedMobileNumber
    );
    setselectedMobileNumber(selectedMobileNumber);
    setSelectedAccountDetails(selectedMobi || {});
    console.log("Selected Account Details:", selectedMobi);
  };


  //GDCS peruvadis
  // const [gdcsNumber, setGdcsNumber] = useState("");

  const handleSchemeChange = (selectedSchemeName) => {
    setSelectedSchemeName(selectedSchemeName);
    const scheme = schemeNames.find(
      (scheme) => scheme.schemeName === selectedSchemeName
    );
    setSelectedSchemeDetails(scheme || {});
    console.log("Selected Scheme Details:", scheme);

    // Assuming you have the branch code available in the user context or state
    const branchCode = user?.branchDetails?.branchCode;
    if (branchCode) {
      // Call updateFDNumber with the branch code
      updateGDCSNumber(branchCode);
    } else {
      console.error("Branch code not available");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleNextClick = (event) => {
    event.preventDefault();
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

  //get mob num and a/c details
  const [savingData, setSavingData] = useState([]);
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("https://api.malabarbank.in/api/membership");
        const text = await response.text();
        console.log("Raw Response:", text);
        const mobiData = JSON.parse(text);
        console.log("makriiii", mobiData);

        mobiData.forEach((mobile) => {
          // console.log("Mobile Number:", mobile.customerMobile);
          setMobiData(mobiData);
        });
      } catch (error) {
        console.error("Error fetching mobile number:", error);
      }
    };

    fetchAccountData();
  }, []);
  const [filteredMobiData, setFilteredMobiData] = useState([]);
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("https://api.malabarbank.in/api/membership");
        const text = await response.text();
        const mobiData = JSON.parse(text);
        // console.log("ani",mobiData);
        setMobiData(mobiData);
        mobiData.forEach((item) => {
          // console.log("Customer Mobile:", item.customerMobile);
        });
        // Filter mobiData based on the query and update filteredMobiData
        const filteredResults = mobiData.filter((mob) =>
          mob.customerMobile.includes(query)
        );
        setFilteredMobiData(filteredResults);
        console.log("thanu", filteredResults);
      } catch (error) {
        console.error("Error fetching mobile number:", error);
      }
    };

    fetchAccountData();
  }, [query]); // Depend on the query state

  const [input, setInput] = useState();

  useEffect(() => {
    const fetchSchemeNames = async () => {
      try {
        const response = await fetch(
          "https://api.malabarbank.in/gdcs/api/gdcsCreateFetch"
        );
        const text = await response.text(); // Read the response as text
        console.log("Raw response:", text); // Log the raw response
        const data = JSON.parse(text); // Attempt to parse the response as JSON
        setSchemeNames(data);

        data.forEach((scheme) => {
          console.log("Scheme Name:", scheme.schemeName);
        });
      } catch (error) {
        console.error("Error fetching scheme names:", error);
      }
    };

    fetchSchemeNames();
  }, []);

  //fd handle

  const [formData, setFormData] = useState({
    GroupName: "",
    companyComisionPercentage: "",
    auctionSlabPercent: "",
    companyComisionPercentage: "",
    priceMoney: "",
    schemeAmount: "",
    duration: "",
    numberofMember: "",
    schemeType: "",
    currentDate: "",
    GDCSNumber: "",
    emi: "",
    amount: "",
    interest: "",
    finalInterest: "",
    membershipId: "",
    customerName: "",
    customerNumber: "",
    interestCutAfter: "",
    interestCutBefore: "",

    referenceName: "",
    date: "",
    totalAmount: "",
    // fdBill: "",
    accountStatus: "",
    branchCode: "",
  });

  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  useEffect(() => {
    // const branchCode = user?.branchDetails?.branchCode;
    if (query) {
      console.log("qury:", query);
      const fetchPhoneNumbers = async () => {
        try {
          const response = await axios.get(
            `https://api.malabarbank.in/api/fetchMemberDetails?phoneNumber=${query}`
          );
          // setPhoneNumbers(response.data);
          const options = response.data.map((number) => ({
            value: number.customerMobile,
            label: number.customerMobile,
          }));
          console.log(options,"pari")
          setPhoneNumbers(options);
          console.log(response.data);
          console.log("tam", query);
          console.log("shiii", phoneNumbers);
        } catch (error) {
          console.error("Error fetching phone numbers:", error);
        }
      };
      fetchPhoneNumbers();
    } else {
      setPhoneNumbers([]);
    }
  }, [query]);

  const handlePhoneNumberSelection = (option) => {
    console.log("option",option);
    if (option === null) {
      // Handle the case where the selection is cleared
      setSelectedPhoneNumber(null);
      setQuery(""); // Reset the query if necessary
      setPhoneNumbers([{ value: "", label: "" }]); // Clear the options if needed

      
      // Reset the formData to remove any data associated with the previously selected phone number
    setFormData({});
    } else {
      // Existing logic for when an option is selected
      setSelectedPhoneNumber(option.value);
      console.log("selected phno xxxx",selectedPhoneNumber);
      fetchMemberDetails(option.value);
      setFormData((prevFormData) => ({
      ...prevFormData,
        customerNumber: option.value,
      }));
      setQuery(option.value);
      setPhoneNumbers([]); // Optionally clear the options after selection
    }
  };
  // fetch mobile number to find member details
  const fetchMemberDetails = async (selectedPhoneNumber) => {
    try {
      const response = await axios.get(
        `https://api.malabarbank.in/fetchMemberDetails?phoneNumber=${selectedPhoneNumber}`
      );

      const {
        membershipId,
        customerName,
        customerMobile,
        phoneNumber,
        branchName,
        finalInterest,
        schemeType,
        totalAmount,
        address,
        duration,
        interest,
        interestCutAfter,
        interestCutBefore,
        FDNumber,
        amount,
        date,
        referenceName,
      } = response.data;

      setFormData({
        schemeType,
        duration,
        amount,
        interest,
        finalInterest,
        membershipId,
        FDNumber,
        customerName,
        customerNumber: customerMobile,
        phoneNumber,
        address,
        branchName,
        referenceName,
        date,
        totalAmount,
        interestCutAfter,
        interestCutBefore,
        //  fdBill,
        //  branchCode,
        accountStatus: "Active",
      });
      console.log("FormData", formData);
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  // Function to generate initial GDCS number

  const [schemeTypeCounts, setSchemeTypeCounts] = useState({});


  const updateGDCSNumber = (branchCode) => {
    let schemeType = formData.schemeType || "GDCS"; // Default to "FD" if schemeType is not set

    if (!schemeTypeCounts[schemeType]) {
      setSchemeTypeCounts((prevCounts) => ({
        ...prevCounts,
        [schemeType]: 1,
      }));
    } else {
      setSchemeTypeCounts((prevCounts) => ({
        ...prevCounts,
        [schemeType]: prevCounts[schemeType] + 1,
      }));
    }

    const newNumber = schemeTypeCounts[schemeType] || 1;
    const newGDCSCode = `GDCS${branchCode}${newNumber
      .toString()
      .padStart(5, "0")}`;
    console.log(newGDCSCode);
    setFormData((prevFormData) => ({
      ...prevFormData,
      GDCSNumber: newGDCSCode, // Update the GDCSNumber field in your form data
      schemeType: formData.schemeType, // Ensure schemeType is updated if necessary
    }));
    console.log("Updated GDCSCode:", newGDCSCode);
  };

  useEffect(() => {
    const branchCode = user?.branchDetails?.branchCode;
    if (formData.schemeType && branchCode) {
      updateGDCSNumber(branchCode);
    }
  }, [formData.schemeType, branchCode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      date: currentDate,
    });
  };

  // Reference name
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("https://api.malabarbank.in/api/employee");
      const data = await response.json();
      console.log("data endi",data);
      // Assuming user is available with branchDetails containing branchCode
      const branchCode = user?.branchDetails?.branchCode;
      if (data && branchCode) {
        // Filter employees based on the branchCode
        const filteredEmployees = data.filter(
          (employee) => employee.branchCode === branchCode
        );
        console.log("endide filtered  data",filteredEmployees);
        setEmployees(filteredEmployees);
        console.log("employees daata",employees)
      } else {
        // If branchCode is not available, set all employees
        setEmployees(data);
      }
      // console.log(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  //generate transaction id
  const generateTransactionId = () => {
    let transactionId = "";
    for (let i = 0; i < 16; i++) {
      transactionId += Math.floor(Math.random() * 10);
    }
    return transactionId;
  };
  const [cashTransactionId, setcashTransactionId] = useState(
    generateTransactionId()
  );

  //posting group data
  const handleGroupSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    await postData(); // Call your postData function
  };

  const postData = async () => {
    try {
      const branchCode = user?.branchDetails?.branchCode;
      const response = await fetch("https://api.malabarbank.in/api/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GroupName: formData.GroupName,
          companyComisionPercentage:
            selectedSchemeDetails.companyComisionPercentage,
          auctionSlabPercent: selectedSchemeDetails.auctionSlabPercent,
          priceMoney: selectedSchemeDetails.priceMoney,
          schemeAmount: selectedSchemeDetails.schemeAmount,
          duration: selectedSchemeDetails.duration,
          numberofMember: selectedSchemeDetails.numberofMember,
          schemeType: selectedSchemeName,
          // GDCSNumber: formData.GDCSNumber,
          emi: selectedSchemeDetails.emi,
          currentDate: currentDate,
          branchCode:branchCode,
        }),
      });
      if (response.ok) {
        // Show alert after successful response
        // alert("Group added successfully");
        // Close the modal
        handleCloseModal();
        const data = await response.json();
        alert(data.message)

        console.log(data);
      } else {
        throw new Error("Network response was not ok");
      }


    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      alert(error)
    }
  };

  //  const handleChangeForm = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //    ...formData,
  //     [name]: value,
  //   });
  // };

  ///group fetching

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [numberOfMembers, setNumberOfMembers] = useState("");


  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const branchCode = user?.branchDetails?.branchCode;
        const response = await fetch(`https://api.malabarbank.in/api/branchGroups?branchCode=${branchCode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();

        setGroups(data.data);
        console.log("yem", data)
        console.log("eldorado", groups)
        // setGroups(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchAllGroups();
  }, []);

  const handleGroupChange = (event) => {
    const selectedId = event.target.value;
    console.log("bang", selectedId)

    setSelectedGroupId(selectedId);

    // Find the selected group in the groups array
    const selectedGroup = groups.find((group) => group._id === selectedId);
    console.log("her", selectedGroup.numberofMember)
    if (selectedGroup) {
      // Update the numberOfMembers state with the selected group's numberOfMembers
      setNumberOfMembers(selectedGroup.numberofMember);
    }
  };






  const [gdcsBillNumber, setGdcsBillNumber] = useState("");
  const [generatedGdcsBills, setGeneratedGdcsBills] = useState(new Set());


  function generateUniqueGdcsBillNumber() {
    let gdcsBill;
    do {
      const gdcsBillNumber = Math.floor(Math.random() * Math.pow(10, 13));
      gdcsBill = "GDCS" + gdcsBillNumber.toString().padStart(14, "0");
    } while (generatedGdcsBills.has(gdcsBill));

    setGeneratedGdcsBills((prevBills) => {
      const newBills = new Set(prevBills);
      newBills.add(gdcsBill);
      return newBills;
    });

    setGdcsBillNumber(gdcsBill);

    return gdcsBill;
  }

  // Call the function to generate a unique GDCS bill number when the component mounts

  useState(() => {
    generateUniqueGdcsBillNumber();
  }, []);




  //num to words
  const [number, setNumber] = useState('');
  const [words, setWords] = useState('');

  const convertToWords = (number) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    let result = '';

    if (number === 0) {
      return 'zero';
    }

    if (number < 0) {
      result += 'negative ';
      number = Math.abs(number);
    }

    if (number >= 1000000) {
      result += convertToWords(Math.floor(number / 1000000)) + ' million ';
      number %= 1000000;
    }

    if (number >= 1000) {
      result += convertToWords(Math.floor(number / 1000)) + ' thousand ';
      number %= 1000;
    }

    if (number >= 100) {
      result += convertToWords(Math.floor(number / 100)) + ' hundred ';
      number %= 100;
    }

    if (number >= 20) {
      result += tens[Math.floor(number / 10)] + ' ';
      number %= 10;
    }

    if (number >= 10) {
      result += teens[number - 10];
      number = 0;
    }

    if (number > 0) {
      result += ones[number];
    }

    return result.trim();
  };

  const handleWordsChange = (event) => {
    const inputNumber = parseInt(event.target.value, 10);
    setNumber(inputNumber);
    setWords(convertToWords(inputNumber));
  };




  // member posting

  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [date, setDate] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [amountInWords, setAmountInWords] = useState('');
  // const[numberofMembers,setNumberOfMembers]=useState('')
  // const [beneficiaryName, setBeneficiaryName] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [groupId, setGroupId] = useState('');
  // const [transactionId, setTransactionId] = useState('');
  // const [accountNumber, setAccountNumber] = useState('');
  // const [ifsc, setIfsc] = useState('');
  // const [bankName, setBankName] = useState('');
  // Define states for other fields...


  const handleSubmit = async () => {
    const memberData = {
      phoneNumber,
      membershipId,
      groupName,
      customerName,
      numberOfMembers,
      referenceName,
      date,
      transactionId,
      billNumber,
      amount,
      amountInWords,
      beneficiaryName,
      paymentMode,
      accountNumber,
      ifsc,
      bankName,
    };

    try {
      const response = await fetch(`https://api.malabarbank.in/api/group/${groupId}/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: [memberData] }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      alert('Member added successfully');
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };  


  // Define a state to store the selected reference name
  const [selectedReferenceName, setSelectedReferenceName] = useState("");

  // Define the handleChange function to update the selectedReferenceName state
  const handleReferenceNameChange = (event) => {
    setSelectedReferenceName(event.target.value);
  };


  // Define a counter variable

  const handleMemberandPayment = async (event) => {
    event.preventDefault();
    const paymentData = {
      GDCSNumber: gdcsNumber,
      transactionId: cashTransactionId,
      amount: number,
      amountInWords: words,
      beneficiaryName,
      bankName,
      accountNumber,
      ifsc,
      paymentMode: selectedPaymentMethod,
      billNumber: gdcsBillNumber,
      customerName: formData.customerName,
      phoneNumber:formData.customerNumber,
      groupId: selectedGroupId,
      numberOfMembers: numberOfMembers,
      membershipId: formData.membershipId,
      referenceName: selectedReferenceName,
      date: currentDate,
    };

    // Extract the groupId and phoneNumber from the paymentData
    const { groupId, phoneNumber } = paymentData;
    console.log(phoneNumber,"ph xxxxxno");

    // Define the API endpoint URL for payment data
    const paymentApiEndpoint = `https://api.malabarbank.in/api/group/${groupId}/member`;

    // Prepare the request body with the member data wrapped in an array
    const requestBody = {
      members: [paymentData],
    };

    // Make the POST request for payment data
    try {
      const response = await fetch(paymentApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert(data.message);
        handleClosePaymentModal();
        handleCloseModal();

        // Extract amount and date from paymentData
        const { amount, date,phoneNumber } = paymentData;
        // Convert amount to payableAmount and use date as is
        const payableAmount = amount; // Assuming amount is already in the correct format
        
        // Define the API endpoint URL for EMI data
        const emiApiEndpoint = `https://api.malabarbank.in/api/group/${groupId}/member/${phoneNumber}/emi`;

        // Prepare the request body for EMI data
        const emiRequestBody = {
          date,
          emiAmount: 0, // Assuming emiAmount is not needed here
          dividend: 0, // Assuming dividend is not needed here
          payableAmount,
        };

        // Make the POST request for EMI data
        try {
          const emiResponse = await fetch(emiApiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emiRequestBody),
          });

          if (emiResponse.ok) {
            const emiData = await emiResponse.json();
            console.log('EMI Success:', emiData);
            alert(emiData.message);
          } else {
            const emiErrorData = await emiResponse.json();
            console.log('EMI Error:', emiErrorData.error);
            alert('EMI Error occurred: ' + emiErrorData.error);
          }
        } catch (emiError) {
          console.log('EMI Error:', emiError.message);
          alert('EMI Error occurred: ' + emiError.message);
        }

      } else {
        const errorData = await response.json();
        console.log('Error:', errorData.error);
        alert('Error occurred: ' + errorData.error);
      }
    } catch (error) {
      console.log('Error:', error.message);
      alert('Error occurred: ' + error.message);
    }
  };







  let serialNumber = 1;


  return (
    <div>
      <nav className="navbar navbar-light ">
        <div className="container-fluid">
          <Link
            className="navbar-brand ms-5 d-flex align-items-center"
            to="/main"
          >
            <img
              src={logo}
              alt="logo"
              width="100px"
              className="d-inline-block align-text-top"
            />
            <strong className="fs-2 ">MALABAR CO-OPERATIVE SOCIETY</strong>
          </Link>
          <div className="d-flex" style={{ width: "500px" }}>
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
                <li className="me-2">Branch</li>
                <li className="me-2">Branch Code</li>
                <li>Date</li>
              </ul>
              <ul className="list-unstyled mb-1 me-5">
                <li className="me-2">
                  : {user ? user.employee.fullname : "N/A"}
                </li>
                <li className="me-2">
                  : {user ? user.branchDetails.branch_name : "N/A"}
                </li>
                <li className="me-2">
                  : {user ? user.branchDetails.branchCode : "N/A"}
                </li>
                <li className="me-2">: {currentDate}</li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className="container border rounded p-4 mt-4 mb-4">
        <div>
          <center>
            <h2>GROUP DEPOSIT & CREDIT SCHEME</h2>
          </center>
        </div>

        <div>
          <center>
            <div>
              <input
                type="radio"
                id="group"
                name="tableOption"
                value="group"
                checked={selectedOption === "group"}
                onChange={handleRadioChange}
              />
              <label htmlFor="group"> Add New Group</label>

              <input
                type="radio"
                className="ms-3"
                id="scheme"
                name="tableOption"
                value="scheme"
                checked={selectedOption === "scheme"}
                onChange={handleRadioChange}
              />
              <label htmlFor="scheme">Add Group Member</label>
            </div>
          </center>
        </div>

        {selectedOption === "group" && (



          <div>
            <div className="App">
              <div className="circle-buttons-container">
                <div className="circle-button" onClick={handlePlusIconScheme}>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="circle-button">
                  <FontAwesomeIcon icon={faPrint} />
                </div>
                <div className="circle-button">
                  <FontAwesomeIcon icon={faCalendarPlus} onClick={handleEmiClick} />

                </div>
                <div className="circle-button">
                  <FontAwesomeIcon icon={faCalendarDays} />

                </div>
                <div className="circle-button">
                  <FontAwesomeIcon icon={faA} />
                </div>
              </div>
            </div>
            <center>
              <div className="table-container">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>SL NO</th>
                      <th>GROUP NAME</th>
                      <th>DURATION</th>
                      <th>TOTAL AMOUNT</th>
                      <th>INSTALMENT AMOUNT</th>
                      {/* <th>COUNT</th> */}
                      {/* <th>STATUS</th> */}
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
                        {/* <td>{group.numberOfMembers}</td> */}
                        {/* <td></td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>



            </center>
          </div>
        )}

        {selectedOption === "scheme" && (
          <div>
            <div className="App">
              <div className="circle-buttons-container">
                {/* <div className="circle-button" onClick={handlePlusIconGroup} ><FontAwesomeIcon icon={faPlus} /></div> */}
                <div className="circle-button" onClick={handlePlusIconClick}>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className="circle-button">
                  <FontAwesomeIcon icon={faPrint} />
                </div>
              </div>
            </div>
            <center>



              <div className="table-container">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>SL NO</th>
                      <th>CUSTOMER NAME</th>
                      <th>CONTACT NUMBER</th>
                      <th>MEMBERSHIP ID</th>
                      <th>GROUP NAME</th>
                      <th>SCHEME AMOUNT</th>
                      <th>DURATION</th>
                      <th>COUNT</th>
                      {/* <th>STATUS</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <React.Fragment key={group._id}>
                        {group.members.map((member) => (
                          <tr key={member._id}>
                            <td>{serialNumber++}</td>
                            <td>{member.customerName}</td>
                            <td>{member.phoneNumber}</td>
                            <td>{member.membershipId}</td>
                            <td>{group.GroupName}</td>
                            <td>{group.priceMoney}</td>
                            <td>{group.duration}</td>
                            <td>{group.numberofMember}</td>
                            {/* <td></td> */}

                            {/* Add more td for other member details */}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
            </center>
          </div>
        )}
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
                  <h4>GDCS NEW GROUP MEMBER CREATION</h4>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-6">
                        {/* All Groups */}
                        <div className="form-group">
                          <label htmlFor="allGroups">All Groups</label>
                          <select className="form-control"
                            id="allGroups"
                            onChange={handleGroupChange}
                            value={selectedGroupId}
                            required
                          >
                            <option value="">Select Group</option>
                            {groups.map((group) => (
                              <option key={group._id} value={group._id}>
                                {group.GroupName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Number of Members */}
                        <div className="form-group">
                          <label htmlFor="numberOfMembers">Number of Members</label>
                          <input
                            type="text"
                            className="form-control"
                            id="numberOfMembers"
                            name="numberOfMembers"
                            placeholder=""
                            value={numberOfMembers}
                            readOnly
                            required
                          />
                        </div>
                        {/* GDCS Number */}
                        <div className="form-group">
                          <label htmlFor="gdcsNumber">GDCS Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="gdcsNumber"
                            name="gdcsNumber"
                            value={gdcsNumber}
                            onChange={handleGdcsNumberChange}
                            placeholder="Enter GDCS Number"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="CurrentDate">Current Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={currentDate}
                            onChange={handleDateChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        {/* Account Holder Name */}
                        <div className="form-group">
                          <label htmlFor="customerName">Account Holder Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            name="customerName"
                            placeholder="Enter Account Holder Name"
                            value={formData.customerName || ""}
                            required
                            readOnly
                          />
                        </div>
                        {/* Customer Phone Number */}
                        <div className="form-group">
                          <div className="dropdown-wrapper">
                            <label htmlFor="customerName">
                              Customer Phone Number
                            </label>
                            <Select
 value={selectedPhoneNumber?{ value: selectedPhoneNumber, label: selectedPhoneNumber } : null} 
     onChange={handlePhoneNumberSelection}
    onInputChange={(inputValue) => setQuery(inputValue)}
    options={phoneNumbers}
    placeholder="Enter phone number"
    isClearable={true}
    required
  />
                          </div>
                        </div>
                        {/* Membership ID */}
                        <div className="form-group">
                          <label htmlFor="membershipId">Membership ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="membershipId"
                            name="membershipId"
                            placeholder="Enter Membership ID"
                            required
                            readOnly
                            value={formData.membershipId || ""}
                          />
                        </div>
                        {/* Reference Name */}
                        <div className="form-group">
                          <label htmlFor="referenceName">Reference Name</label>
                          <select
                            className="form-control"
                            value={selectedReferenceName}
                            onChange={handleReferenceNameChange}
                            name="referenceName"

                          >
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                              <option
                                key={employee.id}
                                value={employee.employeeName}
                              >
                                {employee.employeeName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>
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
                  </form>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>






      </div>
      {/* New payment modal section */}
      <Modal
        show={showPaymentModal}
        onHide={handleClosePaymentModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1000px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>PAYMENT GATEWAY</h4>
              </div>
              <div className="card-body ">
                <form onSubmit="" className=" mt-3">
                  <div className="Cash form">
                    <div class="row justify-content-center">
                      <div class="col-lg-12 col-12">
                        <div class="card card0">
                          <div class="d-flex" id="wrapper">
                            {/* <!-- Sidebar --> */}
                            <div
                              class="bg-light border-right"
                              id="sidebar-wrapper"
                            >
                              <div class="sidebar-heading pt-5 pb-4">
                                <strong>PAY WITH</strong>
                              </div>
                              <div class="list-group list-group-flush ms-4">
                                <a
                                  data-toggle="tab"
                                  href="#menu1"
                                  id="tab1"
                                  name="Cash"
                                  className="list-group-item text-decoration-none"
                                  // className={tabs list-group-item ${selectedPaymentMethod === "Cash" ? "active1" : ""}}
                                  onClick={() =>
                                    setSelectedPaymentMethod("Cash")
                                  }
                                >
                                  <div className="list-div my-2">
                                    <div
                                     className="fa-solid fa-money-bill-1"
                                     ></div>{" "}
                                    &nbsp;&nbsp; CASH
                                  </div>
                                </a>
                                <a
                                  data-toggle="tab"
                                  href="#menu2"
                                  id="tab2"
                                  name="UPI"
                                  // className={tabs list-group-item ${selectedPaymentMethod === "UPI" ? "active1" : ""}}
                                  className="list-group-item text-decoration-none"
                                  onClick={() =>
                                    setSelectedPaymentMethod("UPI")
                                  }
                                >
                                  <div className="list-div my-2">
                                    <div className="fa fa-credit-card"></div>{" "}
                                    &nbsp;&nbsp; UPI
                                  </div>
                                </a>
                                <a
                                  data-toggle="tab"
                                  href="#menu3"
                                  id="tab3"
                                  name="Bank"
                                  className="list-group-item text-decoration-none"
                                  // className={tabs list-group-item ${selectedPaymentMethod === "Bank" ? "active1" : ""}}
                                  onClick={() =>
                                    setSelectedPaymentMethod("Bank")
                                  }
                                >
                                  <div className="list-div my-2">
                                    <div className="fa-solid fa-building-columns"></div>{" "}
                                    &nbsp;&nbsp; BANK
                                  </div>
                                </a>
                              </div>
                            </div>
                            <div id="page-content-wrapper">
                              <div class="tab-content">
                                <div id="menu1" class="tab-pane in active">
                                  <div class="row justify-content-center">
                                    <div class="col-12">
                                      <div class="form-card">
                                        <h3 class="mt-5 mb-4 text-center">
                                          Enter Cash details
                                        </h3>
                                        <form onsubmit="event.preventDefault()">
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cashTransactionId"
                                                  name="cashTransactionId"
                                                  placeholder=""
                                                  minLength="16"
                                                  maxLength="16"
                                                  value={cashTransactionId}
                                                  onChange={(e) =>
                                                    setcashTransactionId(
                                                      e.target.value
                                                    )
                                                  }
                                                  readOnly
                                                />
                                                <label>TRANSACTION ID</label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  id="bk_nm"
                                                  placeholder=""
                                                  type="number"
                                                  value={number}
                                                  onChange={handleWordsChange}
                                                />
                                                {" "}
                                                <label>AMOUNT </label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  placeholder=""
                                                  minlength="19"
                                                  maxlength="19"
                                                  value={words}
                                                />{" "}
                                                <label>AMOUNT IN WORDS</label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  minlength="19"
                                                  maxlength="19"
                                                  value={gdcsBillNumber}
                                                  readOnly
                                                />{" "}
                                                <label>RECEIPT NUMBER</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div id="menu2" class="tab-pane">
                                  <div class="row justify-content-center">
                                    <div class="col-12">
                                      <div class="form-card">
                                        <h3 class="mt-5 mb-4 text-center">
                                          Enter UPI details
                                        </h3>
                                        <form onsubmit="event.preventDefault()">
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  placeholder=""
                                                  minLength="16"
                                                  maxLength="16"
                                                  value={cashTransactionId}
                                                  onChange={(e) =>
                                                    setcashTransactionId(
                                                      e.target.value
                                                    )
                                                  }
                                                  readOnly
                                                />{" "}
                                                <label>TRANSACTION ID</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-6">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="number"
                                                  value={number}
                                                  onChange={handleWordsChange}
                                                  name="exp"
                                                  id="exp"
                                                  placeholder=""
                                                  minlength="5"
                                                  maxlength="5"

                                                />{" "}
                                                <label>AMOUNT</label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-6">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  name="beneficiaryName"
                                                  placeholder="beneficiaryName"
                                                  value={beneficiaryName}
                                                  onChange={(e) =>
                                                    setBeneficiaryName(
                                                      e.target.value
                                                    )
                                                  }
                                                />{" "}
                                                <label>BENEFICIARY NAME</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  placeholder=""
                                                  minlength="19"
                                                  maxlength="19"
                                                  readOnly
                                                  value={words}
                                                />{" "}
                                                <label>AMOUNT IN WORDS</label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  minlength="19"
                                                  maxlength="19"
                                                  value={gdcsBillNumber}
                                                  readOnly
                                                />{" "}
                                                <label>RECEIPT NUMBER</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div id="menu3" class="tab-pane">
                                  <div class="row justify-content-center">
                                    <div class="col-12">
                                      <div class="form-card">
                                        <h3 class="mt-5 mb-4 text-center">
                                          Enter Bank Details
                                        </h3>
                                        <form onsubmit="event.preventDefault()">
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cashTransactionId"
                                                  name="cashTransactionId"
                                                  placeholder=""
                                                  minLength="16"
                                                  maxLength="16"
                                                  value={cashTransactionId}
                                                  onChange={(e) =>
                                                    setcashTransactionId(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <label>TRANSACTION ID</label>
                                              </div>
                                            </div>
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="bankName"
                                                  name="bankName"
                                                  placeholder=""
                                                  value={bankName}
                                                  onChange={(e) =>
                                                    setBankName(e.target.value)
                                                  }
                                                />{" "}
                                                <label>BANK NAME</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-6">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="accountNumber"
                                                  name="accountNumber"
                                                  placeholder=""
                                                  value={accountNumber}
                                                  onChange={(e) =>
                                                    setAccountNumber(
                                                      e.target.value
                                                    )
                                                  }
                                                />{" "}
                                                <label>ACCOUNT NUMBER</label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-6">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="ifsc"
                                                  name="ifsc"
                                                  placeholder=""
                                                  value={ifsc}
                                                  onChange={(e) =>
                                                    setIfsc(e.target.value)
                                                  }
                                                />{" "}
                                                <label>IFSC</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-12">
                                              <div class="">
                                                <div class="input-group">
                                                  {" "}
                                                  <input
                                                    type="number"
                                                    value={number}
                                                    onChange={handleWordsChange}
                                                    name="exp"
                                                    id="exp"
                                                    placeholder=""
                                                    minlength="5"
                                                    maxlength="5"

                                                  />{" "}
                                                  <label>AMOUNT</label>{" "}
                                                </div>
                                              </div>
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  minlength="19"
                                                  maxlength="19"
                                                  readOnly
                                                  value={words}
                                                />{" "}
                                                <label>AMOUNT IN WORDS</label>{" "}
                                              </div>
                                            </div>
                                            <div class="col-12">
                                              <div class="input-group">
                                                {" "}
                                                <input
                                                  type="text"
                                                  id="cr_no"
                                                  minlength="19"
                                                  maxlength="19"
                                                  value={gdcsBillNumber}
                                                  readOnly
                                                />{" "}
                                                <label>RECEIPT NUMBER</label>{" "}
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <center>
                    <div className="form-group mt-5 ">
                      <button type="submit" className="btn btn-primary" onClick={handleMemberandPayment}>
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
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>

      </Modal>

      {/* Scheme Modal */}
      <Modal
        id="scheme-modal"
        show={showScheme}
        onHide={handleCloseModal}
        dialogClassName="custom-modal-width"
      >
        <Modal.Body className="p-0">
          <div className="Member form" style={{ maxWidth: "1800px" }}>
            <div className="card mt-0">
              <div className="card-header text-light">
                <h4>NEW GROUP</h4>
              </div>
              <div className="card-body ">
                <form onSubmit={handleGroupSubmit} className="ms-5 mt-3">
                  <div className="form-group d-flex flex-row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="schemeType">Scheme Name</label>
                        <select
                          className="form-control"
                          id="schemeType"
                          name="schemeType"
                          required
                          onChange={(e) => {
                            handleSchemeChange(e.target.value);
                          }}
                          value={selectedSchemeName}
                        >
                          <option value="">--Select--</option>
                          {schemeNames.map((scheme, index) => (
                            <option key={index} value={scheme.schemeName}>
                              {scheme.schemeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <label htmlFor="GroupName">Group Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="GroupName"
                        name="GroupName"
                        value={schemeData.GroupName}
                        onChange={handleChangeScheme}
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  {/* Start of the 5x5 grid */}
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="CurrentDate">Current Date:</label>
                        <input type="date" className="form-control" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="randomField4">Number of Members</label>
                        <input
                          type="text"
                          className="form-control"
                          id="randomField4"
                          name="randomField4"
                          placeholder="Enter value"
                          value={selectedSchemeDetails.numberofMember || ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="PriceMoney">Price Money</label>
                        <input
                          type="text"
                          className="form-control"
                          id="PriceMoney"
                          name="PriceMoney"
                          placeholder="Price Money"
                          value={selectedSchemeDetails.priceMoney || ""}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="SchemeAmount">Scheme Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          id="SchemeAmount"
                          name="SchemeAmount"
                          placeholder=" Scheme Amount"
                          value={selectedSchemeDetails.schemeAmount || ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="duration">Duration in Month</label>
                        <input
                          type="number"
                          className="form-control"
                          id="duration"
                          name="duration"
                          placeholder="Enter Duration in Month"
                          required
                          value={selectedSchemeDetails.duration || ""}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="CompanyCommision">Company Commision</label>
                        <input
                          type="number"
                          className="form-control"
                          id="CompanyCommision"
                          name="CompanyCommision"
                          placeholder="CompanyCommision value"
                          value={
                            selectedSchemeDetails.companyComisionPercentage || ""
                          }
                          onChange={(e) =>
                            FormData({
                              ...formData,
                              companyComisionPercentage: e.target.value,
                            })
                          }
                          readOnly

                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="auctionSlabPercent">Auction Slab Percent</label>
                        <input
                          type="number"
                          className="form-control"
                          id="auctionSlabPercent"
                          name="auctionSlabPercent"
                          placeholder="AuctionSlabPercent"
                          value={selectedSchemeDetails.auctionSlabPercent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              auctionSlabPercent: e.target.value,
                            })
                          }
                          required
                          readOnly

                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="emi">EMI</label>
                        <input
                          type="text"
                          className="form-control"
                          id="emi"
                          name="emi"
                          placeholder="Enter emi"
                          value={selectedSchemeDetails.emi || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, emi: e.target.value })
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  {/* End of the 5x5 grid */}

                  <center>
                    <div className="form-group mt-5 me-5">
                      <button type="submit" className="btn btn-primary">
                        Create
                      </button>
                      {/* <button type="reset" className="btn btn-secondary m-2"  onClick={resetForm}>
                 Reset
                </button> */}
                      <Button variant="danger" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>


      {/* //group memberdetails modal */}

      <GroupMemberDetailsModal
        show={showMemberGroupModal}
        onHide={() => setShowMemberGroupModal(false)}
        groupId={selectedGroupId}
      />

      {/* //group emi payment modal */}
      <GdcsEmiModal
        show={showEmiModal}
        onHide={() => setShowEmiModal(false)}
      //  onNextClick={handleEmiPayNextClick}
      />
    </div>
  );
};
export default Gdcs;
