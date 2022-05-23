import mongoose, { Schema } from "mongoose";

const ProviderSchema: Schema = new Schema(
    {
        name: { type: String },
        address: { type: String },
        serviceRate: Array,
        isVerified: { type: Boolean },
        isDeleted: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<any>("Provider", ProviderSchema);