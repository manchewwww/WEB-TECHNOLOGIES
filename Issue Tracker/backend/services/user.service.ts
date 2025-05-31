import UserRepository from "../repositories/user.repository";
import { RoleValues, RoleType } from "../constants/RoleType";
import NotFoundError from "../exceptions/NotFoundException";

class UserService {

    async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return users.map(user => {
            return { id: user._id, username: user.username, email: user.email, role: user.role }
        })
    }

    async getUserById(id: string) {
        const user = await UserRepository.getUserById(id);
        return {
            id: user._id,
            username: user.username,
            email: user.email, 
        };
    }

    async updateUserRole(id: string, role: string) {
        if (!Object.values(RoleValues).includes(role as RoleType)) {
            throw new NotFoundError(`Invalid role: ${role}`);
        }

        const updatedUser = await UserRepository.updateUser(id, { role: role as RoleType });
        return {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        };
    }

    async deleteUser(id: string) {
        await UserRepository.deleteUser(id);
        return { message: `User with ID ${id} deleted successfully` };
    }

    async getRoles(): Promise<RoleType[]> {
        return Object.values(RoleValues);
    }

}

export default new UserService();
