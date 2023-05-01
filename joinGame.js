players = [
    "thomas",
    "rhys",
    "ruban",
    "sam",
    "henry"
]

passwords = [
    "keyboard",
    "minecraft man",
    "pneumonoultramicroscopicsilicovolcanoconiosis",
    "star finger",
    "911"
]

var startingLogin = localStorage.getItem("gameLogin") || ""
document.querySelector(".name-input").value = startingLogin

if (startingLogin != "") {
    document.querySelector(".welcome").textContent = `Welcome back, ${players[passwords.indexOf(startingLogin)]}`
}

function joinGame() {
    var gameLogin = document.querySelector(".name-input").value
    if (passwords.includes(gameLogin)) {
        localStorage.setItem("gameLogin", gameLogin)
        localStorage.setItem("gameName", players[passwords.indexOf(gameLogin)])
        window.open("game.html", "_self")
    }
}