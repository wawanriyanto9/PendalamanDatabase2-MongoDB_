import dotenv from 'dotenv'
dotenv.config()

import express, { response } from 'express'
import connectDB from './connect'
import customers from './data/customer'
import { Customer, CustomerType } from './mongoose'

const app = express();
connectDB()

const customerModel = new Customer()

//middleware
app.use(express.json())
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    response.status(500).json({
        success: false,
        message: err.message
    })
})

app.get('/', async (req, res, next) => {
    res.json({
        message: 'success'
    })
})

//route POST /customers
app.post('/customers', async (req, res, next) => {
    try {
    if (req.body instanceof Array) {
        await customerModel.createMany(req.body)
    } else {
        await customerModel.create(req.body)
    }
        
    } catch (error) {
        return next(error)
    }
})

//route GET /customers
app.get('/customers', async (req, res, next) => {
    const limit = Number(req.query.limit) || 10
    let customers: CustomerType[]

    try {
        customers = await customerModel.getAll(limit)
    } catch (error) {
        return next(error)
    }

    res.json(customers)
})

//route GET /customers/search?name=
app.get('/customers/search', async (req, res, next) => {
    let customers: CustomerType[]
    const name = req.query.name ? {
        first_name: {
            $regex: req.query.name as string,
            $options: 'i'
        }
    } : {}

    try {
        customers = await customerModel.getByName(name)
    } catch (error) {
        return next (error)
    }

    res.json(customers)
})

//route GET /customers/type/:type
app.get('/customers/type/:type', async (req, res, next) => {
    let customers: CustomerType[]
    const type = req.params.type as string

    try {
        customers = await customerModel.getByType(type)
    } catch (error) {
        return next (error)
    }

    res.json(customers)
})

//route GET /customers/state/:state
app.get('/customers/state/:state', async (req, res, next) => {
    let customers: CustomerType[]
    const state = req.params.state as string

    try {
        customers = await customerModel.getByState(state)
    } catch (error) {
        return next (error)
    }

    res.json(customers)
})

//route GET /customers/age/:age
app.get('/customers/age/:age', async (req, res, next) => {
    let customers: CustomerType[]
    const age = req.params.age
    try {
        customers = await customerModel.getByAge(age)
    } catch (error) {
        return next (error)
    }

    res.json(customers)
})

app.listen(3000, () => {
    console.log('App listen on port 3000')
})