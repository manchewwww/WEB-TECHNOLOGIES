import { IUser } from "../db/models/User";

class UserRepository {
    //TODO: Replace with real database calls
  private users: IUser[] = [
    {
      _id: "1",
      username: "test",
      email: "test@test.com",
      password: "password123",
      role: "user",
      setPassword: function (this: IUser, password: string) {
        this.password = password;
      },
      validatePassword: function (this: IUser, password: string) {
        return password === "password123";
      },
    } as unknown as IUser,
    {
      _id: "2",
      username: "admin",
      email: "admin@admin.com",
      password: "admin123",
      role: "admin",
      setPassword: function (this: IUser, password: string) {
        this.password = password;
      },
      validatePassword: function (this: IUser, password: string) {
        return password === "admin123";
      },
    } as unknown as IUser,
  ];

  async createUser(username: string, email: string, password: string): Promise<IUser> {
    const newUser: IUser = {
      _id: (this.users.length + 1).toString(),
      username,
      email,
      password,
      role: "user",
      setPassword: function (this: IUser, password: string) {
        this.password = password;
      },
      validatePassword: function (this: IUser, password: string) {
        return this.password === password;
      },
    } as unknown as IUser;

    this.users.push(newUser);
    return newUser;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const user = this.users.find((user) => user._id === id);
    return user || null;
  }
}

export default new UserRepository();
