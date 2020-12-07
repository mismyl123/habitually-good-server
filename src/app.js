'use strict'

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cors = require('cors');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const habitsRouter = require('./habits/habits-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const rewardsRouter = require('./rewards/rewards-router')

const app = express()
app.use(express.json())

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'

app.use(express.static('public'))
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/users', usersRouter)
app.use('/habits', habitsRouter)
app.use('/auth', authRouter)
app.use('/rewards', rewardsRouter)

app.get('/', (req, res)=>{
	res.status(200).end();
});


app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app