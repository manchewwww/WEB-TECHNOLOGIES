import { Types } from "mongoose";
import { RoleType } from "../../constants/RoleType";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: RoleType;
}