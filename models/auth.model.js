const mongoose = require("mongoose");

const bcrypt = require('bcrypt')

const DB_URl = "mongodb://localhost:27017/online-shop"

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    IsAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('user', userSchema)

exports.creatNewUser = (username, email, password) => {
    // check if email exsists
    //yes == error
    // no ===> create new account

    return new Promise((reslove, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOne({ email: email })
        }).then(user => {
            if (user) {
                mongoose.disconnect()
                reject('email is used ')
            }
            else {
                return bcrypt.hash(password, 10)
            }
        }).then(hashPassword => {
            let user = new User({
                username: username,
                password: hashPassword,
                email: email,

            })
            return user.save()
        }).then(() => {
            mongoose.disconnect();
            reslove('done')
        }).catch(erro => {
            reject(erro)
            mongoose.disconnect()
        })
    })
}

exports.login = (email, password) => {
    return new Promise((reslove, reject) => {
        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            User.findOne({ email: email }).then((user) => {
                if (!user) {
                    mongoose.disconnect()
                    reject('there is no user match this email')
                } else {
                    bcrypt.compare(password, user.password).then(same => {
                        if (!same) {
                            mongoose.disconnect()
                            reject('password is incorrect')
                        } else {
                            mongoose.disconnect()
                            reslove({
                                userId: user._id,
                                IsAdmin: user.IsAdmin
                            })
                        }
                    })
                }
            })
        }).catch(erro => {
            mongoose.disconnect()
            reject(erro)
        })
    })
}




function search(userId, arrayOfObject) {
    for (let i = 0; i < arrayOfObject.length; i++) {
        if (arrayOfObject[i]._id == userId) {
            return arrayOfObject[i].email;
        }
    }
}




exports.getUserInfo = (items) => {
    return new Promise((reslove, reject) => {
        let users_email = []

        mongoose.connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            User.find({}).then((users) => {
                for (let i = 0; i < items.length; i++) {
                    let user = search(items[i].userId, users)

                    users_email.push(user)
                }
                return users_email

            }).then((usersEmail) => {
                mongoose.disconnect()
                reslove(usersEmail)
            }).catch((erro) => {
                mongoose.disconnect()
                reject(erro)
            })
        })

    })




}




