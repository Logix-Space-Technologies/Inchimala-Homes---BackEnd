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



module.exports = router;
