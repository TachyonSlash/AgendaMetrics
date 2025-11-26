import { Schema, Types, model, Document } from 'mongoose'

// Estructura del objeto de frecuencia
interface IFrequency {
    type: 'diaria' | 'semanal' | 'mensual' | 'dias_especificos';
    // Array de números para dias(0: domingo, 1: lunes etc), solo se usa si es dias_especificos
    days?: number[];
}

// Describe todas las propiedades de una rutina
export interface IRoutine extends Document {
    user: Types.ObjectId, // Usuario que crea la rutina
    name: string,
    category: 'trabajo' | 'estudio' | 'sueño' | 'ejercicio' | 'otro',
    frequency: IFrequency,
    estimatedDuration: number, // Duración en minutos
    suggestedTime?: string, // HH:MM
    notifications: boolean,
    created: Date;
}

// Esquema de mongoose
const routineSchema = new Schema<IRoutine>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Mejora el rendimiento de las búsquedas
    },
    name: {
        type: String,
        required: [true, "El nombre de la actividad es obligatorio."],
        trim: true
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria."],
        enum: { // Limita los valores posibles a esta lista
            values: ['trabajo', 'estudio', 'sueño', 'ejercicio', 'otro'],
            message: '{VALUE} no es una categoría válida.'
        }
    },
    frequency: {
        type: {
            type: String,
            required: true,
            enum: ['diaria', 'semanal', 'mensual', 'dias_especificos']
        },
        days: {
            type: [Number], // Un array de números
            // Validador personalizado: solo exige este campo si la frecuencia es 'dias_especificos'
            validate: {
                validator: function(this: any, value: number[]) {
                    return this.frequency.type !== 'dias_especificos' || (Array.isArray(value) && value.length > 0);
                },
                message: 'Para una frecuencia de días específicos, debes proveer los días.'
            }
        }
    },
    estimatedDuration: {
        type: Number, // Se guardará en minutos
        required: [true, "La duración estimada es obligatoria."],
        min: [1, "La duración debe ser de al menos 1 minuto."]
    },
    suggestedTime: {
        type: String, // Formato "HH:MM"
        required: false, // Es opcional
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "El formato de hora debe ser HH:MM (ej. 09:30 o 14:00)"]
    },
    notifications: {
        type: Boolean,
        default: true // Las notificaciones estarán activadas por defecto
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }

});

const Routine = model<IRoutine>('Routine', routineSchema);

export default Routine;