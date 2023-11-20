const Order = require('../models/Order.js')
const Product = require('../models/Product.js')
const User = require('../models/User.js')

let auto_create_id_product = async () => {
    let product = await Product.find().sort({ $natural: -1 }).limit(1)
    if (product.length == 0) {
        return 'SP0001'
    } else {
        let oldId = parseInt(product[0].id.slice(2).replace('0', ''))
        let newId = oldId + 1
        if (newId >= 1000) {
            return 'SP' + newId
        } else if (newId >= 100) {
            return 'SP0' + newId
        } else if (newId >= 10) {
            return 'SP00' + newId
        } else {
            return 'SP000' + newId
        }
    }
}

// let auto_create_id_user = async () => {
//     let user = await User.find().sort({ $natural: -1 }).limit(1)
//     if (user.length == 0) {
//         return 'KH0001'
//     } else {
//         let oldId = parseInt(user[0].id.slice(2).replace('0', ''))
//         let newId = oldId + 1
//         if (newId >= 1000) {
//             return 'KH' + newId
//         } else if (newId >= 100) {
//             return 'KH0' + newId
//         } else if (newId >= 10) {
//             return 'KH00' + newId
//         } else {
//             return 'KH000' + newId
//         }
//     }
// }

let auto_create_id_user = async () => {
    const latestUser = await User.findOne().sort({ id: -1 }).exec()

    if (!latestUser) {
        return 'KH0001'
    }

    const oldId = parseInt(latestUser.id.slice(2), 10)
    const newId = oldId + 1

    return `KH${newId.toString().padStart(4, '0')}`
}
let auto_create_id_order = async () => {
    const latestOrder = await Order.findOne().sort({ id: -1 }).exec()

    if (!latestOrder) {
        return 'DH0001'
    }

    const oldId = parseInt(latestOrder.id.slice(2), 10)
    const newId = oldId + 1

    return `DH${newId.toString().padStart(4, '0')}`
}

module.exports = { auto_create_id_product, auto_create_id_user, auto_create_id_order }
