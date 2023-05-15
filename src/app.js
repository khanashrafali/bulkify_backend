const express = require('express')
const connectDB = require('./config/db')
const logger = require('./helpers/logger');
const appRoutes = require("./routes/routes.js");
const cors = require("cors");


const app = express();

// handle cors
app.use(cors({ origin: "*" }));

// parse json data middleware
app.use(express.json());

// parse url encoaded data middleware
app.use(express.urlencoded({ extended: false }));

// load app routes
app.use(appRoutes);

connectDB()



// app.listen(3000, () => {
//     console.log(`Server is Connected ${3000}`)
// })


module.exports = app;