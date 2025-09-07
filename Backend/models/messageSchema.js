const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required:true
    },
    content: {
        type: String,
        required:true
    },
    timeStamps: {
        type:Date,
        default:Date.now()
    }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;