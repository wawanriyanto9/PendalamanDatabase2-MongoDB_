import mongoose from 'mongoose'

export type CustomerType = {
    first_name: string
    last_name: string
    age: number
    customer_type: string
    street: string
    city: string
    state: string
    zip_code: string
    phone_number: string
}

export type CustomerDocument = mongoose.Document & CustomerType

type Keyword = {
    first_name: {
        $regex: string;
        $options: string;
    }
} | {
    first_name ? : undefined;
}

const CustomerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    customer_type: String,
    street: String,
    city: String,
    state: String,
    zip_code: String,
    phone_number: String,
},
{
    timestamps: true
})

export class Customer {
    private model: mongoose.Model<CustomerDocument>

    constructor() {
        this.model = mongoose.model('customer', CustomerSchema)
    }

    async create(data: CustomerType) {
        try {
            const result = await this.model.create(data)
            console.log(result)
        } catch (error) {
            throw error
        }

    }

    async createMany(data: CustomerType[]){
        try {
            const result = await this.model.insertMany(data)
            console.log(result)
        } catch (error) {
            throw error
        }
    }

    async getAll(limit: number) {
        let result: CustomerType[]

        try {
            result = await this.model.aggregate([
                {
                    "$addFields": {
                        "fullname": {"$concat": ["$first_name", " ", "$last_name"]}
                }
                }
            ]).limit(limit).exec()
            //result = await this.model.find({}).Limit(limit)
        } catch (error) {
            throw error
        }

        return result
    }

    async getByName( name: Keyword) {
    let result: CustomerType[]
    try {
        result = await this.model.find({...name})
    } catch (error) {
        throw error
    }

    return result
    }

    async getByType(type: string) {
        let results: CustomerType[]
        try {
            results = await this.model.aggregate([
                {
                    $match: {
                        customer_type: {
                            $eq: type
                        }
                    }
                }
            ]).exec()
        } catch (error) {
            throw error
        }

        return results
    }

    async getByState(state: string) {
        let results: CustomerType[]
        try {
            results = await this.model.aggregate([
                {
                    $match: {
                        customer_state: {
                            $eq: state
                        }
                    }
                }
            ]).exec()
        } catch (error) {
            throw error
        }

        return results
    }

    async getByAge(age: string) {
        let results: CustomerType[]
        try {
            results = await this.model.aggregate([
                {
                    $match: {
                        customer_age: {
                            $eq: age
                        },
                        customer_ageLt: {
                            $lt: [ "$customer_ageLt", "$customer_age"]
                        }
                    }
                }
            ]).exec()
        } catch (error) {
            throw error
        }

        return results
    }

    async deleteMany() {
        try {
            await this.model.deleteMany({})
        } catch (error) {
            throw error
        }
    }
}