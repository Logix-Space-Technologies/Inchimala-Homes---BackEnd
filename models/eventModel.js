const mysql = require("mysql")
require("dotenv").config()

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})
const eventModel = {

    insertEvent: (eventData, callback) => {
        console.log(eventData)
        const query = 'INSERT INTO activity SET ?';
        pool.query(query, eventData, callback)
    },


    deleteEvent: (activityid, callback) => {
        const query = 'DELETE FROM activity WHERE activityid = ?';
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
        const query = 'SELECT * FROM activity';
        pool.query(query, callback);
    },

    rejectActivityBooking:(id,callback)=>{
        const query='UPDATE activitybooking set status="2" WHERE id=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[id],callback)
    },



}
module.exports = eventModel
