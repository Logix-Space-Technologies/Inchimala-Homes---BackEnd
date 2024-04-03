const mysql = require("mysql")

require("dotenv").config()
//MySQL connection

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})

const foodModel={
    insertfood:(foodData,callback)=>{
        const query='INSERT INTO food SET ?';
        pool.query(query,foodData,callback)
    },


    searchFoodByType: (type, callback) => {
        const query = 'SELECT * FROM food WHERE type = ?';
        pool.query(query, [type], callback);
    },

    

    deletefood:(foodid,callback)=>{
        const query='DELETE FROM food WHERE foodid = ?';
        pool.query(query,foodid,callback)
    },
    updateFood: (foodId, updatedFoodData, callback) => {
        const query = 'UPDATE food SET ? WHERE foodid = ?';
        pool.query(query, [updatedFoodData, foodId], callback);
    }

    //food booking by user
    ,getFoodDetails: (foodid, callback) => {
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

    viewFood: (callback) => {
        const query = 'SELECT * FROM food';
        pool.query(query, callback);
    }







}
module.exports=foodModel