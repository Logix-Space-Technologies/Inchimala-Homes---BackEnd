const mysql = require("mysql")
require("dotenv").config()
//MySQL connection

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})


const bookingModel = {

    acceptBooking: (bookingid, adminid, callback) => {
        const query = 'UPDATE booking SET status = "1", updatedby = ?, updatedDate = NOW() WHERE bookingid = ?';  //pending-status(0), accepted-status(1), rejected-status(2)
        pool.query(query, [adminid, bookingid], callback);
    },
    
    rejectBooking: (bookingid, adminid, callback) => {
        const query = 'UPDATE booking SET status = "1", deleteFlag = "1", updatedby = ?, updatedDate = NOW() WHERE bookingid = ?';  // pending-status(0), accepted-status(1), rejected-status(2)
        pool.query(query, [adminid, bookingid], callback);
    },
    
    viewRoomBooking: (callback) => {
        const query = `SELECT booking.bookingid, booking.userid, user.name AS username, user.photo, user.contactno,booking.packageid, package.name AS packageName, booking.checkin, booking.checkout, booking.rooms,booking.adult,booking.children,booking.status,booking.deleteFlag,booking.activeFlag, booking.addedDate, booking.updatedDate,booking.addedBy, booking.updatedBy FROM booking JOIN user ON booking.userid = user.userid JOIN package ON booking.packageid = package.packageid WHERE booking.status = 0`;
        pool.query(query, callback);
    },
    viewAcceptedBooking: (callback) => {
        const query = 'SELECT booking.*,user.name AS username,user.photo,user.contactno,package.name FROM booking INNER JOIN user ON booking.userid=user.userid INNER JOIN package ON booking.packageid=package.packageid WHERE booking.deleteFlag="0" ';
        pool.query(query, callback);
    },

    datecheck: (checkin, checkout, callback) => {
        const query = `
            SELECT b.packageid 
            FROM booking b
            INNER JOIN booking_dates_availability bda ON b.packageid = bda.packageid
            WHERE bda.date >= ? AND bda.date <= ?
              AND ((b.checkin >= ? AND b.checkin <= ?) OR (b.checkout >= ? AND b.checkout <= ?) OR (b.checkin <= ? AND b.checkout >= ?))
              AND b.status = "1"
        `;
        pool.query(query, [checkin, checkout, checkin, checkout, checkin, checkout, checkin, checkout], callback);
    },
    

    RoomBooking: (BookingData, callback) => {
        const query = 'INSERT INTO booking SET ?';
        pool.query(query, BookingData, callback)
    },

    viewRejectedBooking: (callback) => {
        const query = 'SELECT booking.*,user.name AS username,user.photo,user.contactno,package.name FROM booking INNER JOIN user ON booking.userid=user.userid INNER JOIN package ON booking.packageid=package.packageid WHERE booking.deleteFlag="1"'; // Filter by rejected bookings
        pool.query(query, callback);
    }


}


module.exports = bookingModel