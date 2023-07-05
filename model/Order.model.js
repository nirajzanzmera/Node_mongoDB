const mongoose = require('mongoose')
const orderSchema = new  mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    quantity:{
        type:Number
    },
    name:{
        type:String
    },
    type:{
        type:String
    },
    status:{
        type:String
    }
},{
    timestamps: true,
});
const Order = mongoose.model("order",orderSchema);

module.exports = Order