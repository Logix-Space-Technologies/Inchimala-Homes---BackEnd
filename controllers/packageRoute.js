const express=require("express")
const packageModel=require("../models/packageModel")

const router=express.Router()

//route to member register
router.post('/addpackage',(req,res)=>{
    packageModel.insertPackage(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting package data'+error)
            return
        }
        res.status(201).send(`pacage added with ID : ${results.insertId}`)
    })

});

router.post("/updatepackage", async (req, res) => {
    let { packageid, ...rest } = req.body; 
    packageModel.updatePackage(packageid, rest, (error, results) => { 
        if (error) {
            res.status(500).send('Error updating package: ' + error); 
            return;
        }
        res.status(200).send('Package updated successfully');
    });
});

module.exports=router