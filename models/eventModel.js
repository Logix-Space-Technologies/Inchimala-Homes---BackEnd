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

    acceptActivityBooking:(id,callback)=>{
        const query='UPDATE activitybooking set status="1" WHERE id=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[id],callback)
    },
    updateActivityBookingStatus: (id, newStatus, callback) => {
        const query = 'UPDATE activitybooking SET status=? WHERE id=?';//ongoing-status(3),completed-status(4)
        pool.query(query, [newStatus, id], callback);
    },
    


    //getActivityDetails

    
    getActivityDetails: (activityid, callback) => {
    const query = 'SELECT * FROM activity WHERE activityid = ?';
    pool.query(query, [activityid], (error, results) => {
        if (error) {
            return callback('Error retrieving activity details from the database: ' + error.message, null);
        }
        if (results.length === 0) {
            return callback('No activity found with the given ID', null);
        }
        // Return the first activity found
        return callback(null, results[0]);
    });
},

    
    bookactivity: (activitybookingData, callback) => {
        const query = 'INSERT INTO activitybooking SET ?';
        pool.query(query, activitybookingData, callback);
    },
  
    getUserDetails: (userid, callback) => {
      const query = 'SELECT * FROM user WHERE userid = ?';
      pool.query(query, [userid], (error, results) => {
          if (error) {
              return callback(error, null);
          }
          if (results.length === 0) {
              return callback(null, null); // No user found with the given ID
          }
          return callback(null, results[0]); // Return the first user found
      });
    },


}
module.exports = eventModel
