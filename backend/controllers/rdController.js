const RdData = require('../models/rdProducts');
const CounterModel = require("../models/counterSchema");
// const moment = require('moment');


// const incrementRDFiveDigits = (RDNumber) => {
//   return RDNumber.replace(/\d{5}$/, function (match) {
//     return (parseInt(match) + 1).toString().padStart(5, '0');
//   });
// };

// const createRD = async (req, res) => {
//   try {
//     // Extract RDNumber from the request body
//     const { RDNumber } = req.body;

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
//       { _id: "rdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const accountType = req.body.accountType;
//     const branchCode = req.body.branchcode;
//     const lastRDNumber = await RdData.findOne({ RDNumber: { $regex: `^${accountType}${branchCode}` } }).sort({ RDNumber: -1 }).limit(1);


//     // Generate the current time in HH:mm format
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const newRDdata = new RdData({
//       ...req.body,
//       sl_no: counter.seq,
//       time: currentTime // Automatically set the time field to the current time
//     });

//     await newRDdata.save();

//     // Include the newly created data and a status field in the response
//     res.status(200).json({
//       status: 200, // Explicitly setting the status code
//       message: 'RD details uploaded successfully',
//       data: newRDdata // Add the newly created data to the response
//     });
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error(error);
//     // Send back the error message with a status code of 500
//     res.status(500).json({
//       status: 500, // Explicitly setting the status code
//       error: error.message // Include the error message in the response
//     });
//   }
// };



// const createRD = async (req, res) => {
//   try {
//     // Check if RDNumber already exists in the RD collection
//     const { accountType, branchcode } = req.body;

//     // Fetch the last RDNumber with format `RDXXXXXXXX`
//     const lastRD = await RdData.findOne({ RDNumber: { $regex: `^RD${branchcode}` } })
//       .sort({ RDNumber: -1 })
//       .limit(1);

//     // Generate a new RDNumber with prefix "RD" and 8 digits
//     let newRDNumber = lastRD ? incrementRDNumber(lastRD.RDNumber, 'RD', 8) : 'RD00000001';

//     // Fetch the last rdBill with format `RDBXXXXXXXX`
//     const lastRDBill = await RdData.findOne({ rdBill: { $regex: `^RDB${branchcode}` } })
//       .sort({ rdBill: -1 })
//       .limit(1);

//     // Generate a new rdBill with prefix "RDB" and 8 digits
//     let newRDBill = lastRDBill ? incrementRDNumber(lastRDBill.rdBill, 'RDB', 8) : 'RDB00000001';

//     // Increment the sequence in CounterModel
//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "rdval" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     // Generate the current time in HH:mm format
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     // Create a new RdData document with generated RDNumber and rdBill
//     const newRDdata = new RdData({
//       ...req.body,
//       RDNumber: newRDNumber,
//       rdBill: newRDBill,
//       sl_no: counter.seq,
//       time: currentTime // Automatically set the time field to the current time
//     });

//     // Save the new RdData document to the database
//     await newRDdata.save();

//     // Include the newly created data and a status field in the response
//     res.status(200).json({
//       status: 200, // Explicitly setting the status code
//       message: 'RD details uploaded successfully',
//       data: newRDdata // Add the newly created data to the response
//     });
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error creating RD:", error);
//     // Send back the error message with a status code of 500
//     res.status(500).json({
//       status: 500, // Explicitly setting the status code
//       error: error.message // Include the error message in the response
//     });
//   }
// };



// Helper function to increment the number with proper padding 
const incrementRDNumber = (lastNumber, prefix) => {
  const numericPart = parseInt(lastNumber.slice(prefix.length), 10);
  const nextNumber = numericPart + 1;
  return prefix + nextNumber.toString().padStart(8, '0');
};

const createRD = async (req, res) => {
  try {
    // Fetch the last RDNumber and rdBill in sequence
    const lastRD = await RdData.findOne().sort({ RDNumber: -1 }).limit(1);
    const lastRDBill = await RdData.findOne().sort({ rdBill: -1 }).limit(1);

    // Generate new RDNumber and rdBill
    let newRDNumber = lastRD ? incrementRDNumber(lastRD.RDNumber, 'RD') : 'RD00000001';
    let newRDBill = lastRDBill ? incrementRDNumber(lastRDBill.rdBill, 'RDB') : 'RDB00000001';

    // Double-check for duplicates in generated RDNumber or rdBill
    const duplicateCheck = await RdData.findOne({
      $or: [
        { RDNumber: newRDNumber },
        { rdBill: newRDBill }
      ]
    });

    if (duplicateCheck) {
      return res.status(400).json({
        status: 400,
        error: "Generated RD Number or Bill Number already exists"
      });
    }

    // Increment the sequence in CounterModel for sl_no
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "rdval" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Get current time in "HH:mm" format
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });

    // Create and save new RD data
    const newRDdata = new RdData({
      ...req.body,
      RDNumber: newRDNumber,
      rdBill: newRDBill,
      sl_no: counter.seq,
      time: currentTime
    });

    await newRDdata.save();

    res.status(200).json({
      status: 200,
      message: 'RD details uploaded successfully',
      data: newRDdata
    });

  } catch (error) {
    console.error("Error creating RD:", error);
    res.status(500).json({
      status: 500,
      error: error.message || 'Error creating RD entry'
    });
  }
};



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
      const { amount, date, branchUser } = item;  // Extract branchUser from each EMI item


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

      console.log(doc.InterestTillDate, "doc.InterestTillDate");

      // // Update the AmountTillDate property with the new total amount
      doc.AmountTillDate = tempTotalAmount;

      // Check if it's the end of a quarter
      if (((doc.emi.length + 1) / 3) % 1 === 0) {
        console.log(emiData.length, "emiData.length")
        // Update AmountTillDate by adding InterestTillDate to it
        doc.AmountTillDate += doc.InterestTillDate
        console.log(doc.AmountTillDate, "doc.AmountTillDate ")
        console.log(doc.InterestTillDate, "doc.InterestTillDate");
        doc.InterestAmountTillDate = doc.AmountTillDate


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
        emiNumber: doc.emi.length + 1,// Assuming emiNumber starts at 1
        branchUser  // Adding branchUser to the newItem
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
  if (!RDNumber || !branchcode) {
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
const getEMiDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const date = req.query.date;
    // Initialize query object
    let query = {};

    // Add branchCode to the query if it exists
    if (branchCode) {
      query.branchcode = branchCode;
    }

    // Add date to the query if it exists
    if (date) {
      const searchExpenseRegex = new RegExp(date, 'i');
      query.$or = [
        // { startDate: searchExpenseRegex },
        { 'emi.date': searchExpenseRegex },
      ];
    }

    // Calculate pagination parameters
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents matching the query
    const total = await RdData.countDocuments(query);

    // Fetch documents matching the query with pagination
    const newRDdata = await RdData.find(query).limit(limit).skip(startIndex);

    // Determine if there's a next page
    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    // Send response with matched data
    res.json({ data: newRDdata, nextPage, total });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: error.message
    });
  }
};


module.exports = {
  createRD,
  addEmitoRD,
  getRDDetails,
  getRDdataPg,
  getRDdataByBcode,
  getEMiDetails
};

