// variables to keep track of quiz state
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerID;

//HTML elements
let questionsElement = document.getElementById("questions");
let timerElement = document.getElementById("time");
let choicesElement = document.getElementById("choices");
let submitButton = document.getElementById("submit");
let startButton = document.getElementById("start");
let initialElement = document.getElementById("initials");
let feedBackElement = document.getElementById("feedback");

//determines the sfx for right and wrong answers
let sfxRight = new Audio("assets/sfx/correct.wav");
let sfxWrong = new Audio("assets/sfx/incorrect.wav");

//this function determines what happens if an answer is right or wrong
function questionClick() {
    if(this.value !== questions[currentQuestionIndex].answer) {
        time -= 15;

        if(time < 0) {
            time = 0;
    }

    timerElement.textContent = time;
    sfxWrong.play();
    feedBackElement.textContent = "Wrong"
    } else {
        sfxRight.play();
        feedBackElement.textContent = "Correct!";
    }

    feedBackElement.setAttribute("class", "feedback");

    setTimeout(function(){
        feedBackElement.setAttribute("class", "feedback hide")
    }, 1000);

    currentQuestionIndex++;

//this checks whether the quiz has ended by checking if there are any questions left, or ending the quiz

    if(currentQuestionIndex === questions.length) {
        quizEnd()
    } else {
        getQuestion();
    }
}

//this function gets the next question from the questions.js file
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];

    let titleElement = document.getElementById("question-title");

    titleElement.textContent = currentQuestion.title;

    choicesElement.innerHTML = "";

    currentQuestion.choices.forEach(function(choice, index) {
        let choiceButton = document.createElement("button");

        choiceButton.setAttribute("class", "choice");
        choiceButton.setAttribute("value", choice);

        choiceButton.textContent = `${index + 1}. ${choice}`

        choiceButton.addEventListener("click", questionClick);

        choicesElement.append(choiceButton);
    })
}

//this function determines what happens when the quiz ends - it shows the end screen
function quizEnd() {
    clearInterval(timerID);

    let endScreenElement = document.getElementById("end-screen");
    endScreenElement.removeAttribute("class");

    let finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = time;

    questionsElement.setAttribute("class", "hide");
}

//this function controls the countdown timer
function clockTick() {
    time--;
    timerElement.textContent = time;

    if(time <= 0){
        quizEnd();
    }
}

//this function will start the quiz onClick of the begin quiz button and fetch the first question
function startQuiz() {
    let startScreenElement = document.getElementById("start-screen");
    startScreenElement.setAttribute("class", "hide");

    questionsElement.removeAttribute("class");

    timerID = setInterval(clockTick, 1000)

    timerElement.textContent = time;

    getQuestion();
}

//this function saves the highscore to local storage
function saveHighScore() {
    let initials = initialElement.value.trim();
    console.log(initials);

    //sets the initials and the highscore
    if(initials !== ""){
        let highScores = JSON.parse(localStorage.getItem("highscores")) || [];
        let newScore = {
            score: time,
            initials: initials
        }

        highScores.push(newScore);
        localStorage.setItem("highscores", JSON.stringify(highScores));

        window.location.href = "highscores.html";
    }
}

//this function checks for someone submitting the high score
function checkForEnter(event){
    if(event.key === "Enter") {
        saveHighScore();
    }
}

startButton.addEventListener("click", startQuiz);

submitButton.addEventListener("click", saveHighScore);

initialElement.addEventListener("keyup", checkForEnter);