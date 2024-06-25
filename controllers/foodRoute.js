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
    foodModel.deletefood(req.body.bookingid, (error, results) => {
        if (error) {
            res.status(500).send('Error deleting food items' + error)
            return
        }
        res.status(201).send(`food deleted with ID : ${results.insertId}`)
    })

});








//BOOKING FOOD BY USER

router.post('/bookfood', async (req, res) => {
    console.log("Request body:", req.body); // Log the request body for debugging

    const token = req.headers["token"];
    jwt.verify(token, "inchimalaUserLogin", async (error, decoded) => {
        if (decoded && decoded.email) {
            try {
                const { userid, foodItems } = req.body; // Expecting an array of { bookingid, quantity }

                if (!userid || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
                    return res.status(400).json({ error: 'Please provide user ID and an array of food items with quantities' });
                }

                // Retrieve user details
                const user = await new Promise((resolve, reject) => {
                    foodModel.getUserDetails(userid, (error, user) => {
                        if (error) {
                            reject(new Error('Error retrieving user details: ' + error.message));
                        } else if (!user) {
                            reject(new Error('No such user exists with ID: ' + userid));
                        } else {
                            resolve(user);
                        }
                    });
                });

                let totalPrice = 0;
                const foodDetailsArray = [];

                // Retrieve food details and calculate total price
                for (const item of foodItems) {
                    const foodDetails = await new Promise((resolve, reject) => {
                        foodModel.getFoodDetails(item.bookingid, (error, foodDetails) => {
                            if (error) {
                                reject(error);
                            } else if (!foodDetails) {
                                reject(new Error('Food not found: ' + item.bookingid));
                            } else {
                                resolve(foodDetails);
                            }
                        });
                    });
                    const priceForItem = item.quantity * foodDetails.price;
                    totalPrice += priceForItem;
                    foodDetailsArray.push({ foodDetails, quantity: item.quantity, price: foodDetails.price });
                }

                // Generate unique booking ID
                const generateBookingId = () => {
                    const randomNumber = Math.floor(Math.random() * 1000000); // Adjust range as needed
                    return `IHLFB-${randomNumber.toString().padStart(6, '0')}`; // Ensure it has 6 digits
                };

                const bookingId = generateBookingId();

                // Prepare booking data
                const bookingData = {
                    userid,
                    bookingid: bookingId, // Include booking ID
                    totalprice: totalPrice,
                    status: 0 // order placed: 0, order accepted: 1, etc.
                };

                // Insert booking record
                await new Promise((resolve, reject) => {
                    foodModel.bookFood(bookingData, (error) => {
                        if (error) {
                            console.error('Error booking food:', error);
                            reject(new Error('Error booking food: ' + error));
                        } else {
                            resolve();
                        }
                    });
                });

                // Prepare booking details data with bookingId
                const bookingDetailsData = foodDetailsArray.map(item => ({
                    userid,
                    bookingid: bookingId, // Include booking ID
                    bookingid: item.foodDetails.bookingid,
                    quantity: item.quantity,
                    priceforsingleitem: item.price
                }));

                // Insert booking details
                await new Promise((resolve, reject) => {
                    foodModel.addBookingDetails(bookingDetailsData, (error) => {
                        if (error) {
                            console.error('Error adding booking details:', error);
                            reject(new Error('Error adding booking details: ' + error));
                        } else {
                            resolve();
                        }
                    });
                });

                const responseData = {
                    userid,
                    bookingid: bookingId,
                    totalprice: totalPrice,
                    items: foodDetailsArray.map(item => ({
                        bookingid: item.foodDetails.bookingid,
                        foodname: item.foodDetails.name,
                        quantity: item.quantity,
                        totalprice: item.quantity * item.foodDetails.price
                    })),
                    status: 0
                };

                res.status(201).json({ status: 'success', bookingDetails: responseData });

            } catch (err) {
                console.error('Error:', err.message);
                res.status(500).json({ error: err.message });
            }
        } else {
            res.status(401).json({ status: "unauthorized user" });
        }
    });
});




module.exports = router

router.get('/viewFoodBooking', (req, res) => {
    foodModel.viewFoodBooking((error, results) => {
        res.json(results)
        console.log(results)
    })
});


// Reject Food Booking
router.post('/rejectFoodBooking', (req, res) => {
    const token = req.headers["token"];

    // Verify the JWT token
    jwt.verify(token, "inchimalaCaretakerLogin", (error, decoded) => {
        if (error) {
            return res.status(401).json({ status: "Unauthorized user" });
        }

        // Ensure the token contains the required caretaker ID
        if (decoded && decoded.email) {
            const email = decoded.email;
            const { caretakerid,bookingid } = req.body;

            // Validate the presence of booking ID and caretaker ID
            if (!bookingid) {
                return res.status(400).send('Booking ID is required');
            }

            // Update the booking status using the booking ID and caretaker ID
            foodModel.rejectFoodBooking(caretakerid, bookingid, (error, results) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ status: 'Error updating food booking data' });
                }

                // Check the number of affected rows to determine success
                if (results.affectedRows > 0) {

                    return res.json({ status: `Food booking rejected with ID: ${bookingid}` });
                } else {
                    return res.json({ status: `Booking not found with ID: ${bookingid}` });
                }
            });
        } else {
            return res.status(401).json({ status: "Unauthorized user" });
        }
    });
});





//to view food details

router.post('/viewfood', (req, res) => {
    foodModel.viewFood((error, results) => {

        res.json(results)
        console.log(results)
    })
});


// Accept Food Booking
router.post('/acceptFoodBooking', (req, res) => {
    const token = req.headers["token"];

    // Verify the JWT token
    jwt.verify(token, "inchimalaCaretakerLogin", (error, decoded) => {
        if (error) {
            return res.status(401).json({ status: "Unauthorized user" });
        }

        // Ensure the token contains the required caretaker ID
        if (decoded && decoded.email) {
            const email = decoded.email;
            const { caretakerid,bookingid } = req.body;

            // Validate the presence of booking ID and caretaker ID
            if (!bookingid) {
                return res.status(400).send('Booking ID is required');
            }

            // Update the booking status using the booking ID and caretaker ID
            foodModel.acceptFoodBooking(caretakerid, bookingid, (error, results) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ status: 'Error updating food booking data' });
                }

                // Check the number of affected rows to determine success
                if (results.affectedRows > 0) {

                    return res.json({ status: `Food booking accepted with ID: ${bookingid}` });
                } else {
                    return res.json({ status: `Booking not found with ID: ${bookingid}` });
                }
            });
        } else {
            return res.status(401).json({ status: "Unauthorized user" });
        }
    });
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

router.post('/viewCurrentFoodOrders', (req, res) => {
    foodModel.viewCurrentFoodOrders((error, results) => {
        if (error) {
            res.status(500).send('Error retrieving current food orders');
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/updatefood', upload.single('photo'), async (req, res) => {
    const bookingid = req.body.bookingid;
    const newData = req.body;

    if (!bookingid) {
        return res.status(400).send('Food ID is missing');
    }

    if (req.file) {
        newData.photo = req.file.filename; // Save the filename in the food data
    }

    foodModel.updateFood(bookingid, newData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating food: ' + error);
            return;
        }

        res.status(200).send(`Food with ID ${bookingid} updated successfully`);
    });
});

module.exports = router

