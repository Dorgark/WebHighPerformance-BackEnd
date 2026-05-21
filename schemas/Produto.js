import mongoose from "mongoose"

const ProdutoSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    type: String,
    amount: Number
})

export default mongoose.model("Produto", ProdutoSchema)