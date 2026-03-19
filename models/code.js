import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const codeSchema = new Schema(
    {
        roomId: {
            type: String,
            required: true
        },

        code: {
            type: String,
            default: ""
        },

        language: {
            type: String,
            default: "javascript"
        },

        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model("Code", codeSchema);