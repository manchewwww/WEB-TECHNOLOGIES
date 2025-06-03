import express, { Request, Response, Router, RequestHandler } from "express";
import authService from "../services/auth.service";
import jwt from "jsonwebtoken";

class AuthController {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.register.bind(this) as RequestHandler);
    this.router.post("/login", this.login.bind(this) as RequestHandler);
    this.router.post("/refresh", this.refresh.bind(this) as RequestHandler);
  }

  private async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, firstname, lastname, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return;
      }
      const user = await authService.register(username, firstname, lastname, email, password);
      res.status(201).json({ message: "Registration successful.", user });
    } catch (error: any) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.status(200).json({ message: "Login successful.", user });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing." });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string; role: string };
      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    } catch {
      res.status(401).json({ message: "Invalid refresh token." });
    }
  }

}

export default new AuthController().router;
