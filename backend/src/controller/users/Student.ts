import { User } from "./User";

export class Student extends User {
	
	/**
	 * 
	 * @param id 
	 * @param user 
	 * @param firstName 
	 * @param lastName 
	 * @param email 
	 * @param password 
	 * 
	 *  Creates a student object with type Student
	 */
	constructor(id: string, user:string, firstName: string, lastName: string, email:string, password: string) {
		super(id, user, firstName, lastName, email, password);
		this.type = "student"
	}


}