/// примерна реализация за потребител (User.ts)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
import mongoose, { Document, Schema, Types } from "mongoose"; // mongoose трябва да се инсталира в проекта
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  role:     { type: String, enum: ["admin", "user"], default: "user" },
});

UserSchema.methods.setPassword = function(password: string) {
  this.passwordSalt = crypto.randomBytes(16).toString('hex');

  this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

  return;
}

UserSchema.methods.validatePassword = function(password: string) {
  const hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

  return this.passwordHash === hash;
}

export default mongoose.model<IUser>("User", UserSchema);



/// примерна реализация за проект(Project.ts)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
  name:        { type: String, required: true },
  description: { type: String },
  createdBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  members:     [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);



/// примерна реализация за билет(Ticket.ts)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
import mongoose, { Schema, Document, Types } from "mongoose";

interface IComment {
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface ITicket extends Document {
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
  userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TicketSchema: Schema = new Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    status:      {
      type: String,
      enum: ["open", "in_progress", "review", "closed"],
      default: "open",
    },
    projectId:  { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee:   { type: Schema.Types.ObjectId, ref: "User" },
    createdBy:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments:   [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ITicket>("Ticket", TicketSchema);
