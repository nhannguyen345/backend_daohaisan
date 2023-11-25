const { auto_create_id_product } = require("../config/generateId.js");
const Product = require("../models/Product.js");
const { urlFromFireBase } = require("../config/setUpFirebase.js");

const getAllProducts = async (req, res, next) => {
  try {
    let allProducts = await Product.find();
    if (allProducts.length == 0) {
      res.status(404).json({
        message: "Lỗi: Không thể lấy sản phẩm!",
      });
    } else
      res.status(200).json({
        message: "Thành công",
        data: {
          products: allProducts,
        },
      });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, weight, price, available } = req.body;
    const idOfNewProduct = await auto_create_id_product();
    if (!req.file) {
      return res.status(404).json({
        message: "Không tìm thấy hình ảnh sản phẩm. Kiểm tra lại input file!",
      });
    }
    const imageUrl = await urlFromFireBase(req.file);
    console.log(imageUrl);
    if (!imageUrl) {
      return res.status(500).json({
        message: "Lỗi khi lấy url image!",
      });
    }

    const newProduct = await Product.create({
      id: idOfNewProduct,
      name,
      category,
      description,
      imageUrl,
      weight,
      price,
      available,
    });

    if (newProduct) {
      return res.status(201).json({
        message: "Thêm sản phẩm thành công",
        data: {
          newProduct,
        },
      });
    }

    res.status(500).json({
      message: "Không thể thêm mới. Kiểm tra lại các trường đầu vào!!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

const searchProducts = async (req, res, next) => {
  try {
    let searchString = req.params.searchstring;
    let product = await Product.find({
      $or: [
        {
          name: { $regex: `.*${searchString}.*`, $options: "i" },
        },
        {
          category: { $regex: `.*${searchString}.*`, $options: "i" },
        },
        {
          description: { $regex: `.*${searchString}.*`, $options: "i" },
        },
      ],
    });

    if (product.length == 0) {
      res.status(200).json({
        message: "Không tìm thấy sản phẩm nào phù hợp",
        data: {
          products: [],
        },
      });
    } else
      res.status(200).json({
        message: `Tìm thấy ${product.length} sản phẩm phù hợp`,
        data: {
          data: {
            products: product,
          },
        },
      });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

const getSingleProduct = (req, res, next) => {
  const id = req.params.id;
  if (id === undefined || id === "") {
    const error = new Error("Invalid Id!");
    error.statusCode = 400;
    throw error;
  }

  Product.findOne({ id: id })
    .then((product) => {
      if (!product) {
        const error = new Error("Không có sản phẩm phù hợp với Id");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Successful!",
        data: {
          productInfo: product,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(err.statusCode).json({
        message: "Có lỗi xảy ra",
        data: { error: err.message },
      });
    });
};

const getPanigationProduct = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 6;
    let category = req.query.category || "";

    let getPageProduct = await Product.aggregate([
      {
        $match: {
          category: { $regex: `.*${category}.*`, $options: "i" }, // ignore case
        },
      },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    if (getPageProduct.length != 0) {
      res.status(200).json({
        message: "Successfully",
        data: {
          products: getPageProduct,
        },
      });
    } else {
      res.status(404).json({
        message: "Không tìm được sản phẩm. kiểm tra tham số đầu vào.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let {
      id,
      name,
      category,
      description,
      imageUrl,
      weight,
      price,
      available,
    } = req.body;

    if (req.file) {
      console.log("Có ảnh tải lên");
      imageUrl = await urlFromFireBase(req.file);
    }

    let newUpdateProduct = await Product.findOneAndUpdate(
      { id },
      {
        name,
        category,
        description,
        imageUrl: imageUrl,
        weight,
        price,
        available,
      },
      { new: true }
    );

    if (!newUpdateProduct) {
      res.status(404).json({
        message: "Thông tin không hợp lệ. Không thể cập nhập sản phẩm",
      });
    } else
      res.status(200).json({
        message: "Cập nhập thành công",
        modifiedProduct: newUpdateProduct,
      });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    let id = req.params.id;

    let deleProduct = await Product.deleteOne({ id });

    if (deleProduct.deletedCount == 0) {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm nào để xóa",
      });
    } else
      res.status(201).json({
        message: "Đã xóa thành công",
        data: {
          deletedProduct: deleProduct.deletedCount,
        },
      });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      data: {
        error: err,
      },
    });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  getPanigationProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
