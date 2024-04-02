const express=require("express")
const bookingModel=require("../models/bookingModel")

const router=express.Router()



//Accept Booking
router.post('/acceptBooking', (req, res) => {
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






module.exports=router