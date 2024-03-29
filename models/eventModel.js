const mysql = require("mysql")
require("dotenv").config()

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})
const eventModel = {

    insertEvent: (eventData, callback) => {
        console.log(eventData)
        const query = 'INSERT INTO activity SET ?';
        pool.query(query, eventData, callback)
    }

}
module.exports = eventModel
