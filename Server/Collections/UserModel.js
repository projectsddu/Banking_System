const mongoose = require("mongoose")
// const bcrypt = require('bcrypt');
// var SHA256 = require("crypto-js/sha256");
const jwt = require("jsonwebtoken")
const User = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    pinNo: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    aadharNo: {
        type: String,
        required: true
    },
    panCardNo: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    nodeName: {
        type: String,
        required: true
    },
    loginTokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

})
User.methods.generateAuthToken = async function () {
    try {
        const userToken = jwt.sign({ _id: this._id }, "SECRETKEY")
        this.loginTokens = this.loginTokens.concat({ token: userToken })
        let is_saved = this.save()
        if (is_saved) {
            console.log("Login Token saved successfully");
            return userToken
        }
        else {
            console.log("Error saving token");
        }
    }
    catch (e) {
        console.log(e.toString())
    }
}

// hashing the password
// User.pre('save', async function (next) {
//     console.log('inside the pre');
//     if (this.isModified('pinNo')) {
//         this.pinNo = SHA256(this.pinNo).toString()
//         console.log(SHA256(this.pinNo).toString())
//     }
//     next();
// })


const UserModel = mongoose.model("USER", User)
module.exports = UserModel