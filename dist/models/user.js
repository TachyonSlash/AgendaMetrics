"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Esquema de Mongoose
var userSchema = new mongoose_1.Schema({
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
        required: [true, "La contraseña es obligatoria"]
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
}, {
    // Transformar el Schema a Json
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
        }
    }
});
var User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map