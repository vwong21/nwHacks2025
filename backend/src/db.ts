const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../mydb.db');

db.serialize(() => {
	db.run(
		// Creates organizers table if doesn't exist
		`CREATE TABLE IF NOT EXISTS organizers (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)`
	);
	db.run(
		// Creates students table if doesn't exist
		`CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)`
	);
	db.run(
		// Creates events table if doesn't exist
		`CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, location TEXT NOT NULL, schedule TEXT NOT NULL, organizerId TEXT NOT NULL, FOREIGN KEY (organizerId) REFERENCES organizers(id))`
	);
	db.run(
		// Creates event_student table if doesn't exist
		`CREATE TABLE IF NOT EXISTS event_student (eventId TEXT NOT NULL, studentId TEXT NOT NULL, FOREIGN KEY (eventId) REFERENCES events(id), FOREIGN KEY (studentId) REFERENCES students(id))`
	);
});

// Function to create a user
const createUser = (
	id: string,
	username: string,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	userType: string // Passed into query as table name + 's
): Promise<any> => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO ${userType}s (id, username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
			[id, username, firstName, lastName, email, password],
			(err: any) => {
				if (err) {
					return reject(err);
				}
				resolve(getUser(id, userType));
			}
		);
	});
};

// Function to get a user. Receives id from firebase and userType to determine user or organizer.
const getUser = (id: string, userType: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const res: any = {};

		const query = `SELECT * FROM ${userType}s WHERE id = ?`;

		db.get(query, [id], (err: any, row: any) => {
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

// getEvent
const getEvent = (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const res: any = {};

		const query = `SELECT * FROM events WHERE id = ?`;

		db.get(query, [id], (err: any, row: any) => {
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

// createEvent
const createEvent = (
	id: string,
	title: string,
	location: string,
	schedule: string,
	organizerId: string
) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO events (id, title, location, schedule, organizerId) VALUES (?, ?, ?, ?, ?)`,
			[id, title, location, schedule, organizerId],
			(err: any) => {
				if (err) {
					return reject(err);
				}
				resolve(getEvent(id));
			}
		);
	});
};

// getUsersByEvent

// getEventsByUser

createEvent('1', 'Event 1', 'Location 1', 'Schedule 1', '1');

export { createUser, getUser, createEvent, getEvent };
