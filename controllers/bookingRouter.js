const express=require("express")
const bookingModel=require("../models/bookingModel")
const packageModel=require("../models/packageModel")

const router=express.Router()



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

router.post('/datecheack', (req, res) => {
    const { checkin, checkout } = req.body;

    bookingModel.datecheack(checkin, checkout, (error, result1) => {
        if (error) {
            console.error("Error retrieving data:", error);
            res.json({ status: 'Error retrieving data' });
        } else {
            let excludedPackageIds = [];
            if (result1.length > 0) {
                // Extract package IDs from all conflicting bookings
                excludedPackageIds = result1.map(booking => booking.packageid);
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

  






module.exports=router