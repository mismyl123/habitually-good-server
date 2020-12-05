
'use strict';

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postrgresql://habitually:password@localhost/habitually',
  JWT_SECRET: process.env.JWT_SECRET || 'nix-super-secure-secret'
}