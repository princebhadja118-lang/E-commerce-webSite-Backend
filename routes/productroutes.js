const express = require("express")
const { createProduct } = require("../controllers/product.controller");
const { getProducts } = require("../controllers/product.controller");
const { getCategoryProduct } = require("../controllers/product.controller");
const { updateProduct} = require("../controllers/product.controller")
const { addProductToCard} = require("../controllers/product.controller")
const { getProductsById } = require("../controllers/product.controller")
const { deleteProduct } = require("../controllers/product.controller")


const router = express.Router();
router.post('/add-product', createProduct);
router.get('/get-products', getProducts);
router.get('/product/:id', getProductsById);
router.get('/category-products/:category', getCategoryProduct);
router.put('/update-product/:id', updateProduct);
router.delete('/delete-product/:id', deleteProduct);
router.post('/add-to-cart/:productId', addProductToCard);

module.exports = router;