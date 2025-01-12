const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

// cors use in server app
app.use(cors({
    origin : 'http://localhost:4200'
}))

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
        req.currentAcno = data.currentAccount
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
    // registor solving - Asynchronus
    dataservice.registor(req.body.username, req.body.acno, req.body.password).then(result =>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/login', (req,res) => {
    // login solving Asynchronus
    dataservice.login(req.body.acno, req.body.password).then(result =>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/deposit', jwtMiddleware,(req,res) => {
    // deposit solving Asynchronus
    dataservice.deposit(req, req.body.acno, req.body.password, req.body.amt).then(result =>{
    res.status(result.statusCode).json(result)
    })
})

app.post('/withdraw', jwtMiddleware,(req,res) => {
    // withdraw solving Asynchronus
    dataservice.withdraw(req, req.body.acno, req.body.password, req.body.amt).then(result =>{
    res.status(result.statusCode).json(result)
    })
})

app.post('/transaction', jwtMiddleware,(req,res) => {
    // withdraw solving Asynchronus
    dataservice.getTransaction(req, req.body.acno).then(result =>{
    res.status(result.statusCode).json(result)
    })
})

// Delete Account API
app.delete('/deleteAcc/:accno', jwtMiddleware,(req,res) => {
    // delete solving Asynchronus
    dataservice.deleteAcc(req, req.params.accno).then(result =>{
    res.status(result.statusCode).json(result)
    })
})

app.listen(3000, () => {
    console.log("Server Started at 3000");
})