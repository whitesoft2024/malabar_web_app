const GdcsSchema=require('../models/gdcsSchemeModel')

const GdcsSchemeController={
    create:async(req,res)=>{
        console.log(req.body)
        try {
            const newGdcsSchema= new GdcsSchema({
                ...req.body
            })
            const result=await newGdcsSchema.save()
            res.status(200).json({message:"GDCS Scheme Data uploaded sucessfully"})
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
}

module.exports=GdcsSchemeController