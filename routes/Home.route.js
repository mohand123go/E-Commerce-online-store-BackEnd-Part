const router = require('express').Router()
const authGuards = require('./guards/auth.guards')

const homeController = require('../controllers/home.controllers')
router.get('/', homeController.getHome)

module.exports = router
