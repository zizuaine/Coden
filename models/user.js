import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String
});

export default mongoose.model("User", userSchema);