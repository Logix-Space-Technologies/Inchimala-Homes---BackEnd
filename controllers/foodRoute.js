const express = require("express")
const foodModel = require("../models/foodModel")
const router = express.Router()


//route to food add
router.post('/addfood', (req, res) => {
    foodModel.insertfood(req.body, (error, results) => {
        if (error) {
            res.status(500).send('Error inserting new food items' + error)
            return
        }
        res.status(201).send(`food added with ID : ${results.insertId}`)
    })

});


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


module.exports = router