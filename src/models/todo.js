const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trime:true
    },
    description:{
        type:String,
        default:'Nil',
        trim:true
    },
    status:{
        type:Boolean,
        default:false
    },
    owner:{
        type:String,
        required:true,
        ref:'User'
    }
},
{
    timestamps:true
})

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo