import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String },
        fullName: { type: String },
        birthday: { type: String },
        phoneNumber: { type: String },
        avatar: { type: String },
        coverImage: { type: String },
        follow: { type: String },
        chatRoom: Array,
        notification: String,
        isDeleted: { type: Boolean },
        role: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("User", UserSchema);