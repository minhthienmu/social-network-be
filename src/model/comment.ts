import mongoose, { Schema } from "mongoose";

const CommentSchema: Schema = new Schema(
    {
        comments: Array,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Comment", CommentSchema);