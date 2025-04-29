import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
    name: string;
    description?: string;
    createdBy: Types.ObjectId;
    members: Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);