const router = require("express").Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const { upload } = require("../config/setupfirebase");

//[GET] api/users
router.get("/users", userController.getAllUser);
//[GET] api/user/:id
router.get("/user/:id", userController.getUser);
//[GET] api/customers
router.get("/customers", userController.getAllCustomer);
//[POST] api/user/login
router.post("/user/login", userController.loginUser);
//[POST] api/user/
router.post("/user/register", userController.registerUser);
//[PUT] api/user
router.put("/user", upload.single("avatar"), userController.updateUser);

//[GET] api/user/cart/:id
router.get("/user/cart/:id", userController.getCart);
//[POST] api/user/addCartItem
router.post("/user/addCartItem", userController.addProductToCart);
//[PUT] api/user/removeCartItem
router.put("/user/removeCartItem", userController.removeProductFromCart);

//[GET] api/order
router.get("/orders", orderController.getAllOrder);
//[GET] api/order:userId (get order by userId)
router.get("/orders/:userId", orderController.getOrderByUserId);
//[GET] api/order:id (get order by id)
router.get("/order/:id", orderController.getOrderById);
//[POST] api/order
router.post("/order", orderController.createOrder);
//[PUT] api/order
router.put("/order", orderController.updateStatusOrder);

module.exports = router;
