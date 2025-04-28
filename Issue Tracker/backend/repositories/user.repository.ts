import UserModel from "../db/models/user.model";
import { IUser } from "../db/interfaces/user.interface";
import NotFoundError from "../exceptions/NotFoundException";

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

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();
    return savedUser.toObject();
  }
};

export default UserRepository;
