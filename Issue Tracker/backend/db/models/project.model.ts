import mongoose, { Schema } from "mongoose";
import { IProject } from "../interfaces/project.interface";

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);