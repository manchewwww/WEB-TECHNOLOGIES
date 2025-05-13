import UserRepository from "../repositories/user.repository";

class UserService {
    async getAllUsers() {
        const users = await UserRepository.getAllUsers();
        console.log(users);
        return users.map(user => {
            return { id: user._id, username: user.username }
        })
    }
}

export default new UserService();
