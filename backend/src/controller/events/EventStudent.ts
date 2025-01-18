export default class EventStudent {

	private readonly eventId:string;
	private readonly studentId:string;
	
	constructor(eId: string, sId: string) {
		this.eventId = eId;
		this.studentId = sId;
	}
}