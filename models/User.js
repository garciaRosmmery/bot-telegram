const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    dni: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    created_at: {
        type: Date
    }
})

module.exports = model('User', userSchema);