const mysql = require("mysql")
require("dotenv").config()
//MySQL connection

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:'',
    database:process.env.DB_NAME
})


const packageModel={
    insertPackage:(packageData,callback)=>{
        const query='INSERT INTO package SET ?';
        pool.query(query,packageData,callback)
    },
    deletePackage:(packageid,callback)=>{
        const query='DELETE FROM package WHERE packageid=?';
        pool.query(query,[packageid],callback)
    }
}

module.exports=packageModel