import mongoose, { Schema } from "mongoose";

const NotificationSchema: Schema = new Schema(
    {
        notification: Array,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Notification", NotificationSchema);