const express=require("express")
const caretakerModel=require("../models/caretakerModel")

const router=express.Router()

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
        return res.json({status:"success",caretakerData:caretaker});
    });
});


module.exports=router