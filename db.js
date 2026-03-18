import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(process.env.MONGO_URL);
    } catch (err) {
        console.log(err)
    }

}