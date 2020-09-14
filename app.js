require('dotenv').config()

const express = require('express')
const logger = require('morgan');
const path = require('path')
const cookieParser = require('cookie-parser')

require('./config/breadcrumbs.config')
require('./config/db.config')
require('./config/hbs.config')

const session = require('./config/session.config');

const app = express()

if (process.env.NODE_ENV !== 'production') {
  const sassMiddleware = require('node-sass-middleware');
  
  app.use(sassMiddleware({
    src: __dirname + '/src/scss',
    dest: __dirname + '/public',
    //debug: true,
    outputStyle: 'compressed'
  }));
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '2MB' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session)
app.use((req, res, next) => {
  req.breadcrumbs = get_breadcrumbs(req.originalUrl);
  next();
});

const sessionMiddleware = require('./middlewares/session.middleware')
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


// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500 );
    res.render('error', {
      error: {
        message: error.message
      },
      user: req.currentUser
    })
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Storanized project running on port 3000 - http://localhost:3000/ 🧳🧳🧳🧳🧳')
})