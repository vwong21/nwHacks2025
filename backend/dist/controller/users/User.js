"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
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
    constructor(id, user, firstName, lastName, email, password) {
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
    setUser(user) {
        this.username = user;
        return true;
    }
    /**
        Changes the password for the user to given password

        @returns {True} if password changed successfully
    */
    setPassword(password) {
        this.password = password;
        return true;
    }
    /**
        Changes the email for the user to given email

        @returns {True} if email changed successfully
    */
    changeEmail(email) {
        this.email = email;
        return true;
    }
}
exports.User = User;
