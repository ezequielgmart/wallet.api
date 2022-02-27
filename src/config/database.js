const mysql = require('mysql2')
const dotenv = require('dotenv');

dotenv.config();

const conn = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
})

conn.connect(function (err){
    if (err) {
        console.log(err)
        return
    } else {
        console.log("DB is running...")
    }
})

module.exports = conn;