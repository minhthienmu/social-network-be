import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
    {
        userId: String,
        providerId: String,
        serviceId: String,
        image: String,
        description: String,
        numLikes: Number,
        numComments: Number,
        rate: Number,
        isDeleted: Boolean,
        commentId: String,
        likeId: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Post", PostSchema);