'use strict'

const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://habitually-good-client-kcgkj0wk5.vercel.app/',
  'https://damp-castle-21568.herokuapp.com/',
  'https://habitually-good-client.vercel.app/'
]

const originGenerator = function(origin, callback) {
     (whitelist.indexOf(origin) !== -1 || !origin) 
      callback(null, true)
    } 

  module.exports = originGenerator