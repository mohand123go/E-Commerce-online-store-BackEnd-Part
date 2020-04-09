
const validationResult = require('express-validator').validationResult
const ProductsModel = require('../models/products.model')
const ordersModel = require('../models/orders.model')
const authModel = require('../models/auth.model')

exports.getAdd = (req, res, next) => {

    res.render('add-product', {
        validationErros: req.flash('validationErrors'),

        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Add Product'
    })
}

// TEST 
exports.getOrdersToManger = (req, res, next) => {

    let statusfilter = req.query.statusfilter
    let getAllItemWithFilter
    if (statusfilter && statusfilter !== 'all') {
        getAllItemWithFilter = ordersModel.getItemWithFilter(statusfilter)
    }
    else {
        getAllItemWithFilter = ordersModel.getAllItem()
    }

    getAllItemWithFilter.then(items => {
        authModel.getUserInfo(items).then((userEmail) => {
            let allOrder = []

            for (let i = 0; i < items.length; i++) {
                allOrder.push({
                    _id: items[i]._id,
                    userEmail: userEmail[i],
                    name: items[i].name,
                    price: items[i].price,
                    amount: items[i].amount,
                    address: items[i].address,
                    status: items[i].status,
                    productTimestamp: items[i].status,
                    productId: items[i].productId,
                    userId: items[i].userId,

                })
            }
            res.render("manges-orders", {
                items: allOrder,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                validationErrors: req.flash('validationErrors')[0],
                searchResult: req.flash('searchResult')[0],
                pageTitle: 'Manges Orders'
            })
        }).catch(error => {
            next(error)
        })
    }
    ).catch(error => {
        next(error)
    })
}



exports.searchByUserEmail = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        req.flash('searchResult', req.body.search)
        res.redirect('/admin/orders')

    } else {

        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/admin/orders')
    }
}

exports.postAdd = (req, res, next) => {
    if (validationResult(req).isEmpty()) {

        ProductsModel.postProducts({

            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image_name: req.file.filename,
            description: req.body.description
        }).then(() => {
            res.redirect('/')
        }).catch(error => {
            next(error)
        })

    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/admin/add')
    }
}

exports.postUpdateOrdersByManger = (req, res, next) => {
    ordersModel.updateOrderByManger(req.body.cartId, req.body.editedStatus).then(() => {



    }).then(() => {
        res.redirect('/admin/orders')
    }).catch(error => {
        next(error)
    })
}
