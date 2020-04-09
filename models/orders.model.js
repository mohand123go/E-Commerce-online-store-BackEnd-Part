const mongoose = require('mongoose')
const DB_URl = 'mongodb://localhost:27017/online-shop'

cartModel = require('./cart.model')

const orderSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    address: String,
    status: String,
    productTimestamp: Number,
    productId: String,
    userId: String

})
const orderItems = mongoose.model('order', orderSchema)

exports.addNewOrder = (data) => {

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return orderItems.findOne({ productId: data.productId, userId: data.userId, status: 'binding' })
        }
        ).then(items => {
            if (items) {

                let amountStorge = +items.amount + +data.amount
                return orderItems.updateOne({ _id: items._id }, { amount: amountStorge })


            } else {
                let item = new orderItems(data);
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

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => orderItems.find({ userId: userId }, {}, { sort: { timestamp: -1 } })

        ).then((order) => {
            mongoose.disconnect()
            resolve(order)
        }).catch(erro => {
            mongoose.disconnect()
            reject(erro)
        })

    })
}


exports.cancelOrder = (userId, cartId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
            orderItems.deleteOne({ _id: cartId, userId: userId })
        ).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })
}


exports.cancelAllOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
            orderItems.deleteMany({ status: 'pending' })
        ).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })
}





exports.findAllOrder = () => {

    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return cartModel.cartItem.find()
        }).then((dbResp) => {

            mongoose.disconnect();
            resolve(dbResp)
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })

}






let Add_Address_And_Satuts_To_Orders = (ror, UserAddress) => {
    let ordersList = []
    for (let i = 0; i < ror.length; i++) {
        ordersList[i] = {
            name: ror[i].name,
            price: ror[i].price,
            amount: ror[i].amount,
            address: UserAddress,
            status: 'pending',
            productTimestamp: ror[i].timestamp,
            productId: ror[i].productId,
            userId: ror[i].userId,


        }
    }


    return ordersList
}
exports.orderAllOrder = (All_Order_In_The_Cart, UserAddress) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Add_Address_And_Satuts_To_Orders(All_Order_In_The_Cart, UserAddress)
        }).then((All_Oders) => {
            return orderItems.insertMany(All_Oders);
        }).then(() => {
            mongoose.disconnect();

            resolve()
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)
        })
    })

}








exports.getAllItem = () => {

    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return orderItems.find({})
        }).then((allOrder) => {

            mongoose.disconnect();

            resolve(allOrder)
        }).catch((erro) => {
            mongoose.disconnect()
            reject(erro)

        })
    })




}





exports.updateOrderByManger = async (cartId, stat) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return orderItems.updateOne({ _id: cartId }, { status: stat })
        }).then(() => {
            mongoose.disconnect();

            resolve()
        }).catch((erro) => {
            mongoose.disconnect(
                reject(erro)
            )
        })
    })

}



exports.getItemWithFilter = (statusFilter) => {

    return new Promise((resolve, reject) => {

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let allOrder = orderItems.find({ status: statusFilter })
            return allOrder
        }).then((allOrder) => {
            resolve(allOrder)
            mongoose.disconnect();
        }).catch(erro => {
            mongoose.disconnect()
            reject(erro)
        })

    })


}
