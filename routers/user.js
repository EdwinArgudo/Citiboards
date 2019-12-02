const express = require('express')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const userRouteAuth = require('../middleware/UserRouteAuth')
const bcryptHelpers = require('../auxiliary/BcryptHelpers')

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
        console.log(user_id)
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
        console.log(e)
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
            const insertAuth = 'INSERT INTO authentication(username, password, type) VALUES($1,$2,$3) RETURNING id'
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
        console.log(e)
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
            const user_data = await client.query('SELECT id, password FROM authentication WHERE username = $1 AND type = $2', [req.body.username, "user"])
            db_user_id = user_data.rows[0].id
            db_pass = user_data.rows[0].password
            //console.log(db_user_id, db_pass)
            const correctPassword = await bcryptHelpers.isCorrectPassword(req.body.password, db_pass)
            console.log(correctPassword)
        } catch (e) {
            throw new Error("Incorrect username or password")
        } finally {
            client.release()
        }

        req.session.key = db_user_id ;
        req.session.role = "user";
        res.sendStatus(200);

    })().catch(e => {
        console.log(e)
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

module.exports = userRouter;
