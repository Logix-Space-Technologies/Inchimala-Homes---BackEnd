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

module.exports=router