const express = require("express")

const adminModel = require("../models/adminModel")
const bcrypt = require("bcryptjs")
const router = express.Router()

const hashPasswordGenerator = async (pass) => {
    console.log(pass)
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt)
}
router.post('/adminregister', async (req, res) => {
    console.log("test")
    try {
        let { data } = { "data": req.body };
        let password = data.password;
        console.log(password)
        const hashedPassword = await hashPasswordGenerator(password);
        console.log(hashedPassword)
        data.password = hashedPassword;
        console.log(data)
        adminModel.insertAdmin(data, (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ status: "success", data: results });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
            // Successful login
            return res.json({
                status: "Success",
                adminData: admin
            });
        });
    });
});


module.exports = router