const mysql = require("mysql")
require("dotenv").config()

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:'',
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})
const eventModel = {

    insertEvent: (name,description,price,addedBy,photo,callback) => {
        const query = 'INSERT INTO activity (name,description,price,addedBy,photo) VALUES(?,?,?,?,?)';
        pool.query(query, [name,description,price,addedBy,photo], callback)
    },


    deleteEvent: (activityid, callback) => {
        
        const query = 'UPDATE activity SET deleteFlag = 1 WHERE activityid = ?';
        pool.query(query, [activityid], callback);
    },


    updateEvent: (activityId, eventData, callback) => {
        const query = 'UPDATE activity SET ? WHERE activityid = ?';
        pool.query(query, [eventData, activityId], callback);

    },
    searchActivity: (name, callback) => {
        const query = 'SELECT * FROM activity WHERE name = ?';
        pool.query(query, [name], callback);
    },
    viewEvent: (callback) => {
        const query = 'SELECT * FROM activity WHERE deleteFlag != 1';
        pool.query(query, callback);
    },

    viewActivityBooking: (callback) => {
        const query = 'SELECT * FROM activitybooking';
        pool.query(query, callback);
    },

    rejectActivityBooking:(id,callback)=>{
        const query='UPDATE activitybooking set deleteFlag="1" WHERE id=?';  //pending-status(0) , accepted-status(1) , rejected-status(1)
        pool.query(query,[id],callback)
    },

    rejectbookingactivity: (caretakerid,bookingid, callback) => {
        const query = 'UPDATE  activitybooking  SET  deleteFlag = "1", updatedby = ?, updatedDate = NOW() WHERE bookingid = ?';  // pending-status(0), accepted-status(1), rejected-status(2)
        pool.query(query, [caretakerid, bookingid], callback);
       
    },

    acceptActivityBooking:(id,callback)=>{
        const query='UPDATE activitybooking set status="1" WHERE id=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[id],callback)
    },

    acceptbookingactivity: (caretakerid,bookingid, callback) => {
        const query = 'UPDATE activitybooking SET status = "1", updatedby = ?, updatedDate = NOW() WHERE bookingid = ?';  //pending-status(0), accepted-status(1), rejected-status(2)
        pool.query(query, [caretakerid, bookingid], callback);
        
    },

    updateActivityBookingStatus: (id, newStatus, callback) => {
        const query = 'UPDATE activitybooking SET status=? WHERE id=?';//ongoing-status(3),completed-status(4)
        pool.query(query, [newStatus, id], callback);
    },
    viewCurrentActivities: (callback) => {
        const query = 'SELECT * FROM activitybooking WHERE status IN (?, ?)';
        pool.query(query, [1, 3], callback); // 1 for accepted, 3 for ongoing
    },
    viewuserActivities: (userid,callback) => {
        const query = 'SELECT activitybooking.*,activity.* FROM activitybooking INNER JOIN activity ON activitybooking.activityid=activity.activityid WHERE activitybooking.userid= ? AND activitybooking.status IN (?, ?)';
        pool.query(query, [userid,1, 3], callback); // 1 for accepted, 3 for ongoing
    },

    bookActivity: (bookingData, callback) => {
        const query = 'INSERT INTO activitybooking SET ?';
        pool.query(query, bookingData, callback);
    },

    getUserDetails: (userid, callback) => {
        const query = 'SELECT * FROM users WHERE userid = ?';
        pool.query(query, [userid], callback);
    },
    getEventDetails: (activityid, callback) => {
        const query = 'SELECT * FROM activity WHERE activityid = ? AND deleteFlag != 1';
        pool.query(query, [activityid], callback);
    },
    viewRejectedActivityBooking: (callback) => {
        const query = 'SELECT * FROM activitybooking WHERE status = 2'; // Assuming 2 is the status for rejected bookings
        pool.query(query, callback);
    },
    
    



}
module.exports = eventModel
