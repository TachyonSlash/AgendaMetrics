import bcrypt from 'bcrypt';
import User from '../models/user';


// Interfaz para el DTO de creación de usuario
interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
}

// Obtiene todos los usuarios de la base de datos
const getAllUsers = async () => {
    const users = await User.find({});
    return users;
};


const createUser = async (userData: CreateUserDTO) => {
    const { username, email, password } = userData;

    if (!password || password.length < 6) {
        const error = new Error('La contrasela es obligatoria y debe tener al menos 6 caracteres');
        (error as any).statusCode = 400;
        throw error;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        username,
        email,
        passwordHash
    });
    
    const savedUser = await newUser.save();
    return savedUser

}

const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user;
}

export const userService = {
    getAllUsers,
    createUser,
    getUserById
}
