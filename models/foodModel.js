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
    }

    

    deletefood:(foodid,callback)=>{
        const query='DELETE FROM food WHERE foodid = ?';
        pool.query(query,foodid,callback)
    },
    updateFood: (foodId, updatedFoodData, callback) => {
        const query = 'UPDATE food SET ? WHERE foodid = ?';
        pool.query(query, [updatedFoodData, foodId], callback);
    }


}


module.exports=foodModel