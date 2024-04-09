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

const foodModel={
    // insertfood:(foodData,callback)=>{
    //     const query='INSERT INTO food SET ?';
    //     pool.query(query,foodData,callback)
    // },


    insertfood: (name,type,description,price,addedBy,foodData, callback) => {
        const query = 'INSERT INTO food (name, type, description, price, addedBy, photo) VALUES (?,?,?,?,?,?)'; // Inserting into multiple columns
      
        pool.query(query, [name,type,description,price,addedBy,foodData], callback);
    
      },


    searchFoodByType: (type, callback) => {
        const query = 'SELECT * FROM food WHERE type = ?';
        pool.query(query, [type], callback);
    },

    

    deletefood:(foodid,callback)=>{
        
        const query = 'UPDATE food SET delete_flag = 1 WHERE foodid = ?';
        pool.query(query,foodid,callback)
    },
    updateFood: (foodId, updatedFoodData, callback) => {
        const query = 'UPDATE food SET ? WHERE foodid = ?';
        pool.query(query, [updatedFoodData, foodId], callback);
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
            // Return the first food found
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
                return callback(null, null); // No user found with the given ID
            }
            return callback(null, results[0]); // Return the first user found
        });
      },
      
    bookFood: (bookingData, callback) => {
        const query = 'INSERT INTO foodbooking SET ?';
        pool.query(query, bookingData, callback);
    },
  
    

    viewFood: (callback) => {
        const query = 'SELECT * FROM food';
        pool.query(query, callback);
    },

    
    viewFoodBooking: (callback) => {
        const query = 'SELECT * FROM foodbooking';
        pool.query(query, callback);
    } ,

    rejectFoodBooking:(foodid,callback)=>{
        const query='UPDATE foodbooking set status="2" WHERE foodid=?';  // rejected-status(2)
        pool.query(query,[foodid],callback)
    },

    acceptFoodBooking:(foodid,callback)=>{
        const query='UPDATE foodbooking set status="1" WHERE foodid=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[foodid],callback)
    },

    updateFoodBookingStatus: (id, newStatus, callback) => {
        const query = 'UPDATE foodbooking SET status = ? WHERE id = ?'; // food preperation ongoing(3), food preperation completed(4), food delivered(5)
        pool.query(query, [newStatus,id], callback);
    }


}
module.exports=foodModel