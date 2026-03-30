const Product = require("../models/product.model");


//Get Products
exports.getProducts = async (req, res) => {
    try{
        const {minPrice, maxPrice} = req.query;
        const products = await Product.find();
        const filterProduct = products.filter(product => {
            return product.price >= Number(minPrice) && product.price <= Number(maxPrice);
        });
        const orderByProduct = filterProduct.sort((a, b) => a.stock === b.stock ? 0 : a.stock > b.stock ? -1 : 1);

        res.status(200).json({
            success: true,
            products: orderByProduct
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//get product by id
exports.getProductsById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            success: true,
            product
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//Get Products by Category
exports.getCategoryProduct = async (req, res) => {
    try{
        const { category } = req.params;
        const products = await Product.find({ category });
        res.status(200).json({
            success: true,
            products
        });
    }catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//add Product in card
exports.addProductToCard = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock <= 0) {
            return res.status(400).json({ message: "Out of stock" });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}