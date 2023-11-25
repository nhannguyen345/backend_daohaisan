const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { upload } = require("../config/setUpFirebase");
const validateToken = require("../config/validateTokenHandler");

//GET --- api/products
router.get("/products", productController.getAllProducts);
//GET -- api/products/:searchstring
router.get("/products/:searchstring", productController.searchProducts);
//GET --- api/product/:id
router.get("/product/:id", productController.getSingleProduct);
//GET --- api/product/page
router.get("/product/", productController.getPanigationProduct);
//POST -- api/product
router.post(
  "/product",
  validateToken,
  upload.single("image"),
  productController.createProduct
);
//PUT --api/product
router.put(
  "/product/",
  validateToken,
  upload.single("image"),
  productController.updateProduct
);
//POST --api/product
router.post("/product", validateToken, productController.createProduct);
//DELETE --api/product
router.delete("/product/:id", validateToken, productController.deleteProduct);
module.exports = router;
