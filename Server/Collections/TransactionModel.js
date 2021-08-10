/*******************************************************************************
 * The transaction model has the locking mechanism
 * There are two types of locks. we use named "X" -> Exclusive lock
   and "R" -> Read lock.
 * The locking mechanisms helps us control the concurrency situations
 * Here for Ex user A wants to debit 500$ and transfer to user B side by side
   user C wants to credit 500$ and there is a power crash there will no 
   consistency hence we use locking system 
 ********************************************************************************/
const mongoose = require("mongoose")
const Transaction = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccountModel",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccountModel",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    transactionDateTime: {
        type: Date,
        required: true
    },

    lockType: {
        type: String,
        required: true
    }

})
const TransactionModel = mongoose.model("TRANSACTION", Transaction)
module.exports = TransactionModel
