const express = require('express')
const router = express.Router()
const siteController = require('../controllers/siteController')

// ** index
router.get('/', siteController.home)

module.exports = router
