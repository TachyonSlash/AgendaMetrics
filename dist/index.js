"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("./routers/user"));
var errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
var app = (0, express_1.default)();
app.get('/', function (req, res) {
    var name = process.env.NAME || 'World';
    res.send("Hello ".concat(name, "!"));
});
var port = parseInt(process.env.PORT || '3000');
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
app.use(express_1.default.json());
app.use('/api/users', user_1.default);
app.use(errorHandler_1.default);
//# sourceMappingURL=index.js.map