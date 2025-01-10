// controllers/groupController.js
const Group = require('../models/GdcsGroupModel');
const membershipData = require('../models/model')


exports.createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({ success: true, data: group, message: ' group added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {

    // Extracting group name from URL params
    const groupName = req.params.groupName;

    // Extract group name from the request body
    //  const { groupName } = req.body;

    // Find the group by its name
    const group = await Group.findOne({ GroupName: groupName });
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Extracting member data from the request body
    const memberData = req.body;

    // Check if the number of members in the group has reached the limit
    if (group.members.length < group.numberofMember - 1) {
      return res.status(400).json({ success: false, error: 'Group member limit reached' });
    }


    // Check if the phoneNumber and customerName combination already exists in the members array
    const existingMember = group.members.find(
      (member) => member.phoneNumber === memberData.phoneNumber && member.customerName === memberData.customerName
    );

    if (existingMember) {
      return res.status(400).json({ success: false, error: 'Phone number and customer name combination already exists' });
    }

    // Pushing the new member to the group
    group.members.push(memberData);

    // Saving the updated group
    await group.save();

    // Sending the response
    res.status(200).json({ success: true, message: 'Members added to group successfully', data: updatedGroup });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
///add mem to group on base of id

exports.addMemberToGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Extracting member data from the request body
    const { members } = req.body;

    // Checking if member data is provided
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid member data' });
    }

    // Check if the number of members in the group has reached the limit
    if (group.members.length >= group.numberofMember - 1) {
      return res.status(400).json({ success: false, error: 'Group member limit reached' });
    }

    // Check if the phoneNumber and customerName combination already exists in the members array
    members.forEach((member) => {
      const existingMember = group.members.find(
        (m) => m.GDCSNumber === member.GDCSNumber
      );

      if (existingMember) {
        throw new Error(`GDCS Number ${member.GDCSNumber} already exists:  `);
      }
    });
    // Add each member to the group
    members.forEach(member => {
      group.members.push(member);
    });

    // Saving the updated group
    const updatedGroup = await group.save();

    // Sending the response
    res.status(200).json({ success: true, message: 'Members added to group successfully', data: updatedGroup });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};



exports.getAllBranchGroups = async (req, res) => {
  try {
    // Extract the branchCode from the request parameters
    const { branchCode } = req.query;

    console.log("first BCODE", branchCode)

    // Find all groups from the database
    const groups = await Group.find({});

    // Filter the groups based on the branchCode
    let filteredGroups = [];
    if (branchCode) {
      filteredGroups = groups.filter(group => group.branchCode === branchCode);
    }

    // Check if any groups were found with the specified branchCode
    if (filteredGroups.length > 0) {
      res.status(200).json({ success: true, data: filteredGroups });
    } else {
      res.status(404).json({ success: false, message: 'No groups found with the specified branchCode.' });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }
    // Extract only the members array from the group document
    const members = group.members;
    res.status(200).json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addEmiToMember = async (req, res) => {
  try {
    const { groupId, phoneNumber } = req.params;
    const { date, emiAmount, dividend, payableAmount } = req.body;

    // Find the group by its ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Find the member by phone number
    const memberIndex = group.members.findIndex(member => member.phoneNumber === phoneNumber);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }


    // Use the numberOfMembers property of the group to determine the maximum number of EMI entries
    const maxEmiEntries = group.numberofMember - 1;
    if (group.members[memberIndex].monthlyEmi.length >= maxEmiEntries) {
      return res.status(400).json({ success: false, error: 'Maximum number of EMI entries reached for this member' });
    }


    // Add the new EMI entry to the found member
    group.members[memberIndex].monthlyEmi.push({
      emiNumber: group.members[memberIndex].monthlyEmi.length + 1,
      date,
      emiAmount,
      dividend,
      payableAmount,
    });

    // Save the updated group document
    await group.save();

    res.status(200).json({ success: true, message: 'EMI entry added successfully', data: group.members[memberIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

//getting member details from member data using phone number
exports.fetchMemberDetails = async (req, res) => {
  const { phoneNumber } = req.query;
  console.log("reqqueryxxx", req.query);
  // Validate and sanitize input parameters
  if (!phoneNumber) {
    return res.status(400).send({ message: 'Invalid request:phoneNumber is required' });
  }

  try {
    const minPhoneNumberLength = phoneNumber.length;
    const members = await membershipData.find({
      customerMobile: { $regex: `^${phoneNumber}`, $options: 'i' }
    });

    console.log(`Found ${members.length} members`);
    if (members.length === 0) {
      console.log('No members found matching t phone number');
      return res.status(404).send({ message: 'No members found matching phone number' });
    }

    console.log('Sending response with members');
    res.send(members);
  } catch (error) {
    console.error(`Error fetching member details: ${error.message}`);
    res.status(500).send({ message: 'Error fetching member details', error: error.message });
  }
};

exports.addEmiToGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { gdcNumber, date, emiAmount, dividend, payableAmount } = req.body;

    console.log(`Received request to add EMI for groupId: ${groupId}, GDCSNumber: ${gdcNumber}`); // Debugging statement

    // Find the group by its ID
    const group = await Group.findById(groupId);
    if (!group) {
      console.log(`Group not found for groupId: ${groupId}`); // Debugging statement
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    console.log(`Found group with name: ${group.GroupName}`); // Debugging statement

    // Find the member by GDCSNumber
    const memberIndex = group.members.findIndex(member => member.GDCSNumber === gdcNumber);
    if (memberIndex === -1) {
      console.log(`Member not found for groupId: ${groupId}, GDCSNumber: ${gdcNumber}`); // Debugging statement
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    // Check if the GDCSNumber matches the one provided in the request body
    if (group.members[memberIndex].GDCSNumber !== gdcNumber) {
      console.log(`GDCSNumber mismatch for groupId: ${groupId}, GDCSNumber: ${gdcNumber}`); // Debugging statement
      return res.status(400).json({ success: false, error: 'GDCSNumber mismatch' });
    }

    // Use the numberOfMembers property of the group to determine the maximum number of EMI entries
    const maxEmiEntries = group.numberofMember - 1; // Ensure consistency in property naming
    if (group.members[memberIndex].monthlyEmi.length >= maxEmiEntries) {
      console.log(`Maximum number of EMI entries reached for this member`); // Debugging statement
      return res.status(400).json({ success: false, error: 'Maximum number of EMI entries reached for this member' });
    }

    // Add the new EMI entry to the found member
    group.members[memberIndex].monthlyEmi.push({
      emiNumber: group.members[memberIndex].monthlyEmi.length + 1,
      date,
      emiAmount,
      dividend,
      payableAmount,
    });

    console.log(`Added new EMI entry for groupId: ${groupId}, GDCSNumber: ${gdcNumber}`); // Debugging statement

    // Save the updated group document
    await group.save();

    res.status(200).json({ success: true, message: 'EMI entry added successfully', data: group.members[memberIndex] });
  } catch (err) {
    console.error('Error in addEmiToGroupMember:', err); // Log the error
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


exports.fetchGDCSGroup = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const date = req.query.date;

    // Initialize query object
    let query = {};

    // Add branchCode to the query if it exists
    if (branchCode) {
      query.branchCode = branchCode;
    }

    // Add date to the query if it exists
    if (date) {
      const searchExpenseRegex = new RegExp(date, 'i');
      query.$or = [
        { currentDate: searchExpenseRegex },
        { 'members.date': searchExpenseRegex },
        { 'members.monthlyEmi.date': searchExpenseRegex }
      ];
    }

    // Calculate pagination parameters
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents matching the query
    const total = await Group.countDocuments(query);

    // Fetch documents matching the query with pagination
    const newExpensedata = await Group.find(query).limit(limit).skip(startIndex);

    // Determine if there's a next page
    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    // Send response with matched data
    res.json({ data: newExpensedata, nextPage, total });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: error.message
    });
  }
}


exports.fetchGDCSMember = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const date = req.query.date;

    // Initialize query object
    let query = {};

    // Add branchCode to the query if it exists
    if (branchCode) {
      query.branchCode = branchCode;
    }

    // Add date to the query if it exists
    if (date) {
      const searchExpenseRegex = new RegExp(date, 'i');
      query.$or = [
        { currentDate: searchExpenseRegex },
        { 'members.date': searchExpenseRegex },
        { 'members.monthlyEmi.date': searchExpenseRegex }
      ];
    }

    // Calculate pagination parameters
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Count total documents matching the query
    const total = await Group.countDocuments(query);

    // Fetch documents matching the query with pagination
    const newExpensedata = await Group.find(query).limit(limit).skip(startIndex);

    // Determine if there's a next page
    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    // Send response with matched data
    res.json({ data: newExpensedata, nextPage, total });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again',
      error: error.message
    });
  }
}