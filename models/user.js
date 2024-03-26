const mysql = require("mysql")

//MySQL connection

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'inchimala_db'
})

const userModel={
    insertuser:(userData,callback)=>{
        const query='INSERT INTO user SET ?';
        pool.query(query,userData,callback)
    }
}

module.exports=userModel