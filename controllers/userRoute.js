const express = require("express")
const userModel = require("../models/user")
const foodModel=require("../models/foodModel")
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




//BOOKING FOOD

router.post('/bookfood', async (req, res) => {
    try {
        const { userid, foodid, quantity } = req.body;

        if (!userid || !foodid || !quantity) {
            return res.status(400).json({ error: 'Please provide user ID, food ID, and quantity' });
        }

        //retrive user details
        userModel.getUserDetails(userid, (error, user) => {
            if (error) {
                return res.status(500).json({ error: 'Error booking food: ' + error.message });
            }
            if (!user) {
                return res.status(404).json({ error: 'No such user exists with ID: ' + userid });
            }
        })

        // Retrieve food details
        foodModel.getFoodDetails(foodid, (error, foodDetails) => {
            if (error) {
                return res.status(500).json({ error: 'Error retrieving food details: ' + error });
            }

            if (!foodDetails) {
                return res.status(404).json({ error: 'Food not found' });
            }

            const totalPrice = quantity * foodDetails.price; // Calculate total price

            // Prepare booking data
            const bookingData = {
                userid,
                foodid,
                quantity,
                totalprice: totalPrice,
                status: 0 //order placed:0,order accepted:0,..
            };

            // Insert booking record
            userModel.bookFood(bookingData, (error) => {
                if (error) {
                    return res.status(500).json({ error: 'Error booking food: ' + error });
                }

                // Prepare response data
                const responseData = {
                    userid,
                    foodid,
                    foodname: foodDetails.name,
                    quantity,
                    totalprice: totalPrice,
                    status: 0
                };

                res.status(201).json({ status: 'success', bookingDetails: responseData });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports=router

