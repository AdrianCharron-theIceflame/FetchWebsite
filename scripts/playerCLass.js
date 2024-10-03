"use strict";
class Player {
    id;
    firstName;
    lastName;
    username;
    email;
    dayEnrolled;
    avatar;
    wins;
    losses;
    gamesPlayed;
    constructor(id, firstName, lastName, username, email, dayEnrolled, avatar, wins, losses, gamesPlayed) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.dayEnrolled = dayEnrolled;
        this.avatar = avatar;
        this.wins = wins;
        this.losses = losses;
        this.gamesPlayed = gamesPlayed;
    }
    getId() {
        return this.id;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getDayEnrolled() {
        return this.dayEnrolled;
    }
    getAvatar() {
        return this.avatar;
    }
    getWins() {
        return this.wins;
    }
    getLosses() {
        return this.losses;
    }
    getGamesPlayed() {
        return this.gamesPlayed;
    }
}
