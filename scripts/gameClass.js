"use strict";
class Game {
    id;
    name;
    type;
    static gameTypes = new Array(0);
    constructor(id, game, type) {
        this.id = id;
        this.name = game;
        this.type = type;
        if (Game.gameTypes.indexOf(this.type) === -1) {
            Game.gameTypes.push(this.type);
        }
        Game.sortGameTypes();
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    static getGameTypes() {
        let types = [...Game.gameTypes];
        return types;
    }
    static sortGameTypes() {
        this.gameTypes.sort((a, b) => {
            return a.localeCompare(b);
        });
    }
}
