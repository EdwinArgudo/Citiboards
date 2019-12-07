const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const adminRouteAuth = require('../middleware/AdminRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')
const timestamp = require('time-stamp');
const fs = require('fs').promises;
// const split = require('split');

// Database

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

// File Stream

// Routing

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

function moveBoards(obj, generateTime) {
    return new Promise((resolve, reject) => {
        (async () => {
             console.log(obj)
            const client = await pool.connect()
            let date = timestamp("YYYY-MM-DD")
            let _time = timestamp("HH:mm:ss")
            if(!generateTime){
                date = obj.date
                _time = obj.time
            }
            const _timestamp = `${date} ${_time}`
            console.log(_timestamp)
            let curr_data = null;

            try {
                curr_data = await client.query("SELECT * FROM boards WHERE board_id = $1", [obj.boardID])
            } catch(e) {
                throw new Error("Board Doesn't Exists")
                client.release()
            }

            //console.log(curr_data)

            const beingCheckedOut = (obj.boardStatus === "in_use")
            const currAtStation =  (curr_data.rows[0].board_status === "parked")
            console.log("beingCheckedOut", beingCheckedOut)
            console.log("currAtStation", currAtStation)

            if(!((currAtStation && beingCheckedOut) || (!currAtStation && !beingCheckedOut))){
                throw new Error("Invalid Update")
            }

            if(!beingCheckedOut){
                try {
                    const station_inventory = await client.query("SELECT COUNT(*) FROM boards WHERE board_status = 'parked' AND station_id = $1", [obj.stationID])
                    const station_capacity = await client.query("SELECT capacity FROM stations WHERE station_id = $1", [obj.stationID])
                    const inventory = station_inventory.rows[0].count
                    const capacity = station_capacity.rows[0].capacity
                    if(inventory === capacity){
                        throw new Error("Station at Max Capacity")
                        client.release()
                    }
                }  catch(e) {
                    throw new Error("Station at Max Capacity")
                    client.release()
                }
            }

            const curr_user = curr_data.rows[0].user_id

            if(!beingCheckedOut && (curr_user != obj.userID)){
                throw new Error("Checked out board cannot be returned by different user")
            }

            console.log("No Obv Errors - Lets Update")

            let columns = "(station_id, user_id, board_status, last_transaction_time)"
            let quant = "($2, $3, $4, $5)"
            let fullQueryValues = [obj.boardID, obj.stationID,  obj.userID, obj.boardStatus, date, _time]
            let updateQueryValues = [obj.boardID, obj.stationID,  obj.userID, obj.boardStatus, _timestamp]
            if(beingCheckedOut){
                fullQueryValues[1] = "*"
            } else {
                columns = "(user_id, board_status, last_transaction_time)"
                updateQueryValues = [obj.boardID, obj.userID, obj.boardStatus, _timestamp]
                quant = "($2, $3, $4)"
            }
            console.log(updateQueryValues)
            const updateQuery = `UPDATE boards SET ${columns} = ${quant} WHERE board_id = $1 RETURNING *`
            try {
                const user_data = await client.query(updateQuery, updateQueryValues)
                console.log(user_data.rows[0])
            } catch (e) {
                throw new Error("Database Error")
            } finally {
                client.release()
            }

            //await transactionalLogStream.write(`${fullQueryValues.join(",")}\n`)
            console.log(`${fullQueryValues.join(",")}\n`)
            //const a = await fs.writeFile('transactionalLogs.txt', "hi", 'utf-8')
            //console.log(a)
            const transactionalLogStream = await fs.appendFile('./logs/transactionalLogs.csv',`${fullQueryValues.join(",")}\n`)
            return resolve("did it!");

        })().catch(e => {
            return reject(e);
        })
    })

}

adminRouter.post('/station-simulator', adminRouteAuth, function(req, res) {
    moveBoards(req.body, true)
        .then(() => res.sendStatus(200))
        .catch(e => res.json({ error: e.message }))
})

adminRouter.get('/load-random-data', adminRouteAuth, async function (req, res) {
    let results = await fs.readFile('./logs/randomBoardData.csv','utf8')
    let contents = results.split("\n")
    console.log(contents)
    for(let i = 0; i < contents.length; i++){
        if(contents[i].length !== 0){
            let parsedLine = contents[i].split(",")
            let stationID = parsedLine[1] === "*" ? 1 : parseInt(parsedLine[1])
            const obj = {
                boardID: parseInt(parsedLine[0]),
                stationID: stationID,
                userID: parseInt(parsedLine[2]),
                boardStatus: parsedLine[3],
                date: parsedLine[4],
                time: parsedLine[5]
            }
            await moveBoards(obj, false)
        }
    }
    res.sendStatus(200)
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

function generateReports(){
    return new Promise((resolve, reject) => {
        // open File
        // intepret data
        // generate Reports
        resolve({ historical:["uno"], stationRebalancing: ["dos"], missingBoards:["tres"]})
    })
}

adminRouter.get('/generateReports', adminRouteAuth, function(req, res){
    generateReports()
        .then((reports) => {
            // res.json({data})
            res.json(reports)
        })
        .catch(e => {
            res.json({
              error: e.message
            })
        })
})

adminRouter.get('/inventory', adminRouteAuth, function(req,res){
    (async () => {
        const client = await pool.connect()
        let stations_data = null
        try {
            stations_data = await client.query("SELECT station_id, COUNT(*) FROM boards WHERE board_status = 'parked' GROUP BY station_id", [])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        res.json({
            stations_data: stations_data.rows
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
