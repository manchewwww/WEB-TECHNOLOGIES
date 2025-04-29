import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";

class AuthService {
    
  async register(username: string, firstname: string, lastname: string, email: string, password: string) {
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Този имейл вече е зает.");
    }

    const newUser = await UserRepository.createUser({
      username,
      firstname,
      lastname,
      email,
      password,
      role: "user",
    });

    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(email: string, password: string) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Грешен имейл или парола.");
    }
    
    const isPasswordValid = await UserRepository.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Грешен имейл или парола.");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: any) {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
    );
 }

    private generateRefreshToken(user: any) {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "1d" }
        );
    }

}

export default new AuthService();
