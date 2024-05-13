const express=require("express")
const packageModel=require("../models/packageModel")

const router=express.Router()
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '-' + file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed'));
        }
        cb(null, true);
    }
});



//route to add package
router.post('/addpackage',upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { filename: imagePath } = req.file;

    packageModel.insertPackage(req.body.name,req.body.description,req.body.price,imagePath,(error,results)=>{
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

//to view packages

router.post('/viewpackage', (req, res) => {
    packageModel.viewPackage((error, results) => {
        res.json(results)
        console.log(results)
    })
});



module.exports=router