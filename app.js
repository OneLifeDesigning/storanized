require('dotenv').config()
const express = require('express')
const path = require('path')


require('./config/db.config')
require('./config/hbs.config');


const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))


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
  console.log('Minhub project running on port 3000 - http://localhost:3000/ 🧳🧳🧳🧳🧳')
})