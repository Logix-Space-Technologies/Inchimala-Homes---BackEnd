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


const packageModel={

    insertPackage: (name,description,price,photo,callback) => {
            const query = 'INSERT INTO package (name,description,price,photo) VALUES(?,?,?,?)';
            pool.query(query, [name,description,price,photo], callback)
        },

    deletePackage:(packageid,callback)=>{
        
        const query = 'UPDATE package SET deleteFlag = 1 WHERE packageid = ?';
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
        },
    schedulePackage: (packageid, date, amount, callback) => {
        const query = 'INSERT INTO booking_dates_availability (packageid, date, amount) VALUES ((SELECT packageid FROM package WHERE packageid = ?), ?, ?)';
        pool.query(query, [packageid, date, amount], callback);
    },
    updateSchedule: (id, packageid, date, amount, callback) => {
        const query = `
            UPDATE booking_dates_availability SET packageid = (SELECT packageid FROM package WHERE packageid = ?), date = ?, amount = ? 
            WHERE id = ?
        `;
        pool.query(query, [packageid, date, amount, id], callback);
    },
}



module.exports=packageModel