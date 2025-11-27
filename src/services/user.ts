import User from '../models/user';
import Routine from '../models/routine';
import bcrypt from 'bcrypt';

// DTO para las actualizaciones del usuario
interface UpdateUserDTO {
    username?: string;
    email?: string;
    password?: string;
}

// Obtiene todos los usuarios de la base de datos
const getAllUsers = async () => {
    const users = await User.find({});
    return users;
};

const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user;
};

const updateUser = async (userId: string, updates: UpdateUserDTO) => {
    const { username, email, password } = updates;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
        const error = new Error('Usuario no encontrado');
        (error as any).statusCode = 404;
        throw error;
    }

    // Validar si el nuevo email ya está en uso por OTRO usuario
    if (email && email !== userToUpdate.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('El correo electrónico ya está en uso');
            (error as any).statusCode = 409;
            throw error;
        }
        userToUpdate.email = email;
    }

    if (username) {
        userToUpdate.username = username;
    }

    // Hashear y actualizar la contraseña si se proporciona una nueva
    if (password) {
        if (password.length < 6) {
            const error = new Error('La nueva contraseña debe tener al menos 6 caracteres');
            (error as any).statusCode = 400;
            throw error;
        }
        const saltRounds = 10;
        userToUpdate.passwordHash = await bcrypt.hash(password, saltRounds);
    }
    
    const updatedUser = await userToUpdate.save();
    return updatedUser;
};

// Elimina un usuario por su ID
const deleteUser = async (userId: string) => {
    // Eliminar todas las rutinas que pertenecen a este usuario.
    await Routine.deleteMany({ user: userId });

    // Eliminar al usuario.
    const result = await User.findByIdAndDelete(userId);
    
    if(!result){
        const error = new Error('Usuario no encontrado para eliminar');
        (error as any).statusCode = 404;
        throw error;
    }
};

export const userService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser 
};
