const mongoose = require('mongoose')
const Schema = mongoose.Schema

const barHopsSchema = new Schema({
    restaurant: {
        type: String,
    },
    price: {
        type: String
    },
    rating: {
        type: String
    },
    address: {
        type: String
    },
    

})

module.exports = mongoose.model('barHops', barHopsSchema)