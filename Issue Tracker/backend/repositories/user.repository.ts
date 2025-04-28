import UserModel from "../db/models/user.model";
import { IUser } from "../db/interfaces/user.interface";
import NotFoundError from "../exceptions/NotFoundException";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const UserRepository = {
  async getAllUsers(): Promise<IUser[]> {
    const users = await UserModel.find().lean();
    return users;
  },

  async getUserByUsername(username: string): Promise<IUser> {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      throw new NotFoundError(`User with username ${username} not found`);
    }
    return user;
  },

  async getUserById(id: string): Promise<IUser> {
    const user = await UserModel.findById(id).lean();
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  },

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email }).lean();
    return user;
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if (!userData.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await this.hashPassword(userData.password);

    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    return savedUser.toObject();
  },

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export default UserRepository;