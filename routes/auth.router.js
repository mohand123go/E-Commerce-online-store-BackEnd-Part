const router = require('express').Router()
const bodyParser = require('body-parser')
const check = require("express-validator").check
const authController = require('../controllers/auth.controllers')
const authGuards = require('./guards/auth.guards')

router.get('/signup', authGuards.isNotAuth, authController.getSinup)


router.post('/signup', authGuards.isNotAuth, bodyParser.urlencoded({ extended: true }),
    check('username').not().isEmpty().withMessage('username is rquire'),
    check('email').not().isEmpty().withMessage('E-mail is rquire').isEmail().withMessage('E-mail is incorrect'),
    check('password').isLength({ min: 6 }).withMessage('password is too  short'),
    check('confirmPassword').custom((value, { req }) => {
        if (value === req.body.password) return true
        else throw "passowrds do not match"
    }),
    authController.postSignup)

router.get('/login', authGuards.isNotAuth, authController.getLogin)

router.post('/login', authGuards.isNotAuth, bodyParser.urlencoded({ extended: true }), check('email').not().isEmpty().withMessage('E-mail is rquire').isEmail().withMessage('E-mail is incorrect'),
    check('password').isLength({ min: 6 }).withMessage('password is too  short'), authController.postLogin)

router.all('/logout', authGuards.isAuth, authController.logout)

module.exports = router