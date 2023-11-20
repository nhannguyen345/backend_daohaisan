const mongoose = require('mongoose')

const orderScheme = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                name: {
                    type: String,
                    required: true,
                },
                imageUrl: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                quantity: {
                    type: Number,
                },
            },
        ],
        status: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentInfo: {
            type: Object,
        },
    },
    {
        timestamp: true,
    }
)

module.exports = mongoose.model('Order', orderScheme)
