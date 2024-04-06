const express=require("express")
const caretakerModel=require("../models/caretakerModel")
const jwt = require("jsonwebtoken")
const router=express.Router()
const multer = require('multer');
const upload = multer();

//route to member register
router.post('/signup',(req,res)=>{
    caretakerModel.insertCaretaker(req.body,(error,results)=>{
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
        if(contactno !== caretaker.contactno)
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

router.post('/update', (req, res) => {
    const { caretakerId, ...updatedData } = req.body;
caretakerModel.updateCaretaker(caretakerId, updatedData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating caretaker data: ' + error);
            return;
        }
        res.status(200).send('Caretaker with ID ${caretakerId} updated successfully');
    });
});
module.exports=router