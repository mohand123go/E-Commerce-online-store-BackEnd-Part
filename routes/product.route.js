const router = require('express').Router()

const productController = require('../controllers/product.controllers')

router.get('/', productController.getFirstProduct)

router.get('/:id', productController.getProduct)

module.exports = router
