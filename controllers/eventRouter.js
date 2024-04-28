const express = require("express")
const eventModel = require("../models/eventModel")
const userModel=require("../models/user")
const router = express.Router();

router.post('/addevent', async (req, res) => {
    let data = req.body;
    console.log(data);
    eventModel.insertEvent(req.body, (error, results) => {
        if (error) {
            res.status(500).send('Error inserting caretaker data' + error);
            return;
        }
        res.status(201).send(`Event added with ID : ${results.insertId}`);
    });
});

router.post('/searchactivity', (req, res) => {
    const { name } = req.body; // Extract type from request body
    if (!name) {
        return res.status(400).json({ error: 'Please enter the activity name' });
    }

    eventModel.searchActivity(name, (error, results) => {
        if (error) {
            return res.status(500).send('Error searching for activity: ' + error);
        }

        if (results.length === 0) {
            return res.status(404).json({ status:  'No such ativity' });
            }
        res.status(200).send(results); 
    });
});


router.post('/updateevent', async (req, res) => {
    const activityId = req.body.activityid; // Extract activityid from the request body
    const eventData = req.body;

    eventModel.updateEvent(activityId, eventData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating event data: ' + error);
            return;
        }
        
        res.status(200).send(`Event with ID ${activityId} updated successfully`);
    });
});



//to delete event

router.post('/deleteEvent', (req, res) => {
    const { activityid } = req.body; // Extract activityid from the request body
   
    eventModel.deleteEvent(activityid, (error, results) => {
        if (!activityid) {
            return res.status(400).send('Activity ID is required');
        }
        if (error) {
            return res.status(500).send('Error deleting event: ' + error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('No event found with the given ID');
        }
        res.status(200).send(`Event deleted with ID: ${activityid}`);
    });
});

//to view events

router.get('/viewEvent', (req, res) => {
    eventModel.viewEvent((error, results) => {
        res.json(results)
        console.log(results)
    })
});

//Reject Activity Booking
router.post('/rejectActivityBooking', (req, res) => {
    var id =req.body.id

    eventModel.rejectActivityBooking(id,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving  data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`Activity Booking rejected with ID : ${id}`);
        }
       
    });
});

//Accept Activity Booking
router.post('/acceptActivityBooking', (req, res) => {
    var id =req.body.id

    eventModel.acceptActivityBooking(id,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving  data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`Activity Booking accepted with ID : ${id}`);
        }
       
    });
});


router.post('/updateActivityBookingStatus', (req, res) => {
    const id = req.body.id;
    const newStatus = req.body.newStatus;

    // Check if the new status is valid (3 or 4)
    if (![3, 4].includes(newStatus)) {
        res.status(400).send('Invalid new status');
        return;
    }

        // Update the activity booking status to the new status
        eventModel.updateActivityBookingStatus(id, newStatus, (error, results) => {
            if (error) {
                res.status(500).send('Error updating activity booking status');
                return;
            }
            res.status(200).send(`Activity booking status updated to ${newStatus} for ID: ${id}`);
        });
    });

    //activity booking
    router.post('/bookactivity', async (req, res) => {
        try {
            const { userid, activityid } = req.body;
    
            if (!userid || !activityid) {
                return res.status(400).json({ error: 'Please provide user ID and activity ID' });
            }
    
            // Retrieve user details
            userModel.getUserDetails(userid, (error, user) => {
                if (error) {
                    return res.status(500).json({ error: 'Error booking activity: ' + error.message });
                }
                if (!user) {
                    return res.status(404).json({ error: 'No such user exists with ID: ' + userid });
                }
    
                // Retrieve activity details
                eventModel.getActivityDetails(activityid, (error, activityDetails) => {
                    if (error) {
                        return res.status(500).json({ error: 'Error retrieving activity details: ' + error });
                    }
    
                    if (!activityDetails) {
                        return res.status(404).json({ error: 'Activity not found' });
                    }
    
                    // Prepare booking data
                    const activitybookingData = {
                        userid,
                        activityid,
                        status: 0 // Order placed: 0, order accepted: 1, ...
                    };
    
                    // Insert booking record
                    eventModel.bookactivity(activitybookingData, (error) => {
                        if (error) {
                            return res.status(500).json({ error: 'Error booking activity: ' + error });
                        }
    
                        // Prepare response data
                        const responseData = {
                            userid,
                            activityid,
                            activityname: activityDetails.name,
                            status: 0
                        };
    
                        res.status(201).json({ status: 'success', activityDetails: responseData });
                    });
                });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
        


module.exports = router