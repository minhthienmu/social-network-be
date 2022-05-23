import mongoose, { Schema } from "mongoose";

const FollowSchema: Schema = new Schema(
    {
        follower: Array,
        following: Array,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Follow", FollowSchema);