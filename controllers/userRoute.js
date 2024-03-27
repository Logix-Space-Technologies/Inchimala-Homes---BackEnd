const express = require("express")
const userModel = require("../models/user")
const router = express.Router()
const bcrypt = require("bcryptjs")


//route to user register

const hashPasswordGenerator = async (pass) => {
    console.log(pass)
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt)
};

router.post('/signup', async (req, res) => {
    try {
        const { password } = req.body; // Destructure password directly from req.body
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        
        const hashedPassword = await hashPasswordGenerator(password);
        console.log(hashedPassword) 
        req.body.password = hashedPassword; // Update req.body directly
        
        userModel.insertuser(req.body, (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ status: "success" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/view', (req, res) => {
    userModel.viewusers((error, results) => {
        res.json(results)
        console.log(results)
    })
});


module.exports = router
=======
router.post('/userlogin', (req, res) => {
    const { emailid,password } = req.body;

    userModel.loginUser(emailid, (error, user) => {
        if (error) {
            return res.json({status: "Error"});
        }
        if (!user) {
            return res.json({status: "Invalid Email ID"});
        }
        // Now user is found, let's compare the password
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

