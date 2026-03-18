import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log("✅ MongoDB connected");
        console.log("Host:", conn.connection.host);
        console.log("DB:", conn.connection.name);

    } catch (err) {

        console.log("❌ Mongo error");
        console.log(err);

    }
};