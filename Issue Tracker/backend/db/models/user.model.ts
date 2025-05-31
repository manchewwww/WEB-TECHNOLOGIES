import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema({
  isActive: { type: Boolean, required: true },
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "manager", "user"],
    default: "user"
  },
}, {
  versionKey: false
});

export default mongoose.model<IUser>("User", UserSchema);
