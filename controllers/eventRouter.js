const express = require("express");
const eventModel = require("../models/eventModel");
const adminModel = require("../models/adminModel")
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer")


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

router.post('/addevent',  upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' }); 
    }
    const { filename: imagePath } = req.file;

    eventModel.insertEvent(req.body.name,req.body.description,req.body.price,req.body.addedBy,imagePath, (error, results) => {
        if (error) {
            res.status(500).send('Error inserting caretaker data' + error);
            return;
        }
        adminModel.logAdminAction(admin.adminid, 'Admin added activity')
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
            return res.status(404).json({ status: 'No such ativity' });
        }
        res.status(200).send(results);
    });
});


router.post('/updateEvent', upload.single('file'), async (req, res) => {
    const activityId = req.body.activityid;
    const eventData = req.body;
    console.log(activityId);
    console.log(eventData);

    if (req.file) {
        eventData.photo = req.file.filename;
        console.log(eventData);  // Save the filename in the event data
    }
    delete eventData.file;
    console.log(eventData);
    eventModel.updateEvent(activityId, eventData, (error, results) => {
        if (error) {
            res.status(500).send('Error updating event data: ' + error);
            return;
        }

        res.status(200).send('Event with ID ${activityId} updated successfully');
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
        adminModel.logAdminAction(admin.adminid, 'Admin deleted activity')
        res.status(200).send(`Event deleted with ID: ${activityid}`);
    });
});

//to view events

router.post('/viewEvent', (req, res) => {
    eventModel.viewEvent((error, results) => {
        res.json(results)
        console.log(results)
    })
});

//Reject Activity Booking
router.post('/rejectActivityBooking', (req, res) => {
    var id = req.body.id;
    const token = req.headers["token"];
    jwt.verify(token, "inchimalaCaretakerLogin", async (error, decoded) => {
        if (decoded && decoded.email) {
            eventModel.rejectActivityBooking(id, (error, results) => {
                if (error) {
                    res.status(500).send('Error retrieving data');
                    return;
                }
                if (results.length > 0) {
                    res.status(200).json(results[0]);
                } else {
                    res.status(404).send(`Activity Booking rejected with ID : ${id}`);
                }
            });
        } else {
            res.json({
                status: "unauthorized user"
            });
        }
    });
});


//Accept Activity Booking
router.post('/acceptActivityBooking', (req, res) => {
    var id = req.body.id
    const token = req.headers["token"]
    jwt.verify(token, "inchimalaCaretakerLogin", async (error, decoded) => {
        if (decoded && decoded.email) {
            eventModel.acceptActivityBooking(id, (error, results) => {
                if (error) {
                    res.status(500).send('Error retrieving  data');
                    return;
                }
                if (results.length > 0) {
                    res.status(200).json(results[0]);
                }
                else {
                    res.status(404).send(`Activity Booking accepted with ID : ${id}`);
                }

            });

        } else {
            res.json({
                status: "unauthorized user"
            });

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


// View Accepted and Ongoing Activities

router.get('/viewCurrentEvents', (req, res) => {
    eventModel.viewCurrentActivities((error, results) => {
        if (error) {
            res.status(500).send('Error retrieving accepted and ongoing activities');
            return;
        }
        res.status(200).json(results);
    });
});

router.post('/viewuseractivity', (req, res) => {
    eventModel.viewuserActivities(req.body.userid,(error, results) => {
        if (error) {
            res.json({status:'Error retrieving accepted and ongoing activities'});
            return;
        }
        res.status(200).json(results);
    });
});




module.exports = router;
