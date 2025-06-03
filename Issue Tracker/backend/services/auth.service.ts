import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const SALT_ROUNDS = 10;

class AuthService {

  async register(username: string, firstname: string, lastname: string, email: string, password: string) {
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException("Email already in use");
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await UserRepository.createUser({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "user",
      isActive: true,
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
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("User is not active");
    }

    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
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
      process.env.ACCESS_TOKEN_SECRET || "default",
      { expiresIn: "15m" }
    );
  }

  private generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET || "default",
      { expiresIn: "1d" }
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  private async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

}

export default new AuthService();
