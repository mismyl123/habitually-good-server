'use strict'

const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://serene-sierra-18729.herokuapp.com'
]

const originGenerator = function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
  
  module.exports = originGenerator