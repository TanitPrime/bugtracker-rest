const mongoose = require("mongoose")

const schema = new mongoose.Schema({name:'string'})
const animal = mongoose.model('Animal',schema);

module.exports = animal;