


const Scheme1 = require('../models/swarnanidhiModel');
// Import mongoose at the top of your file
const mongoose = require('mongoose');
const moment = require('moment');

const employeeData=require('../models/signup')






exports.createGroup = async (req, res) => {
    try {
        // Find the highest groupNumber currently in the database
        const latestGroup = await Scheme1.findOne().sort({ groupNumber: -1 }).select('groupNumber');

        // Determine the next groupNumber
        let nextGroupNumber = 0;
        if (latestGroup) {
            nextGroupNumber = parseInt(latestGroup.groupNumber) + 1;
        }

        // Format the groupNumber to be a two-digit string (e.g., "01", "02", etc.)
        const formattedGroupNumber = formatGroupNumber(nextGroupNumber);

        // Create a new group using the request data, including the formatted groupNumber
        const group = new Scheme1({
            ...req.body,
            groupNumber: formattedGroupNumber,
        });

        // Save the new group to the database
        const savedGroup = await group.save();

        // Format the createdAt timestamp into 12-hour format
        const createdAt = savedGroup.createdAt;
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the `time` field in the newly created group with formatted time
        savedGroup.time = formattedTime;

        // Save the group again after updating the time
        await savedGroup.save();

        // Return a success message with the created group data
        res.status(201).json({
            message: "Group created successfully!",
            data: savedGroup,
        });
    } catch (error) {
        // Log the error to the console
        console.error('Error creating group:', error.message);

        // Return a detailed error message
        res.status(400).json({
            message: "Failed to create group. Please check your input and try again.",
            error: error.message,
        });
    }
};



// Helper function to get the current time in 12-hour format
// const getCurrentTimeIn12HourFormat = (date) => {
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12; // Convert to 12-hour format
//     return `${hours}:${minutes} ${ampm}`;
// };


// Helper function to format groupNumber
const formatGroupNumber = (number) => {
    return number.toString().padStart(2, '0');
};





exports.addMemberToGroup = async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        const groupId = req.params.groupId;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }

        // Fetch the group by groupId
        const group = await Scheme1.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if the group already has 1000 members
        if (group.members && group.members.length >= 1000) {
            return res.status(400).json({ message: 'Cannot add more than 1000 members to a group.' });
        }

        // Retrieve the groupNumber from the selected group
        const groupNumber = group.groupNumber;
        const formattedGroupNumber = groupNumber.toString().padStart(2, '0'); // Ensure it's two digits

        // Function to generate the next schemeId
        const generateNextSchemeId = (highestMemberPart) => {
            return `SNAG${formattedGroupNumber}${String(highestMemberPart).padStart(4, '0')}`;
        };

        let highestMemberPart = 0;
        group.members.forEach(member => {
            if (member.schemeId && typeof member.schemeId === 'string') {
                const memberPart = parseInt(member.schemeId.slice(-4), 10); // Extract the last four digits
                highestMemberPart = Math.max(highestMemberPart, memberPart);
            }
        });

        let nextSchemeId;
        let schemeIdExists = true;

        // Loop until we generate a unique schemeId that doesn't exist in the collection
        while (schemeIdExists) {
            highestMemberPart += 1; // Increment the member part
            nextSchemeId = generateNextSchemeId(highestMemberPart);

            // Check if this schemeId already exists in any group
            const schemeIdCheck = await Scheme1.findOne({ 'members.schemeId': nextSchemeId });
            if (!schemeIdCheck) {
                schemeIdExists = false; // Exit the loop if the schemeId is unique
            }
        }
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
        console.log('Params:', req.params);
        console.log('Query:', req.query);
        console.log('Request Body:', req.body);
        console.log('Reference Name:', req.body.referenceName);

        // Create the new member with the unique schemeId
        const newMember = {
            branchCode: req.body.branchCode,
            customerName: req.body.customerName,
            customerNumber: req.body.customerNumber,
            membershipId: req.body.membershipId,
            schemeId: nextSchemeId,
            installments: req.body.installments,
            date: req.body.date || new Date().toISOString().split('T')[0], // Use current date if not provided
            groupName: req.body.groupName,
            address: req.body.address,
            userName: req.body.userName,
            userDesignation: req.body.userDesignation,
            // referenceName:req.body.referenceName,
            referenceName: req.body.referenceName || '', // Ensure it's always present
            totalAmount: 50000 // Set default totalAmount if necessary
        };

          // Check if a member with the same schemeId already exists
          const existingMember = await Scheme1.findOne({
            'members.schemeId': newMember.schemeId
        });

        if (existingMember) {
            return res.status(409).json({ message: 'Member with this schemeId already exists' });
        }

        // Add the new member to the group
        group.members.push(newMember);

        // Save the updated group to get MongoDB timestamps
        const updatedGroup = await group.save();

        // Format the createdAt timestamp into 12-hour format
        const createdAt = updatedGroup.members[updatedGroup.members.length - 1].createdAt;
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the `time` field in the newly added member with formatted time
        updatedGroup.members[updatedGroup.members.length - 1].time = formattedTime;

        // Save the group again after updating the time
        await updatedGroup.save();

        res.status(200).json({ message: 'Member added successfully', group: updatedGroup, schemeId: nextSchemeId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




exports.addInstallmentToMember = async (req, res) => {
    try {
        const group = await Scheme1.findOne({ 'members.schemeId': req.params.schemeId });
        if (!group) return res.status(404).json({ message: 'Group or member not found' });

        // Check if auctionDetails exists and if it contains any firstPrice entries
        const auctionDetails = group.auctionDetails && group.auctionDetails[0];
        if (auctionDetails && Array.isArray(auctionDetails.firstPrice)) {
            const auctionWinner = auctionDetails.firstPrice.find(price => price.schemeId === req.params.schemeId);
            if (auctionWinner) {
                return res.status(400).json({ 
                    message: `SchemeId has won the auction on ${auctionWinner.date}, no more EMI payments allowed.` 
                });
            }
        }

        const member = group.members.find(member => member.schemeId === req.params.schemeId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        let lastEmiAmount = 0;
        let lastEmiTotal = 0;
        let nextEmiIndex = 1;

        if (member.installments.length > 0) {
            const lastInstallment = member.installments[member.installments.length - 1];
            lastEmiAmount = Number(lastInstallment.emiAmount) || 0;
            lastEmiTotal = Number(lastInstallment.emiTotal) || 0;
            nextEmiIndex = lastInstallment.emiIndex + 1;
        }

        const currentEmiAmount = Number(req.body.emiAmount) || 0;
        const currentAmount = Number(req.body.amount) || 0;

        // Format the date from req.body.date
        const [day, month, year] = req.body.date.split('/');
        const formattedDate = moment(`${year}-${month}-${day}`).format('DD/MM/YYYY');

        // Calculate the new emiTotal
        const newEmiTotal = lastEmiTotal + currentAmount;

        // Calculate emiOutstanding
        const emiOutstanding = member.totalAmount - newEmiTotal;

        // Push the installment to the member
        member.installments.push({
            amount: currentAmount,
            date: formattedDate,
            emiIndex: nextEmiIndex,
            emiAmount: lastEmiAmount + currentEmiAmount,
            emiTotal: newEmiTotal,
            emiOutstanding: emiOutstanding,
        });

        // Save the group to get the MongoDB timestamps (createdAt)
        await group.save();

        // Get the createdAt timestamp of the latest installment
        const createdAt = member.installments[member.installments.length - 1].createdAt;
        
        // Format the timestamp into 12-hour format
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the time field in the latest installment
        member.installments[member.installments.length - 1].time = formattedTime;

        // Save the group again after updating the time
        await group.save();

        res.status(200).json({ message: 'Installment added successfully', group });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




exports.getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme1.find();
        res.status(200).json({message: "Group details retrived successfully!",schemes});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Controller to get all schemes with pagination
exports.getAllSchemesPaginated = async (req, res) => {
    try {
        // Extract page and limit from query params, and set defaults
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page

        // Calculate the number of records to skip based on the page
        const skip = (page - 1) * limit;

        // Get paginated data
        const schemes = await Scheme1.find().skip(skip).limit(limit);

        // Get total count of records
        const totalRecords = await Scheme1.countDocuments();

        // Send response with pagination metadata
        res.status(200).json({
            message: "Group details retrieved successfully!",
            schemes,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Controller to get paginated installments by groupId
exports.getPaginatedInstallmentsByGroupId = async (req, res) => {
    try {
        const { groupId } = req.params;
        const page = parseInt(req.query.page) || 1; // Current page (default to 1)
        const limit = parseInt(req.query.limit) || 10; // Limit of installments per page (default to 10)
        const skip = (page - 1) * limit;

        // Find the scheme by groupId
        const scheme = await Scheme1.findOne({ groupNumber: groupId });

        if (!scheme) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Extract all installments from all members in the group
        const allInstallments = scheme.members.flatMap(member => member.installments);

        // Pagination logic for the installments array
        const totalRecords = allInstallments.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const paginatedInstallments = allInstallments.slice(skip, skip + limit);

        res.status(200).json({
            message: "Installments retrieved successfully",
            installments: paginatedInstallments,
            currentPage: page,
            totalPages,
            totalRecords
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get a specific scheme entry by ID
exports.getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme1.findById(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.status(200).json(scheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Controller for paginated group data
exports.getPaginatedGroups = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalRecords = await Scheme1.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const schemes = await Scheme1.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Group data retrieved successfully",
            schemes,
            currentPage: page,
            totalPages,
            totalRecords
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





function getCurrentTimeIn12HourFormat() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strHours = hours < 10 ? '0' + hours : hours;
    return `${strHours}:${strMinutes} ${ampm}`;
}



exports.addFirstPrice = async (req, res) => {
    try {
        const { groupId } = req.params;
        const firstPrice = req.body;  // Assuming req.body contains the firstPrice object

        // Find the group by ID
        const group = await Scheme1.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if auctionDetails exists; if not, initialize it as an array with one object containing the firstPrice array
        if (!group.auctionDetails || group.auctionDetails.length === 0) {
            group.auctionDetails = [{ firstPrice: [] }];
        }

        // Push the new firstPrice object into the firstPrice array
        group.auctionDetails[0].firstPrice.push(firstPrice);

        // Save the group to get the MongoDB timestamps
        await group.save();

        // Get the createdAt timestamp for the last inserted firstPrice object
        const createdAt = group.auctionDetails[0].firstPrice[group.auctionDetails[0].firstPrice.length - 1].createdAt;

        // Format the timestamp to 12-hour format
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the time field in the latest firstPrice
        group.auctionDetails[0].firstPrice[group.auctionDetails[0].firstPrice.length - 1].time = formattedTime;

        // Save the updated group with the time field
        await group.save();

        res.status(200).json({ message: 'First price added/updated successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error adding first price', error: error.message });
    }
};



exports.addSecondPrice = async (req, res) => {
    try {
        const { groupId } = req.params;
        const secondPrice = req.body;  // Assuming req.body contains the secondPrice object

        // Find the group by ID
        const group = await Scheme1.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if auctionDetails exists; if not, initialize it as an array with one object containing the secondPrice array
        if (!group.auctionDetails || group.auctionDetails.length === 0) {
            group.auctionDetails = [{ secondPrice: [] }];
        }

        // Push the new secondPrice object into the secondPrice array
        group.auctionDetails[0].secondPrice.push(secondPrice);

        // Save the group to get the MongoDB timestamps
        await group.save();

        // Get the createdAt timestamp for the last inserted secondPrice object
        const createdAt = group.auctionDetails[0].secondPrice[group.auctionDetails[0].secondPrice.length - 1].createdAt;

        // Format the timestamp to 12-hour format
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the time field in the latest secondPrice
        group.auctionDetails[0].secondPrice[group.auctionDetails[0].secondPrice.length - 1].time = formattedTime;

        // Save the updated group with the time field
        await group.save();

        res.status(200).json({ message: 'Second price added successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error adding second price', error: error.message });
    }
};




exports.addThirdPrice = async (req, res) => {
    try {
        const { groupId } = req.params;
        const thirdPrice = req.body;  // Assuming req.body contains the thirdPrice object

        // Find the group by ID
        const group = await Scheme1.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if auctionDetails exists; if not, initialize it as an array with one object containing the thirdPrice array
        if (!group.auctionDetails || group.auctionDetails.length === 0) {
            group.auctionDetails = [{ thirdPrice: [] }];
        }

        // Push the new thirdPrice object into the thirdPrice array
        group.auctionDetails[0].thirdPrice.push(thirdPrice);

        // Save the group to get the MongoDB timestamps
        await group.save();

        // Get the createdAt timestamp for the last inserted thirdPrice object
        const createdAt = group.auctionDetails[0].thirdPrice[group.auctionDetails[0].thirdPrice.length - 1].createdAt;

        // Format the timestamp to 12-hour format
        const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
        const formattedTime = new Date(createdAt).toLocaleTimeString('en-IN', options);

        // Update the time field in the latest thirdPrice
        group.auctionDetails[0].thirdPrice[group.auctionDetails[0].thirdPrice.length - 1].time = formattedTime;

        // Save the updated group with the time field
        await group.save();

        res.status(200).json({ message: 'Third price added successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error adding third price', error: error.message });
    }
};




exports.updateSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme1.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.status(200).json(scheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a scheme entry by ID
exports.deleteSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme1.findByIdAndDelete(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.status(200).json({ message: 'Scheme deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Controller function to get installments
exports.getInstallments = async (req, res) => {
    try {
        const { schemeId } = req.params;
    
        // Find the scheme by schemeId
        const scheme = await Scheme1.findOne({ 'members.schemeId': schemeId });
    
        if (!scheme) {
          return res.status(404).json({ message: 'Scheme not found' });
        }
    
        // Extract the installments for all members under the matching schemeId
        const member = scheme.members.find(member => member.schemeId === schemeId);
    
        if (!member || member.installments.length === 0) {
          return res.status(404).json({ message: 'No installments found for this scheme' });
        }
    
        // Return the installments
        res.status(200).json({ installments: member.installments });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };

// controllers/swarnaController.js

// Get installments based on schemeId
// exports.getInstallmentsBySchemeId = async (req, res) => {
//     try {
//         const { schemeId } = req.params;
        
//         // Find the scheme that contains the requested schemeId
//         const scheme = await Scheme1.findOne({ "members.schemeId": schemeId }, { "members.$": 1 });
        
//         // If scheme is found, return the installments of that schemeId
//         if (scheme && scheme.members && scheme.members.length > 0) {
//             const installments = scheme.members[0].installments;
//             res.status(200).json({ message: "Installments retrieved successfully", installments });
//         } else {
//             res.status(404).json({ message: "Scheme with the specified schemeId not found" });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };



// Get installments based on schemeId
exports.getInstallmentsBySchemeId = async (req, res) => {
    try {
      const schemeId = req.params.schemeId;
  
      // Find the schemes that contain members with matching schemeId
      const schemes = await Scheme1.find({
        "members.schemeId": { $regex: new RegExp(schemeId, "i") }
      });
  
      if (!schemes || schemes.length === 0) {
        return res.status(404).json({ error: 'No members found with matching schemeId' });
      }
  
      // Collect matching members from all schemes
      const matchingMembers = [];
      schemes.forEach(scheme => {
        const members = scheme.members.filter(member =>
          member.schemeId.toLowerCase().includes(schemeId.toLowerCase())
        );
        matchingMembers.push(...members);
      });
  
      res.json({
        data: matchingMembers,
        message: 'Matching members retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



// Controller function to get auction details for a specific groupId
exports.getAuctionDetails = async (req, res) => {
    try {
        const { groupId } = req.params; // Get the groupId from request params

        // Find the group by ID
        const group = await Scheme1.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Extract auction details from the group
        const auctionDetails = group.auctionDetails[0]; // Assuming you want the first set of auction details

        if (!auctionDetails) {
            return res.status(404).json({ message: 'No auction details found for this group' });
        }

        // Return the auction details
        res.status(200).json({
            message: 'Auction details retrieved successfully',
            data: {
                firstPrice: auctionDetails.firstPrice,
                secondPrice: auctionDetails.secondPrice,
                thirdPrice: auctionDetails.thirdPrice,
            },
        });
    } catch (error) {
        console.error('Error fetching auction details:', error.message);
        res.status(500).json({ message: 'Error fetching auction details', error: error.message });
    }
};

exports.getEmpData=async (req,res) => {
    try {
        const getEmployees=await employeeData.aggregate([
            { $project: { _id: 0, fullname: 1, user_id: 1 } }
          ])
        res.status(200).json({message:'emp data fetched sucessfully',getEmployees})
    } catch (error) {
        res.status(400).json({message:"error fetching emp data",error})
    }
}





exports.getGroupMembersBySchemeId = async (req, res) => {
    try {
        const schemeId = req.params.schemeId || req.query.schemeId;

        if (!schemeId) {
            return res.status(400).json({ message: 'Scheme ID is required' });
        }

        // Find the group that contains a member with the specified schemeId
        const group = await Scheme1.findOne({
            'members.schemeId': schemeId
        });

        if (!group) {
            return res.status(404).json({ message: 'No group found with the specified schemeId' });
        }

        // Extract relevant group information
        const groupInfo = {
            groupName: group.groupName,
            groupNumber: group.groupNumber,
            duration: group.duration,
            price: group.price,
            EMI: group.EMI,
            numberOfMembers: group.numberOfMembers,
            numberOfAuctions: group.numberOfAuctions,
        };

        // Get all members of the group
        const members = group.members;

        // Format the response
        const responseData = {
            message: 'Group members retrieved successfully',
            groupInfo,
            members
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching group members:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



