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

require('./lib/production/prepareProduction')();

if (process.env.NODE_ENV === 'production') {
  const css = require('./config/css.config');
  app.use('/css', css);
}

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

/* 
  TODO: Error handlers


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

 */

app.listen(process.env.PORT || 3000, () => {
  console.log('Storanized project running on port 3000 - http://localhost:3000/ 🧳🧳🧳🧳🧳')
})