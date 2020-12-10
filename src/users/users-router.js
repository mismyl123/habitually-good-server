const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/')
  .get(jsonBodyParser, (req, res, next) => {
    UsersService.getByUsername(req.app.get('db'), req.user.username)
      .then(user => {
        res.json(UsersService.serializeUser(user))
      })
      .catch(next)
  })

  .post(jsonBodyParser, (req, res, next) => {
    const { password, username, first_name } = req.body

    for(const field of ['username', 'password', 'first_name']) {
      if(!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }

    const passwordError = UsersService.validatePassword(password)
    if(passwordError) {
      return res.status(400).json({ error: passwordError })
    }

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if(hasUserWithUserName) {
          return res.status(400).json({ error: 'Username is already taken' })
        }

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              first_name
            }

            return UsersService.insertNewUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl))
                  .json(UsersService.serializeUser(user))
              })
              .catch(next)
          })
          .catch(next)
      })
      .catch(next)
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { username = req.user.username, gained_points } = req.body

    if(gained_points == null) {
      return res.status(400).json({
        error: `Request body must contain 'gained_points'`
      })
    }

    UsersService.getByUsername(req.app.get('db'), username)
      .then(user => {
        let { points, points_to_next_level, level } = user
        const totalPoints = points + gained_points
        const diffOfPoints = points_to_next_level - totalPoints
        
        if(diffOfPoints <= 0) {
          points = Math.abs(diffOfPoints)
          points_to_next_level = Math.ceil(points_to_next_level * 1.1)
          level += 1
        } else {
          points = totalPoints
        }

        const fieldsToUpdate = { points, points_to_next_level, level }
        UsersService.updateUser(
          req.app.get('db'),
          req.user.id,
          fieldsToUpdate
        )
          .then(updatedUser => {
            res.json(UsersService.serializeUser(updatedUser))
          })
        .catch(next)
      })
      .catch(next)
  })

module.exports = usersRouter