import UserRepository from "../repositories/user.repository";

class UserService {
    async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        return users.map(user => {
            return { id: user._id, username: user.username }
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
}

export default new UserService();
