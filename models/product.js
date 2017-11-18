var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    titile: {type: String, required: true},
    description: {type: String, required: true},
    prices: {type: Number, required: true}
});

module.exports=mongoose.model('Product',schema);