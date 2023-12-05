const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true
    },
    password:{
        type:"String",
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    image:{
        type:"String",
        required:false
    },
})
const users = mongoose.model('user', user)
module.exports = users;