const express=require("express")
const packageModel=require("../models/packageModel")

const router=express.Router()

//route to add package
router.post('/addpackage',(req,res)=>{
    packageModel.insertPackage(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting package data'+error)
            return
        }
        res.status(201).send(`package added with ID : ${results.insertId}`)
    })

});


//delete package
router.post('/deletePackage', (req, res) => {
    var packageId =req.body.packageid

    packageModel.deletePackage(packageId,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving member data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`package deleted with ID : ${packageId}`);
        }
       
    });
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

//router for search package

router.post('/searchpackage', (req, res) => {
    const { name } = req.body; 
    if (!name) {
        return res.status(400).json({ error: 'Please enter the package name' });
    }

    packageModel.searchPackage(name, (error, results) => {
        if (error) {
            return res.status(500).send('Error searching package: ' + error);
        }

        if (results.length === 0) {
            return res.status(404).json({ status:  'No such package' });
            }
        res.status(200).send(results); 
    });
});



module.exports=router