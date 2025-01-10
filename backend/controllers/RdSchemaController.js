const rdschemedata =require('../models/rdschememodel')


const RDschemaController ={
    create:async(req,res)=>{
        try {
            console.log("Request received to create RD scheme");
            
            // Log the request body to ensure it includes finalAmount
            console.log("Request body:", req.body);
            const newRDschemeData =new rdschemedata({...req.body})
            const result=await newRDschemeData.save()
            res.status(200).json({ message: 'RD  schema details uploaded successfully',data:result });
            console.log(result)
        } catch (error) {
            res.status(500).json({ message: error.message });
 
        }
    }
}

module.exports=RDschemaController;