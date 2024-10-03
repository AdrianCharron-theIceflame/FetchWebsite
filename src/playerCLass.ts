class Player {
    private id: number
    private firstName: string
    private lastName: string
    private username: string
    private email: string
    private dayEnrolled: Date
    private avatar: string
    private wins: number
    private losses: number
    private gamesPlayed: Array<{}>
    constructor(id: number, firstName: string, lastName: string, username: string, email: string, dayEnrolled: Date, avatar: string, wins: number, losses: number, gamesPlayed: Array<{}>) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.username = username
        this.email = email
        this.dayEnrolled = dayEnrolled
        this.avatar = avatar
        this.wins = wins
        this.losses = losses
        this.gamesPlayed = gamesPlayed
    }
    public getId(): number {
        return this.id
    }
    public getFirstName(): string {
        return this.firstName
    }
    public getLastName(): string {
        return this.lastName
    }
    public getUsername(): string {
        return this.username
    }
    public getEmail(): string {
        return this.email
    }
    public getDayEnrolled(): Date {
        return this.dayEnrolled
    }
    public getAvatar(): string {
        return this.avatar
    }
    public getWins(): number {
        return this.wins
    }
    public getLosses(): number {
        return this.losses
    }
    public getGamesPlayed(): Array<{}> {
        return this.gamesPlayed
    }
}