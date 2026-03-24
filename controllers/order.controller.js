const Order = require("../models/Order")
const Product = require("../models/product.model")

//create Order
exports.createOrder = async (req, res) =>{
    try {

        const {
            userId = req.user.userId ,
            products,
            shippingAddress,
            totalAmount,
            paymentID,
            date,
            time
        } = req.body;
       
        if(!userId || !products || !shippingAddress || !totalAmount || !paymentID) {
            return res.status(400).json({error: "All fields are required"});
        }

        // Check stock and reduce
        for (const item of products) {
            const product = await Product.findById(item.productId || item._id);
            if (!product) return res.status(404).json({ error: `Product not found: ${item.title}` });
            if (product.stock < (item.quantity || 1)) {
                return res.status(400).json({ error: `Insufficient stock for: ${product.title}` });
            }
        }

        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId || item._id,
                { $inc: { stock: -(item.quantity || 1) } }
            );
        }

        const order = new Order({
            userId,
            products,
            shippingAddress,
            totalAmount,
            paymentID,
            date,
            time
        });

        await order.save();

        res.json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

//Get all Order
exports.getOrders = async(req,res) => {
    try {
        const orders = await Order.find();
        res.json({
            success: true,
            orders
        });
    } catch(err) {
        res.status(500).json({error: err.message});

    }
}

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({
            userId:req.params.userId
        });
        res.json({
            success: true,
            orders
        })
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}