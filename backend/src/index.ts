import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as db from './db';
import cors from 'cors';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.post('/user', async (req: Request, res: Response) => {
	const id = req.body.uid;
	const type = req.body.type;

	try {
		const userInfo = await db.getUser(id, type);
		res.status(200).json({ userInfo: userInfo, message: 'User Found' });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ error: 'Not Found', message: err.message });
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.post('/newUser', async (req: Request, res: Response) => {
	const id = req.body.uid;
	const user = req.body.username;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const password = req.body.password;
	const type = req.body.type;
	try {
		const userInfo = await db.createUser(
			id,
			user,
			firstName,
			lastName,
			email,
			password,
			type
		);
		res.status(200).json({
			userInfo: userInfo,
			message: `User ${user} Created`,
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({
				error: 'Bad Request',
				message: err.message,
			});
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.post('/event', async (req: Request, res: Response) => {
	const id = req.body.uid;

	try {
		const eventInfo = await db.getEvent(id);
		res.status(200).json({ eventInfo: eventInfo, message: 'Event Found' });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ error: 'Not Found', message: err.message });
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.post('/newEvent', async (req: Request, res: Response) => {
	const id = req.body.uid;
	const title = req.body.title;
	const location = req.body.location;
	const start = req.body.start;
	const end = req.body.end;
	const eoId = req.body.organizerId;

	try {
		const eventInfo = await db.createEvent(
			id,
			title,
			location,
			start,
			end,
			eoId
		);
		res.status(200).json({
			eventInfo: eventInfo,
			message: `Event ${title} Created`,
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({
				error: 'Bad Request',
				message: err.message,
			});
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.post('/event_student', async (req: Request, res: Response) => {
	const eventId = req.body.eventId;
	const studentId = req.body.studentId;

	try {
		const eventStudentInfo = await db.createEventStudent(
			eventId,
			studentId
		);
		res.status(200).json({
			eventStudentInfo: eventStudentInfo,
			message: `Event ${eventId} for Student ${studentId} Created`,
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({
				error: 'Bad Request',
				message: err.message,
			});
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.get('/event_users/:eventId', async (req: Request, res: Response) => {
	const eventId = req.params.eventId;

	try {
		const eventUsers = await db.getUsersByEvent(eventId);
		res.status(200).json({
			eventUsers: eventUsers,
			message: `Students in Event ${eventId} Found`,
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ error: 'Not Found', message: err.message });
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.get('/user_events/:userId', async (req: Request, res: Response) => {
	const userId = req.params.userId;

	try {
		const userEvents = await db.getEventsByUser(userId);
		res.status(200).json({
			userEvents: userEvents,
			message: `Events for User ${userId} Found`,
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ error: 'Not Found', message: err.message });
		} else {
			res.status(400).json({
				error: 'Bad Request',
				message: 'Unknown Error',
			});
		}
	}
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
