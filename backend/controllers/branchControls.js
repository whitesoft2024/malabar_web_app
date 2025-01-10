// controllers/branchController.js
const Branch = require("../models/branchCreate");

const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.s = { getBranches };
