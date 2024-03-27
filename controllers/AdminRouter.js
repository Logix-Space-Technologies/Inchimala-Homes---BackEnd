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



module.exports = router