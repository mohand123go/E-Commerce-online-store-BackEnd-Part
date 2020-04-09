const ordersModel = require('../models/orders.model')
const validationResult = require('express-validator').validationResult
const cartModel = require('../models/cart.model')

exports.postOrder = (req, res, next) => {
    ordersModel.addNewOrder({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        address: req.body.address,
        status: 'pending',
        productTimestamp: Date.now(),
        productId: req.body.productId,
        userId: req.session.userId,

    }).then(() => {
        res.redirect('/orders')

    }).catch(erro => {
        console.log(erro)
    })
    next()
}



exports.deleteCart = (req, res, next) => {
    cartModel.deleteItem(req.body.cartId).then(() => {

    }).catch((erro) => {
        console.log(erro)
    })
}



exports.getOrder = (req, res, next) => {
    ordersModel.getItemByUser(req.session.userId).then(items => {
        res.render('orders', {
            items: items,
            isUser: true,
            validationErrors: req.flash('validationErrors')[0],
            isAdmin: req.session.isAdmin,
            pageTitle: 'Orders'

        })
    }).catch(erro => console.log(erro))
}

exports.cancelOrder = (req, res, next) => {
    ordersModel.cancelOrder(req.body.userId, req.body.cartId).then(() => {
        res.redirect(req.body.redirectTo)
    }).catch((erro) => {
        console.log(erro)
    })
}

exports.postOrderCancelAll = (req, res, next) => {
    ordersModel.cancelAllOrders().then(() => {

        res.redirect(req.body.redirectTo)
    }).catch((erro) => {
        console.log(erro)
    })
}


exports.postOrderAllCart = async (req, res, next) => {

    await ordersModel.findAllOrder().then((All_Order_In_The_Cart) => {

        ordersModel.orderAllOrder(All_Order_In_The_Cart, req.body.address)

    }).catch(erro => {
        console.log(erro)
    })

    next()

}

exports.postOrderAllCart = (req, res, next) => {

    ordersModel.findAllOrder().then((All_Order_In_The_Cart) => {

        return ordersModel.orderAllOrder(All_Order_In_The_Cart, req.body.address)

    }).then(() => {
        next()
    }).catch(erro => {
        next(erro)
    })



}



exports.postOrderAllCartDelete = (req, res, next) => {
    cartModel.deleteAllItem().then(() => {
        res.redirect('/orders')
    }).catch((erro) => {
        console.log(erro)
    })
}





