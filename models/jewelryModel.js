const mongoose = require("mongoose");
const Joi = require("joi");


let jewelrysSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    date_created: {
        type: Date, default: Date.now()
    }
})

exports.JewelrysModel = mongoose.model("jewelrys", jewelrysSchema);

exports.validateJewelrys = (reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        info: Joi.string().min(2).max(500).required(),
        category: Joi.string().min(2).max(150).required(),
        img_url: Joi.string().min(2).max(150).allow(null,""),
        price: Joi.number().min(1).max(9999).required(),
    })
    return joiSchema.validate(reqBody);
}