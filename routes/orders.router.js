const router = require('express').Router()
const authGuards = require('./guards/auth.guards')
const bodyParser = require('body-parser')
const check = require('express-validator').check

const ordersController = require('../controllers/orders.controllers')
router.get('/', authGuards.isAuth, ordersController.getOrder)
router.post('/cancel', bodyParser.urlencoded({ extended: true }), authGuards.isAuth, ordersController.cancelOrder)

router.post('/cancelAll', bodyParser.urlencoded({ extended: true }), authGuards.isAuth, ordersController.postOrderCancelAll)


router.post('/', authGuards.isAuth,
    bodyParser.urlencoded({ extended: true }),
    ordersController.postOrder, ordersController.deleteCart)


router.post('/orderAll', authGuards.isAuth,
    bodyParser.urlencoded({ extended: true }),
    ordersController.postOrderAllCart, ordersController.postOrderAllCartDelete)






module.exports = router
