const Membership = require("../models/model");
const CounterModel = require("../models/counterSchema");

const incrementLastFiveDigits = (membershipId) => {
  return membershipId.replace(/\d{5}$/, match => {
    const incremented = parseInt(match) + 1;
    return incremented.toString().padStart(5, '0');
  });
};

exports.create= async (req, res) => {
  try {

 // Check if the customerMobile already exists
 const existingMembership = await Membership.findOne({ customerMobile: req.body.customerMobile });
 if (existingMembership) {
   return res.status(400).json({ error: 'Same mobile number already exists' });
 }

    const counter = await CounterModel.findOneAndUpdate(
      { _id: "autoval" },
      { '$inc': { 'seq': 1 }},
      { new: true, upsert: true }
    );

    const membershipType = req.body.membershipType || "I";
    const branchCode = req.body.membershipId.slice(5, 8);
    const lastMembership = await Membership.findOne({ membershipId: { $regex: `^MSCS${membershipType}${branchCode}` } }).sort({ membershipId: -1 }).limit(1);

    let newMembershipId;
    if (lastMembership) {
      newMembershipId = incrementLastFiveDigits(lastMembership.membershipId);
    } else {
      newMembershipId = `MSCS${membershipType}${branchCode}00001`;
    }

    const newMembership = new Membership({
      ...req.body,
      membershipId: newMembershipId,
      sl_no: counter.seq
    });

    await newMembership.save();
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAll= async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const searchTerm = req.query.searchTerm;
    const searchReceipt = req.query.searchReceipt;
    const selectedNumber = req.query.selectedNumber;
    const date = req.query.date;

    let query = {};
    if (branchCode) {
      query.membershipId = { $regex: new RegExp(`^.{5}${branchCode}`) };
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { customerName: searchRegex },
        { membershipId: searchRegex },
        { customerMobile: searchRegex }
      ];
    }

    if (searchReceipt) {
      const searchReceiptRegex = new RegExp(searchReceipt, 'i');
      query.$or = [
        { customerName: searchReceiptRegex },
        { customerMobile: searchReceiptRegex }
      ];
    }
    if (selectedNumber) {
      const selectedNumberRegex = new RegExp(selectedNumber, 'i');
      query.$or = [
        { customerMobile: selectedNumberRegex }
      ];
    }
    if (date) {
      const searchRDSRegex = new RegExp(date, 'i');
      query.$or = [
        { date: searchRDSRegex }
      ];
    }

    const total = await Membership.countDocuments(query);
    const data = await Membership.find(query)
      .sort({ membershipId: 1 })
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
};

// Route to update a membership by ID
// exports.updateAll= async (req, res) => {
//   try {
    
// // Check if the customerMobile already exists
// const existingMembership = await Membership.findOne({ customerMobile: req.body.customerMobile });
// if (existingMembership) {
//   return res.status(400).json({ error: 'Same mobile number already exists' });
// }

//       const membershipId = req.params.id;
//       const updatedMembershipData = req.body; // New data from the request body

//       // Update the membership in the database
//       const updatedMembership = await Membership.findByIdAndUpdate(
//           membershipId,
//           updatedMembershipData,
//           { new: true } // Return the updated document
//       );

//       res.json(updatedMembership);
//   } catch (error) {
//       console.error('Error updating membership:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// };



exports.updateAll = async (req, res) => {
  try {
      const membershipId = req.params.id;
      const updatedMembershipData = req.body;
      const { customerMobile } = updatedMembershipData;

      if (customerMobile) {
          // Check if any other document has the same mobile number
          const existingMembership = await Membership.findOne({
              customerMobile,
              _id: { $ne: membershipId } // Exclude current document
          });

          if (existingMembership) {
              return res.status(400).json({
                  message: 'Customer mobile number already exists for another membership',
                  existingMembershipId: existingMembership._id
              });
          }
      }

      // If no duplicate found, proceed with update
      const updatedMembership = await Membership.findByIdAndUpdate(
          membershipId,
          updatedMembershipData,
          { new: true }
      );

      if (!updatedMembership) {
          return res.status(404).json({
              message: 'Membership not found'
          });
      }

      res.json(updatedMembership);
  } catch (error) {
      console.error('Error updating membership:', error);
      res.status(500).json({
          message: 'Internal server error',
          error: error.message
      });
  }
};