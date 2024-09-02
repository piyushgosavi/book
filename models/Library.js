const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    books:[{
        type:mongoose.Schema.Types.ObjectId, ref:'Book'
    }]
})

module.exports = mongoose.model('Library',librarySchema);