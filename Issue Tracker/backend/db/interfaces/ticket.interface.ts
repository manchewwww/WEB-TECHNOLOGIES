import { Types } from "mongoose";
import { StatusType } from "../../constants/StatusType";
import { PriorityType } from "../../constants/PriorityType";

interface IComment {
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

export interface ITicket {
    _id: Types.ObjectId;
    title: string;
    description: string;
    status: StatusType;
    priority: PriorityType;
    projectId: Types.ObjectId;
    assignee?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    comments?: IComment[];
}