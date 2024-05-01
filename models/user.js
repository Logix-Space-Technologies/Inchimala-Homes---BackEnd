const mysql = require("mysql")

//MySQL connection
const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:'',
  database:process.env.DB_NAME,
  port:process.env.DB_PORT
})



const userModel = {

    insertuser: (name,emailid,contactno,password,aadharNo,address,pincode,bookingtype,photo, callback) => {
      const query = 'INSERT INTO user (name,emailid,contactno,password,aadharNo,address,pincode,bookingtype,photo) VALUES(?,?,?,?,?,?,?,?,?)';
      pool.query(query, [name,emailid,contactno,password,aadharNo,address,pincode,bookingtype,photo], callback)
  },
    

    viewusers: (callback) => {
        const query = 'SELECT * FROM user';
        pool.query(query, callback);
    },
    loginUser: (emailid, callback) => {
        // Your user table needs to have an 'email' and 'password' column
        const query = 'SELECT * FROM user WHERE emailid = ? LIMIT 1'; // Assuming your table is named 'user'
        pool.query(query, [emailid], (error, results) => {
          if (error) {
            return callback(error, null);
          }
          // If no user found, results array will be empty
          if (results.length === 0) {
            return callback(null, null);
          }
          // Return the first user found (there should only be one due to the 'LIMIT 1' in the query)
          return callback(null, results[0]);
        });
    },



//BOOKING FOOD
    bookFood: (bookingData, callback) => {
      const query = 'INSERT INTO foodbooking SET ?';
      pool.query(query, bookingData, callback);
  },

  getUserDetails: (userid, callback) => {
    const query = 'SELECT * FROM user WHERE userid = ?';
    pool.query(query, [userid], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // No user found with the given ID
        }
        return callback(null, results[0]); // Return the first user found
    });
},

searchUser: (name, callback) => {
  const query = 'SELECT * FROM user WHERE name = ?';
  pool.query(query, [name], callback);
},


}


module.exports=userModel

