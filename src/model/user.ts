import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        fullName: { type: String },
        posts: Array,
        followers: Array,
        following: Array,
        isDeleted: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("User", UserSchema);