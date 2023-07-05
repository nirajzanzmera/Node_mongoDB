const mongoose = require('mongoose')
const usesessionSchema = new mongoose.Schema({
    user_id:{
       type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    token:{
        type: String,
        required: false,
    },
    expire_timestamp: {
        type: Number,
        required: false
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at:{
        type: Date,
        required: true,
        default: Date.now
    }

})
const user_session = mongoose.model("user_session",usesessionSchema);

module.exports = user_session;