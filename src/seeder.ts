import dotenv from 'dotenv'
dotenv.config()

import {Customer} from './mongoose'

import customers from './data/customer'
import connectDB from './connect'

connectDB()

const customerModel = new Customer()

const importData = async () => {
    try {
        await customerModel.deleteMany()
        await customerModel.createMany(customers)

        console.log('Data Imported')
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await customerModel.deleteMany()

        console.log('Data Destroyed')
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
        
    }
}

if (process.argv[2] == '-d') {
    destroyData()
}else {
    importData()
}