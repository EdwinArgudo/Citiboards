const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const adminRouteAuth = require('../middleware/AdminRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')
const timestamp = require('time-stamp');

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
    (async () => {
        const client = await pool.connect()
        let db_user_id = ''
        let db_pass = ''
        try {
            const user_data = await client.query('SELECT id, password FROM authentication WHERE username = $1 AND user_type = $2', [req.body.username, "admin"])
            db_user_id = user_data.rows[0].id
            db_pass = user_data.rows[0].password
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
        res.json({
          error: e.message
        })
    })
})

adminRouter.post('/station-simulator', adminRouteAuth, function(req, res) {
    (async () => {
        const client = await pool.connect()
        const _timestamp = timestamp("HH:mm:ss")
        let curr_data = null;

        try {
            curr_data = await client.query("SELECT * FROM boards WHERE board_id = $1", [req.body.boardID])
        } catch(e) {
            throw new Error("Board Doesn't Exists")
            client.release()
        }

        const beingCheckedOut = (req.body.boardStatus === "in_use")
        const currAtStation =  (curr_data.rows[0].board_status === "parked")
        console.log("beingCheckedOut", beingCheckedOut)
        console.log("currAtStation", currAtStation)

        if(!((currAtStation && beingCheckedOut) || (!currAtStation && !beingCheckedOut))){
            throw new Error("Invalid Update")
        }

        const curr_user = curr_data.rows[0].user_id

        if(!beingCheckedOut && (curr_user != req.body.userID)){
            throw new Error("Checked out board cannot be returned by different user")
        }

        let columns = "(station_id, user_id, board_status, last_transaction_time)"
        let quant = "($2, $3, $4, $5)"
        let updateQueryValues = [req.body.boardID, req.body.stationID,  req.body.userID, req.body.boardStatus, _timestamp]
        if(!beingCheckedOut){
            columns = "(user_id, board_status, last_transaction_time)"
            updateQueryValues = [req.body.boardID, req.body.userID, req.body.boardStatus, _timestamp]
            quant = "($2, $3, $4)"
        }
        const updateQuery = `UPDATE boards SET ${columns} = ${quant} WHERE board_id = $1 RETURNING *`
        try {
            const user_data = await client.query(updateQuery, updateQueryValues)
            console.log(user_data.rows[0])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }
        res.sendStatus(200);

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

adminRouter.get('/peek-database', function(req, res) {
    (async () => {
        const client = await pool.connect()
        let users_data = null
        let stations_data = null
        let boards_data = null
        try {
            users_data = await client.query('SELECT * FROM users', [])
            stations_data = await client.query('SELECT * FROM stations', [])
            boards_data = await client.query('SELECT * FROM boards', [])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        res.json({
            users_data: users_data.rows,
            stations_data: stations_data.rows,
            boards_data: boards_data.rows
        });

    })().catch(e => {
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
