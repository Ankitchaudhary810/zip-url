const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const formSchema = new Schema({
    FullName: {
        type: String,
        require: true,
        trim: true,
    },
    Email: {
        type: String,
        require: true,
        trim: true,
    },
    Message: {
        type: String,
        require: true,
        trim: true,
    }
});

module.exports = new mongoose.model("form", formSchema);