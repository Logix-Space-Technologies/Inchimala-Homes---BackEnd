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

module.exports=router