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
      const { username, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        res.status(400).json({ message: "Паролите не съвпадат." });
        return;
      }
      const user = await authService.register(username, email, password);
      res.status(201).json({ message: "Успешна регистрация.", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.status(200).json({ message: "Успешен вход.", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh Token липсва" });
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
    } catch (error) {
        res.status(401).json({ message: "Невалиден refresh токен" });
    }
  }

}

export default new AuthController().router;
