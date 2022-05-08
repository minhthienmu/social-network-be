import mongoose, { Schema } from "mongoose";

const ServiceSchema: Schema = new Schema(
    {
        name: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Service", ServiceSchema);