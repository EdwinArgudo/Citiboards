const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcryptjs')
const userRouteAuth = require('../middleware/UserRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')
const timestamp = require('time-stamp');
const fs = require('fs').promises;

// Database

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const userRouter = express.Router();

userRouter.get('/profile', userRouteAuth, async function (req, res) {
    (async () => {
        const client = await pool.connect()
        const user_id = req.session.key
        let user_data = null;
        let username = null;
        try {
            user_data = await client.query('SELECT * FROM users WHERE user_id = $1', [user_id])
            username = await client.query('SELECT username FROM authentication WHERE id = $1', [user_id])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        res.json({ ...user_data.rows[0], ...username.rows[0] });

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

userRouter.get('/checkSession', userRouteAuth, function(req, res) {
  res.sendStatus(200)
})

// POST route to register a user
userRouter.post('/register', async function(req, res) {

    (async () => {
        const hashed_pwd = await bcryptHelpers.hashPassword(req.body.password)
        const client = await pool.connect()
        let result = null
        try {
            await client.query('BEGIN')
            const insertAuth = 'INSERT INTO authentication(username, password, user_type) VALUES($1,$2,$3) RETURNING id'
            const insertAuthValues = [req.body.username, hashed_pwd, "user"]
            result = await client.query(insertAuth, insertAuthValues)
        } catch (e) {
            await client.query('ROLLBACK')
            throw new Error("User Already Exists")
            client.release()
        }

        try {
            const insertUser = `INSERT INTO users(user_id, first_name, last_name, email,
                                phone_number, credit_card) VALUES ($1, $2, $3, $4, $5, $6)`
            const insertUserValues = [result.rows[0].id, req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.credit_card ]
            await client.query(insertUser, insertUserValues)
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }

        req.session.key = result.rows[0].id;
        req.session.role = "user";
        res.sendStatus(200);

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

userRouter.get('/inventory', function(req,res){
    (async () => {
        const client = await pool.connect()
        let stations_data = null
        try {
            stations_data = await client.query("SELECT station_id, COUNT(*) FROM boards WHERE board_status = 'parked' GROUP BY station_id ORDER BY station_id", [])
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

userRouter.get('/has-board', function(req,res){
    (async () => {
        const client = await pool.connect()
        const user_id = req.session.key
        let user_data = null
        try {
            user_data = await client.query("SELECT * FROM boards WHERE board_status = 'in_use' AND user_id = $1 ", [user_id])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        let user_has_board = (user_data.rows.length !== 0 ? true : false)
        let ret = {
            has_board: user_has_board
        }
        if(user_has_board){
            ret["board_info"] = user_data.rows[0]
        } else {
            ret["board_info"] = []
        }

        console.log(ret)
        res.json(ret);

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

userRouter.post('/authenticate', function(req, res) {
    //const { username, password } = req.body

    (async () => {
        const client = await pool.connect()
        let db_user_id = ''
        let db_pass = ''
        try {
            const user_data = await client.query('SELECT id, password FROM authentication WHERE username = $1 AND user_type = $2', [req.body.username, "user"])
            db_user_id = user_data.rows[0].id
            db_pass = user_data.rows[0].password
            const correctPassword = await bcryptHelpers.isCorrectPassword(req.body.password, db_pass)
        } catch (e) {
            throw new Error("Incorrect username or password")
        } finally {
            client.release()
        }

        req.session.key = db_user_id ;
        req.session.role = "user";
        res.sendStatus(200);

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

userRouter.get('/logout',function(req,res){
    if(req.session.key) {
        req.session.destroy()
    }
    res.end('done logging out')
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
            let curr_data = null;

            try {
                curr_data = await client.query("SELECT * FROM boards WHERE board_id = $1", [obj.boardID])
            } catch(e) {
                throw new Error("Board Doesn't Exists")
                client.release()
            }

            try {
                if(obj.boardStatus === 'in_use'){
                    let user_data = await client.query("SELECT COUNT(*) FROM boards WHERE board_status = 'in_use' AND user_id = $1", [obj.userID])
                    if(user_data.rows[0].count > 0){
                        throw "error!"
                    }
                }

            } catch(e) {
                throw new Error("Please return board before checking out a new one")
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

            let columns = "(station_id, user_id, board_status, last_transaction_date, last_transaction_time)"
            let quant = "($2, $3, $4, $5, $6)"
            let updateQueryValues = [obj.boardID, obj.stationID,  obj.userID, obj.boardStatus, date, _time]
            if(beingCheckedOut){
                updateQueryValues[1] = curr_data.rows[0].station_id
            } else {
                // columns = "(user_id, board_status, last_transaction_date, last_transaction_time)"
                // updateQueryValues = [obj.boardID, obj.userID, obj.boardStatus, date, _time]
                // quant = "($2, $3, $4, $5)"
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
            console.log(`${updateQueryValues.join(",")}\n`)
            //const a = await fs.writeFile('transactionalLogs.txt', "hi", 'utf-8')
            //console.log(a)
            const transactionalLogStream = await fs.appendFile('./data/transactionalLogs.csv',`${updateQueryValues.join(",")}\n`)
            return resolve("did it!");

        })().catch(e => {
            return reject(e);
        })
    })

}

userRouter.post('/action', function(req, res) {
    let obj = req.body
    obj['userID'] = req.session.key
    if(req.body.boardStatus === "in_use"){
        (async () => {
            const client = await pool.connect()
            try {
                const board = await client.query("SELECT * FROM boards WHERE station_id = $1 AND board_status = 'parked' LIMIT 1", [obj.stationID])
                obj['boardID'] = parseInt(board.rows[0].board_id)
                console.log('chose board', obj['boardID'])
            } catch(e) {
                throw new Error("No Boards Available At That Station")
                client.release()
            } finally {
                client.release()
            }

            await moveBoards(obj, true)
                .then(() => res.sendStatus(200))

        })().catch(e => {
            res.json({ error: e.message })
        })
    } else {
        console.log(obj)
        moveBoards(obj, true)
            .then(() => res.sendStatus(200))
            .catch(e => res.json({ error: e.message }))
    }

})

module.exports = userRouter;
