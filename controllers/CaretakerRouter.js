const express=require("express")
const caretakerModel=require("../models/caretakerModel")
const jwt = require("jsonwebtoken")
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



router.post('/signup', upload.single('file'),(req,res, next)=>{
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { filename: imagePath } = req.file;

    caretakerModel.insertCaretaker(req.body.name,req.body.address,req.body.contactno,req.body.emailid,req.body.experience,imagePath,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting caretaker data'+error)
            return
        }
        res.status(201).send(`Member added with ID : ${results.insertId}`)
    })

});

router.post("/login",(req,res)=>{
    const { emailid,contactno } =req.body;
    caretakerModel.loginCaretaker(emailid,(error, caretaker) => {
        if(error)
        {
            return res.json({status:"Error"});
        }
        if(!caretaker)
        {
            return res.json({status:"Invalid Email ID"});
        }
        if(contactno != caretaker.contactno)
        {
            return res.json({status:"Invalid password"});
        }
        jwt.sign({email:emailid},"inchimalaCaretakerLogin",{expiresIn:"1d"},(error,caretakertoken)=>{
            if (error) {

                res.json(
                    {status : "error",
                    "error":error
                })
            }
            else{
                return res.json({
                    status:"success",
                    caretakerData:caretaker,
                    "token":caretakertoken
                });
            }
        });
    });
});

router.post('/deletecaretaker',(req,res)=>{
    caretakerModel.deletecaretaker(req.body.caretakerid,(error,results)=>{
        if (error) {
            res.status(500).send('Error deleting caretaker'+error)
            return
        }
        res.json({status:'caretaker deleted'})
    })

});


router.post('/updateCaretaker', upload.single('photo'), async (req, res) => {
    const caretakerId = req.body.caretakerid;
    const updatedData = req.body;

    if (req.file) {
        updatedData.photo = req.file.filename; // Save the filename in the event data
    }

    caretakerModel.updateCaretaker(caretakerId, updatedData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating caretaker data: ' + error);
            return;
        }

        res.status(200).send(`caretaker with ID ${caretakerId} updated successfully`);
    });
});

router.post('/viewcaretaker', (req, res) => {
    caretakerModel.getAllCaretakers((error, caretakers) => {
        if (error) {
            res.status(500).send('Error retrieving caretaker data: ' + error);
            return;
        }
        if (!caretakers || caretakers.length === 0) {
            res.status(404).send('No caretakers found');
            return;
        }
        res.status(200).json(caretakers);
    });
});

module.exports=router