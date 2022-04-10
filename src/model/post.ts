import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
    {
        userId: String,
        image: String,
        description: String,
        tag: String,
        likes: Array,
        comments: Array,
        isDeleted: Boolean,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Post", PostSchema);