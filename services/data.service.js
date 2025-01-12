// import jsonwebtoken
const jwt = require('jsonwebtoken')

// DataBase
db = {
    1000 : { "acno":1000, "username":"justine", "password":1000, "balance":5000 }
}

// Registor
const registor = (username, acno, password) => {
    if(acno in db){
        // return false
        return{
            status : false,
            message: 'Already Registered. Please login',
            statusCode: 401
        }
    }

    else {
        db[acno] = {
            acno,
            username,
            password,
            "balance":0,
            transaction:[]

        }
        console.log(db)
        // return true
        return{
            status : true,
            message: "Registered Successfully",
            statusCode: 200
        }
    }
}

const login = (acno, password) => {
    if(acno in db){
        if(password == db[acno]["password"]){
            currentuser = db[acno]["username"]
            currentaccount = acno
            token = jwt.sign({
                // store account number inside token
                currentAccount : acno
            }, 'supersecretkey12345')
            return{
                status : true,
                message: "Login Successfully",
                statusCode: 200,
                currentuser,
                currentaccount,
                token
            }
        }
        else{
            return{
                status : false,
                message: "Incorrect Password",
                statusCode: 401
            }
        }

    }
    else{
        return{
            status : false,
            message: "User does not exists",
            statusCode: 401
        }
    }
}

const deposit = (acno, password, amt) => {
    var amount = parseInt(amt);
    if (acno in db) {
        if (password == db[acno]['password']) {
            db[acno]['balance'] += amount;
            db[acno].transaction.push({
                type: "CREDIT",
                amount: amount
            });
            console.log(db);
            return {
                status: true,
                message: amount + " deposited successfully.. New balance is " + db[acno]["balance"],
                statusCode: 200
            };
        } else {
            return {
                status: false,
                message: "Incorrect Password",
                statusCode: 401
            };
        }
    } else {
        return {
            status: false,
            message: "Account number not found",
            statusCode: 404
        };
    }
};


module.exports = {
    registor, login, deposit
}