import { create } from 'domain';

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
		`CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, location TEXT NOT NULL, start TEXT NOT NULL, end TEXT NOT NULL, organizerId TEXT NOT NULL, FOREIGN KEY (organizerId) REFERENCES organizers(id))`
	);
	db.run(
		// Creates event_student table if doesn't exist
		`CREATE TABLE IF NOT EXISTS event_student (id INTEGER PRIMARY KEY AUTOINCREMENT, eventId TEXT NOT NULL, studentId TEXT NOT NULL, FOREIGN KEY (eventId) REFERENCES events(id), FOREIGN KEY (studentId) REFERENCES students(id))`
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

// Function to get a returning user. Receives id from firebase and userType to determine user or organizer.
const getReturningUser = (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const res: any = {};

		const queryDatabase = (query: string, params: any[], type: string) => {
			return new Promise((resolve, reject) => {
				db.get(query, params, (err: any, row: any) => {
					if (err) return reject(err);
					if (row) {
						for (const [key, value] of Object.entries(row)) {
							res[key] = value;
						}
						res['type'] = type;
						resolve(res);
					} else {
						resolve(null); // Continue checking the next table
					}
				});
			});
		};

		queryDatabase(`SELECT * FROM students WHERE id = ?`, [id], 'student')
			.then((result) => {
				if (result) return resolve(result); // Found in students
				return queryDatabase(
					`SELECT * FROM organizers WHERE id = ?`,
					[id],
					'organizer'
				);
			})
			.then((result) => {
				if (result) return resolve(result); // Found in organizers
				reject(new Error('User not found')); // Not found in either table
			})
			.catch((err) => reject(err));
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
	start: string,
	end: string,
	organizerId: string
) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO events (id, title, location, start, end, organizerId) VALUES (?, ?, ?, ?, ?, ?)`,
			[id, title, location, start, end, organizerId],
			(err: any) => {
				if (err) {
					return reject(err);
				}

				const query = 'SELECT id FROM students'
				db.all(query, [], (err:any, rows:any) => {
					if (err) {
						return reject(err);
					}

					if (!rows) {
						return reject(new Error("No students"));
					}

					const stu_ids = rows.map((row: { id: any; }) => row.id)

					for (const stu in stu_ids) {
						createEventStudent(id,stu);
					}

					resolve(getEvent(id));
				});
			}
		);
	});
};

// delete an Event
const deleteEvent = (id: string) => {
	return new Promise((resolve, reject) => {
		db.run('DELETE FROM events WHERE id =?', [id], (err: any) => {
			if (err) {
				return reject(err);
			}

			console.log(`Deleted Event: ${id} From events`);

			db.run(
				'DELETE FROM event_student WHERE eventId =?',
				[id],
				(err: any) => {
					if (err) {
						return reject(err);
					}

					console.log(`Deleted Event: ${id} from all students`);

					resolve(id);
				}
			);
		});
	});
};

// create event_student
const createEventStudent = (eventId: string, studentId: string) => {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO event_student (eventId, studentId) VALUES (?, ?)`,
			[eventId, studentId],
			(err: any) => {
				if (err) {
					return reject(err);
				}
				resolve('done');
			}
		);
	});
};

// getUsersByEvent
const getUsersByEvent = async (eventId: string): Promise<any[]> => {
	try {
		const rows: any[] = await new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM event_student WHERE eventId = ?`,
				[eventId],
				(err: any, rows: any) => {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				}
			);
		});

		// Fetch detailed user data for each studentId
		const detailedUsers = await Promise.all(
			rows.map((row) => getUser(row.studentId, 'student'))
		);

		return detailedUsers;
	} catch (error) {
		console.error('Error in getUsersByEvent:', error);
		throw error;
	}
};

// getEventsByUser
const getEventsByUser = async (studentId: string): Promise<any[]> => {
	try {
		const rows: any[] = await new Promise((resolve, reject) => {
			db.all(
				`SELECT * FROM event_student WHERE studentId = ?`,
				[studentId],
				(err: any, rows: any) => {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				}
			);
		});

		// Fetch detailed event data for each eventId
		const detailedEvents = await Promise.all(
			rows.map((row) => getEvent(row.eventId))
		);

		return detailedEvents;
	} catch (error) {
		console.error('Error in getEventsByUser:', error);
		throw error;
	}
};

// createUser(
// 	'Cn9IMFfgZxU8OQM7aDShY0LzvRE2',
// 	'vwong21',
// 	'Vincent',
// 	'Wong',
// 	'vincentwong5609@gmail.com',
// 	'password',
// 	'student'
// );

export {
	createUser,
	getUser,
	getReturningUser,
	createEvent,
	deleteEvent,
	getEvent,
	getEventsByUser,
	getUsersByEvent,
	createEventStudent,
};
