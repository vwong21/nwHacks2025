import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {getUser, createUser} from './db'

dotenv.config();

const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.post('/user', async (req: Request, res:Response) => {
	console.log(req.body)
	const id = req.body.uid; 
	const type = req.body.type;

	try {
		const userInfo = await getUser(id,type);
		res.status(200).json({userInfo: userInfo, message: "User Found"});
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({error: "Not Found", message: err.message});
		} else {
			res.status(400).json({error: "Bad Request", message: "Unknown Error"});
		}
	} 
});

app.post('/newUser', async (req: Request, res:Response) => {
	const id = req.body.uid; 
	const user = req.body.username;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const password = req.body.password;
	const type = req.body.type;
	try {
		const userInfo = await createUser(id,user,firstName,lastName,email,password,type);
		res.status(200).json({userInfo: userInfo, message: `User ${user} Created`});
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({error: "Bad Request", message: err.message});
		} else {
			res.status(400).json({error: "Bad Request", message: "Unknown Error"});
		}
	}
	
});


app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
