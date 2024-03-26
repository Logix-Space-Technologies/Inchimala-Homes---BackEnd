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
        // Your student table needs to have an 'email' and 'password' column
        const query = 'SELECT * FROM user WHERE emailid = ? LIMIT 1'; // Assuming your table is named 'student'
        pool.query(query, [emailid], (error, results) => {
          if (error) {
            return callback(error, null);
          }
          // If no student found, results array will be empty
          if (results.length === 0) {
            return callback(null, null);
          }
          // Return the first student found (there should only be one due to the 'LIMIT 1' in the query)
          return callback(null, results[0]);
        });
    },
}


module.exports=userModel