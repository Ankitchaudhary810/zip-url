const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortUrl: {
    type: String,
    unique: true,
  },
  clicks: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      userAgent: String,
      browser: String,
      os: String,
      platform:String,
      city: String,
      region: String,
      country_name: String,
      org: String,
    },
  ],
  password: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  }
});

module.exports = mongoose.model('url', urlSchema);
