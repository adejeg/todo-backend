const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validator(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Your password cannot contain the word "Password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
},
{
    timestamps:true
})

userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})
    
    if (!user) {
        throw new Error('Unable To Login')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Unable To Login')
    }

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, 'todoapplicationloginportal', {expiresIn:"7 days"})
    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

userSchema.virtual('todos', {
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens

    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User