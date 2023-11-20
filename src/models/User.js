const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        avatarUrl: {
            type: String,
            default: 'https://i.stack.imgur.com/l60Hf.png',
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
        },
        cart: {
            items: [
                {
                    productId: {
                        type: String,
                        ref: 'Product',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
