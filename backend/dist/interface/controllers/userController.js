"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class UserController {
    constructor(userAuthService) {
        this.userAuthService = userAuthService;
    }
    async addUser(req, res) {
        const { email, password, firstName, lastName, role } = req.body;
        const user = await this.userAuthService.addUser(firstName, lastName, email, password, role);
        return ResponseFormatter_1.ResponseFormatter.success(res, user, "User created successfully", 201);
    }
}
exports.UserController = UserController;
