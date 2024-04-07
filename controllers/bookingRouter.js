const express=require("express")
const bookingModel=require("../models/bookingModel")
const packageModel=require("../models/packageModel")
const router=express.Router()
const jwt = require("jsonwebtoken")


//Accept Booking
router.post('/acceptBooking', (req, res) => {
    var bookingid =req.body.bookingid

    bookingModel.acceptBooking(bookingid,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving  data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`Booking accepted with ID : ${bookingid}`);
        }
       
    });
});

//to view Room Bookings

router.get('/viewRoomBooking', (req, res) => {
    bookingModel.viewRoomBooking((error, results) => {
        res.json(results)
        console.log(results)
    })
});



//Reject Booking
router.post('/rejectBooking', (req, res) => {
    var bookingid =req.body.bookingid

    bookingModel.rejectBooking(bookingid,(error,results)=>{
        if(error){
            res.status(500).send('Error retrieving  data');
            return;
        }
        if(results.length > 0){
            res.status(200).json(results[0]);
        }
        else{
            res.status(404).send(`Booking rejected with ID : ${bookingid}`);
        }
       
    });
});


//To View Accepeted Room Bookings

router.get('/viewAcceptedBooking', (req, res) => {
    bookingModel.viewAcceptedBooking((error, results) => {
        if (error) {
            res.status(500).send('Error retrieving data');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {

            res.status(404).send('No accepted bookings found');
        }
    });
});


  
  
router.post('/datecheck', (req, res) => {
    const { checkin, checkout } = req.body;

    bookingModel.datecheck(checkin, checkout, (error, result1) => {
        if (error) {
            console.error("Error retrieving data:", error);
            res.json({ status: 'Error retrieving data' });
        } else {
            let excludedPackageIds = [];
            if (result1.length > 0) {
                // Extract package IDs from all conflicting bookings
                excludedPackageIds = result1.map(booking => booking.packageid);
                console.log(result1)
            }

            // If there are conflicting bookings, exclude them from available packages
            if (excludedPackageIds.length > 0) {
                packageModel.viewavailablePackage(excludedPackageIds, (error, result) => {
                    if (error) {
                        console.error("Error retrieving data:", error);
                        res.json({ status: 'Error retrieving data' });
                    } else {
                        res.status(200).json(result);
                      
                    }
                });
            } else {
                // If there are no conflicting bookings, return all packages
                packageModel.viewPackage((error, result) => {
                    if (error) {
                        console.error("Error retrieving data:", error);
                        res.json({ status: 'Error retrieving data' });
                    } else {
                        res.status(200).json(result);
                    }
                });
            }
    }
});
});

router.post('/roombooking',(req,res)=>{

    const token = req.headers["token"]
    jwt.verify(token,"inchimalaUserLogin",async(error,decoded)=>{

        if (decoded && decoded.email) {
            
            bookingModel.RoomBooking(req.body,(error,results)=>{
                if (error) {
                    res.status(500).send('Booking unsuccessfull'+error)
                    return
                }
                res.status(200).send(`Booking successfull : ${results.insertId}`)
            })

        } else {
            
            res.json(
                {status : "unauthorized user"}
            )

        }
    })

   

});




// View Rejected Booking

router.get('/viewRejectedBooking', (req, res) => {
    bookingModel.viewRejectedBooking((error, results) => {
        if (error) {
            res.status(500).send('Error retrieving data');
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {

            res.status(404).send('No rejected bookings found');
        }
    });
});







module.exports=router