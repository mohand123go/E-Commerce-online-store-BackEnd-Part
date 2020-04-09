const authModel = require('../models/auth.model')
const validationResult = require('express-validator').validationResult

exports.getSinup = (req, res, next) => {
    res.render('signup', {
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: 'Signup'

    })
}

exports.postSignup = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.creatNewUser(req.body.username, req.body.email, req.body.password).then(() => {
            res.redirect('/login')
        }).catch(erro => {
            res.redirect('/signup')
        })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/signup')
    }
}


exports.getLogin = (req, res, next) => {


    res.render('login', {
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Login'

    })
}

exports.postLogin = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.login(req.body.email, req.body.password)
            .then((result) => {
                req.session.userId = result.userId
                req.session.isAdmin = result.IsAdmin
                res.redirect('/')
            })
            .catch(erro => {
                req.flash('authError', erro)
                res.redirect('/login')
            })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/login')
    }

}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}