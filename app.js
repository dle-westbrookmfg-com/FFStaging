const createError = require('http-errors')
const express = require('express')
const Raven = require('raven')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()


const indexRouter = require('./routes/index')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({limit: "200mb"}));
app.use(bodyParser.urlencoded({limit: "200mb", extended: true, parameterLimit:50000}));

// app.use(logger('dev'))
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(bodyParser.text())
// app.use(bodyParser.urlencoded({ extended: false }))


//= =====ROUTES=============
app.use('/', indexRouter)

//= =====================================
//= ===========ERROR HANDLERS============
//= =====================================

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

const port = process.env.PORT || 1335

app.listen(port, () => {
  console.log(`🚀 Listening on Port ${port}!`)
  console.log(path.join(__dirname, 'views'))
})

module.exports = app