//=================================MEMBERSHIP DATA FETCHING AND SEACHING CODES===============================================

app.get('/api/membership', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const branchCode = req.query.branchCode; 
    const searchTerm = req.query.searchTerm;
    
    let query = {}; 

    if (branchCode) {
      query = { membershipId: { $regex: new RegExp(`^.{5}${branchCode}`) } };
    }
    
    // Fetch all data regardless of searchTerm presence
    let newMembershipdata = await Membership.find(query);
    
    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      newMembershipdata = newMembershipdata.filter(membership => {
          // Perform case-insensitive search within relevant fields
          const customerName = membership.customerName ? membership.customerName.toLowerCase() : '';
          const membershipType = membership.membershipType ? membership.membershipType.toLowerCase() : '';
          const customerMobile = membership.customerMobile ? membership.customerMobile.toLowerCase() : '';
          // Add additional fields as needed for searching
  
          return (
              customerName.includes(searchTerm.toLowerCase()) ||
              membershipType.includes(searchTerm.toLowerCase()) ||
              customerMobile.includes(searchTerm.toLowerCase())
              // Add additional fields here
          );
      });
  }

    const total = newMembershipdata.length; // Total count after filtering
    
    // Paginate the data regardless of searchTerm presence
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = newMembershipdata.slice(startIndex, endIndex);

    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    res.json({ data, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//================================================================================

app.get('/api/membership', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const branchCode = req.query.branchCode; 
    const searchTerm = req.query.searchTerm;
    
    let query = {}; 

    if (branchCode) {
      query = { membershipId: { $regex: new RegExp(`^.{5}${branchCode}`) } };
    }
    
    // Fetch all data regardless of searchTerm presence
    let newMembershipdata = await Membership.find(query);
    
    // Paginate the data regardless of searchTerm presence
    const total = newMembershipdata.length; // Total count before filtering
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = newMembershipdata.slice(startIndex, endIndex);

    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      newMembershipdata = newMembershipdata.filter(membership => {
          // Perform case-insensitive search within relevant fields
          const customerName = membership.customerName ? membership.customerName.toLowerCase() : '';
          const membershipType = membership.membershipType ? membership.membershipType.toLowerCase() : '';
          const customerMobile = membership.customerMobile ? membership.customerMobile.toLowerCase() : '';
          // Add additional fields as needed for searching
  
          return (
              customerName.includes(searchTerm.toLowerCase()) ||
              membershipType.includes(searchTerm.toLowerCase()) ||
              customerMobile.includes(searchTerm.toLowerCase())
              // Add additional fields here
          );
      });

      // Update total count after filtering
      const filteredTotal = newMembershipdata.length;

      // Update pagination information after filtering
      nextPage = null; // Reset nextPage since we are updating the data
      if (filteredTotal > 0 && filteredTotal > endIndex) {
        nextPage = page + 1;
      }

      // Update data to include only filtered results based on pagination
      const filteredData = newMembershipdata.slice(startIndex, endIndex);

      res.json({ data: filteredData, nextPage, total: filteredTotal });
    } else {
      // Send the data normally without applying search filter
      res.json({ data, nextPage, total });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//================================================================================


app.get('/api/membership', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const branchCode = req.query.branchCode; 
    const searchTerm = req.query.searchTerm;
    
    let query = {}; 

    if (branchCode) {
      query = { membershipId: { $regex: new RegExp(`^.{5}${branchCode}`) } };
    }
    
    // Fetch all data regardless of searchTerm presence
    let newMembershipdata = await Membership.find(query);
    
    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      newMembershipdata = newMembershipdata.filter(membership => {
          // Perform case-insensitive search within relevant fields
          const customerName = membership.customerName ? membership.customerName.toLowerCase() : '';
          const membershipType = membership.membershipType ? membership.membershipType.toLowerCase() : '';
          const customerMobile = membership.customerMobile ? membership.customerMobile.toLowerCase() : '';
          // Add additional fields as needed for searching
  
          return (
              customerName.includes(searchTerm.toLowerCase()) ||
              membershipType.includes(searchTerm.toLowerCase()) ||
              customerMobile.includes(searchTerm.toLowerCase())
              // Add additional fields here
          );
      });
  }

    const total = newMembershipdata.length; // Total count after filtering
    
    // Paginate the data regardless of searchTerm presence
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = newMembershipdata.slice(startIndex, endIndex);

    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    res.json({ data, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//================================================================================

Membership
app.get('/api/memberdata', async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//================================================================================


app.get('/api/membership', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const branchCode = req.query.branchCode; 
    
    let query = {}; 

    if (branchCode) {
      query = { membershipId: { $regex: new RegExp(`^.{5}${branchCode}`) } };
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Membership.countDocuments(query);

    const newMembershipdata = await Membership.find(query).limit(limit).skip(startIndex);

    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    res.json({ data: newMembershipdata, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//=================================verified===============================================

app.get('/api/membership', async (req, res) => {
    try {
       const page = parseInt(req.query.page) || 1; 
       const limit = parseInt(req.query.limit) || 10; 
       const branchCode = req.query.branchCode; 
       const searchTerm = req.query.searchTerm;
       
       // Initialize query object
       let query = {};
   
       // Apply branchCode filter if provided
       if (branchCode) {
         query.membershipId = { $regex: new RegExp(`^.{5}${branchCode}`) };
       }
   
       // Apply searchTerm filter if provided
       if (searchTerm) {
         const searchRegex = new RegExp(searchTerm, 'i');
         query.$or = [
           { customerName: searchRegex },
           { membershipType: searchRegex },
           { customerMobile: searchRegex }
           // Add additional fields here
         ];
       }
   
       // Fetch data with pagination and filters applied
       const total = await Membership.countDocuments(query);
       const data = await Membership.find(query)
         .skip((page - 1) * limit)
         .limit(limit)
         .exec();
   
       let nextPage = null;
       if (total > page * limit) {
         nextPage = page + 1;
       }
   
       res.json({ data, nextPage, total });
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
   });


//================================================================================


// Membership

// app.get('/api/membership', async (req, res) => {
//   try {
//      const page = parseInt(req.query.page) || 1; 
//      const limit = parseInt(req.query.limit) || 10; 
//      const branchCode = req.query.branchCode; 
//      const searchTerm = req.query.searchTerm;
//      const searchReceipt = req.query.searchReceipt;
     
//      let query = {};
 
//      // Apply branchCode filter if provided
//      //  if (branchCode) {
//      //   query.branchCode = branchCode;
//      // }
     
//      if (branchCode) {
//        query.membershipId = { $regex: new RegExp(`^.{5}${branchCode}`) };
//      }
 
//      // Apply searchTerm filter if provided
//      if (searchTerm) {
//        const searchRegex = new RegExp(searchTerm, 'i');
//        query.$or = [
//          { customerName: searchRegex },
//          { membershipType: searchRegex },
//          { customerMobile: searchRegex }
//        ];
//      }

//      if (searchReceipt) {
//        const searchReceiptRegex = new RegExp(searchReceipt, 'i');
//        query.$or = [
//          { customerName: searchReceiptRegex },
//          { customerMobile: searchReceiptRegex }
//        ];
//      }
 
//      // Fetch data with pagination and filters applied
//      const total = await Membership.countDocuments(query);
//      const data = await Membership.find(query)
//        .sort({ membershipId: 1 }) 
//        .skip((page - 1) * limit)
//        .limit(limit)
//        .exec();

//      let nextPage = null;
//      if (total > page * limit) {
//        nextPage = page + 1;
//      }
 
//      res.json({ data, nextPage, total });
//   } catch (error) {
//      res.status(500).json({ error: error.message });
//   }
//  });


//----------------------------------------------------------------

// Savings search and fetch
// app.get('/searchAccNumbers', async (req, res) => {
//   try {
//     const query = req.query.query;
//     if (typeof query !== 'string') {
//       throw new Error('Query parameter must be a string');
//     }
//     const accNumbers = await SavingsData.find({ accountNumber: { $regex: query, $options: 'i' } });
//     res.json(accNumbers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get('/accfetchMemberDetails', async (req, res) => {
//   try {
//     const accNumber= req.query.accountNumber;
//     const member = await SavingsData.findOne({ accountNumber: accNumber });
//     res.json(member);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

//----------------------------------------------------------------
 
// app.get('/api/savings', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Current page number, default is 1
//     const limit = parseInt(req.query.limit) || 10; // Number of records per page, default is 10
//     const branchCode = req.query.branchCode; // Retrieve branch code from query parameters
    
//     let query = {}; 

//     if (branchCode) {
//       query = { accountNumber: { $regex: new RegExp(`^.{1}${branchCode}`) } };
//     }
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const total = await SavingsData.countDocuments(query);

//     const newSavedata = await SavingsData.find(query).limit(limit).skip(startIndex);

//     let nextPage = null;
//     if (endIndex < total) {
//       nextPage = page + 1;
//     }

//     res.json({ data: newSavedata, nextPage, total });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// app.get('/api/savings', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Current page number, default is 1
//     const limit = parseInt(req.query.limit) || 10; // Number of records per page, default is 10

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const total = await SavingsData.countDocuments();

//     const newSavedata = await SavingsData.find().limit(limit).skip(startIndex);

//     let nextPage = null;
//     if (endIndex < total) {
//       nextPage = page + 1;
//     }

//     res.json({ data: newSavedata, nextPage, total });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Admin controlls

// add designation 
