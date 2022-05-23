import mongoose, { Schema } from "mongoose";

const LikeSchema: Schema = new Schema(
    {
        userIds: Array,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Like", LikeSchema);