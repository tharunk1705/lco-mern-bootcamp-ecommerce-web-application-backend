const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ObjectId } = mongoose.Schema;


const productCartSchema =  new Schema(
    {
        product : {
            type : ObjectId,
            ref : "Product"
        },
        name : String,
        count : Number,
        price : Number
        
    }
);

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new Schema(
    {
        products : [productCartSchema],
        transactionId : {},
        amount : {
            type : Number
        },
        address : String,
        status : {
            type : String,
            default : "Received",
            enum : ["Received", "Delivered", "Cancelled", "Processing", "Shipped"]
        },
        updated : Date,
        user : {
            type : ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = {Order, ProductCart};