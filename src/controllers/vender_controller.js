const mongoose = require('../models/vender_model');

exports.RegisterVender = async(req, res) => {
    try{
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}