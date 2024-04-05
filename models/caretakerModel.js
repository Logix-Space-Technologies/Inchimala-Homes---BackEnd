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

const caretakerModel={
    insertCaretaker:(caretakerData,callback)=>{
        const query='INSERT INTO caretaker SET ?';
        pool.query(query,caretakerData,callback)
    },
   
    loginCaretaker:(emailid, callback) => {
        const query = 'SELECT * FROM caretaker WHERE emailid = ? LIMIT 1';
        pool.query(query,[emailid],(error,results) => {
            if (error) {
                return callback(error, null);
              }
            if (results.length === 0) {
                return callback(null, null);
              }
              return callback(null, results[0]);
        });
    },
    deletecaretaker:(caretakerid,callback)=>{
        const query='DELETE FROM caretaker WHERE caretakerid = ?';
        pool.query(query,caretakerid,callback)
    },
    updateCaretaker: (caretakerId, updatedData, callback) => {
    const query = 'UPDATE caretaker SET ? WHERE caretakerid = ?';
    pool.query(query, [updatedData, caretakerId], callback);
    }
}

module.exports=caretakerModel

