const router = require('express').Router()
const bodyParser = require('body-parser')
const authguard = require('./guards/auth.guards')
const check = require('express-validator').check
const cartController = require('../controllers/cart.controllers')

router.get('/', authguard.isAuth, cartController.getCart)

router.post('/', authguard.isAuth,
    bodyParser.urlencoded({ extended: true }),
    check('amount').not().isEmpty().withMessage('Amount is require')
        .isInt({ min: 1, max: 100 }).withMessage("amount  rang must be from  1 to 100")
    , cartController.postCart)



router.post('/save', authguard.isAuth,
    bodyParser.urlencoded({ extended: true }),
    check('amount').not().isEmpty().withMessage('Amount is require')
        .isInt({ min: 1, max: 100 }).withMessage("amount  rang must be from  1 to 100")
    , cartController.postCartSave)

router.post('/delete', authguard.isAuth,
    bodyParser.urlencoded({ extended: true })
    , cartController.postCartDelete)


router.post('/deleteAll', authguard.isAuth,
    bodyParser.urlencoded({ extended: true })
    , cartController.postCartAllDelete)

module.exports = router