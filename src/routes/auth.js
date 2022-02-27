const express = require('express')
const conn = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router()

const table = {
    name:'users'
}

// Login info
router.post('/users/auth', (req,res)=>{
    const {email,password} = req.body

    // save the users from Server
    const usersOnServer = {}

    const query = `SELECT email,password FROM ${table.name} where email =?`

    conn.query(query,[email],(err,rows,fields)=>{
        if (rows.length == 0) {
            res.status(401).json({msg:"Email not found. "})
        } else {
            const usersOnServer = rows
            bcrypt.compare(password, usersOnServer[0].password, (err, results) =>{
                    if (err) {
                        throw new Error(err)
                    }
                    if (results) {
                        const accessToken = jwt.sign({usersOnServer},process.env.SECRET_KEY)
                        
                        return res.status(200).json({ accessToken:accessToken })
                    } else {
                        return res.status(401).json({ msg: "Password incorrect. Try again" })
                    }
                
                })
            
        }
    
        
    })
  
})
router.post('/users/register', async(req,res)=>{
    try{
        const {email,fullName,password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = `
        INSERT INTO ${table.name} (email,full_name,password)
		VALUES (?,?,?);
        `;

        conn.query(query,[email,fullName,hashedPassword], (err,rows,fields)=>{
            if (!err) {
                if (rows.affectedRows >= 1) {
                    res.status(201)
                    res.json({Status: 'New user saved'})
                    
                } else {
                    res.json({Status: "Something went wrong"})
                }
            } else {
                console.log(err)
                
            }
        })
    }catch (exception){
        console.log("We have the following error: ",exception)
        process.exit(1)
    }
})

module.exports = router