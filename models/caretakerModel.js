const mysql = require("mysql")

//MySQL connection

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'inchimala_db'
})

const caretakerModel={
    insertCaretaker:(caretakerData,callback)=>{
        const query='INSERT INTO caretaker SET ?';
        pool.query(query,caretakerData,callback)
    }
}

module.exports=caretakerModel