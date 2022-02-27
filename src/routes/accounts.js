const express = require('express')
const router = express.Router()
const conn = require('../config/database')

const table = {
    name:'accounts'
}
router.get('/accounts',(req,res)=>{
    const {user} = req.headers
    let userRequest = parseInt(user)
    const query = `
    SELECT * from accounts where user_id = ?;
    `;
    conn.query(query, [userRequest], (err,rows,fields) =>{

        if (!err) {
            if (rows == 0) {
                res.status(200).json({Status: "No results."})
            } else {
                res.status(200).json({rows})
               
            }
        } else {
            console.log(err)
            
        }

    })
})


router.get('/accounts/:id',(req,res)=>{
    // return account info including balance
    const {id} = req.params
    
    const {user} = req.headers
    const query = `
    CALL SelectAccountById(?);
    `;

    conn.query(query, [id], (err,rows,fields) =>{

        if (!err) {
            if (rows == 0) {
                res.status(200);
                res.json({Status: "No results."})
            } else {
                
                res.status(200);
                res.json(rows)
            }
        } else {
            console.log(err)
            
        }

    })
})

router.post('/accounts', (req,res)=>{
    // return accounts info
    const { name, type, category} = req.body

    const {user} = req.headers

    const query = `
        INSERT INTO ${table.name} (user_id,name,type,category)
		VALUES (?,?,?,?);
    `;
    conn.query(query,[user,name,type,category], (err,rows,fields)=>{
        if (!err) {
            if (rows.affectedRows >= 1) {
                res.status(201)
                res.json({Status: 'Account saved'})
                
            } else {
                res.json({Status: "Something went wrong"})
            }
        } else {
            console.log(err)
            
        }
    })
})

router.put('/accounts/:id', (req,res)=>{
    const { name, type, category} = req.body
    const {id} = req.params
    const query = `
        UPDATE ${table.name}
        SET
            name = ?,
            type = ?,
            category = ?
        WHERE account_id = ?;
    `;

    conn.query(query,[name,type,category,id], (err,rows,fields)=>{
        if (!err) {
            res.status(201);
            res.json({Status: `Account ${id} updated`})
        } else {
            console.log(err)
            
        }
    })
})


router.delete('/accounts/:id', (req,res) =>{
    const {id} = req.params;
    conn.query(`DELETE FROM ${table.name} WHERE account_id = ?`, [id], (err,rows,fields) =>{
         if (!err) {
            if (rows.affectedRows >= 1) {
                res.status(201)
                res.json({Status: `Account ${id} deleted.`})
                
            } else {
                res.json({Status: "Something went wrong."})
            }
        } else {
            console.log(err)
            
        }
    })
})
module.exports = router