const productsModel = require('../models/products.model')
exports.getHome = (req, res, next) => {
    // get products from the database
    // render index.ejs


    // get category 
    // if category && category !=  all 
    // else render all 
    let category = req.query.category
    let productsPromise
    let vaildCategories = ['clothes', 'womens_accessories']

    if (category && vaildCategories.includes(category)) {
        productsPromise = productsModel.getProductsByCategory(category)
    } else productsPromise = productsModel.getAllProducts()


    productsPromise.then(products => {
        res.render('index', {
            products: products,
            isUser: req.session.userId,
            validationErrors: req.flash('validationErrors')[0],
            isAdmin: req.session.isAdmin,
            pageTitle: 'Home'
        })
    }).catch((erro) => {
        next(erro)
    })
}