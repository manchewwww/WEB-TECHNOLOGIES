import mongoose, { Schema } from "mongoose";
import { ITicket } from "../interfaces/ticket.interface";

const CommentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

const TicketSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["open", "in_progress", "review", "closed"],
            default: "open",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "low",
        },
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        assignee: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        comments: [CommentSchema],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<ITicket>("Ticket", TicketSchema);
