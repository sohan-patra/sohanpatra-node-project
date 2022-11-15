const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = new mongoose.model('comment', CommentSchema);
