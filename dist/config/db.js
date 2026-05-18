"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const MONGODB_USERNAME = process.env['MONGODB_USERNAME'];
    const MONGODB_PASSWORD = process.env['MONGODB_PASSWORD'];
    const MONGODB_CLUSTER = process.env['MONGODB_CLUSTER'];
    const MONGODB_DB_NAME = process.env['MONGODB_DB_NAME'];
    if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DB_NAME) {
        throw new Error('MongoDB connection details are not fully defined in the environment variables');
    }
    const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DB_NAME}`;
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Handle connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
// Handle connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
//# sourceMappingURL=db.js.map