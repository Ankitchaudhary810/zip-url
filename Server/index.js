const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const useragent = require('express-useragent');
const path = require('path');
const apicache = require("apicache");


// Middleware
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.set('view engine', 'ejs');
dotenv.config();

// Mongodb Connection
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('connected', () => {
  console.log("Mongoose connection done");
})
db.on("error", (err) => {
  console.log("Mongoose default connection fail: " + err);
})

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");
const urlRoutes = require("./routes/url");
const adminRoutes = require("./routes/admin.js");
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/', urlRoutes);
app.use('/admin', adminRoutes);

app.use(useragent.express());
app.get("/", (req, res) => {

  res.status(200).json("zipurl working")

})

// Start the server
const PORT = 1234
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});