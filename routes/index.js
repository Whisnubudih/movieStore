const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

// const startUpRoute = require('./startUpRoute')




router.get('/signUp', Controller.formSignUp)
router.post('/signUp', Controller.postSignUp)

router.get('/login', Controller.formLogin)
router.post('/login', Controller.postLogin)

router.get('/logout', Controller.getLogOut) 


// USER
router.use(function (req,res,next){
    if(!req.session.userId) {
        const error = "Please login first"
        res.redirect(`/login?errors=${error}`)
    } else {
        console.log(`LANJOOOTT`);
        next()
    }
    
})

router.get('/', Controller.showHome)
router.get('/profiles', Controller.showProfile)
router.get('/movies/buy/:id', Controller.buyMovie)


// ADMIN
router.use(function (req,res,next){
    if(req.session.user.role !== 'Admin') {
        const error = "You can not in"
        res.redirect(`/login?errors=${error}`)
    } else {
        console.log(`LANJOOOTT`);
        next()
    }
    
})



router.get('/users', Controller.showUsers)

router.get('/movies/add', Controller.formMovie)
router.post('/movies/add', Controller.addMovie)

router.get('/movies/delete/:id', Controller.deleteMovie)



// router.use('/movies', movieRoute)




module.exports = router
