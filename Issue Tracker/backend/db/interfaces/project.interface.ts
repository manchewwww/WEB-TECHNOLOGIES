import { Types } from "mongoose";

export interface IProject{
    _id: Types.ObjectId;
    name: string;
    description?: string;
    createdBy: Types.ObjectId;
    members: Types.ObjectId[];
}

