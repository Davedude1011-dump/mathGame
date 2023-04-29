const firebaseConfig = {
  apiKey: "AIzaSyApAN7sL3It27FfCUwElukdWiEpy4cIQlw",
  authDomain: "speedtestonline-e57dd.firebaseapp.com",
  projectId: "speedtestonline-e57dd",
  storageBucket: "speedtestonline-e57dd.appspot.com",
  messagingSenderId: "187539101752",
  appId: "1:187539101752:web:47af898535dc9e1f80eecd",
  measurementId: "G-RF0VVKQNSM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database()

db.ref("question").once("value").then((snapshot) => {
    var dbQuestionValue = snapshot.val()
    console.log("dbQuestionValue: " + dbQuestionValue)
})

function showToast(message, type) {
    toastr.options = {
        "positionClass": "toast-top-right",
        "closeButton": true,
        "progressBar": true,
    };
    if (type == "error") {
        toastr.error(message);
    } else if (type == "success") {
        toastr.success(message);
    } else if (type == "warning") {
        toastr.warning(message);
    }

}

var username = localStorage.getItem("gameName")

var questionBox = document.querySelector(".question-box");
var questionInput = document.querySelector(".question-input");

document.getElementById(username).parentNode.classList.add("user")


var BaseQuestions = [ // R gets swapped with a random number between -10 and 10
    "(R * R) + R",
    "R + R",
    "R * R"
]

var question = ""
var answer = ""

function randomizeQuestion() {
    var randomQuestionNum = Math.floor(Math.random() * BaseQuestions.length);
    let outputString = BaseQuestions[randomQuestionNum].replace(/R/g, function() {
      return Math.floor(Math.random() * 21) - 10;
    });
    question = outputString
    answer = eval(outputString)

    db.ref("question").set(question)
    db.ref("answer").set(answer)
}

function createQuestion(currentQuestion) {
    questionBox.innerHTML = ""
    var newQuestion = document.createElement("div");
    newQuestion.classList.add("question");
    newQuestion.textContent = currentQuestion
    newQuestion.id = answer
    questionBox.appendChild(newQuestion);
}

db.ref("question").on("value", (snapshot) => {
    createQuestion(snapshot.val())
})
db.ref("lastScoredPoint").on("value", (snapshot) => {
    // someone scored a point. display that on every screen:

    if (snapshot.val() != "") {
        console.log(snapshot.val() + ", just scored a point!")
        showToast(`${snapshot.val()}, just scored a point!`, "success")
    }
})

db.ref("question").once("value", (snapshot) => {
    createQuestion(snapshot.val())
})

console.log(question, answer)


function checkQuestionInput() {
    var questionInputValue = questionInput.value

    db.ref("answer").once("value").then((snapshot) => {
        var currentAnswer = snapshot.val()
        if (questionInputValue == currentAnswer) {
            db.ref("lastScoredPoint").set(username)
            db.ref("lastScoredPoint").set("")
            db.ref(username).transaction((currentPoints) => {
                // Increment the current value by 1 and return the new value
                return currentPoints + 1;
            })
            randomizeQuestion()
        }
        else {
            showToast(`${questionInputValue} is not the correct answer!`, "warning")
        }
        db.ref(username).once("value").then((snapshot) => {
            var currentPoints = snapshot.val()
            pointsBox.textContent = currentPoints
        })
        questionInput.value = ""
    })
}

function leaveGame() {
    db.ref(username).set(0)
    window.open("index.html", "_self")
    db.ref("justLeft").set(username)
    db.ref("justLeft").set("")
}

db.ref(username).set(0)
db.ref("justJoined").set(username)
db.ref("justJoined").set("")

db.ref("justJoined").on("value", snapshot => {
    if (snapshot.val() != "") {
        showToast(`${snapshot.val()}, just joined the game!`, "warning")
    }
})
db.ref("justLeft").on("value", snapshot => {
    if (snapshot.val() != "") {
        showToast(`${snapshot.val()}, just left the game!`, "warning")
    }
})


// leaderboard and naming stuff:

console.log(username)

function sortLeaderboard() {
    leaderboard = document.querySelector(".leaderboard")
    // Get all <li> elements within the <ul>
    const listItems = leaderboard.getElementsByTagName("li");
    
    // Convert the list items into an array and sort it based on their inner span values
    const sortedListItems = Array.from(listItems).sort((a, b) => {
      const aScore = parseInt(a.querySelector("span").textContent);
      const bScore = parseInt(b.querySelector("span").textContent);
      return bScore - aScore;
    });
    
    // Append the sorted list items back to the <ul>
    for (let i = 0; i < sortedListItems.length; i++) {
        leaderboard.appendChild(sortedListItems[i]);
    }
  }

db.ref("thomas").on("value", snapshot => { document.getElementById("thomas").textContent = snapshot.val(); sortLeaderboard() })
db.ref("rhys").on("value", snapshot => { document.getElementById("rhys").textContent = snapshot.val(); sortLeaderboard() })
db.ref("ruban").on("value", snapshot => { document.getElementById("ruban").textContent = snapshot.val(); sortLeaderboard() })
db.ref("sam").on("value", snapshot => { document.getElementById("sam").textContent = snapshot.val(); sortLeaderboard() })