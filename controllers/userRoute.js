const express=require("express")
const userModel=require("../models/user")
const router=express.Router()
const bcrypt = require("bcryptjs")

//route to user register

const hashFunction = async (password) => {
    const Salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, Salt)
}
router.post('/signup',async(req,res)=>{
    let data = req.body
    let password = data.password
    let hashedpassword=await hashFunction(password)
    data.password = hashedpassword
    userModel.insertuser(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting new user'+error)
            return
        }
        res.status(201).send(`user added with ID : ${results.insertId}`)
    })

});

module.exports=router