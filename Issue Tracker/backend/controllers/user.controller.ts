import express, { Request, Response, Router, RequestHandler } from "express";
import userService from "../services/user.service";

class UserController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/roles", this.getRoles.bind(this) as RequestHandler);
        this.router.get("", this.getAllUsers.bind(this) as RequestHandler);
        this.router.get("/:id", this.getUserById.bind(this) as RequestHandler);
        this.router.patch("/:id/role", this.updateUserRole.bind(this) as RequestHandler);
        this.router.delete("/:id", this.deleteUser.bind(this) as RequestHandler);
    }

    private async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.status(201).json(users);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    private async updateUserRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.body;
            const updatedUser = await userService.updateUserRole(req.params.id, role);
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    private async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            await userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    private async getRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await userService.getRoles();
            res.status(200).json(roles);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
  
}

export default new UserController().router;
