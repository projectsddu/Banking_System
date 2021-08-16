/*********************************************
 * getAccountDetails:{
    "account_id",
    "pin"
},cookie->Imp 
  
 * craeteAccount:{
    "ac_type","user_id","ac_bal"
 }
********************************************/

const express = require("express");
const router = express.Router()
const Account = require("../Collections/AccountModel")
const AccountType = require("../Collections/AccountTypeModel")
const User = require("../Collections/UserModel")
const authenticate = require("../Middlewares/Authenticate")
const createACMiddleware = require("../Middlewares/Account/CreateAccount")
// const AccountType = require("../Collections/AccountTypeModel")

router.post("/user/getACDetails/:acNumber", [authenticate], async (req, res) => {
    try {

        if (req.is_authenticated) {
            const acnum = req.params.acNumber;
            if (acnum == -1) {
                // all account details
                const allAc = await Account.find({
                    accountOwner: req.current_user
                })

                return res.json({ "data": allAc, "Success": true });
            }
            else {
                // particular account details
                if (acnum.length != 24) {
                    return res.json({ "Error:": "Account number must be 24 characters long" })
                }
                const ac = await Account.findOne({
                    _id: acnum
                })

                return res.json({ "data": ac, "Success": true });

            }
        }
        else {

        }
    }
    catch (e) {
        return res.json({ "Error:": e.toString() })
    }
})


// Creating test account API
// This must have a parameter named
// -> acType:String
// -> acInitBal: Number
// -> isEcard: Boolean
// Currently we donot require the user id but
// in general case we would as admin would use it.
router.post("/account/createTestAccount", [authenticate, createACMiddleware], async (req, res) => {
    try {
        if (req.is_authenticated) {

            if (req.create_account) {
                const ac = await Account({
                    accountOwner: req.current_user,
                    accountType: req.acType,
                    accountBalance: req.body.acInitBal,
                    isEcardIssued: req.body.isEcard
                }).save()
                if (!ac) {
                    return res.json({ "Error:": "Failed saving your account to DB" })
                }
                else {
                    return res.json({ "Success:": "Account created successfully!" })
                }
            }
            else {
                return res.json({ "Error:": "create ac is set to false" })
            }


        }
        else {
            return res.json({ "Error": "Hey you are not authenticated", "redirect": "true" })
        }
    }
    catch (e) {
        return res.json({ "Error:": e.toString })
    }
})

// API for making different account type
// This also must be used by an admin
router.post("/account/createAccountType", [authenticate], async (req, res) => {
    try {
        if (req.is_authenticated) {
            const actype = await AccountType({
                accountTypeName: "joint",
                minimumAccountBalance: 100
            }).save()
            if (!actype) {
                return res.json({ "Error:": "Error creating a new account type" })
            }
            else {
                return res.json({ "Success:": "ACType created successfully" })
            }
        }
        else {

        }
    }
    catch (e) {
        return res.json({ "Error:": e.toString() })
    }
})




// // This is to be used by the admin.
// router.post("/account/createAccount", async (req, res) => {
//     try {
//         const user_obj = await User.findOne({ _id: req.body["user_id"] })
//         const accountType = req.body["ac_type"]
//         const accountBalance = req.body["ac_bal"]
//         const account = await Account({
//             accountOwner: user_obj,
//             accountType,
//             accountBalance,
//             isEcardissued: false,
//         })
//     }
//     catch (e) {
//         console.log(e.toString())
//         return res.JSON({ "Error:": "Sorry We could not create your account at this time" })
//     }
// })


module.exports = router;