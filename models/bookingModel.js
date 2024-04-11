const mysql = require("mysql")
require("dotenv").config()
//MySQL connection

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:'',
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})


const bookingModel={

    acceptBooking:(bookingid,callback)=>{
        const query='UPDATE booking set status="1" WHERE bookingid=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[bookingid],callback)
    },
    rejectBooking:(bookingid,callback)=>{
        const query='UPDATE booking set deleteFlag="1" WHERE bookingid=?';  //pending-status(0) , accepted-status() , rejected-status(1)
        pool.query(query,[bookingid],callback)
    },
    viewRoomBooking: (callback) => {
        const query = 'SELECT * FROM booking';
        pool.query(query, callback);
    },
    viewAcceptedBooking: (callback) => {
        const query = 'SELECT * FROM booking WHERE status="1" ';
      pool.query(query, callback);
    },

    datecheck: (checkin, checkout, callback) => {
        const query = 'SELECT packageid FROM booking WHERE ((checkin >= ? AND checkin <= ?) OR (checkout >= ? AND checkout <= ?) OR (checkin <= ? AND checkout >= ?)) AND status="1";';
        pool.query(query, [checkin, checkout, checkin, checkout, checkin, checkout], callback);
      },
    RoomBooking:(BookingData,callback)=>{
    const query='INSERT INTO booking SET ?';
    pool.query(query,BookingData,callback)
},

    viewRejectedBooking: (callback) => {
        const query = 'SELECT * FROM booking WHERE status="2"'; // Filter by rejected bookings
        pool.query(query, callback);
    }


}


module.exports=bookingModel