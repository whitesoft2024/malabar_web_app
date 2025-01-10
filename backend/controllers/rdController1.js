const RdData = require('../models/rdProducts');
const CounterModel =  require("../models/counterSchema");
const moment = require('moment');


const incrementRDFiveDigits = (RDNumber) => {
  return RDNumber.replace(/\d{5}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(5, '0');
  });
};

// const createRD = async (req, res) => {
//     try {
//         const counter = await CounterModel.findOneAndUpdate(
//             { _id: "rdval" },
//             { '$inc': { 'seq': 1 }},
//             { new: true, upsert: true }
//         );

//         const accountType = req.body.accountType;
//         const branchCode = req.body.branchcode
//         const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);

//         let newRDNumber;
//         if (lastRDNumber) {
//             newRDNumber = incrementRDFiveDigits(lastRDNumber.RDNumber);
//         } else {
//             newRDNumber = `${accountType}${branchCode}00001`;
//         }

//         const newRDdata = new RdData({
//             ...req.body,
//             RDNumber: newRDNumber,
//             sl_no: counter.seq
//         });

//         await newRDdata.save();
//         res.status(200).json({ message: 'RDS details uploaded successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



//emi adding

// const createRD = async (req, res) => {
//   try {
//       const counter = await CounterModel.findOneAndUpdate(
//           { _id: "rdval" },
//           { '$inc': { 'seq': 1 }},
//           { new: true, upsert: true }
//       );

//       const accountType = req.body.accountType;
//       const branchCode = req.body.branchcode;
//       const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);

//       let newRDNumber;
//       if (lastRDNumber) {
//           newRDNumber = incrementRDFiveDigits(lastRDNumber.RDNumber);
//       } else {
//           newRDNumber = `${accountType}${branchCode}00001`;
//       }

//       const newRDdata = new RdData({
//          ...req.body,
//           RDNumber: newRDNumber,
//           sl_no: counter.seq
//       });

//       await newRDdata.save();

//       // Include the newly created data in the response
//       res.status(200).json({
//           message: 'RD details uploaded successfully',
//           data: newRDdata // Add the newly created data to the response
//       });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

// const createRD = async (req, res) => {
//   try {
//       const counter = await CounterModel.findOneAndUpdate(
//           { _id: "rdval" },
//           { '$inc': { 'seq': 1 }},
//           { new: true, upsert: true }
//       );

//       const accountType = req.body.accountType;
//       const branchCode = req.body.branchcode;
//       const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);

//       // let newRDNumber;
//       // if (lastRDNumber) {
//       //     newRDNumber = incrementRDFiveDigits(lastRDNumber.RDNumber);
//       // } else {
//       //     newRDNumber = `${accountType}${branchCode}00001`;
//       // }

//       const newRDdata = new RdData({
//         ...req.body,
//           // RDNumber: newRDNumber,
//           sl_no: counter.seq
//       });

//       await newRDdata.save();

//       // Include the newly created data and a status field in the response
//       res.status(200).json({
//           status: 200, // Explicitly setting the status code
//           message: 'RD details uploaded successfully',
//           data: newRDdata // Add the newly created data to the response
//       });
//   } catch (error) {
//       // Log the error for debugging purposes
//       console.error(error);
//       // Send back the error message with a status code of 500
//       res.status(500).json({
//           status: 500, // Explicitly setting the status code
//           error: error.message // Include the error message in the response
//       });
//   }
// };

const createRD = async (req, res) => {
  try {
    // Extract RDNumber from the request body
    const { RDNumber } = req.body;

    // Check if RDNumber already exists in the RD collection
    const existingRD = await RdData.findOne({ RDNumber });

    if (existingRD) {
      // If RDNumber exists, return an error response
      return res.status(400).json({
        status: 400, // Bad Request
        message: 'RDNumber already exists',
        error: 'A recurring deposit with this number already exists.'
      });
    }

    const counter = await CounterModel.findOneAndUpdate(
        { _id: "rdval" },
        { '$inc': { 'seq': 1 }},
        { new: true, upsert: true }
    );

    const accountType = req.body.accountType;
    const branchCode = req.body.branchcode;
    const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);


    // Generate the current time in HH:mm format
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRDdata = new RdData({
     ...req.body,
      sl_no: counter.seq,
      time: currentTime // Automatically set the time field to the current time
    });

    await newRDdata.save();

    // Include the newly created data and a status field in the response
    res.status(200).json({
        status: 200, // Explicitly setting the status code
        message: 'RD details uploaded successfully',
        data: newRDdata // Add the newly created data to the response
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Send back the error message with a status code of 500
    res.status(500).json({
        status: 500, // Explicitly setting the status code
        error: error.message // Include the error message in the response
    });
  }
};

// const createRD = async (req, res) => {
//   try {
//     // Extract RDNumber and startDate from the request body
//     const { RDNumber, startDate } = req.body;

//     // Parse the startDate string to get the Date object
//     const dateObject = new Date(startDate);

//     // Format the date part of startDate to DD/MM/YYYY format
//     const formattedStartDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;

//     // Extract the time part from the startDate string
//     const extractedTime = dateObject.toTimeString().split(' ')[0]; // This gives us the time in HH:MM:SS format

//     // Check if RDNumber already exists in the RD collection
//     const existingRD = await RdData.findOne({ RDNumber });

//     if (existingRD) {
//       // If RDNumber exists, return an error response
//       return res.status(400).json({
//         status: 400, // Bad Request
//         message: 'RDNumber already exists',
//         error: 'A recurring deposit with this number already exists.'
//       });
//     }

//     const counter = await CounterModel.findOneAndUpdate(
//         { _id: "rdval" },
//         { '$inc': { 'seq': 1 }},
//         { new: true, upsert: true }
//     );

//     const accountType = req.body.accountType;
//     const branchCode = req.body.branchcode;
//     const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);

//     const newRDdata = new RdData({
//    ...req.body,
//       sl_no: counter.seq,
//       startDate: formattedStartDate, // Use the formatted start date
//       time: [extractedTime] // Use the extracted time as a single element array
//     });

//     await newRDdata.save();

//     // Include the newly created data and a status field in the response
//     res.status(200).json({
//         status: 200, // Explicitly setting the status code
//         message: 'RD details uploaded successfully',
//         data: newRDdata // Add the newly created data to the response
//     });
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error(error);
//     // Send back the error message with a status code of 500
//     res.status(500).json({
//         status: 500, // Explicitly setting the status code
//         error: error.message // Include the error message in the response
//     });
//   }
// };

// const createRD = async (req, res) => {
//   try {
//     // Extract RDNumber, startDate, and time from the request body
//     const { RDNumber, startDate, time } = req.body;

//     // Parse the startDate string to get the Date object
//     const dateObject = new Date(startDate);

//     // Use Moment.js to format the date part of startDate to DD/MM/YYYY format
//     const formattedStartDate = moment(dateObject).format('DD/MM/YYYY');

//     // Extract the time part from the startDate string
//     const extractedTime = dateObject.toTimeString().split(' ')[0]; // This gives us the time in HH:MM:SS format

//     // Check if RDNumber already exists in the RD collection
//     const existingRD = await RdData.findOne({ RDNumber });

//     if (existingRD) {
//       // If RDNumber exists, return an error response
//       return res.status(400).json({
//         status: 400, // Bad Request
//         message: 'RDNumber already exists',
//         error: 'A recurring deposit with this number already exists.'
//       });
//     }

//     const counter = await CounterModel.findOneAndUpdate(
//         { _id: "rdval" },
//         { '$inc': { 'seq': 1 }},
//         { new: true, upsert: true }
//     );

//     const accountType = req.body.accountType;
//     const branchCode = req.body.branchcode;
//     const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);

//     // Create the newRDdata object, ensuring time is handled correctly
//     const newRDdata = new RdData({
//     ...req.body,
//       sl_no: counter.seq,
//       startDate: formattedStartDate, // Use the formatted start date
//       time: extractedTime // Directly assign the extracted time as a string
//     });

//     await newRDdata.save();

//     // Include the newly created data and a status field in the response
//     res.status(200).json({
//         status: 200, // Explicitly setting the status code
//         message: 'RD details uploaded successfully',
//         data: newRDdata // Add the newly created data to the response
//     });
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error(error);
//     // Send back the error message with a status code of 500
//     res.status(500).json({
//         status: 500, // Explicitly setting the status code
//         error: error.message // Include the error message in the response
//     });
//   }
// };










// const addEmitoRD = async (req, res) => {
//   const { id } = req.params;
//   const { emiData } = req.body;
  
//   console.log(emiData,"emiData");

//   try {
//     const doc = await RdData.findById(id);

//     if (!doc) {
//       throw new Error('Document not found');
//     }

//     // Initialize a variable to hold the temporary total amount
//     let tempTotalAmount = doc.InterestAmountTillDate;

//     // Iterate over each item in emiData to accumulate the total amount
//     emiData.forEach(item => {
//       tempTotalAmount += item.amount;
//     });

//     // Calculate the additional interest based on the temporary total amount and the interest rate
//     const additionalInterest = tempTotalAmount * (doc.interest / 100);

//     // Update the InterestAmountTillDate with the sum of the temporary total amount and the additional interest
//     doc.InterestAmountTillDate = tempTotalAmount + additionalInterest;


 
//   // Accumulate the total amount from emiData and add it to AmountTillDate
//   const emiTotal = emiData.reduce((total, item) => total + item.amount, 0);
//   console.log("emiTotal", emiTotal);
//   doc.AmountTillDate += emiTotal;


//  // Calculate InterestTillDate by subtracting AmountTillDate from InterestAmountTillDate
//  doc.InterestTillDate = doc.InterestAmountTillDate - doc.AmountTillDate;


//     // Count the current number of EMI entries in the document
//     const currentEmiCount = doc.emi.length;
    
//     // Prepare new EMI data with the current time and emiNumber set for each item
//     const newEmiItems = emiData.map(item => ({
//       ...item,
//        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//        emiNumber: currentEmiCount + 1 // Assuming you want to start counting from 1 for each new EMI
//      }));
 
//      // Append the new EMI data to the existing emi array
//      doc.emi.push(...newEmiItems);
//     await doc.save();

//     res.status(200).json(doc); // Send the result back to the client
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const addEmitoRD = async (req, res) => {
//   const { id } = req.params;
//   const { emiData } = req.body;

//   try {
//     const doc = await RdData.findById(id);

//     if (!doc) {
//       throw new Error('Document not found');
//     }

//     // Extract necessary properties from the document
//     const { interest, duration } = doc;
//     // Calculate the monthly interest rate by dividing the annual interest rate by the duration in months
//     const monthlyInterestRate = interest / (duration * 100);
//     console.log(monthlyInterestRate,"monthlyInterestRate")


//     // Initialize variables to hold the temporary total amount and interest
//     let tempTotalAmount = doc.AmountTillDate;
//     let tempInterestAmount = 0;

//     // Iterate over each item in emiData to accumulate the total amount and calculate interest
//     emiData.forEach((item) => {
//       // Add the current EMI amount to the running total
//       tempTotalAmount += item.amount;

//       // Calculate the interest for the current month using the monthly interest rate
//       tempInterestAmount += item.amount * monthlyInterestRate;

// console.log(tempInterestAmount,"tempInterestAmount")

//       // Update the InterestTillDate property
//       doc.InterestTillDate += tempInterestAmount;

//       // Prepare new EMI data with the current time and emiNumber set for each item
//       const newItem = {
//       ...item,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         emiNumber: doc.emi.length + 1 // Assuming emiNumber starts at 1
//       };

//       // Append the new EMI data to the existing emi array
//       doc.emi.push(newItem);
//     });

//     // Update the AmountTillDate property with the new total amount
//     doc.AmountTillDate = tempTotalAmount;

//     await doc.save();

//     res.status(200).json(doc); // Send the result back to the client
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const addEmitoRD = async (req, res) => {
  const { id } = req.params;
  const { emiData } = req.body;

  try {
    const doc = await RdData.findById(id);

    if (!doc) {
      throw new Error('Document not found');
    }

    // Extract necessary properties from the document
    const { interest, duration } = doc;
    const monthlyInterestRate = interest / (12 * 100);

    // Initialize variables to hold the temporary total amount and interest
    let tempTotalAmount = doc.AmountTillDate;
    let tempInterestAmount = 0;

    // Iterate over each item in emiData to accumulate the total amount and calculate interest
    emiData.forEach((item, index) => {
      // Add the current EMI amount to the running total
      tempTotalAmount += item.amount;

     // Update the monthlyCollection with the current EMI amount
     doc.monthlyCollection += item.amount;

       // Interest calculation
       if (index === 0 && doc.emi.length === 0) {
        // For the first EMI, calculate interest based on the EMI amount
        tempInterestAmount = item.amount * monthlyInterestRate;
      } else {
        // For subsequent EMIs, calculate interest based on AmountTillDate
        tempInterestAmount = tempTotalAmount * monthlyInterestRate;
      }
      

       // Update the InterestTillDate property
      doc.InterestTillDate += tempInterestAmount;

      console.log(doc.InterestTillDate,"doc.InterestTillDate");

      // // Update the AmountTillDate property with the new total amount
       doc.AmountTillDate = tempTotalAmount;

      // Check if it's the end of a quarter
      if (((doc.emi.length + 1) / 3) % 1 === 0) {
        console.log(emiData.length,"emiData.length")
        // Update AmountTillDate by adding InterestTillDate to it
         doc.AmountTillDate += doc.InterestTillDate 
        console.log(doc.AmountTillDate ,"doc.AmountTillDate ")
        console.log(doc.InterestTillDate,"doc.InterestTillDate");
        doc.InterestAmountTillDate=doc.AmountTillDate


         // Calculate the interest received by subtracting monthlyCollection from AmountTillDate
         const interestReceived = doc.AmountTillDate - doc.monthlyCollection;
         doc.interestRecived = interestReceived;


        // Reset InterestTillDate to zero
        doc.InterestTillDate = 0;

        // Log or handle the quarterly update
        console.log(`Quarterly update: ${emiData.length + 1}`);

      
      }

     

      // Prepare new EMI data with the current time and emiNumber set for each item
      const newItem = {
    ...item,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emiNumber: doc.emi.length + 1, // Assuming emiNumber starts at 1
        currentInterestBalance:doc.AmountTillDate,
        currentInterest:tempInterestAmount
      };

      // Append the new EMI data to the existing emi array
      doc.emi.push(newItem);
    });

    
   
  

    await doc.save();

    res.status(200).json(doc); // Send the result back to the client
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




//get rd data
// Controller function to get RD details based on RDNumber and branchCode
const getRDDetails = async (req, res) => {
  const { RDNumber, branchcode } = req.query;
  console.log("Query Parameters:", req.query);

  // Validate and sanitize input parameters
  if (!RDNumber ||!branchcode) {
    return res.status(400).send({ message: 'Invalid request: RDNumber and branchCode are required' });
  }

  try {
  
    const regexPattern = new RegExp(`^[\\w\\s]*\\d+$`);

    // Find documents that match the RDNumber pattern and branchCode
    const docs = await RdData.find({
      RDNumber: { $regex: regexPattern, $options: 'i' },
      branchcode: branchcode
    });

    console.log(`Found ${docs.length} documents matching the criteria`);
    if (docs.length === 0) {
      console.log('No documents found matching the RDNumber and branchCode');
      return res.status(404).send({ message: 'No documents found matching the RDNumber and branchCode' });
    }

    console.log('Sending response with documents');
    res.send(docs);
  } catch (error) {
    console.error(`Error fetching RD details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching RD details', error: error.message });
  }
};


//paginated rd details

// const getRDdataPg = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to 1 if not provided
//     const limit = parseInt(req.query.limit) || 10; // Default limit to 10 items per page if not provided
//     const branchcode = req.query.branchcode; // Get the branchCode from the query parameter

//     // Validate branchCode is provided
//     if (!branchcode) {
//       return res.status(400).json({ error: "Branch Code is required" });
//     }
//     // Calculate the number of documents to skip
//     const skip = (page - 1) * limit;

//     // Find documents with pagination
//     // const newRDdata = await RdData.find().limit(limit).skip(skip);

//     // // Optionally, calculate the total number of pages
//     // const totalDocuments = await RdData.countDocuments();
//     // const totalPages = Math.ceil(totalDocuments / limit);

//      // Find documents with pagination and filter by branchCode
//      const newRDdata = await RdData.find({ branchcode: branchcode }).limit(limit).skip(skip);

//      // Optionally, calculate the total number of pages for filtered data
//      const totalDocuments = await RdData.countDocuments({ branchcode: branchcode });
//      const totalPages = Math.ceil(totalDocuments / limit);
 

//     // Return paginated results along with total pages
//     res.json({
//       data: newRDdata,
//       currentPage: page,
//       totalPages: totalPages
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const getRDdataPg = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to 1 if not provided
//     const limit = parseInt(req.query.limit) || 10; // Default limit to 10 items per page if not provided
//     const branchcode = req.query.branchcode; // Get the branchCode from the query parameter
//     const RDNumber = req.query.RDNumber; // Get the RDNumber from the query parameter, optional

//     // Validate branchCode is provided
//     if (!branchcode) {
//       return res.status(400).json({ error: "Branch Code is required" });
//     }

//     // Calculate the number of documents to skip
//     const skip = (page - 1) * limit;

//     // Construct the query object to include both branchCode and optional RDNumber filters
//     const queryObject = {
//       branchcode: branchcode,
//     };

//     // Only add RDNumber to the query if it's provided
//     if (RDNumber) {
//       queryObject.RDNumber = RDNumber;
//     }

//     // Find documents with pagination and filters
//     const newRDdata = await RdData.find(queryObject)
//      .limit(limit)
//      .skip(skip);

//     // Optionally, calculate the total number of pages for filtered data
//     const totalDocuments = await RdData.countDocuments(queryObject);
//     const totalPages = Math.ceil(totalDocuments / limit);

//     // Return paginated results along with total pages
//     res.json({
//       data: newRDdata,
//       currentPage: page,
//       totalPages: totalPages
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getRDdataPg = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchcode = req.query.branchcode;
    const RDNumber = req.query.RDNumber;

    if (!branchcode) {
      return res.status(400).json({ error: "Branch Code is required" });
    }

    const skip = (page - 1) * limit;

    const queryObject = {
      branchcode: branchcode,
    };

    if (RDNumber) {  
         // Escape special regex characters in RDNumber
      const escapedRDNumber = RDNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Create a regex pattern to match RDNumbers more precisely
      // This example assumes RDNumber can contain digits, dots (for decimals), and possibly special characters
      const regexPattern = new RegExp(`^${escapedRDNumber}\\d*$`);

      queryObject.RDNumber = regexPattern;
    }

    const newRDdata = await RdData.find(queryObject)
    .limit(limit)
    .skip(skip);

    const totalDocuments = await RdData.countDocuments(queryObject);
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      data: newRDdata,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//gettin rd data by bcode
const getRDdataByBcode = async (req, res) => {
  try {
    const branchcode = req.query.branchcode; // Get the branchCode from the query parameter

    // Validate branchCode is provided
    if (!branchcode) {
      return res.status(400).json({ error: "Branch Code is required" });
    }

    // Fetch all documents that match the branchCode without pagination
    const allRDdata = await RdData.find({ branchcode: branchcode });

    // Return all matching documents
    res.json({
      data: allRDdata
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};













 
  module.exports = {
    createRD,
    addEmitoRD,
    getRDDetails,
    getRDdataPg,
    getRDdataByBcode
  };