import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// DTO para la autenticación
interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
}

// DTO para el login
interface LoginUserDTO {
    email: string;
    password: string;
}

// Función auxiliar para generar nuestros propios tokens
const generateAuthToken = (user: any) => {
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    if(!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en las variables de entorno. El servidor se detendrá.');
        process.exit(1);
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: user.toJSON() };
};

// Logica para registrar un usuario nuevo con contraseña
const registerUser = async (userData: CreateUserDTO) => {
    const { username, email, password } = userData;

    if(!password || password.length < 6) {
        const error = new Error('La contraseña es obligatoria y debe tener al menos 6 caracteres');
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
    return savedUser;
};

// Logica para el login
const loginUser = async (credentials: LoginUserDTO) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    const passwordCorrect = user === null || !user.passwordHash
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        const error = new Error('Credenciales inválidas');
        (error as any).statusCode = 401;
        throw error;
    }

    return generateAuthToken(user);
};

// Logica para el login con google
const loginWithGoogle = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub || !payload.name) {
        const error = new Error('Token de Google inválido o incompleto');
        (error as any).statusCode = 401;
        throw error;
    }

    const { sub: googleId, email, name: username } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
        user = await new User({
            username,
            email,
            googleId,
        }).save();
    }

    return generateAuthToken(user);
};

export const authService = {
    registerUser,
    loginUser,
    loginWithGoogle
};