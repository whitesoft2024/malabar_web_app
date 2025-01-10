const EmployeeSchemedata = require("../models/CreateSchemedata.js");
const CounterModel =  require("../models/counterSchema");

const EmployeeSchemeController = {
     create: async (req, res) => { 
        //key  aanu create:value aanu appurathe 
      try {

        const counter = await CounterModel.findOneAndUpdate(
          { _id: "valemp" },
          { '$inc': { 'seq': 1 }},
          { new: true, upsert: true }
        );

        const newCreateSchemedata = new EmployeeSchemedata({
            ...req.body,
            si_no: counter.seq ,
          });
           const result= await newCreateSchemedata.save();
           console.log(result)
          res.status(200).json({ message: 'Employee details uploaded successfully' });
        
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  };
  
  module.exports = EmployeeSchemeController;

  