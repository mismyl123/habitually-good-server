const express = require('express')
const xss = require("xss");
const path = require('path')
const HabitsService = require('./habits-service')
const { requireAuth } = require('../middleware/jwt-auth')

const habitsRouter = express.Router()
const jsonBodyParser = express.json()

habitsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    SabitsService.getUserHabits(req.app.get('db'), req.user.id)
      .then(habits => {
        res.json(HabitsService.serializeHabits(habits))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { 
      user_id = req.user.id,
      text,
      due_date,
      reward,
      points
    } = req.body
    const newHabits = { user_id, text, due_date, reward, points }

    for (const [key, value] of Object.entries(newHabits)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }

    HabitsService.insertNewHabits(req.app.get('db'), newHabits)
      .then(habits => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user_id}`))
          .json(HabitsService.serializeHabits(habits))
      })
      .catch(next)
  })

  habitsRouter
  .route('/:habits_id')
  .all(checkHabitsExists)
  .all(requireAuth)
  .delete((req, res, next) => {
    HabitsService.deleteHabits(
      req.app.get('db'),
      req.params.habits_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

async function checkHabitsExists(req, res, next) {
  try {
    const habits = await HabitsService.getById(
      req.app.get('db'),
      req.params.habits_id
    )

    if(!habits) {
      return res.status(404).json({
        error: 'Habit does not exist'
      })
    }

    res.habits = habits
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = habitsRouter