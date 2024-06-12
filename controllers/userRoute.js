const express = require("express")
const userModel = require("../models/user")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")

//route to user register

const hashPasswordGenerator = async (pass) => {
    console.log(pass)
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt)
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + '-' + file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed'));
        }
        cb(null, true);
    }
});




router.post('/signup', upload.single('file'), async (req, res, next) => {
    try {
        const { password } = req.body; // Destructure password directly from req.body
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { filename: imagePath } = req.file;

        const hashedPassword = await hashPasswordGenerator(password);
        console.log(hashedPassword)
        req.body.password = hashedPassword; // Update req.body directly

        userModel.insertuser(req.body.name, req.body.emailid, req.body.contactno, req.body.password, req.body.aadharNo, req.body.address, req.body.pincode, req.body.bookingtype, imagePath, (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ status: "success" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.post('/view', (req, res) => {
    userModel.viewusers((error, results) => {
        res.json(results)
        console.log(results)
    })
});




router.post('/userlogin', (req, res) => {
    const { emailid, password } = req.body;

    userModel.loginUser(emailid, (error, user) => {
        if (error) {
            return res.json({ status: "Error" });
        }
        if (!user) {
            return res.json({ status: "Invalid Email ID" });
        }
        // Now user is found, let's compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.json({ status: "Error is" });
            }
            if (!isMatch) {
                return res.json({ status: "Invalid Password" });
            }

            jwt.sign({ email: emailid }, "inchimalaUserLogin", { expiresIn: "1d" }, (error, token) => {
                if (error) {

                    res.json(
                        {
                            status: "error",
                            "error": error
                        })
                } else {
                    userModel.logUserAction(user.userid, 'User Logged in')
                    // Successful login
                    return res.json({
                        status: "Success",
                        userData: user,
                        "token": token
                    });

                }
            })

        });
    });
});

//router for search user

router.post('/searchuser', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Please enter the user name' });
    }

    userModel.searchUser(name, (error, results) => {
        if (error) {
            return res.status(500).send('Error searching user: ' + error);
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'No such user' });
        }
        res.status(200).send(results);
    });
});

router.post('/userprofile', (req, res) => {
    const token = req.headers["token"]
    jwt.verify(token, "inchimalaUserLogin", async (error, decoded) => {

        if (decoded && decoded.email) {

            try {

                userModel.userprofile(req.body.userid, (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: 'Error viewing profile: ' + error.message })
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ status: 'No such user' })
                    }
                    userModel.logUserAction(req.body.userid, 'User viewed profile ')
                    res.status(200).send(results);
                });
            } catch (err) {
                res.status(500).json({ error: err.message })
            }

        }
        else {
            res.json(
                { status: "unauthorized user" }
            )
        }
    })
});

module.exports = router

