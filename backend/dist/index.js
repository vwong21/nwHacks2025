"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db = __importStar(require("./db"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.uid;
    const token = req.body.token;
    try {
        const userInfo = yield db.getReturningUser(id);
        res.status(200).json({ userInfo: userInfo, message: 'User Found' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(404).json({ error: 'Not Found', message: err.message });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.post('/newUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received POST request to /newUser");
    const id = req.body.uid;
    const user = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    try {
        const userInfo = yield db.createUser(id, user, firstName, lastName, email, password, type);
        res.status(200).json({
            userInfo: userInfo,
            message: `User ${user} Created`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({
                error: 'Bad Request',
                message: err.message,
            });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.post('/event', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.uid;
    try {
        const eventInfo = yield db.getEvent(id);
        res.status(200).json({ eventInfo: eventInfo, message: 'Event Found' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(404).json({ error: 'Not Found', message: err.message });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.post('/newEvent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.uid;
    const title = req.body.title;
    const location = req.body.location;
    const start = req.body.start;
    const end = req.body.end;
    const eoId = req.body.organizerId;
    try {
        const eventInfo = yield db.createEvent(id, title, location, start, end, eoId);
        res.status(200).json({
            eventInfo: eventInfo,
            message: `Event ${title} Created`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({
                error: 'Bad Request',
                message: err.message,
            });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.post('/event_student', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.body.eventId;
    const studentId = req.body.studentId;
    try {
        const eventStudentInfo = yield db.createEventStudent(eventId, studentId);
        res.status(200).json({
            eventStudentInfo: eventStudentInfo,
            message: `Event ${eventId} for Student ${studentId} Created`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({
                error: 'Bad Request',
                message: err.message,
            });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.get('/event_users/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.eventId;
    try {
        const eventUsers = yield db.getUsersByEvent(eventId);
        res.status(200).json({
            eventUsers: eventUsers,
            message: `Students in Event ${eventId} Found`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(404).json({ error: 'Not Found', message: err.message });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.get('/user_events/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userEvents = yield db.getEventsByUser(userId);
        res.status(200).json({
            userEvents: userEvents,
            message: `Events for User ${userId} Found`,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(404).json({ error: 'Not Found', message: err.message });
        }
        else {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Unknown Error',
            });
        }
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
