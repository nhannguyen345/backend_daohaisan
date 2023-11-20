const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: 'will update,not yet',
        },
        weight: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        available: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Product = mongoose.model('Product', Schema)

module.exports = Product
