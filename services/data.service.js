// import jsonwebtoken
const jwt = require('jsonwebtoken')

// import db.js
const db = require('./db')

// Registor
const registor = (username, acno, password) => {
    // asynchronus
    return db.Users.findOne({
        acno
    }).then(user => {
        console.log(user);

        if(user){
            return{
                status : false,
                message: 'Already Registered. Please login',
                statusCode: 401
            }    
        }
        else {
            // insert in db
            const newuser = new db.Users({
                acno,
                username,
                password,
                balance : 0,
                transaction:[]
            })

            newuser.save()

            return{
                status : true,
                message: "Registered Successfully",
                statusCode: 200
            }
        }    
    })
}

const login = (acno, pswd) => {
    // asynchronus
    return db.Users.findOne({
        acno,
        password : pswd
    }).then(user => {
        if(user){
            console.log(user);
            currentuser = user.username
            currentAccount = acno
            // token generation
            token = jwt.sign({
                // store account number inside token
                currentAccount : acno
            }, 'supersecretkey12345')

            return{
                status : true,
                message: "Login Successfully",
                statusCode: 200,
                currentuser,
                currentAccount,
                token
            }
        }

        else{
            return{
                status : false,
                message: 'Invalid Account Number or Password!!!',
                statusCode: 401
            }    
        }

              
    })
}
        
// deposit
const deposit = (req, acno, password, amt) => {
    var amount = parseInt(amt);
    var currentAcno = req.currentAcno
    return db.Users.findOne({
        acno,
        password
    }).then(user => {
        if(user){
            if(acno != currentAcno){
                return {
                    status: false,
                    message: "Permission Denied",
                    statusCode: 401
                }
            }

            user.balance += amount
            user.transaction.push({
                type: "CREDIT",
                amount: amount
            })
            user.save()
            return {
                status: true,
                message: amount + " deposited successfully.. New balance is " + user.balance,
                statusCode: 200
            }
        }
        else{
            return {
                status: false,
                message: "Invalid Account no or Password",
                statusCode: 401
            }
        }
    })
}

// withdraw
const withdraw = (req, acno, password, amt) => {
    var amount = parseInt(amt);
    var currentAcno = req.currentAcno
    return db.Users.findOne({
        acno,
        password
    }).then(user => {
        if(user){
            if(acno != currentAcno){
                return {
                    status: false,
                    message: "Permission Denied",
                    statusCode: 401
                }
            }
            if(user.balance > amount){
                user.balance -= amount
                user.transaction.push({
                    type: "DEBIT",
                    amount: amount
                })
            
                user.save()
                return {
                    status: true,
                    message: amount + " debited successfully.. New balance is " + user.balance,
                    statusCode: 200
                }
            }
            else{
                return {
                    status: false,
                    message: "Insufficient balance!!!",
                    statusCode: 401
                }
            }
        }
        else{
            return {
                status: false,
                message: "Insufficient Account Number or Password!!!",
                statusCode: 401
            }
        }
    })
}

// Transaction
const getTransaction = (req, acno) => {
    var currentAcno = req.currentAcno
    return db.Users.findOne({
        acno
    }).then(user => {
        if(user){
            if(acno != currentAcno){
                return {
                    status: false,
                    message: "Permission Denied",
                    statusCode: 401
                }
            }

            return {
                status: true,
                statusCode: 200,
                transaction: user.transaction
            }
        }
        else{
            return {
                status: false,
                message: "User does not exist!!!",
                statusCode: 401
            }
        }
    })
}

// Delete
const deleteAcc = (req, acno) => {
    var currentAcno = req.currentAcno
    return db.Users.deleteOne({
        acno
    }).then(user => {
        console.log(user)
        if(! user){
            return {
                status: false,
                message: "Operation filed!!!",
                statusCode: 401
            }
        }
        else{
            if(acno != currentAcno){
                return {
                    status: false,
                    message: "Permission Denied",
                    statusCode: 401
                }
            }

            if(user.deletedCount == 0){
                return {
                    status: false,
                    message: "Already deleted!!!",
                    statusCode: 401
                }
            }

            return {
                status: true,
                statusCode: 200,
                message: "Successfully deleted"
            }
        }
    })
}


module.exports = {
    registor,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
}