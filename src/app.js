'use strict'

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const habitsRouter = require('./habits/habits-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const rewardsRouter = require('./rewards/rewards-router')

const app = express()
app.use(express.json())

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'dev'

app.use(morgan(morganSetting)),
app.use(cors()),
app.use(helmet()),

app.use('/api/users', usersRouter),
app.use('/api/habits', habitsRouter),
app.use('/api/auth', authRouter),
app.use('/api/rewards', rewardsRouter),

app.use('/', (req, res) => {
  res.send(`
    <h1>Habitually Good Server</h1>
  `)
})
//trying to fix cors error
//app.use((req, res, next) => {
  //res.header("Access-Control-Allow-Origin": "*")
//}) 

app.use(function errorHandler(error, req, res, next) {
  let response
 
    response = { error: { message: 'server error' } }

    console.error(error)
  
  res.status(500).json(response)
})

module.exports = app