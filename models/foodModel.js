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

const foodModel = {


    insertfood: (name, type, description, price, addedBy, foodData, callback) => {
        const query = 'INSERT INTO food (name, type, description, price, addedBy, photo) VALUES (?,?,?,?,?,?)';

        pool.query(query, [name, type, description, price, addedBy, foodData], callback);

    },


    searchFoodByType: (type, callback) => {
        const query = 'SELECT * FROM food WHERE type = ?';
        pool.query(query, [type], callback);
    },



    deletefood: (foodid, callback) => {

        const query = 'UPDATE food SET deleteFlag = 1 WHERE foodid = ?';
        pool.query(query, foodid, callback)
    },

    updateFood: (foodid, newData, callback) => {
        const query = 'UPDATE food SET ? WHERE foodid = ?';
        pool.query(query, [newData, foodid], callback);
    },



    //food booking by user

    getFoodDetails: (foodid, callback) => {
        const query = 'SELECT * FROM food WHERE foodid = ?';
        pool.query(query, [foodid], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    },

    getUserDetails: (userid, callback) => {
        const query = 'SELECT * FROM user WHERE userid = ?';
        pool.query(query, [userid], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    },

    bookFood: (bookingData, callback) => {
        const query = 'INSERT INTO foodBooking SET ?';
        pool.query(query, bookingData, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results.insertId); // Ensure to return the insertId
        });
    },
    
    addBookingDetails: (details, callback) => {
        const query = 'INSERT INTO foodBookingDetails (userid, bookingid, foodid, quantity, priceforsingleitem) VALUES ?';
        pool.query(query, [details.map(item => [item.userid, item.bookingid, item.foodid, item.quantity, item.priceforsingleitem])], callback);
    },
    



    viewFood: (callback) => {
        const query = 'SELECT * FROM food WHERE deleteFlag != 1';
        pool.query(query, callback);
    },


    viewFoodBooking: (callback) => {
        const query = 'SELECT * FROM foodbooking';
        pool.query(query, callback);
    },

    rejectFoodBooking: (foodid, callback) => {
        const query = 'UPDATE foodbooking set status="2" WHERE foodid=?';  // rejected-status(2)
        pool.query(query, [foodid], callback)
    },

    acceptFoodBooking: (foodid, callback) => {
        const query = 'UPDATE foodbooking set status="1" WHERE foodid=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query, [foodid], callback)
    },

    updateFoodBookingStatus: (id, newStatus, callback) => {
        const query = 'UPDATE foodbooking SET status = ? WHERE id = ?'; // food preperation ongoing(3), food preperation completed(4), food delivered(5)
        pool.query(query, [newStatus, id], callback);
    },

    viewCurrentFoodOrders: (callback) => {
        const query = 'SELECT * FROM foodbooking WHERE status IN (?, ?)';
        pool.query(query, [1, 3], callback); // 1 for accepted, 3 for ongoing
    }


}
module.exports = foodModel



