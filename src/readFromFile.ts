const games: Array<Game> = new Array(0)
const gamePlayersDiv = document.querySelector(`#players`) as HTMLDivElement
const players: Array<Player> = new Array(0)
const playerDiv: HTMLDivElement = document.createElement(`div`)
playerDiv.id = `playerDiv`
const sortBy = document.querySelector(`#sortBy`) as HTMLSelectElement
const fieldSet = document.querySelector(`#gamesArray`) as HTMLFieldSetElement
const selectElArr: Array<HTMLSelectElement> = new Array(0)
const dateGameArr: Array<HTMLInputElement> = new Array(0)
const mainGamePlayers = document.querySelector(`main`) as HTMLDivElement

window.addEventListener(`load`, () => {
    fetch(`./files/games.json`, {
        method: `get`
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((el: any) => {
                games.push(new Game(el.id, el.game, el.type))
            })
            displaySortByOptions()
            addSelectField(0)
        })
        .catch(e => {
            console.log(`games.json Error: ${e}`)
            mainGamePlayers.innerHTML = `
                <section id="error">
                    <h2>There was an error when fetching the file of games.</h2>
                    <p>Please contact a website administrator.</p>
                </section>`
        })
    fetch(`./files/players.json`, {
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
                let games_played: Array<any> = new Array(0)
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
                games_played.sort((a: any, b: any) => {
                    if (a.game.getName().localeCompare(b.game.getName()) != 0)
                        return a.game.getName().localeCompare(b.game.getName())
                    else {
                        return b.date.getTime() - a.date.getTime()
                    }
                })
                for (let i = 1; i < games_played.length; i++) {
                    if (games_played[i].game.getName() == games_played[i - 1].game.getName()) {
                        games_played.splice(i, 1)
                    }
                }
                players.push(new Player(id, firstName, lastName, username, email, enrolled, avatar, wins, losses, games_played))
            })
            sortPlayersByName()
            postPlayers(players)
            gamePlayersDiv.appendChild(playerDiv)
        })
        .catch(e => {
            console.log(`players.json Error: ${e}`)
            mainGamePlayers.innerHTML = `
                <section id="error">
                    <h2>There was an error when fetching the file of players.</h2>
                    <p>Please contact a website administrator.</p>
                </section>`
        })
})

sortBy.addEventListener(`change`, () => {
    if (sortBy.value != `lastName`) {
        let newPlayerArray: Array<Player> = new Array(0)
        players.forEach(play => {
            play.getGamesPlayed().forEach((gam: any) => {
                if (gam.game.getName() == sortBy.value)
                    newPlayerArray.push(play)
            })
        })
        postPlayers(newPlayerArray)
    }
    else
        postPlayers(players)
})

let count: number = 0

function addSelectionField() {
    if (count == 0)
        count++
    if (count < games.length) {
        addSelectField(count)
    }
    count++
}

function gameOptions(): Array<HTMLOptionElement> {
    let gameOptionsArr: Array<HTMLOptionElement> = new Array(0)
    let gameNameArr: Array<string> = new Array(0)
    games.sort((a, b) => a.getName().localeCompare(b.getName()))
    for (let game of games) {
        gameNameArr.push(game.getName())
        for (let i = 0; i < count; i++) {
            let select = document.querySelector(`#selectGame${i}`) as HTMLSelectElement
            if (select.value == game.getName()) {
                gameNameArr.splice(gameNameArr.indexOf(game.getName()), 1)
            }
        }
    }
    let option1 = document.createElement(`option`)
    option1.textContent = `--Choose a Game--`
    option1.value = ""
    gameOptionsArr.push(option1)
    gameNameArr.forEach(game => {
        let option = document.createElement(`option`)
        option.value = game
        option.textContent = `${game}`
        gameOptionsArr.push(option)
    })
    return gameOptionsArr
}

function addSelectField(i: number) {
    let div = document.createElement(`div`)
    let select = document.createElement(`select`)
    let date = document.createElement(`input`)
    date.id = `dateGame${i}`
    date.type = `date`
    select.id = `selectGame${i}`
    let gameOptionsArr: Array<HTMLOptionElement> = gameOptions()
    gameOptionsArr.forEach(option => {
        select.appendChild(option)
    })
    div.appendChild(select)
    div.appendChild(date)
    fieldSet.appendChild(div)
    selectElArr.push(select)
    dateGameArr.push(date)
    select.addEventListener(`change`, addSelectionField)
    select.addEventListener(`change`, validateSelects)
    date.addEventListener(`change`, validateSelects)
    if (i != 0) {
        selectElArr[i - 1].removeEventListener(`change`, addSelectionField)
        selectElArr[i - 1].setAttribute(`disabled`, ``)
    }
}

function displaySortByOptions() {
    games.sort((a, b) => a.getName().localeCompare(b.getName()))
    games.forEach(game => {
        sortBy.innerHTML += `
            <option value="${game.getName()}">${game.getName()}</option>`
    })
}

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
    playerDiv.innerHTML = ``
    arr.forEach(player => {
        let section = document.createElement(`section`)
        section.innerHTML = `
            <p class="image"><img src="${player.getAvatar()}" alt="Player's avatar"></p>
            <h3>Number ${player.getId()}: ${player.getFirstName()} ${player.getLastName()} &nbsp <span class="aka">aka</span> &nbsp ${player.getUsername()}</h3>
            <p>Email: ${player.getEmail()}</p>
            <p>Day joined: ${player.getDayEnrolled().getFullYear()}/${player.getDayEnrolled().getMonth()}/${player.getDayEnrolled().getUTCDate()}
            <p>Number of wins: ${player.getWins()}</p>
            <p>Number of losses: ${player.getLosses()}</p>`;
        let ul = document.createElement(`ul`)
        player.getGamesPlayed().forEach(playerGame => {
            ul.innerHTML += `
                <li>${playerGame.game.getName()}<br>Last played on ${playerGame.date.getFullYear()}/${playerGame.date.getMonth() + 1}/${playerGame.date.getDate()}</li>`
        })
        let p = document.createElement(`p`)
        p.innerHTML = `Games played:`
        section.appendChild(p)
        section.appendChild(ul)
        playerDiv.appendChild(section)
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

function validateSelects(): boolean {
    gameErr.textContent = ``
    let ret = true
    if (selectElArr[0].value == ``) {
        ret = false
        gameErr.textContent = `You must have played at least 1 game`
    }
    for (let i = 0; i < count; i++) {
        let today = new Date()
        let date = createDate(dateGameArr[i].value)
        if (!(today.getTime() - date.getTime() >= 0)) {
            gameErr.textContent += `*Last time played cannot be in the furture`
            ret = false
        }
    }
    return ret
}