const router = require('express').Router()
const productController = require('../controllers/productController')

//GET --- api/admin/products
router.get('/products', productController.getAllProducts)
//GET -- api/admin/products/:searchstring
router.get('/products/:searchstring', productController.searchProducts)
//GET --- api/admin/product/:id
router.get('/product/:id', productController.getSingleProduct)
//POST -- api/admin/product
router.post('/product', productController.createProduct)
//PUT --api/admin/product
router.put('/product/', productController.updateProduct)
//POST --api/admin/product
router.post('/product', productController.createProduct)
//DELETE --api/admin/product
router.delete('/product/:id', productController.deleteProduct)

module.exports = router
