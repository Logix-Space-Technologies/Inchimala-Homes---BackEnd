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
    },

    updatePackage: (packageid, newData, callback) => {
        const query = 'UPDATE package SET ? WHERE packageid = ?';
        pool.query(query, [newData, packageid],callback) 
    },
    searchPackage: (name, callback) => {
        const query = 'SELECT * FROM package WHERE name = ?';
        pool.query(query, [name], callback);
    },
    viewPackage: (callback) => {
        const query = 'SELECT * FROM package';
        pool.query(query, callback);
    },
    viewavailablePackage: (packageIds, callback) => {
        // Dynamically generate placeholders for the package IDs
        const placeholders = packageIds.map(() => '?').join(',');
        const query = `SELECT * FROM package WHERE packageid NOT IN (${placeholders})`;
        pool.query(query, packageIds, callback);
        }
}



module.exports=packageModel