import User from '../models/user';
import Routine from '../models/routine';

// Obtiene todos los usuarios de la base de datos
const getAllUsers = async () => {
    const users = await User.find({});
    return users;
};

const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user;
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
    deleteUser 
};
