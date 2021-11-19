const express = require('express')
const app = express()
const router = require('./routes/index')
const port = 3000
const session = require('express-session')
const Controller = require('./controllers/controller')


// app.use(express.static('public'))

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        sameSite:true
     }
  }))

  

// const startUpRoute = require('./startUpRoute')


// app.get('/', Controller.showHome)
app.use(router)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/login`)
})
 