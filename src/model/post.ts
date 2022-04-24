import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
    {
        userId: String,
        image: String,
        description: String,
        tag: String,
        numLikes: Number,
        likes: Array,
        numComments: Number,
        comments: Array,
        isDeleted: Boolean,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Post", PostSchema);