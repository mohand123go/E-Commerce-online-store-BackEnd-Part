const mongoose = require('mongoose')
const DB_URl = 'mongodb://localhost:27017/online-shop'

const cartSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number
})

const cartItem = mongoose.model('cart', cartSchema)

exports.cartItem = cartItem

exports.addNewItem = (data, amount, userId) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return cartItem.findOne({ productId: data.productId, userId: data.userId })
        }
        ).then(items => {
            if (items) {
                let amountStorge = +items.amount + +data.amount
                return cartItem.updateOne({ _id: items._id }, { amount: amountStorge })


            } else {
                let item = new cartItem(data);
                return item.save()
            }

        }).then(() => {

            mongoose.disconnect();
            resolve()
        }).catch(erro => {
            mongoose.disconnect();
            reject(erro)
        })
    })


}




exports.getItemByUser = (userId) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => cartItem.find({ userId: userId }, {}, { sort: { timestamp: -1 } })

        ).then((items) => {
            mongoose.disconnect()
            resolve(items)
        }).catch(erro => {
            mongoose.disconnect()
            reject(erro)
        })

    })
}

exports.editItem = (id, newdata) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
            cartItem.updateOne({ _id: id }, newdata)

        ).then((items) => {
            mongoose.disconnect()
            resolve(items)
        })
            .catch(err => {
                mongoose.disconnect()
                reject(err)
            })
    })
}

exports.deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
            cartItem.deleteOne({ _id: id })
        ).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })
}


exports.deleteAllItem = () => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
            cartItem.deleteMany({})
        ).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })
}















