"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventStudent = exports.getUsersByEvent = exports.getEventsByUser = exports.getEvent = exports.createEvent = exports.getReturningUser = exports.getUser = exports.createUser = void 0;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../mydb.db');
db.serialize(() => {
    db.run(
    // Creates organizers table if doesn't exist
    `CREATE TABLE IF NOT EXISTS organizers (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)`);
    db.run(
    // Creates students table if doesn't exist
    `CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)`);
    db.run(
    // Creates events table if doesn't exist
    `CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, location TEXT NOT NULL, start TEXT NOT NULL, end TEXT NOT NULL, organizerId TEXT NOT NULL, FOREIGN KEY (organizerId) REFERENCES organizers(id))`);
    db.run(
    // Creates event_student table if doesn't exist
    `CREATE TABLE IF NOT EXISTS event_student (id INTEGER PRIMARY KEY AUTOINCREMENT, eventId TEXT NOT NULL, studentId TEXT NOT NULL, FOREIGN KEY (eventId) REFERENCES events(id), FOREIGN KEY (studentId) REFERENCES students(id))`);
});
// Function to create a user
const createUser = (id, username, firstName, lastName, email, password, userType // Passed into query as table name + 's
) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO ${userType}s (id, username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?, ?)`, [id, username, firstName, lastName, email, password], (err) => {
            if (err) {
                return reject(err);
            }
            resolve(getUser(id, userType));
        });
    });
};
exports.createUser = createUser;
// Function to get a user. Receives id from firebase and userType to determine user or organizer.
const getUser = (id, userType) => {
    return new Promise((resolve, reject) => {
        const res = {};
        const query = `SELECT * FROM ${userType}s WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return reject(new Error('User not found'));
            }
            // Populate the res object with row data
            for (const [key, value] of Object.entries(row)) {
                res[key] = value;
            }
            resolve(res);
        });
    });
};
exports.getUser = getUser;
// Function to get a returning user. Receives id from firebase and userType to determine user or organizer.
const getReturningUser = (id) => {
    return new Promise((resolve, reject) => {
        const res = {};
        const queryS = `SELECT * FROM student WHERE id = ?`;
        db.get(queryS, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (row) {
                // Populate the res object with student row data
                for (const [key, value] of Object.entries(row)) {
                    res[key] = value;
                }
                res['type'] = "student";
                return resolve(res);
            }
            const queryEO = `SELECT * FROM organizer WHERE id = ?`;
            db.get(queryEO, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new Error('User not found'));
                }
                // Populate the res object with organizer row data
                for (const [key, value] of Object.entries(row)) {
                    res[key] = value;
                }
                res['type'] = "organizer";
                resolve(res);
            });
        });
    });
};
exports.getReturningUser = getReturningUser;
// getEvent
const getEvent = (id) => {
    return new Promise((resolve, reject) => {
        const res = {};
        const query = `SELECT * FROM events WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return reject(new Error('Event not found'));
            }
            // Populate the res object with row data
            for (const [key, value] of Object.entries(row)) {
                res[key] = value;
            }
            console.log(res);
            resolve(res);
        });
    });
};
exports.getEvent = getEvent;
// createEvent
const createEvent = (id, title, location, start, end, organizerId) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO events (id, title, location, start, end, organizerId) VALUES (?, ?, ?, ?, ?, ?)`, [id, title, location, start, end, organizerId], (err) => {
            if (err) {
                return reject(err);
            }
            resolve(getEvent(id));
        });
    });
};
exports.createEvent = createEvent;
// create event_student
const createEventStudent = (eventId, studentId) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO event_student (eventId, studentId) VALUES (?, ?)`, [eventId, studentId], (err) => {
            if (err) {
                return reject(err);
            }
            resolve('done');
        });
    });
};
exports.createEventStudent = createEventStudent;
// getUsersByEvent
const getUsersByEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield new Promise((resolve, reject) => {
            db.all(`SELECT * FROM event_student WHERE eventId = ?`, [eventId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
        // Fetch detailed user data for each studentId
        const detailedUsers = yield Promise.all(rows.map((row) => getUser(row.studentId, 'student')));
        return detailedUsers;
    }
    catch (error) {
        console.error('Error in getUsersByEvent:', error);
        throw error;
    }
});
exports.getUsersByEvent = getUsersByEvent;
// getEventsByUser
const getEventsByUser = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield new Promise((resolve, reject) => {
            db.all(`SELECT * FROM event_student WHERE studentId = ?`, [studentId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
        // Fetch detailed event data for each eventId
        const detailedEvents = yield Promise.all(rows.map((row) => getEvent(row.eventId)));
        return detailedEvents;
    }
    catch (error) {
        console.error('Error in getEventsByUser:', error);
        throw error;
    }
});
exports.getEventsByUser = getEventsByUser;
