const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    signup: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signups' 
    }
})
const users = mongoose.model('user', user)
module.exports = users;