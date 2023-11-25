const jwt = require("jsonwebtoken");
const { auto_create_id_user } = require("../config/generateId");
const Product = require("../models/Product");
const User = require("../models/User");
const ResetCode = require("../models/ResetCode");
const { urlFromFireBase } = require("../config/setUpFirebase.js");
const { transporter, mailOptions } = require("../config/setUpMailer.js");
const randomCode = require("../config/generateResetCode.js");

const getAllUser = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "Fetched Successfully!",
        data: {
          users: users,
        },
      });
    })
    .catch((err) => res.status(500).json({ err: err }));
};

const getAllCustomer = (req, res) => {
  User.find({ isAdmin: false })
    .then((users) => {
      res.status(200).json({
        message: "Fetched Successfully!",
        data: {
          customers: users,
        },
      });
    })
    .catch((err) => res.status(500).json({ err: err }));
};

const getUser = (req, res) => {
  const id = req.params.id;
  User.find({ id: id })
    .then((user) => {
      res.status(200).json({
        message: "Fetched Successfully!",
        data: {
          user: user,
        },
      });
    })
    .catch((err) => res.status(500).json({ err: err }));
};

const registerUser = async (req, res, next) => {
  try {
    const { fullname, email, password, phone, gender, address } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Creation Failed: Email has already been registered!",
      });
    }

    // Tạo mã id cho user mới
    const id = await auto_create_id_user();

    const user = new User({
      id,
      fullname,
      email,
      password,
      phone,
      gender,
      address,
    });

    user
      .save()
      .then((user) => {
        res.status(200).json({
          message: "Create Successfully",
          data: { newUser: user },
        });
      })
      .catch((err) =>
        res.status(500).json({ message: "Có lỗi xảy ra", err: err.message })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", err: err.message });
  }
};

//get an User

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user)
      return res.status(404).json({
        message: "Account not found, please check your email or password.",
      });

    // Tạo mã token cho user đăng nhập
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).json({
      message: "Successfully",
      data: { userInfo: user, token: accessToken },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      userId,
      fullname,
      email,
      password,
      phone,
      avatarUrl,
      gender,
      address,
    } = req.body;
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "User not fount" });
    user.fullname = fullname;
    user.email = email;
    user.password = password;
    user.phone = phone;
    user.avatarUrl = await urlFromFireBase(req.file);
    user.gender = gender;
    user.address = address;
    const newUser = await user.save();
    res.status(200).json({
      message: "Cập nhập sản phẩm thành công",
      data: { newUser: newUser },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", err: err.message });
  }
};

// const getCart = async (req, res) => {
//     try {
//         const userId = req.params.id
//         const user = await User.findOne({ id: userId }).populate({
//             path: 'cart.items.productId',
//             model: 'Product', // Thay 'Product' bằng tên model sản phẩm của bạn
//         })

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' })
//         }

//         const cart = user.cart.items
//         res.status(200).json({ cart })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Có lỗi xảy ra', err: err })
//     }
// }

const getCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cart.items;

    // Lấy thông tin sản phẩm cho mỗi sản phẩm trong giỏ hàng
    const cart = [];

    for (const cartItem of cartItems) {
      const product = await Product.findOne({ id: cartItem.productId });

      if (product) {
        cart.push({
          product,
          quantity: cartItem.quantity,
        });
      }
    }

    res.status(200).json({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", err: err.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = user.cart.items.find(
      (item) => item.productId === productId
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.cart.items.push({
        productId: productId,
        quantity: 1,
      });
    }

    await user.save();
    res.status(200).json({
      message: "Giỏ hàng đã được cập nhập",
      data: {
        cart: user.cart,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cartItem = user.cart.items.find(
      (item) => item.productId === productId
    );
    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "Product not found in your cart" });
    }
    user.cart.items = user.cart.items.filter(
      (item) => item.productId !== productId
    );
    await user.save();
    res.status(200).json({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      data: { newCart: user.cart },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};

// Xử lý xác thực email và gửi mã xác nhận
const checkMailAndSendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "Tài khoản email không tồn tại! Vui lòng kiểm tra lại!",
      });
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    // Thêm 3 phút vào ngày mới
    expirationDate.setMinutes(currentDate.getMinutes() + 3);

    const newResetCode = await ResetCode.create({
      user_id: user.id,
      code: randomCode,
      expirationDate,
    });

    if (!newResetCode) {
      return res.status(500).json({ message: "Máy chủ xảy ra!" });
    }

    const sendM = await transporter.sendMail(
      mailOptions(email, newResetCode.code)
    );
    console.log("Send email successfully!");
    return res.status(200).json({
      mesage:
        "Đã gửi mã đến email! Mã có thời gian là 3 phút! Vui lòng nhập vào trước thời gian!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};

// Nhận mã xác nhận và kiểm tra
const checkResetCode = async (req, res) => {
  try {
    const { email, resetcode } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "Tài khoản Email này không tồn tại! Vui lòng kiểm tra lại",
      });
    }
    const resetCodeInDB = await ResetCode.find({ user_id: user.id })
      .sort({ _id: -1 })
      .limit(1);
    if (resetCodeInDB.lenght) {
      return res.status(400).json({
        message:
          "Có lỗi xảy ra! Xin vui lòng thực hiện theo đúng trình tự: xác nhận email -> nhận mã -> nhập mã!",
      });
    }
    // so sánh mã gửi của khách hàng và trong database
    if (resetcode.toString() !== resetCodeInDB[0].code) {
      console.log(resetcode, resetCodeInDB);
      return res
        .status(400)
        .json({ mesage: "Mã xác nhận nhập không chính xác!" });
    }

    // kiểm tra mã đã hết hạn hay chưa
    const currentDate = new Date();
    if (resetCodeInDB[0].expirationDate < currentDate) {
      return res.status(400).json({ mesage: "Mã xác nhận đã hết hạn!" });
    }
    return res.status(200).json({
      message: "Xác nhận thành công!",
      idOfUser: user.id,
      idOfResetCode: resetCodeInDB[0]._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  const { id, idresetcode, newpass } = req.body;

  try {
    const resetCode = await ResetCode.findById(idresetcode);
    // Kiểm tra mã có tồn tại hay không
    if (!resetCode) {
      return res.status(404).json({ message: "Mã xác nhận không hợp lệ!" });
    }
    // Set thời gian cho phép người dùng cập nhật mật khẩu là 10 phút so với ngày hết hạn của mã
    const setDateChangePass = resetCode.expirationDate;
    setDateChangePass.setMinutes(setDateChangePass.getMinutes() + 10);
    const currentDate = new Date();
    console.log(setDateChangePass);
    if (setDateChangePass < currentDate) {
      return res.status(400).json({
        message:
          "Đã hết thời gian đổi mật khẩu! Vui lòng thực hiện lại các bước để thực hiện!",
      });
    }
    const newUserPass = await User.findOneAndUpdate(
      { id: id },
      { $set: { password: newpass } },
      { new: true }
    );
    if (!newUserPass) {
      return res
        .status(404)
        .json({ message: "Lỗi! Không tìm thấy người dùng này!" });
    }

    return res.status(201).json({ message: "Đã đổi mật khẩu thành công!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};
module.exports = {
  registerUser,
  getUser,
  getAllUser,
  addProductToCart,
  loginUser,
  updateUser,
  removeProductFromCart,
  getCart,
  getAllCustomer,
  checkMailAndSendCode,
  checkResetCode,
  changePassword,
};
