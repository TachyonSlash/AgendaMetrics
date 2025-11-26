import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';


// Interfaz para el DTO de creación de usuario
interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
}

// Interfaz para el DTO de login
interface LoginUserDTO {
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

const loginUser = async (credentials: LoginUserDTO) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        const error = new Error('Credenciales inválidas');
        (error as any).statusCode = 401;
        throw error;
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en las variables de entorno. El servidor se detendrá.');
        process.exit(1);
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user: user.toJSON() };
};

export const userService = {
    getAllUsers,
    createUser,
    getUserById,
    loginUser
}
