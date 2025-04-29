import { Types } from "mongoose";

interface IComment {
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface ITicket {
    _id: Types.ObjectId;
    title: string;
    description: string;
    status: "open" | "in_progress" | "review" | "closed";
    priority: "low" | "medium" | "high" | "critical";
    projectId: Types.ObjectId;
    assignee?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    comments?: IComment[];
}