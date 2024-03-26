const express=require("express")
const foodModel=require("../models/foodModel")
const router=express.Router()


//route to food add
router.post('/addfood',(req,res)=>{
    foodModel.insertfood(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting new food items'+error)
            return
        }
        res.status(201).send(`food added with ID : ${results.insertId}`)
    })

});

module.exports=router