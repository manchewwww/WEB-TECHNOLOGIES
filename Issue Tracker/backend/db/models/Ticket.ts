import mongoose, { Schema, Document, Types, NumberExpression } from "mongoose";

interface IComment {
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface ITicket extends Document {
    id: Types.ObjectId;
    title: string;
    description: string;
    status: "open" | "in_progress" | "review" | "closed";
    projectId: Types.ObjectId;
    assignee?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    comments?: IComment[];
}

const CommentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const TicketSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["open", "in_progress", "review", "closed"],
            default: "open",
        },
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        assignee: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        comments: [CommentSchema],
    },
    { timestamps: true }
);

export default mongoose.model<ITicket>("Ticket", TicketSchema);
