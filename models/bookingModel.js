const mysql = require("mysql")
require("dotenv").config()
//MySQL connection

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:'',
    database:process.env.DB_NAME
})


const bookingModel={

    rejectBooking:(bookingid,callback)=>{
        const query='UPDATE booking set status="2" WHERE bookingid=?';  //pending-status(0) , accepted-status(1) , rejected-status(2)
        pool.query(query,[bookingid],callback)
    },
   
}


module.exports=bookingModel