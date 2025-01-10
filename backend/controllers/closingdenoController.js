// controllers/closingDenominationController.js
const ClosingDenomination = require("../models/closingDenomination");

exports.createClosingDenomination = async (req, res) => {
  try {
    const {
      netCash,
      closingBalance,
      shortage,
      excess,
      date,
      branchCode,
      total500,
      total200,
      total100,
      total50,
      total20,
      total10,
      coinsAmount,
      stampsAmount,
    } = req.body;


     // Check if there is already an entry for the same branch and date
     const existingEntry = await ClosingDenomination.findOne({ date, branchCode });

     // If an entry already exists, respond with an error
     if (existingEntry) {
       return res.status(400).json({ error: 'Closing Denomination already exists for this branch on the selected date' });
     }
    const newClosingDenomination = new ClosingDenomination({
      netCash,
      closingBalance,
      shortage,
      excess,
      date,
      branchCode,
      total500,
      total200,
      total100,
      total50,
      total20,
      total10,
      coinsAmount,
      stampsAmount,
    });
    await newClosingDenomination.save();
    res
      .status(201)
      .json({ message: "Closing denomination saved successfully" });
  } catch (error) {
    console.error("Error saving closing denomination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getClosingDenominationByDateAndBranch = async (req, res) => {
    try {
      const { date, branchCode } = req.query;
  
      // Find the closing denomination entry for the specified date and branch code
      const closingDenomination = await ClosingDenomination.findOne({ date, branchCode });
  
      if (!closingDenomination) {
        // If no entry is found, respond with a 404 Not Found error
        return res.status(404).json({ error: 'Closing denomination not found for the specified date and branch code' });
      }
  
      // If an entry is found, respond with the closing denomination data
      res.status(200).json({ closingDenomination });
    } catch (error) {
      console.error('Error fetching closing denomination:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
