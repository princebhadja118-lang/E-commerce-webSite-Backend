const express = require("express")
const { getProducts, getCategoryProduct, addProductToCard, getProductsById } = 
require("../controllers/product.controller");

const router = express.Router();
router.get('/get-products', getProducts);
router.get('/product/:id', getProductsById);
router.get('/category-products/:category', getCategoryProduct);
router.post('/add-to-cart/:productId', addProductToCard);

module.exports = router;