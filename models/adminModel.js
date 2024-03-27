const mysql=require("mysql")
//MySQL connection



const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})

const adminModel={
    insertAdmin: (adminData, callback)=>{
        const query='INSERT INTO admin SET ?';
        pool.query(query,adminData, callback);
    },
    loginAdmin: (emailid, callback) => {
        const query = 'SELECT * FROM admin WHERE emailid = ? LIMIT 1'; 
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


module.exports=adminModel;