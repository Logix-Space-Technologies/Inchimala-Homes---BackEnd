const mysql = require("mysql")
require("dotenv").config()

//MySQL connection

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})

const caretakerModel={
    insertCaretaker:(caretakerData,callback)=>{
        const query='INSERT INTO caretaker SET ?';
        pool.query(query,caretakerData,callback)
    }
    
}

module.exports=caretakerModel