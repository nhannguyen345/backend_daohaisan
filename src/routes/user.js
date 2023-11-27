const router = require("express").Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const { upload } = require("../config/setupfirebase");
const validateToken = require("../config/validateTokenHandler");

//[GET] api/users
router.get("/users", userController.getAllUser);
//[GET] api/user/:id
router.get("/user/:id", validateToken, userController.getUser);
//[GET] api/customers
router.get("/customers", userController.getAllCustomer);
//[POST] api/user/login
router.post("/user/login", userController.loginUser);
//[POST] api/user/
router.post("/user/register", userController.registerUser);
//[PUT] api/user/info
router.put(
  "/user/info",
  validateToken,
  upload.single("avatar"),
  userController.updateUser
);
//[PUT] api/user/changePass
router.put(
  "/user/changePass",
  validateToken,
  userController.updatePasswordUser
);

//[GET] api/user/cart/:id
router.get("/user/cart/:id", validateToken, userController.getCart);
//[POST] api/user/addCartItem
router.post(
  "/user/addCartItem",
  validateToken,
  userController.addProductToCart
);
//[PUT] api/user/removeCartItem
router.put(
  "/user/removeCartItem",
  validateToken,
  userController.removeProductFromCart
);

//POST api/resetpass/checkmail
router.post("/resetpass/checkMail", userController.checkMailAndSendCode);
//POST api/resetpass/checkmail
router.post("/resetpass/checkResetCode", userController.checkResetCode);
//POST api/resetpass/checkmail
router.put("/resetpass/", userController.changePassword);

//[GET] api/order
router.get("/orders", validateToken, orderController.getAllOrder);
//[GET] api/order:userId (get order by userId)
router.get("/orders/:userId", validateToken, orderController.getOrderByUserId);
//[GET] api/order:id (get order by id)
router.get("/order/:id", validateToken, orderController.getOrderById);
//[POST] api/order
router.post("/order", validateToken, orderController.createOrder);
//[PUT] api/order
router.put("/order", validateToken, orderController.updateStatusOrder);

module.exports = router;
