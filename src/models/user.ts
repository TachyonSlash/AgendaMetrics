import { Schema, model } from 'mongoose'

// Interfaz de Usuario
interface IUser {
    username: string;
    email: string;
    passwordHash?: string; // Se guarda el hash de la contraseña
    googleId?: string;
    joinDate: Date;
}

// Esquema de Mongoose
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatoruio"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Por favor ingrese una dirección email válida"]
    },
    passwordHash: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Permite multiples documentos con valor nulo
        required: false
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
}, {
    // Transformar el Schema a Json
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
        
        }
    }
});

const User = model<IUser>('User', userSchema);

export default User;