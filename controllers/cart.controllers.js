const cartModel = require('../models/cart.model')
const validationResult = require('express-validator').validationResult

exports.postCart = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel.addNewItem({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            userId: req.session.userId,
            productId: req.body.productId,

            timestamp: Date.now()
        }).then(() => {
            res.redirect('/cart')
        }).catch(error => {
            next(error)
        })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect(req.body.redirectTo)
    }

}

exports.getCart = (req, res, next) => {
    cartModel.getItemByUser(req.session.userId).then(items => {
        res.render('cart', {
            items: items,
            isUser: true,
            validationErrors: req.flash('validationErrors')[0],
            counter: req.flash('counter')[0],
            isAdmin: req.session.isAdmin,
            isUser: req.session.userId,
            pageTitle: 'Cart'


        })
    }).catch(error => {
        next(error)
    })
}



exports.postCartSave = (req, res, next) => {

    if (validationResult(req).isEmpty()) {
        cartModel.editItem(req.body.cartId, { amount: req.body.amount, timestamp: Date.now() }).then((items) => {
            res.redirect('/cart')

        }).catch((error) => {
            next(error)
        })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/cart')
    }
}

exports.postCartDelete = (req, res, next) => {
    cartModel.deleteItem(req.body.cartId).then(() => {
        res.redirect('/cart')
    }).catch((error) => {
        next(error)
    })
}

exports.postCartAllDelete = (req, res, next) => {
    cartModel.deleteAllItem().then(() => {
        res.redirect('/cart')
    }).catch((error) => {
        next(error)
    })
}