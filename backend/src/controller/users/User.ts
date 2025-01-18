export abstract class User {

	readonly id: string; 
	protected username: string;
	protected firstName: string;
	protected lastName: string;
	protected email: string;
	protected type: string;
	protected password: string;
	/**
	 * 
	 * @param id 
	 * @param user 
	 * @param firstName 
	 * @param lastName 
	 * @param email 
	 * @param password 
	 * 
	 * Creates a User object
	 */
	constructor(id: string, user:string, firstName: string, lastName: string, email:string, password: string) {
		this.id = id;
		this.username = user;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.type = "";
		this.password = password;
	}

	/**
		Changes the password for the user to given password

		@returns {True} if password changed successfully 
	*/
	public setUser(user: string): boolean {
		this.username = user;
		return true;
	}

	/**
		Changes the password for the user to given password

		@returns {True} if password changed successfully 
	*/
	public setPassword(password: string): boolean {
		this.password = password;
		return true;
	}

	/**
		Changes the email for the user to given email

		@returns {True} if email changed successfully 
	*/
	public changeEmail(email:string): boolean {
		this.email = email;
		return true;
	}
	
}