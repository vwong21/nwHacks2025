"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const User_1 = require("./User");
class Student extends User_1.User {
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
    constructor(id, user, firstName, lastName, email, password) {
        super(id, user, firstName, lastName, email, password);
        this.type = "student";
    }
}
exports.Student = Student;
