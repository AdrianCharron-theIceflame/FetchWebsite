class Game {
    private id: number
    private name: string
    private type: string
    private static gameTypes: Array<string> = new Array<string>(0)
    constructor(id: number, game: string, type: string) {
        this.id = id
        this.name = game
        this.type = type
        if (Game.gameTypes.indexOf(this.type) === -1) {
            Game.gameTypes.push(this.type)
        }
        Game.sortGameTypes()
    }
    public getId(): number {
        return this.id
    }
    public getName(): string {
        return this.name
    }
    public getType(): string {
        return this.type
    }
    public static getGameTypes(): Array<string> {
        let types = [...Game.gameTypes]
        return types
    }
    private static sortGameTypes() {
        this.gameTypes.sort((a, b) => {
            return a.localeCompare(b)
        })
    }
}