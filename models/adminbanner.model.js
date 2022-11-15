const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BannerSchema = new Schema({
    heading: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }

});


module.exports = new mongoose.model('banner', BannerSchema);
