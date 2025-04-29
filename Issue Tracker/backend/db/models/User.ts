import mongoose, { Document, Schema } from "mongoose"; // mongoose трябва да се инсталира в проекта
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
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
});

UserSchema.methods.setPassword = function (password: string) {
    this.passwordSalt = crypto.randomBytes(16).toString('hex');

    this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

    return;
}

UserSchema.methods.validatePassword = function (password: string) {
    const hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

    return this.passwordHash === hash;
}

export default mongoose.model<IUser>("User", UserSchema);