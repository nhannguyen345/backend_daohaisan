const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = async () => {
    try {
        const mongoURI = process.env.URI_MongoDB
        await mongoose.connect(mongoURI, {})
        console.log('Connected to MongoDB')
    } catch (err) {
        console.error('Error connecting to MongoDB: ', err)
    }
}
module.exports = connectDB
