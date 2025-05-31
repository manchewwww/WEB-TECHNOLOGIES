import { Types } from "mongoose";

export interface IUser{
  _id: Types.ObjectId;
  isActive: boolean;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}