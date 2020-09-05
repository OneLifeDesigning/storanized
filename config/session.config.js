const expressSession = require("express-session");
const connectMongo = require("connect-mongo")
const mongoose = require("mongoose");

const MongoStore = connectMongo(expressSession)

const session = expressSession({
  secret: process.env.SESSION_SECRET || "super secret (change it)",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: process.env.SESSION_MAX_AGE || 36000000000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: process.env.SESSION_MAX_AGE || 36000000,
  }),
});

module.exports = session