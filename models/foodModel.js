const mysql = require("mysql")

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
    }
}

module.exports=foodModel