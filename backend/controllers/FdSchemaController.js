const fdSchemedata = require("../models/fdschememodel");

const FDSchemeController = {
     create: async (req, res) => { 
        //key  aanu create:value aanu appurathe 
      try {
        const newfdSchemedata = new fdSchemedata({
            ...req.body,
          });
           const result= await newfdSchemedata.save();
           console.log(result)
          res.status(200).json({ message: 'FD  schema details uploaded successfully' });
        
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  };
  
  module.exports = FDSchemeController;