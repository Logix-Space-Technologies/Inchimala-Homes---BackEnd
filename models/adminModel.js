const mysql=require("mysql")
//MySQL connection



const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'inchimala_db'
})

const adminModel={
    insertAdmin: (adminData, callback)=>{
        const query='INSERT INTO admin SET ?';
        pool.query(query,adminData, callback);
    }
}

module.exports=adminModel;