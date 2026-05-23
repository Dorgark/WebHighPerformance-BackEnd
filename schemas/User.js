import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    number: String
})

export default mongoose.model("User", UserSchema)