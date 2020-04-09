const productsModel = require('../models/products.model')

exports.getProduct = (req, res, next) => {
    //get id 
    //get product with id 
    //render



    let id = req.params.id

    productsModel.getProductById(id).then(product => {

        res.render("product", {
            product: product,
            id: id,
            isUser: req.session.isUser,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0],
            pageTitle: 'Product'

        })

    }).catch((erro) => {
        next(erro)
    })

}

exports.getFirstProduct = (req, res, next) => {
    //get id 
    //get product with id 
    //render

    productsModel.getFirstProductM().then(product => {

        res.render("product", {
            product: product,
            isUser: req.session.isUser,
            isAdmin: req.session.isAdmin,
            pageTitle: 'Product',
            validationErrors: req.flash('validationErrors')[0]
        })

    }).catch((erro) => {
        next(erro)
    })

}