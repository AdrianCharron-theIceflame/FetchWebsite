const $$ = (el: string) => document.querySelector(el)
const newPlayerForm = $$(`#newPlayer`) as HTMLFormElement
const fldLastName = $$(`#lastName`) as HTMLInputElement
const fldFirstName = $$(`#firstName`) as HTMLInputElement
const fldUsername = $$(`#username`) as HTMLInputElement
const fldEmail = $$(`#email`) as HTMLInputElement
const fldEnrolled = $$(`#enrolled`) as HTMLInputElement
const fldWins = $$(`#wins`) as HTMLInputElement
const fldLosses = $$(`#losses`) as HTMLInputElement
const fnameErr = $$(`#firstNameErr`) as HTMLSpanElement
const lnameErr = $$(`#lastNameErr`) as HTMLSpanElement
const userErr = $$(`#userErr`) as HTMLSpanElement
const emailErr = $$(`#emailErr`) as HTMLSpanElement
const enroErr = $$(`#enroErr`) as HTMLSpanElement
const winsErr = $$(`#winsErr`) as HTMLSpanElement
const lossErr = $$(`#lossErr`) as HTMLSpanElement
const gameErr = $$(`#gameErr`) as HTMLSpanElement

newPlayerForm.addEventListener(`submit`, async (e) => {
    e.preventDefault()
    if (!validateform()) {
        return
    }
    else {
        await sendPlayer()
        window.location.reload()
    }
})

async function sendPlayer() {
    let newId = players.length + 1
    let enro = ``
    if (fldEnrolled.value == ``) {
        let today = new Date()
        enro = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    }
    else {
        enro = fldEnrolled.value.replaceAll('-', '/')
    }
    let gamesPlayed = new Array(0)
    for (let i = 0; i < count; i++) {
        if (selectElArr[i].value != ``) {
            let lastPlayed = ``
            if (dateGameArr[i].value == ``) {
                let today = new Date()
                lastPlayed = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
            }
            else {
                lastPlayed = dateGameArr[i].value.replaceAll('-', '/')
            }
            gamesPlayed.push({
                "game": selectElArr[i].value,
                "date": lastPlayed
            })
        }
    }
    let playerRecord = {
        "id": newId,
        "first_name": fldFirstName.value,
        "last_name": fldLastName.value,
        "username": fldUsername.value,
        "email": fldEmail.value,
        "enrolled": enro,
        "avatar": `https://robohash.org/${fldUsername.value}.png?size=60x60&set=set5`,
        "wins": Number(fldWins.value),
        "losses": Number(fldLosses.value),
        "games_played": gamesPlayed
    }
    await fetch(`./php/addPlayer.php`, {
        method: `post`,
        body: JSON.stringify(playerRecord)
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(e => console.log(e))
}

fldFirstName.addEventListener(`change`, validateFNames)
fldLastName.addEventListener(`change`, validateLName)
fldUsername.addEventListener(`change`, validateUsername)
fldEmail.addEventListener(`change`, validateEmail)
fldEnrolled.addEventListener(`change`, validateDate)
fldWins.addEventListener(`change`, validateWins)
fldLosses.addEventListener(`change`, validateLosses)


function validateform(): boolean {
    let isValid = true
    if (!validateFNames()) isValid = false
    if (!validateLName()) isValid = false
    if (!validateUsername()) isValid = false
    if (!validateEmail()) isValid = false
    if (!validateDate()) isValid = false
    if (!validateWins()) isValid = false
    if (!validateLosses()) isValid = false
    if (!validateSelects()) isValid = false
    return isValid
}

function validateLosses(): boolean {
    lossErr.textContent = ` `
    let losses = Number(Number(fldLosses.value).toFixed(0))
    if (!(losses >= 0))
        lossErr.textContent += `*Number of losses cannot be negative`
    return losses >= 0
}

function validateWins(): boolean {
    winsErr.textContent = ` `
    let wins = Number(Number(fldWins.value).toFixed(0))
    if (!(wins >= 0))
        winsErr.textContent += `*Number of wins cannot be negative`
    return wins >= 0
}

function validateDate(): boolean {
    enroErr.textContent = ` `
    let date = createDate(fldEnrolled.value)
    let today = new Date()
    if (!(today.getTime() - date.getTime() >= 0))
        enroErr.textContent += `*Date Enrolled cannot be in the furture`
    return today.getTime() - date.getTime() >= 0
}

function validateEmail(): boolean {
    emailErr.textContent = ` `
    let ret: boolean = true
    players.forEach(pl => {
        if (pl.getEmail() == fldEmail.value) {
            ret = false
            emailErr.textContent = `*Email is already used`
        }
    })
    let pat = /^([A-Z]|-|\.|\d|_)+@([a-z]|\d|_|-)+(\.[a-z]{2}){0,1}\.[a-z]{2,3}$/i
    if (!(pat.test(fldEmail.value)))
        emailErr.textContent = `*Email can only contain letters, dashes, dots, numbers and underscores`
    if (fldEmail.value.length <= 0)
        emailErr.textContent = `*Email cannot be empty`
    return ret && pat.test(fldEmail.value)
}

function validateUsername(): boolean {
    userErr.textContent = ` `
    let ret: boolean = true
    players.forEach(pl => {
        if (pl.getUsername() == fldUsername.value) {
            ret = false
            userErr.textContent = `*Username is already used`
        }
    })
    let pat = /^([A-Z]|[0-9])+$/i
    if (!pat.test(fldUsername.value))
        userErr.textContent = `*Username can only contain letters and numbers`
    if (fldUsername.value.length <= 0)
        userErr.textContent = `*Username cannot be empty`
    return ret && pat.test(fldUsername.value)
}

function validateFNames(): boolean {
    fnameErr.textContent = ` `
    let pat = /^([A-Z]|\s|'|`|-)*([^`]|[A-Z]|-|')$/i
    if (!pat.test(fldFirstName.value))
        fnameErr.textContent = `*First name contains illegal character`
    if (fldFirstName.value.length <= 0)
        fnameErr.textContent = `*First name cannot be empty`
    return pat.test(fldFirstName.value)
}

function validateLName(): boolean {
    lnameErr.textContent = ` `
    let pat = /^([A-Z]|\s|'|`|-)*([^`]|[A-Z]|-|')$/i
    if (!pat.test(fldLastName.value))
        lnameErr.textContent = `*Last name contains illegal character`
    if (fldLastName.value.length <= 0)
        lnameErr.textContent = `*Last name cannot be empty`
    return pat.test(fldLastName.value)
}