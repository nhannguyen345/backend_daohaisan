const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { upload } = require("../config/setupfirebase.js");

//GET --- api/user/products
router.get("/products", productController.getAllProducts);
//GET -- api/user/products/:searchstring
router.get("/products/:searchstring", productController.searchProducts);
//GET --- api/user/product/:id
router.get("/product/:id", productController.getSingleProduct);
//GET --- api/user/product/page
router.get("/product/", productController.getPanigationProduct);
//POST -- api/user/product
router.post(
  "/product",
  upload.single("image"),
  productController.createProduct
);
//PUT --api/user/product
router.put(
  "/product/",
  upload.single("image"),
  productController.updateProduct
);
//POST --api/user/product
router.post("/product", productController.createProduct);
//DELETE --api/user/product
router.delete("/product/:id", productController.deleteProduct);
module.exports = router;
