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
    },
    loginUser: (emailid, callback) => {
        
        const query = 'SELECT * FROM user WHERE emailid = ? LIMIT 1'; 
        pool.query(query, [emailid], (error, results) => {
          if (error) {
            return callback(error, null);
          }
          
          if (results.length === 0) {
            return callback(null, null);
          }
          
          return callback(null, results[0]);
        });
    },
}


module.exports=userModel