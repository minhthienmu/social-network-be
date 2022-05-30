import mongoose, { Schema } from "mongoose";

const ChatRoomSchema: Schema = new Schema(
    {
        userId1: String,
        userId2: String,
        messages: Array,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("ChatRoom", ChatRoomSchema);