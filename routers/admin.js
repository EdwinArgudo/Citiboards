const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcryptjs')
const adminRouteAuth = require('../middleware/AdminRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')
const timestamp = require('time-stamp');
const fs = require('fs').promises;
const shell = require('shelljs');
const STATIONS = require('../data/stations.json')
const moment = require('moment');
const cron = require('node-cron');

// Database

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

// Queue

class Queue {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    enqueue(item) {
        this.items.push(item)

    }

    dequeue() {
        if(this.isEmpty()) return "Underflow";
        return this.items.shift();
    }

    front() {
        if(this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    printQueue() {
        let str = "";
        for(let i = 0; i < this.items.length; i++)
            str += this.items[i] +" ";
        return str;
    }
}

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

adminRouter.post('/station-simulator', adminRouteAuth, function(req, res) {
    moveBoards(req.body, true)
        .then(() => res.sendStatus(200))
        .catch(e => res.json({ error: e.message }))
})

let loadedRandom = false;

adminRouter.post('/load-data', adminRouteAuth, async function (req, res) {
    if(req.body.loadedData){
        let contents = req.body.loadedData
        for(let i = 0; i < contents.length; i++){
            let obj = {
                boardID: contents[i].board_id,
                stationID: contents[i].station_id,
                userID: 1,
                boardStatus: "in_use",
            }
            await moveBoards(obj, true)
            obj = {
                boardID: contents[i].board_id,
                stationID: contents[i].new_station_id,
                userID: 1,
                boardStatus: "parked",
            }
            await moveBoards(obj, true)
        }
        res.sendStatus(200)
    } else {
        if(!loadedRandom){
            let results = await fs.readFile('./data/randomBoardData.csv','utf8')
            let contents = results.split("\n")
            console.log(contents)
            for(let i = 0; i < contents.length; i++){
                if(contents[i].length !== 0){
                    let parsedLine = contents[i].split(",")
                    const obj = {
                        boardID: parseInt(parsedLine[0]),
                        stationID: parseInt(parsedLine[1]),
                        userID: parseInt(parsedLine[2]),
                        boardStatus: parsedLine[3],
                        date: parsedLine[4],
                        time: parsedLine[5]
                    }
                    await moveBoards(obj, false)
                }
            }
            res.sendStatus(200)
            loadedRandom = true
        } else {
            res.json({
                error: 'Random Data Already Loaded'
            })
        }

    }
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

cron.schedule('* * * * *', async () => {
    await generateReports()
});

function generateReports(){
    return new Promise((resolve, reject) => {
        // open File
        shell.echo('Calling Spark MapReduce Job');
        shell.exec('/usr/local/Cellar/apache-spark/2.4.4/bin/spark-submit --master local[4] ./spark/parseTransactionLogs.py')
        shell.echo('Job Finished, Data ready');
        // place outputted files
        resolve("done")
    })
}

adminRouter.get('/generate-reports', adminRouteAuth, function(req, res){
    generateReports()
        .then((reports) => {
            res.sendStatus(200)
        })
        .catch(e => {
            res.json({
              error: e.message
            })
        })
})

adminRouter.get('/historical-reports/:boardID', adminRouteAuth, async function(req, res){
    const boardID = parseInt(req.params.boardID)
    let transactions = await fs.readFile(`./historical_reports/board_${boardID}.csv`,'utf8')
    let contents = transactions.split("\n")
    let boardData = []
    for(let i = 0; i < contents.length; i++){
        if(contents[i].length !== 0){
            let parsedLine = contents[i].split(",")
            const obj = {
                date: parsedLine[0],
                time: parsedLine[1],
                s_start: parsedLine[2],
                s_end: parsedLine[3],
                duration: parsedLine[4]
            }
            boardData.push(obj)
        }
    }
    console.log(boardData)
    res.json({ data: boardData })

})

adminRouter.get('/station-rebalancing', adminRouteAuth, function(req,res){
    (async () => {
        const client = await pool.connect()
        let stations_data = []
        let num_boards = null
        const num_stations = STATIONS.length
        try {
            for(let i = 0; i < num_stations; i++){
                let per_station = await client.query("SELECT board_id, station_id FROM boards WHERE board_status = 'parked' AND station_id = $1", [i + 1])
                stations_data.push(per_station.rows)
            }
            num_boards = (await client.query("SELECT COUNT(*) FROM boards", [])).rows[0].count
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        const avg = Math.floor(num_boards / num_stations)
        const queue = new Queue()
        const changes = []

        for(let i = 0; i < num_stations; i++){
            let possess = stations_data[i].length
            if(possess > avg){
                let contribute = possess - avg
                for(let j = 0; j < contribute; j++){
                    queue.enqueue(stations_data[i][j])
                }
            }
        }

        for(let i = 0; i < num_stations; i++){
            let possess = stations_data[i].length
            if(possess < avg){
                let contribute = avg - possess
                for(let j = 0; j < contribute; j++){
                    if(!queue.isEmpty()){
                        let board = queue.front()
                        board['new_station_id'] = i + 1
                        changes.push(board)
                        queue.dequeue()
                    }
                }
            }

        }

        console.log(changes)
        res.json({
            rebalancing_data: changes
        });

    })().catch(e => {
        res.json({
          error: e.message
        })
    })
})

adminRouter.get('/missing-boards', adminRouteAuth, function(req, res){
    (async () => {
        const client = await pool.connect()
        let board_data = null
        try {
            board_data = await client.query("SELECT * FROM boards WHERE board_status = 'in_use'", [])
        } catch (e) {
            throw new Error("Database Error")
        } finally {
            client.release()
        }

        const in_use_boards = board_data.rows
        const missing_boards = []
        for(let i = 0; i < in_use_boards.length; i++){
            const timestamp = moment(`${in_use_boards[i].last_transaction_date} ${in_use_boards[i].last_transaction_time}`)
            const now = moment()

            if(now.diff(timestamp, 'days') > 7){
                missing_boards.push(in_use_boards[i])
            }
        }
        console.log(missing_boards)

        res.json({
            missing_boards
        });

    })().catch(e => {
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

adminRouter.get('/logout',function(req,res){
    if(req.session.key) {
        req.session.destroy()
    }
    res.end('done logging out')
})

module.exports = adminRouter;
