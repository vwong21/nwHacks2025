"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
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
    constructor(id, title, location, start, end, organizerId) {
        this._id = id;
        this._title = title;
        this._location = location;
        this._start = start;
        this._end = end;
        this._organizerId = organizerId;
    }
    /** Setters and Getters */
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }
    get location() {
        return this._location;
    }
    set location(location) {
        this._location = location;
    }
    get start() {
        return this._start;
    }
    set start(start) {
        this._start = start;
    }
    get end() {
        return this._end;
    }
    set end(end) {
        this._end = end;
    }
    get organizerId() {
        return this._organizerId;
    }
    set organizerId(value) {
        this._organizerId = value;
    }
}
exports.default = Event;
