"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    console.error(err.stack);
    var statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error'
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map