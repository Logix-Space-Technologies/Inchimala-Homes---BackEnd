const express=require("express")
const adminModel=require("../models/adminModel")
const router=express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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

router.post('/adminlogin', (req, res) => {
    const { emailid,password } = req.body;

    adminModel.loginAdmin(emailid, (error, admin) => {
        if (error) {
            return res.json({status: "Error"});
        }
        if (!admin) {
            return res.json({status: "Invalid Email ID"});
        }
        // Now user is found, let's compare the password
        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) {
                return res.json({status: "Error is"});
            }
            if (!isMatch) {
                return res.json({status: "Invalid Password"});
            }
            jwt.sign({email:emailid},"inchimalaAdminLogin",{expiresIn:"1d"},(error,admintoken)=>{
                if (error) {

                    res.json(
                        {status : "error",
                        "error":error
                    })
                }
                else{
                     // Successful login
            return res.json({
                status: "Success",
                "adminData": admin,
                "token":admintoken
            });
                } 
        })
    });
});
});


module.exports = router