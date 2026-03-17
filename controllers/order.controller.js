const Order = require("../models/Order")

//create Order
exports.createOrder = async (req, res) =>{
    try {
        const order = new Order(req.body);

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