const mongoose = require('mongoose');

const venderSchema = mongoose.Schema({
   first_name: {
    type: String,
   },
   last_name: {
    type: String,
   },
   email: {
    type: String
   },
   company_name: {
    type: String
   },
   company_country: {
    type: String
   }, 
   mobile: {
    type: String
   },
   password: {
    type: String
   }
    
})