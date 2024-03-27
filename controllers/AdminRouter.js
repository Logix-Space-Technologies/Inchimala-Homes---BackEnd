const express=require("express")
const adminModel=require("../models/adminModel")
const router=express.Router()
const bcrypt = require("bcryptjs")


//route to admin register
const hashFunction = async (password) => {
    const Salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, Salt)
    return hashedPassword
}

router.post('/adminreg',async(req,res)=>{
    let data = req.body
    let password = data.password
    let hashedpassword=await hashFunction(password)
    data.password = hashedpassword
    adminModel.insertadmin(req.body,(error,results)=>{
        if (error) {
            res.status(500).send('Error inserting new admin'+error)
            return
        }
        res.status(201).send(`admin added with ID : ${results.insertId}`)
    })

});


module.exports = router