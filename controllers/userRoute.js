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

router.post('/userlogin', (req, res) => {
    const { emailid,password } = req.body;

    userModel.loginUser(emailid, (error, user) => {
        if (error) {
            return res.json({status: "Error"});
        }
        if (!user) {
            return res.json({status: "Invalid Email ID"});
        }
        // Now student is found, let's compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.json({status: "Error is"});
            }
            if (!isMatch) {
                return res.json({status: "Invalid Password"});
            }
            // Successful login
            return res.json({
                status: "Success",
                studentData: user
            });
        });
    });
});

module.exports=router