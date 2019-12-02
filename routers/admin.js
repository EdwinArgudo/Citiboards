const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const adminRouteAuth = require('../middleware/AdminRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')

// Database

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const adminRouter = express.Router();

adminRouter.get('/checkSession', adminRouteAuth, function(req, res) {
  res.sendStatus(200)
})

adminRouter.post('/authenticate', function(req, res) {
    //const { username, password } = req.body

    (async () => {
        const client = await pool.connect()
        let db_user_id = ''
        let db_pass = ''
        try {
            const user_data = await client.query('SELECT id, password FROM authentication WHERE username = $1 AND type = $2', [req.body.username, "admin"])
            db_user_id = user_data.rows[0].id
            db_pass = user_data.rows[0].password
            //console.log(db_user_id, db_pass)
            const correctPassword = await bcryptHelpers.isCorrectPassword(req.body.password, db_pass)
        } catch (e) {
            throw new Error("Incorrect username or password")
        } finally {
            client.release()
        }

        req.session.key = db_user_id ;
        req.session.role = "admin" ;
        res.sendStatus(200);

    })().catch(e => {
        console.log(e)
        res.json({
          error: e.message
        })
    })
})

adminRouter.get('/logout',function(req,res){
    if(req.session.key) {
        req.session.destroy()
    }
    res.end('done logging out')
})

module.exports = adminRouter;
