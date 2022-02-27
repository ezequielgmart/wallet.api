const express = require('express')

const router = express.Router()

const conn = require('../config/database')

const table = {
    name:'transactions',
    key:'transaction_id'
}
router.get('/transactions/:id',(req,res)=>{
    const {id} = req.params

    conn.query(`SELECT * FROM ${table.name} WHERE transaction_id = ?`, [id], (err,rows,fields) =>{

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
router.get('/transactions',(req,res)=>{
    const {user} = req.headers

    conn.query(`SELECT * FROM ${table.name} WHERE user_id = ?`, [user], (err,rows,fields) =>{

       
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

router.post('/transactions', (req,res)=>{
    const { 
        account_id,
        date, 
        type,
        income,
        outcome,
        description, 
        beneficiarie, 
        category
    } = req.body

    
    const {user} = req.headers
    let userInt = parseInt(user)
    const query = `
    INSERT INTO ${table.name} (user_id,account_id,date,type,income,outcome,description,beneficiarie,category)
    VALUES (?,?,?,?,?,?,?,?,?);
    `;
    
    conn.query(query,[userInt,account_id,date,type,income,outcome,description,beneficiarie,category], (err,rows,fields)=>{
        if (!err) {
            if (rows.affectedRows > 0) {
                res.status(201);
                res.json({Status: "Transaction added."})
            } else {
                
                res.status(500);
                res.json({Status: "Something went wrong."})
            }
        } else {
            console.log(err)
            
        }

    })
    
    
})
router.post('/transactions/transfer',(req,res)=>{
    const {
        account_in,
        account_out,
        date,
        value
    } = req.body

    const {user} = req.headers
    let userInt = parseInt(user)

    const queryTransfer = `
    INSERT INTO ${table.name} (user_id,account_id,date,type,income,outcome,description,beneficiarie,category)
    VALUES (?,?,?,?,?,?,?,?,?);
    `;
    
    conn.query(queryTransfer,[
        userInt,
        account_in,date,
        "TransferIn",
        value,
        "0",
        "Transfer in",
        "Transfer In",
        "Transfer In"], (err,rows,fields)=>{
        if (!err) {
            if (rows.affectedRows > 0) {
                try {
                    conn.query(queryTransfer,[
                        userInt,
                        account_out,
                        date,
                        "TransferOut",
                        "0",
                        value,
                        "Transfer out",
                        "Transfer out",
                        "Transfer out"], (err,rows,fields)=>{
                        if (!err) {
                            if (rows.affectedRows > 0) {
                                res.status(201).json({Status: "Transaction added."})
                            } else {
                                res.status(500).json({Status:"Cannot proccess your request. Try again"})
                            }
                        } else {
                            console.log(err)
                            
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            } else {
                res.status(500).json({Status:"Cannot proccess your request. Try again"})
            }
        } else {
            console.log(err)
            
        }

    })

})
router.put('/transactions/:id', (req,res)=>{
    const { 
        account_id,
        date, 
        type,
        income,
        outcome,
        description, 
        beneficiarie, 
        category
    } = req.body
    const {id} = req.params
    
    
    const query = `
        UPDATE ${table.name}
        SET
            account_id = ?,
            date = ?, 
            type = ?,
            income = ?,
            outcome = ?,
            description = ?, 
            beneficiarie = ?, 
            category = ?
        WHERE ${table.key} = ?;
    `;

    conn.query(query,[account_id,date,type,income,outcome,description,beneficiarie,category,id], (err,rows,fields)=>{
        if (!err) {
            res.status(201);
            res.json({Status: `Account ${id} updated`})
        } else {
            console.log(err)
            
        }
    })
})


router.delete('/transactions/:id', (req,res) =>{
    const {id} = req.params;
    conn.query(`DELETE FROM ${table.name} WHERE ${table.key} = ?`, [id], (err,rows,fields) =>{
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


