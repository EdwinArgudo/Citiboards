const express = require('express')
const cors = require('cors')
const { Pool, Client } = require('pg')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const redis = require('redis')
const redisStore = require('connect-redis')(session)
//const jwt = require('jsonwebtoken')

const client  = redis.createClient()
const app = express()


//Load .env

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT

// MiddleWare
app.use(session({
    secret: process.env.SECRET,
    name: '_citiboard',
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}))
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Routing API v1

const apiRouterV1 = express.Router()
const userRouter = require('./routers/user')
const adminRouter = require('./routers/admin')

apiRouterV1.use('/user', userRouter)
apiRouterV1.use('/admin', adminRouter)
app.use('/api/v1', apiRouterV1)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
