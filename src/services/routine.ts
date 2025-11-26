import Routine, { IRoutine } from '../models/routine';
import { Types } from 'mongoose';

// Interfaz para el DTO de creación de rutina
interface CreateRoutineDTO extends Omit<IRoutine, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'created'> { }

// Interfaz para el DTO de actualización. Todos los campos son opcionales.
interface UpdateRoutineDTO extends Partial<CreateRoutineDTO> { }

const getAllRoutines = async () => {
    const routines = await Routine.find({  }).populate('user', 'username email');
    return routines;
};

const getAllUserRoutines = async (userId: string | Types.ObjectId) => {
    const routines = await Routine.find({ user: userId });
    return routines;
};

const getRoutineById = async (id: string, userId:string | Types.ObjectId) => {
    const routine = await Routine.findOne({ _id: id, user: userId });
    return routine;
};

const createRoutine = async (routineData: CreateRoutineDTO, userId: string | Types.ObjectId) => {
    const newRoutine = new Routine({
        ...routineData,
        user: userId // Asocia la rutina con el usuario
    });

    const savedRoutine = await newRoutine.save();
    return savedRoutine;
};

const updateRoutine = async (id: string, updateData: UpdateRoutineDTO, userId: string | Types.ObjectId) => {
    const updatedRoutine = await Routine.findOneAndUpdate(
        { _id: id, user: userId }, // Solo actualice si el Id y el usuario coincide
        updateData,
        { new: true, runValidators: true }
    );

    if(!updatedRoutine) {
        const error = new Error('La rutina no existe o no pertenece al usuario');
        (error as any).statusCode = 404;
        throw error;
    }

    return updatedRoutine;

};

const deleteRoutine = async (id: string, userId: string | Types.ObjectId) => {
    const result = await Routine.findOneAndDelete({ _id: id, user: userId });
    
    if(!result){
        const error = new Error('La rutina no existe o no pertenece al usuario');
        (error as any).statusCode = 404;
        throw error;
    }
};


export const routineService = {
    getAllRoutines,
    getAllUserRoutines,
    getRoutineById,
    createRoutine,
    updateRoutine,
    deleteRoutine
}