import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    type: String,
    amount: Number,
    imageUrl: String,
    imagePublicId: String
})

export default mongoose.model("Product", ProductSchema)