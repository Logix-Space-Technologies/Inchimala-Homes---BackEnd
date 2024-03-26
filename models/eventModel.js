const mysql = require("mysql")


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inchimala_db'
})
const eventModel = {

    insertEvent: (eventData, callback) => {
        console.log(eventData)
        const query = 'INSERT INTO event SET ?';
        pool.query(query, eventData, callback)
    }

}
module.exports = eventModel
