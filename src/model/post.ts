import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
    {
        userId: String,
        providerId: String,
        serviceId: String,
        image: String,
        description: String,
        numLikes: Number,
        likes: Array,
        numComments: Number,
        comments: Array,
        rate: Number,
        isDeleted: Boolean,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Post", PostSchema);