"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const errorHanlder_1 = require("./interface/middlewares/errorHanlder");
const logger_1 = require("./shared/utils/logger");
const auth_route_1 = __importDefault(require("./interface/routes/auth.route"));
const doctor_route_1 = __importDefault(require("./interface/routes/doctor.route"));
const user_route_1 = __importDefault(require("./interface/routes/user.route"));
const patient_route_1 = __importDefault(require("./interface/routes/patient.route"));
const appointement_route_1 = __importDefault(require("./interface/routes/appointement.route"));
const medicalFile_route_1 = __importDefault(require("./interface/routes/medicalFile.route"));
const room_route_1 = __importDefault(require("./interface/routes/room.route"));
const machine_route_1 = __importDefault(require("./interface/routes/machine.route"));
const stats_route_1 = __importDefault(require("./interface/routes/stats.route"));
const receptionist_route_1 = __importDefault(require("./interface/routes/receptionist.route"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Swagger setup
const swaggerOptions = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clinic Management Dashboard API",
            version: "1.0.0",
            description: "API documentation for Clinic Management Dashboard",
            contact: {
                name: "Dilmi Abderrahmane",
                email: "abderrahmane.dilmi@ensia.edu.dz",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/interface/routes/*.ts"], // ✅ Point to route files
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOptions));
// Sample route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
// This mounts all auth routes at /auth prefix
app.use("/auth", auth_route_1.default);
// This mounts all doctor routes at /doctors prefix
app.use("/doctors", doctor_route_1.default);
// This mounts all user routes at /users prefix
app.use("/users", user_route_1.default);
// This mounts all patient routes at /patients prefix
app.use("/patients", patient_route_1.default);
// This mounts all appointment routes at /appointments prefix
app.use("/appointments", appointement_route_1.default);
// This mounts all medical file routes at /medical-files prefix
app.use("/medical-files", medicalFile_route_1.default);
// This mounts all room routes at /rooms prefix
app.use("/rooms", room_route_1.default);
// Machines
app.use("/machines", machine_route_1.default);
// Dashboard stats
app.use("/stats", stats_route_1.default);
// (moved machine-stats route into machine.route.ts)
// Receptionists
app.use("/receptionists", receptionist_route_1.default);
app.use(errorHanlder_1.errorHandler);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger_1.Logger.success(`Server is running on port ${PORT}`);
    logger_1.Logger.success(`📚 Swagger UI available at http://localhost:${PORT}/api-docs`);
});
