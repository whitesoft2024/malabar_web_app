// controllers/loanFormController.js

const loanForm = require('../models/loanform')
const membershipData=require('../models/model')
// const EmployeeSchema = require('../models/EmpSchemedata');




// controllers/employeeController.js


// exports.getEmployeesByBranchCode = async (req, res) => {
//   try {
//     const branchCode = req.query.branchCode;
//     const employees = await EmployeeSchema.find({ branchCode });

//     if (!employees.length) {
//       return res.status(404).json({ message: "No employees found for the given branch code." });
//     }

//     res.json(employees);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





// exports.saveLoanForm = async (req, res) => {
//   try {
//     const newLoanForm = new loanForm(req.body);
//     await newLoanForm.save();
//     res.status(201).json({ message: 'Loan scheme saved successfully' });
//   } catch (error) {
//     console.error('Error saving loan scheme:', error);
//     res.status(500).json({ message: 'Failed to save loan scheme' });
//   }
// };



exports.saveLoanForm = async (req, res) => {
  try {
    // Extract membershipId from req.body
    const { membershipId, totalLoanAmount  } = req.body;

    // Check if membershipId exists and is of sufficient length
    if (!membershipId || membershipId.length < 8) {
      return res.status(400).json({ message: 'Invalid membershipId' });
    }

    // Extract the 6th, 7th, and 8th characters
    const branchCode = membershipId.substring(5, 8);
    console.log("bcode", branchCode);

    const pendingEmiAmount = totalLoanAmount

    // Update req.body to include branchCode
    req.body.branchCode = branchCode;
    req.body.pendingEmiAmount = totalLoanAmount

    // Update the model collection by pushing the branchCode value
    // await membershipData.updateOne(
    //   {}, // Assuming you are updating a single document, adjust the filter as needed
    //   { $push: { branchCode: branchCode } }
    // );

    // Save the new loan form
    const newLoanForm = new loanForm(req.body);
    await newLoanForm.save();

    res.status(201).json({ message: 'Loan scheme saved successfully' });
  } catch (error) {
    console.error('Error saving loan scheme:', error);
    res.status(500).json({ message: 'Failed to save loan scheme' });
  }
};



exports.getLoanForms = async (req, res) => {
  try {
    const loanForms = await loanForm.find();
    res.json(loanForms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//getting member details from member data
exports.fetchMemberDetails = async (req, res) => {
  const { branchCode, phoneNumber } = req.query;
console.log("reqqueryxxx",req.query);
  // Validate and sanitize input parameters
  if (!branchCode ||!phoneNumber) {
    return res.status(400).send({ message: 'Invalid request: branchCode and phoneNumber are required' });
  }

  try {
    const minPhoneNumberLength = phoneNumber.length;
    const members = await membershipData.find({
      customerMobile: { $regex: `^${phoneNumber}`, $options: 'i' },
      membershipId: { $regex: `^.{5}${branchCode}` },
    });

    console.log(`Found ${members.length} members`);
    if (members.length === 0) {
      console.log('No members found matching the branch code and phone number');
      return res.status(404).send({ message: 'No members found matching the branch code and phone number' });
    }

    console.log('Sending response with members');
    res.send(members);
  } catch (error) {
    console.error(`Error fetching member details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching member details', error: error.message });
  }
};






  // Assuming the model is exported from a file named models/loanForm.js
  // exports.addEmiToLoanForm = async (req, res) => {
  //   try {
  //     const { groupId } = req.params;
  //     const { date, amount } = req.body;
  
  //     // Find the loan form by its groupId
  //     const loanform = await loanForm.findById(groupId);
  //     if (!loanform) {
  //       return res.status(404).json({ success: false, error: 'Loan form not found' });
  //     }
  
  //     // Check if the loan form already has EMI entries
  //     if (loanform.loanEMI.length >= loanform.duration) {
  //       return res.status(400).json({ success: false, error: 'Maximum number of EMI entries reached for this loan form' });
  //     }
  
  //     // Calculate the new currentEmiBalance based on the last EMI's currentEmiBalance and the new EMI amount
  //     let newCurrentEmiBalance = loanform.loanEMI.length > 0? loanform.loanEMI[loanform.loanEMI.length - 1].currentEmiBalance : amount;
  
  //     // For the first EMI, currentEmiBalance is equal to its amount
  //     if (loanform.loanEMI.length === 0) {
  //       newCurrentEmiBalance = amount;
  //     } else {
  //       // For subsequent EMIs, currentEmiBalance is the sum of the previous EMI's currentEmiBalance and the new EMI's amount
      
  //         newCurrentEmiBalance += amount;
       

  //         // Extract the last added currentEmiBalance and log it to the console
  //     const lastAddedCurrentEmiBalance = loanform.loanEMI[loanform.loanEMI.length - 1].currentEmiBalance;
  //     console.log(`Last added currentEmiBalance: ${lastAddedCurrentEmiBalance}`);

  //       // Calculate the sum of the lastAddedCurrentEmiBalance and the newly added amount
  //   const totalAmount = lastAddedCurrentEmiBalance + amount;
  //   console.log(`Total amount after adding the newly added amount to the last added currentEmiBalance: ${totalAmount}`);
  //     }



  
  //     // Add the new EMI entry to the found loan form
  //     loanform.loanEMI.push({
  //       amount,
  //       date,
  //       emiNumber: loanform.loanEMI.length + 1, // Incrementing the emiNumber
  //       currentEmiBalance: newCurrentEmiBalance, // Setting the new currentEmiBalance
  //     });
  
  //     // Save the updated loan form document
  //     await loanform.save();
  
  //     res.status(200).json({ success: true, message: 'EMI entry added successfully', data: loanform });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ success: false, error: 'Server error' });
  //   }
  // };








  exports.addEmiToLoanForm = async (req, res) => {
    try {
      const { groupId } = req.params;
      const { date, amount } = req.body;
  
      // Find the loan form by its groupId
      const loanform = await loanForm.findById(groupId);
      if (!loanform) {
        return res.status(404).json({ success: false, error: 'Loan form not found' });
      }
  
      // Check if the loan form already has EMI entries
      if (loanform.loanEMI.length >= loanform.duration) {
        return res.status(400).json({ success: false, error: 'Maximum number of EMI entries reached for this loan form' });
      }
  
      // Calculate the new currentEmiBalance based on the last EMI's currentEmiBalance and the new EMI amount
      let newCurrentEmiBalance = loanform.loanEMI.length > 0
        ? loanform.loanEMI[loanform.loanEMI.length - 1].currentEmiBalance + amount
        : amount;
  
      // Calculate and update the pendingEmiAmount
      const newPendingEmiAmount = loanform.pendingEmiAmount - amount;
      loanform.pendingEmiAmount = newPendingEmiAmount;
  
      // Add the new EMI entry to the found loan form
      loanform.loanEMI.push({
        amount,
        date,
        emiNumber: loanform.loanEMI.length + 1, // Incrementing the emiNumber
        currentEmiBalance: newCurrentEmiBalance, // Setting the new currentEmiBalance
      });

     // Update the amountPaidTillDate with the new currentEmiBalance
     loanform.amountPaidtillDate += amount;

  
      // Save the updated loan form document
      await loanform.save();
  
      res.status(200).json({ success: true, message: 'EMI entry added successfully', data: loanform });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
  



  



 //gettin mem details from loan data


 exports.fetchLoanDetails = async (req, res) => {
  const { branchCode, loanNumber } = req.query;
console.log("reqqueryxxx",req.query);
  // Validate and sanitize input parameters
  if (!branchCode ||!loanNumber) {
    return res.status(400).send({ message: 'Invalid request: branchCode and loanNumber are required' });
  }

  try {
    // const minLoanNumberLength = loanNumber.length;
    console.log(" loan form",);
    const loanData = await loanForm.find({
      loanNumber: { $regex: `^${loanNumber}`, $options: 'i' },
      membershipId: { $regex: `^.{5}${branchCode}` },
    });
    console.log("loan data",loanData);
    console.log("loan num and mem id");


    console.log(`Found ${loanData.length} loan data`);
    if (loanData.length === 0) {
      console.log('No members found matching the branch code and loan number');
      return res.status(404).send({ message: 'No members found matching the branch code and loan number' });
    }

    console.log('Sending response with loan details');
    res.send(loanData);
  } catch (error) {
    console.error(`Error fetching member details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching loan details', error: error.message });
  }
};




 //gettin mem details from loan data base of branchh code
 exports.fetchBranchLoanDetails = async (req, res) => {
  const { branchCode } = req.query;
console.log("reqqueryxxx",req.query);
  // Validate and sanitize input parameters
  if (!branchCode) {
    return res.status(400).send({ message: 'Invalid request: branchCode required' });
  }

  try {
    // const minLoanNumberLength = loanNumber.length;
    console.log(" loan form",);
    const loanData = await loanForm.find({
      membershipId: { $regex: `^.{5}${branchCode}` },
    });
    console.log("loan data",loanData);
    console.log("loan num and mem id");


    console.log(`Found ${loanData.length} loan data`);
    if (loanData.length === 0) {
      console.log('No members found matching the branch code and loan number');
      return res.status(404).send({ message: 'No members found matching the branch code and loan number' });
    }

    console.log('Sending response with loan details');
    res.send(loanData);
  } catch (error) {
    console.error(`Error fetching member details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching loan details', error: error.message });
  }
};
//getting paginated branch loan details
// exports.fetchBranchLoanDetailsPG = async (req, res) => {
//   const { branchCode, page = 1, limit = 10 } = req.query; // Default values for page and limit

//   // Validate and sanitize input parameters
//   if (!branchCode) {
//     return res.status(400).send({ message: 'Invalid request: branchCode required' });
//   }

//   try {
//     // Calculate skip value based on page and limit
//     const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

//     // Find loan data with pagination
//     const loanData = await loanForm.find({
//       membershipId: { $regex: `^.{5}${branchCode}` },
//     }).skip(skip).limit(parseInt(limit, 10));

//     console.log(`Found ${loanData.length} loan data`);

//     if (loanData.length === 0) {
//       console.log('No members found matching the branch code and loan number');
//       return res.status(404).send({ message: 'No members found matching the branch code and loan number' });
//     }

//     console.log('Sending response with loan details');
//     res.send(loanData);
//   } catch (error) {
//     console.error(`Error fetching member details: ${error.message}`);
//     res.status(500).send({ message: 'Error fetching loan details', error: error.message });
//   }
// };

// exports.fetchBranchLoanDetailsPG = async (req, res) => {
//   const { branchCode, page = 1, limit = 10 } = req.query; // Default values for page and limit

//   // Validate and sanitize input parameters
//   if (!branchCode) {
//     return res.status(400).send({ message: 'Invalid request: branchCode required' });
//   }

//   try {
//     // Calculate skip value based on page and limit
//     const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

//     // Count the total number of documents that match the query criteria
//     const totalCount = await loanForm.countDocuments({
//       membershipId: { $regex: `^.{5}${branchCode}` },
//     });

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

//     // Find loan data with pagination
//     const loanData = await loanForm.find({
//       membershipId: { $regex: `^.{5}${branchCode}` },
//     }).skip(skip).limit(parseInt(limit, 10));

//     console.log(`Found ${loanData.length} loan data`);

//     if (loanData.length === 0) {
//       console.log('No members found matching the branch code and loan number');
//       return res.status(404).send({ message: 'No members found matching the branch code and loan number' });
//     }

//     // Include totalPages in the response
//     res.send({
//       totalPages,
//       loanData,
//     });
//   } catch (error) {
//     console.error(`Error fetching member details: ${error.message}`);
//     res.status(500).send({ message: 'Error fetching loan details', error: error.message });
//   }
// };

exports.fetchBranchLoanDetailsPG = async (req, res) => {
  const { branchCode,loanNumber, page = 1, limit = 10 } = req.query;
  // Validate and sanitize input parameters
  if (!branchCode) {
    return res.status(400).send({ message: 'Invalid request: branchCode required' });
  }
  try {
    // Calculate skip value based on page and limit
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Construct the query object to include both branchCode and optional loanNumber filters
    const queryObject = {
      membershipId: { $regex: `^.{5}${branchCode}` }, // Filter by branchCode
    };

    // Only add loanNumber to the query if it's provided
    if (loanNumber) {
      queryObject.loanNumber = loanNumber;
    }

    // Count the total number of documents that match the query criteria
    const totalCount = await loanForm.countDocuments(queryObject);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

    // Find loan data with pagination and filters
    const loanData = await loanForm.find(queryObject)
    .skip(skip)
    .limit(parseInt(limit, 10));

    console.log(`Found ${loanData.length} loan data`);

    if (loanData.length === 0) {
      console.log('No members found matching the branch code and loan number');
      return res.status(404).send({ message: 'No members found matching the branch code and loan number' });
    }

    // Include totalPages in the response
    res.send({
      totalPages,
      loanData,
    });
  } catch (error) {
    console.error(`Error fetching member details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching loan details', error: error.message });
  }
};

exports.fetchloan = async (req, res) => {
  try {
    // Parse pagination parameters from query, or set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branch;

    // Initialize query object
    let query = {};

    // If branchCode is provided, add it to the query object
    if (branchCode) {
      query.branchCode = branchCode;
    }

    // Calculate the starting and ending index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents matching the query
    const total = await loanForm.countDocuments(query);

    // Fetch documents matching the query with pagination
    const newExpensedata = await loanForm.find(query).limit(limit).skip(startIndex);

    // Determine if there's a next page
    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    // Send response with matched data
    res.json({ data: newExpensedata, nextPage, total });
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: error.message
    });
  }
};



exports.fetchLoanData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const date = req.query.date;
    let query = {};
    
    console.log('loan date:', date);
    console.log('loan code:', branchCode);

    if (branchCode) {
        query.branchCode = branchCode;
    }

    if (date) {
        const searchExpenseRegex = new RegExp(date, 'i');
        query.$or = [
          { date: searchExpenseRegex },
          { 'loanEMI.date': searchExpenseRegex },
        ];
      }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await loanForm.countDocuments(query);

    const newLoandata = await loanForm.find(query).limit(limit).skip(startIndex);

    let nextPage = null;
    if (endIndex < total) {
        nextPage = page + 1;
    }

    res.json({ data: newLoandata, nextPage, total });
} catch (error) {
    res.status(500).json({
        success: false,
        message: 'Server error. Please try again',
        error: error.message
    });
}
}


