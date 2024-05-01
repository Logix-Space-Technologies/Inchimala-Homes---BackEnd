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

        insertCaretaker:(name,address,contactno,emailid,experience,photo,callback)=>{
                 const query='INSERT INTO caretaker (name,address,contactno,emailid,experience,photo) VALUES(?,?,?,?,?,?)';
                 pool.query(query,[name,address,contactno,emailid,experience,photo],callback)
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
            const query = 'UPDATE caretaker SET deleteFlag = 1 WHERE caretakerid = ?';
            pool.query(query,caretakerid,callback)
        },
        updateCaretaker: (caretakerId, updatedData, callback) => {
        const query = 'UPDATE caretaker SET ? WHERE caretakerid = ?';
        pool.query(query, [updatedData, caretakerId], callback);
        },
        getCaretakerById: (caretakerId, callback) => {
            const query = 'SELECT * FROM caretaker WHERE caretakerid = ? LIMIT 1';
            pool.query(query, [caretakerId], (error, results) => {
                if (error) {
                    return callback(error, null);
                }
                if (results.length === 0) {
                    return callback(null, null); 
                }
                return callback(null, results[0]); 
            });
        }
        
    }

    module.exports=caretakerModel

