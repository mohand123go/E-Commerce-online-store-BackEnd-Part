const router = require('express').Router()
const check = require('express-validator').check
const multer = require('multer')
const ordersController = require('../controllers/orders.controllers')
const bodyParser = require('body-parser')

const adminController = require('../controllers/admin.controller')
const adminGuard = require('./guards/admins.guards')
const authGuards = require('./guards/auth.guards')

router.get('/add', adminGuard.isAdmin, adminController.getAdd)

router.post('/add', adminGuard.isAdmin, multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'), check('image').custom((value, { req }) => {
    if (req.file) return true
    else throw 'image is require'
}), check('name').not().isEmpty().withMessage('name is rquire'),
    check('price').not().isEmpty().withMessage('price is rquire').isLength({ min: 1, max: 5 }).withMessage('price range must be from 1 to 5 digits'),
    check('description').isLength({ min: 10, max: 150 }).withMessage('description range must be from 10 to 150 letter'),
    check('category').not().isEmpty().withMessage('please chooce category'),
    adminController.postAdd)



router.get('/orders', adminGuard.isAdmin, adminController.getOrdersToManger)
router.post('/orders/search', adminGuard.isAdmin, bodyParser.urlencoded({ extended: true }), authGuards.isAuth,
    check('search').not().isEmpty().withMessage('E-mail is rquire').isEmail().withMessage('E-mail is incorrect'),
    adminController.searchByUserEmail)
router.post('/orders/save', authGuards.isAuth, bodyParser.urlencoded({ extended: true }), adminController.postUpdateOrdersByManger)


module.exports = router