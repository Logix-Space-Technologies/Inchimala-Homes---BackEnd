const express = require("express")
const foodModel = require("../models/foodModel")
const userModel = require("../models/user")
const multer = require("multer")
const router = express.Router()
const jwt = require("jsonwebtoken")




//router to search food


router.post('/searchfood', (req, res) => {
    const { type } = req.body; // Extract type from request body
    if (!type) {
        return res.status(400).json({ error: 'Please enter the type of food' });
    }

    foodModel.searchFoodByType(type, (error, results) => {
        if (error) {
            return res.status(500).send('Error searching for food: ' + error);
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'No such type of food' });
        }
        res.status(200).send(results);
    });
});

router.post('/deletefood', (req, res) => {
    foodModel.deletefood(req.body.foodid, (error, results) => {
        if (error) {
            res.status(500).send('Error deleting food items' + error)
            return
        }
        res.status(201).send(`food deleted with ID : ${results.insertId}`)
    })

});


router.post('/updatefood', (req, res) => {
    const { foodid, ...updatedFoodData } = req.body;

    foodModel.updateFood(foodid, updatedFoodData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating food: ' + error);
            return;
        }
        res.status(200).send(`Food with ID ${foodid} updated successfully`);
    });
});



//BOOKING FOOD BY USER

router.post('/bookfood', async (req, res) => {

    const token = req.headers["token"]
    jwt.verify(token, "inchimalaUserLogin", async (error, decoded) => {

        if (decoded && decoded.email) {

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

        }
        else {

            res.json(
                { status: "unauthorized user" }
            )

        }
    })

});


module.exports = router

router.get('/viewFoodBooking', (req, res) => {
    foodModel.viewFoodBooking((error, results) => {
        res.json(results)
        console.log(results)
    })
});

//Reject Food Booking
router.post('/rejectFoodBooking', (req, res) => {
    const token = req.headers["token"]
    jwt.verify(token, "inchimalaCaretakerLogin", async (error, decoded) => {
        if (decoded && decoded.email) {

            var foodid = req.body.foodid
            foodModel.rejectFoodBooking(foodid, (error, results) => {
                if (error) {
                    res.status(500).send('Error retrieving  data');
                    return;
                }
                if (results.length > 0) {
                    res.status(200).json(results[0]);
                }
                else {
                    res.status(404).send(`Booking rejected with ID : ${foodid}`);
                }
            });
        }
        else {
            
            res.json(
                {status : "unauthorized user"}
            )

        }
    })
});





    //to view food details

    router.get('/viewfood', (req, res) => {
        foodModel.viewFood((error, results) => {
            res.json(results)
            console.log(results)
        })
    });

    //Accept Food Booking
    router.post('/acceptFoodBooking', (req, res) => {

        const token = req.headers["token"]
        jwt.verify(token, "inchimalaCaretakerLogin", async (error, decoded) => {
            if (decoded && decoded.email) {

                var foodid = req.body.foodid
                foodModel.acceptFoodBooking(foodid, (error, results) => {
                    if (error) {
                        res.status(500).send('Error retrieving  data');
                        return;
                    }
                    if (results.length > 0) {
                        res.status(200).json(results[0]);
                    }
                    else {
                        res.status(404).send(`Booking accepted with ID : ${foodid}`);
                    }
                });
            }

            else {
                res.json(
                    { status: "unauthorized user" }
                )
            }
        })
    });

    //update food booking status

    router.post('/updateFoodBookingStatus', (req, res) => {
        const id = req.body.id;
        const newStatus = req.body.newStatus;
        // Validate the status
        if (![3, 4, 5].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid status provided' });
        }

        foodModel.updateFoodBookingStatus(id, newStatus, (error, results) => {
            if (error) {
                return res.status(500).send('Error updating food booking status: ' + error);
            }

            res.status(200).send(`Food booking status updated to ${newStatus} for ID: ${id}`);
        });
    });





    ////////////////////////////////////////////////



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


    //route to food add

    router.post('/addfood', upload.single('file'), (req, res, next) => {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { filename: imagePath } = req.file;

        foodModel.insertfood(req.body.name, req.body.type, req.body.description, req.body.price, req.body.addedBy, imagePath, (error, result) => {

            if (error) {
                console.error('Error inserting image path into foodModel:', error);
                res.status(500).json({ error: 'Error inserting image path into foodModel' });
            } else {
                console.log('Image path inserted into foodModel successfully:', result);
                res.status(200).json({ success: 'data inserted' });
            }
        });
    });
    // View Current food orders

router.get('/viewCurrentFoodOrders', (req, res) => {
    foodModel.viewCurrentFoodOrders((error, results) => {
        if (error) {
            res.status(500).send('Error retrieving current food orders');
            return;
        }
        res.status(200).json(results);
    });
});

    module.exports = router

