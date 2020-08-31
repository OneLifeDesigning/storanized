require('dotenv').config()
const express = require('express')
const logger = require('morgan');
const path = require('path')
const cookieParser = require('cookie-parser')


require('./config/db.config')
require('./config/hbs.config')

const session = require('./config/session.config');
const sessionMiddleware = require('./middlewares/session.middleware')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'));
app.use(cookieParser())
app.use(session)
app.use(sessionMiddleware.getCurrentUser)


/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

/**
 * Configure routes
 */
const router = require('./config/routes.js')
app.use('/', router)

app.listen(process.env.PORT || 3000, () => {
  console.log('Storanized project running on port 3000 - http://localhost:3000/ 🧳🧳🧳🧳🧳')
})