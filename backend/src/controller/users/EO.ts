import  { User }  from "./User";
import Event  from "../events/Event"

export class EO extends User {


	/**
	 * 
	 * @param id 
	 * @param user 
	 * @param firstName 
	 * @param lastName 
	 * @param email 
	 * @param password 
	 * 
	 *  Creates a EO object with type organizer
	 */
	constructor(id: string, user:string, firstName: string, lastName: string, email:string, password: string) {
		super(id, user, firstName, lastName, email, password);
		this.type = "organizer";
	}

	public createEvent(id:string, title:string, location:string, schedule:Date): Event {
		return new Event(id, title, location, schedule, this.id);
	}


}