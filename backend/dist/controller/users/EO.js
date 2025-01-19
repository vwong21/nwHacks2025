"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EO = void 0;
const User_1 = require("./User");
const Event_1 = __importDefault(require("../events/Event"));
class EO extends User_1.User {
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
    constructor(id, user, firstName, lastName, email, password) {
        super(id, user, firstName, lastName, email, password);
        this.type = "organizer";
    }
    createEvent(id, title, location, start, end) {
        return new Event_1.default(id, title, location, start, end, this.id);
    }
}
exports.EO = EO;
