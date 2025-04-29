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

    const newUser = new UserModel(userData);

    const savedUser = await newUser.save();
    return savedUser.toObject();
  },

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true, lean: true });
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  },
  
  async deleteUser(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
  },
};

export default UserRepository;