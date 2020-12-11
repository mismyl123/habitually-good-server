'use strict'

const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080',
  ''
]

const originGenerator = function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
  
  module.exports = originGenerator