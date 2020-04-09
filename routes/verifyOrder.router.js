const router = require('express').Router()
const bodyParser = require('body-parser')
const VerifyOrderController = require('../controllers/verifyOrder.controllers')
const check = require('express-validator').check


router.post('/', bodyParser.urlencoded({ extended: true }), check('amount').not().isEmpty().withMessage('Amount is require')
    .isInt({ min: 1, max: 100 }).withMessage("amount  rang must be from  1 to 100"),
    VerifyOrderController.postVerifyOrder)

router.post('/orderAll', bodyParser.urlencoded({ extended: true }), VerifyOrderController.postVerifyOrder)

module.exports = router
