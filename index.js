const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const dataservice = require('./services/data.service')

// Middleware
const jwtMiddleware = (req, res, next) => {
    try{
        // fetch token
        token = req.headers['access_token']
        // verify token
        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data);
        next()
    }
    catch{
        res.status(401).json({
            status : false,
            statusCode: 401,
            message: 'Please login'
        })
    }
}

app.post('/registor', (req,res) => {
    console.log(req)
    const result = dataservice.registor(req.body.username, req.body.acno, req.body.password)

    // if(result){
    //     res.send("Registor Successfully")
    // }
    // else{
    //     res.send("Already Registered")
    // }

    res.status(result.statusCode).json(result)
})

app.post('/login', (req,res) => {
    const result = dataservice.login(req.body.acno, req.body.password)
    res.status(result.statusCode).json(result)
})

app.post('/deposit', jwtMiddleware,(req,res) => {
    const result = dataservice.deposit(req.body.acno, req.body.password, req.body.amt)
    res.status(result.statusCode).json(result)
})

app.listen(3000, () => {
    console.log("Server Started at 3000");
})