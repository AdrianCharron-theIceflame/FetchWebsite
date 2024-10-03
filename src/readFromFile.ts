const games: Array<Game> = new Array(0)
const gamePlayersMain = document.querySelector(`main`) as HTMLDivElement
const players: Array<Player> = new Array(0)
const playerTable: HTMLTableElement = document.createElement(`table`)
const tableHeader: HTMLTableRowElement = document.createElement(`tr`)
const headers: Array<string> = [`Avatar: `, `ID: `, `Name: `, `Username: `, `Enrolled: `, `Wins: `, `Losses: `]

function appendHeaders() {
    headers.forEach(header => {
        let th: HTMLTableCellElement = document.createElement(`th`)
        th.textContent = header
        th.scope = `col`
        tableHeader.appendChild(th)
    })
    playerTable.appendChild(tableHeader)
}
window.addEventListener(`load`, async () => {
    await fetch(`./files/games.json`, {
        method: `get`
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((el: any) => {
                games.push(new Game(el.id, el.game, el.type))
            })
            // console.table(games)
            // Game.getGameTypes().forEach(el => console.log(el))
        })
        .catch(e => {
            location.assign(`./gamesNotFound.html`)
        })
    await fetch(`./files/players.json`, {
        method: `get`
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((el: any) => {
                let id: number = el.id
                let firstName: string = el.first_name
                let lastName: string = el.last_name
                let username: string = el.username
                let email: string = el.email
                let enrolled: Date = createDate(el.enrolled)
                let avatar: string = el.avatar
                let wins: number = el.wins
                let losses: number = el.losses
                let games_played: Array<{}>
                games_played = new Array(0)
                if (el.games_played instanceof Array) {
                    el.games_played.forEach((gameEl: any) => {
                        let gamePlayed: Game | string = ""
                        try {
                            gamePlayed = findGame(gameEl.game)
                        }
                        catch (e) {
                            console.log(`${e}`)
                            gamePlayed = gameEl.game
                        }
                        let datePlayed: Date = createDate(gameEl.date)
                        games_played.push({
                            game: gamePlayed,
                            date: datePlayed
                        })
                    })
                }
                // TODO: Line 740 has an error
                else {
                    let gamePlayed: Game | string = ``
                    try {
                        gamePlayed = findGame(el.games_played.game)
                    }
                    catch (e) {
                        console.log(`${e}`)
                        gamePlayed = el.games_played.game
                    }
                    let datePlayed = createDate(el.games_played.date)
                    games_played.push({
                        game: gamePlayed,
                        date: datePlayed
                    })
                }
                // console.table(games_played)
                // console.log(enrolled)
                players.push(new Player(id, firstName, lastName, username, email, enrolled, avatar, wins, losses, games_played))
            })
            sortPlayersByName()
            postPlayers(players)
            console.table(players)
            gamePlayersMain.appendChild(playerTable)
        })
        .catch(e => {
            // TODO: make an error page for missing
            console.log(e)
        })
})

function createDate(dateString: string): Date {
    let date = new Date()
    date.setFullYear(Number(dateString.substring(0, 4)), Number(dateString.substring(5, 7)) - 1, Number(dateString.substring(8)))
    return date
}

function findGame(playerGame: string): Game {
    for (let game of games) {
        if (game.getName() == playerGame)
            return game
    }
    throw Error(`Player played an unknown game`)
}

function postPlayers(arr: Array<Player>) {
    playerTable.innerHTML = ``
    appendHeaders()
    arr.forEach(player => {
        let tr = document.createElement(`tr`)

        tr.innerHTML = `
            <td><img src="${player.getAvatar()}" alt="Player's avatar"></td>
            <td>${player.getId()}
            <td>${player.getFirstName()} ${player.getLastName()}</td>
            <td>${player.getUsername()}</td>
            <td>${player.getDayEnrolled().getFullYear()}/${player.getDayEnrolled().getMonth()}/${player.getDayEnrolled().getUTCDate()}
            <td>${player.getWins()}</td>
            <td>${player.getLosses()}</td>`
        playerTable.appendChild(tr)
    })
}

function sortPlayersByName() {
    players.sort((a: Player, b: Player) => {
        if (a.getLastName().localeCompare(b.getLastName()) === 0
            && a.getFirstName().localeCompare(b.getFirstName()) === 0) {
            return 0
        }
        else if (a.getLastName().localeCompare(b.getLastName()) >= 0
            || (a.getLastName().localeCompare(b.getLastName()) === 0
                && a.getFirstName().localeCompare(b.getFirstName()) >= 0)) {
            return 1
        }
        else {
            return -1
        }
    })
}
