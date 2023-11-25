const router = require("express").Router();
const validateToken = require("../config/validateTokenHandler");
const productController = require("../controllers/productController");

//GET --- api/admin/products
router.get("/products", validateToken, productController.getAllProducts);
//GET -- api/admin/products/:searchstring
router.get(
  "/products/:searchstring",
  validateToken,
  productController.searchProducts
);
//GET --- api/admin/product/:id
router.get("/product/:id", validateToken, productController.getSingleProduct);
//POST -- api/admin/product
router.post("/product", validateToken, productController.createProduct);
//PUT --api/admin/product
router.put("/product/", validateToken, productController.updateProduct);
//POST --api/admin/product
router.post("/product", validateToken, productController.createProduct);
//DELETE --api/admin/product
router.delete("/product/:id", validateToken, productController.deleteProduct);

module.exports = router;
