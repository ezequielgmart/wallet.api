const express = require('express')
const app = express()
const dotenv = require('dotenv');

dotenv.config();

// settings
app.set('port', process.env.PORT)

// middelwares
app.use(express.json())

// routes
app.use(require('./src/routes/accounts'))
app.use(require('./src/routes/auth'))
app.use(require('./src/routes/transactions'))

// app
app.listen(app.get('port'), ()=>{
    console.log('Wallet app running on port', app.get('port'))
})