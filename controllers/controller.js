// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1
const { Profile, Movie, User, Category } = require('../models/index')
const currency = require('../helpers/currency')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");


class Controller {
    // static showHome(req,res){

    //     Movie.findAll({

    //         include: [Category]
    //     })
    //     .then(data => {
    //       res.render('home',{data,currency})  
    //       console.log(data)
    //     })
    //     .catch(err => res.send(err))
    // }

    static showHome(req, res) {
        let sort = req.query.sort
        let validRole = req.session.role
        // console.log(req.session.user);
       
        if (sort) {

            Movie.findAll(Movie.getMovieByType(sort))
                .then(data => {
                    // console.log(data, '>>>>>>>>>>>>> filterrrrrrrr');
                    res.render('home', { data, currency ,validRole })
                    // console.log(validRole);
                })
                .catch(err => res.send("errrooooooooooooooooorrrrrrrrrrrrr"))
        } else {
            
            Movie.findAll({
                include: 'Category',
                order: [
                    ['id', 'ASC']
                ]
            })
                .then(data => {
                    
                    res.render('home', { data, currency, validRole})
                    // console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< NON FILTER')
                })
                .catch(err => res.send("errrooooooooooooooooorrrrrrrrrrrrr tanpa sort"))
        }
    }

    //user
    static showUsers(req, res) {
        Profile.findAll({
            include: 'User'
        })
            .then(data => {
                res.render('users', { data })
                console.log(data)

            })
            .catch(err => res.send(err))
    }

    //profile
    static showProfile(req, res) {
        let idUsr = req.session.user.id
        Profile.findByPk(idUsr, {
            include: 'User'
        })
            .then(data => {
                res.render('profile', { data })


            })
            .catch(err => res.send(err))
    }

    //form login
    static formLogin(req, res) {
        const {error} = req.query

        let errorsQuery = req.query.errors
        let errors = []
        if (errorsQuery) {
            errors = req.query.errors.split(',')
        }
        res.render('login', { errors, error })
    }


    static postLogin(req, res) {
        const { username, password } = req.body

        User.findOne({
            where: {
                username: username
            }
        })
            .then(data => {
                if (data) {
                    const isValid = bcrypt.compareSync(req.body.password, data.password);

                    if(isValid) {
                        req.session.user = { id: data.id, role: data.role}
                        req.session.userId = data.id
                        req.session.role = data.role
                        req.session.username = data.username
                        req.session.email = data.email

                        console.log(req.session.email);

                        res.redirect('/')
                    } else {
                        const error = `invalid username/password`
                        return res.redirect(`/login?errors=${error}`)
                    }
                } else {
                    const error = `invalid username/password`
                    return res.redirect(`/login?errors=${error}`)
                }

            })
            .catch(err => {
                let error = err.errors.map(el => el.message)

                res.redirect(`/login?errors=${error}`)
            })
    }


    //logout
    static getLogOut(req, res) {
        req.session.destroy((err) => {
            if (err) console.log(`RAMASHOK`)
            else res.redirect('/login')
        })
    }

    //signup form
    static formSignUp(req, res) {

        let errorsQuery = req.query.errors
        let errors = []
        if (errorsQuery) {
            errors = req.query.errors.split(',')
        }
        res.render('signUp', { errors })
    }

    //signup
    static postSignUp(req, res) {
        const { username, email, password, name, age, address, gender} = req.body
        User.create({ username, email, password})
            .then(data => {
                
                return  Profile.create({name, age, address, gender, UserId : data.id})
            })
            .then(data2 => {
                res.render('login', { data2 ,errors:[]})
            })
            .catch(err => {
                let error = err.errors.map(el => el.message)

                res.redirect(`/signUp?errors=${error}`)
            })
    }


    //add movies form
    static formMovie(req, res) {
        let errorsQuery = req.query.errors
        let errors = []
        if (errorsQuery) {
            errors = req.query.errors.split(',')
        }
        res.render('addMovie', { errors })
    }

    //add movies
    static addMovie(req, res) {
        const { name, description, CategoryId, imageUrl, stock, type, price } = req.body
        Movie.create({ name, description, CategoryId, imageUrl, stock, type, price })
            .then(data => {
                res.redirect('/')
            })
            .catch(err => {
                let error = err.errors.map(el => el.message)

                res.redirect(`/movies/add?errors=${error}`)
            })
    }

    //delete movies
    static deleteMovie(req, res) {
        const idM = +req.params.id
        Movie.destroy({
            where: {
                id: idM
            }
        })
            .then(data => res.redirect('/'))
            .catch(err => res.send(err))
    }

    //buy movies
    static buyMovie(req, res) {
        const username = req.session.username
        const email = req.session.email
        const idM = +req.params.id
        Movie.decrement(
            {
                stock: 1
            },
            {
                where: {
                    id: idM
                }
            })
            .then(data => {
                console.log(data, '<<<<<<<<<<<<< data');
                let transporter = nodemailer.createTransport({

                    service:  'gmail', 
                    auth: {
                      user: 'tokomovieh8@gmail.com', 
                      pass: 'ToKoMovieH8!', 
                    },
                  });
                  let notif = {
                    from: 'tokomovieh8@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Succesfull Buy  ✔", // Subject line
                    text: `Hello ${username}, you succesfully buy a movie!`, // plain text body
                    
                  }

                  
                transporter.sendMail(notif, (err, data) => {
                    if (err) {
                        console.log(`Email not send`);  
                    }else {
                        console.log(`Email has been sent`);
                    }
                });
                 res.redirect('/')
            })
            .catch(err => res.send(err))
    }

    
}

module.exports = Controller