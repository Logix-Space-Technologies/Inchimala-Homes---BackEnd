const express = require("express");
const eventModel = require("../models/eventModel");
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
    var activityid =req.body.activityid

    eventModel.rejectActivityBooking(activityid,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving  data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`Activity Booking rejected with ID : ${activityid}`);
        }
       
    });
});




module.exports = router;
