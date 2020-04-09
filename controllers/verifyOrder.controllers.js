const cartModel = require('../models/cart.model')
const validationResult = require('express-validator').validationResult

exports.postVerifyOrder = (req, res, next) => {


    if (validationResult(req).isEmpty()) {
        res.render('verifyOrder', {
            isUser: true,
            orderItem: {
                name: req.body.name,
                price: req.body.price,
                amount: req.body.amount,
                userId: req.body.userId,
                productId: req.body.productId,
                submit: req.body.submit,


            },
            cartId: req.body.cartId,
            isAdmin: req.session.isAdmin,
            pageTitle: 'verifyOrder'
        })


    } else {
        req.flash('validationErrors', validationResult(req).array())
        req.flash('counter', req.body.counter)

        res.redirect('/cart')
    }


}
