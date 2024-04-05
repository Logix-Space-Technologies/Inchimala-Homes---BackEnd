const express=require("express")
const bookingModel=require("../models/bookingModel")

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