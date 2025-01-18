export default class Event {
	
	private _id: string;
	private _title: string;
	private _location: string;
	private _schedule: Date;
	private _organizerId: string;

	/**
	 * 
	 * @param id 
	 * @param title 
	 * @param location 
	 * @param schedule 
	 * @param organizerId 
	 * 
	 *  Creates an Event Object with necessary information
	 */
	constructor(id:string, title:string, location:string, schedule:Date, organizerId: string) {
		this._id = id;
		this._title = title;
		this._location = location;
		this._schedule = schedule;
		this._organizerId = organizerId;
	}

	
	/** Setters and Getters */
	public get id(): string {
		return this._id;
	}

	public set id(id: string) {
		this._id = id;
	}

	public get title(): string {
		return this._title;
	}
	public set title(title: string) {
		this._title = title;
	}

	public get location(): string {
		return this._location;
	}

	public set location(location: string) {
		this._location = location;
	}

	public get schedule(): Date {
		return this._schedule;
	}
	
	public set schedule(schedule: Date) {
		this._schedule = schedule;
	}

	public get organizerId(): string {
		return this._organizerId;
	}
	
	public set organizerId(value: string) {
		this._organizerId = value;
	}


}