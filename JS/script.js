var timerEl = document.querySelector("#time");
var startButton = document.querySelector("#start-button");
var questionsEl = document.querySelector('#questions');
var endScreenEl = document.getElementById("end-screen");
var feedbackEl = document.querySelector("#feedback");
var initialsEl = document.querySelector("#initials");
var submitButton = document.querySelector("#submit");
var scoresEl = document.querySelector("#scores");
var highscores = JSON.parse(window.localStorage.getItem("highscores"));
// Questions added here
var questionsArray = [
    {
      question: "Javascript is an _______ language?",
      choices: ["Object-Oriented", "Object-Based", "Procedural", "None of the above"],
      answer: "Object-Oriented"
    },
    {
      question: "Which of the following keywords is used to define a variable in Javascript?",
      choices: ["getElementById()", "getElementByClassName()", "Both A and B", "None of the above"],
      answer: "Both A and B"
    },
    {
      question: "How can a datatype be declared to be a constant type?",
      choices: ["const", "var", "let", "constant"],
      answer: "const"
    },
    {
      question: "What keyword is used to check whether a given property is valid or not?",
      choices: ["in", "is in", "exists", "lies"],
      answer: "in"
    },
    {
      question: "When an operators value is NULL, the typeof returned by the unary operator is:",
      choices: ["Boolean", "Undefined", "Object", "Integer"],
      answer: "Object"
    }
  ]

// added timer vars
var time = 60;
var timerId;
var currentQuestionIndex = 0;

// function to track timer
function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    endQuiz();
  }
}


// starts quiz by calling function when start button is clicked
startButton.addEventListener("click", startQuiz);

// beginning of startQuiz function
function startQuiz() {
  //declares startingScreen as the id start-screen
    var startingScreen = document.getElementById("start-screen");

    //if statement checks the css style of the start screen then displays the questions in the same block and starts time
    if (startingScreen.style.display === "none") {
      startingScreen.style.display = "block";
    } else {
      startingScreen.style.display = "none";
      questionsEl.style.display = "block";

      // starts timer at 1 seconds intervals
    timerId = setInterval(clockTick, 1000);

    // display time
    timerEl.textContent = time;

      //calling function to pull questions
      getQuestion();
    }
}
//  end of startQuiz function

//Start of getQuestion function
function getQuestion() {
//   gets the current questioni from the questions array and sets titleEl to the current question
  var currentQuestion = questionsArray[currentQuestionIndex];
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.question;

  var choicesEl = document.querySelector("#choices");

  //clears the question choices to empty string
  choicesEl.innerHTML = "";

  // this holds the choices of the questions
  var choicesArray = currentQuestion.choices;

  //function to loop through choices array
  var displayChoices = function() {
    for (var currentQuestionIndex = 0; currentQuestionIndex < choicesArray.length; currentQuestionIndex++) {

      // creates a var for the current choice in the array that the function is affecting
      var choice = choicesArray[currentQuestionIndex];

      //creates button
      var choiceButton = document.createElement("button");
      //sets class of new button
      choiceButton.setAttribute("class", "choice");
      //sets the value button to the current choice that the function is dealing with
      choiceButton.setAttribute("value", choice);

      //sets the button text content to the current index of the array plus 1, and beside it,
      // the text of the current choice that the function is dealing with
      choiceButton.textContent = currentQuestionIndex + 1 + ". " + choice;
      choiceButton.addEventListener("click", questionClick);
      //appended the button within the choices div
      choicesEl.appendChild(choiceButton);
    };
  }
   displayChoices();
}
// end of get questions function

// start of questionsClick function
 function questionClick() {
   //if user answers incorrectly, deducts time and vice versa
   if (this.value !== questionsArray[currentQuestionIndex].answer) {
     //penalize time
     time -= 15;

     if (time < 0) {
       time = 0;
     }
      //displays the new time on page
      timerEl.textContent = time;
      //styles the feedback text
      feedbackEl.textContent = "Wrong answer!";
      feedbackEl.style.color = "orange";
      feedbackEl.style.fontSize = "250%";
     } else {
      feedbackEl.textContent = "Correct!";
      feedbackEl.style.color = "blue";
      feedbackEl.style.fontSize = "200%";
     };
     //will go to next question if the following if statement calls getQuestion
    currentQuestionIndex++;

    //checks time
     if (currentQuestionIndex === questionsArray.length || time <= 0) {
       endQuiz();
     } else {
       getQuestion();
     };
};
// end of questionClick function

// start of endQuiz function
function endQuiz() {
  clearInterval(timerId);
  //hides the questions and feedback
  questionsEl.style.display = "none";
  feedbackEl.style.display = "none";
  // displays the end screen
  endScreenEl.style.display = "block";
  // creates var that references the span tag
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
}
// end of endQuiz function

// start of enterKey function
function enterKey(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}
// end of checkForEnter
initialsEl.onkeyup = enterKey;

// start of saveHighscores function
 submitButton.addEventListener("click", saveHighscore);
function saveHighscore() {
  //gets the value from the input box
  var initials = initialsEl.value.trim();
  if (initials !== "") {
    endScreenEl.style.display = "none";
    scoresEl.style.display = "block";

    // gets local storage items for highscores
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];

   // new score object for current user
   var newScore = {
    score: time,
    initials: initials
  };
   // saves to localstorage
   highscores.push(newScore);
   window.localStorage.setItem("highscores", JSON.stringify(highscores));
   printHighscores();
  }
}
// end of saveHighscores

// start printHighscores functions
function printHighscores() {
   // gets scores from the localstorage or set as an empty array
   JSON.parse(window.localStorage.getItem("highscores")) || [];
  // sort highscores
  highscores.sort(function(a, b) {
    return b.score - a.score;
  });
  highscores.forEach(function(score) {
    // create li tag
    var liTag = document.createElement("li");
    liTag.textContent = score.initials + " - " + score.score;
    // display on page
    var olEl = document.getElementById("highscores");
    olEl.appendChild(liTag);
  });
}
// end of printHighscores function

// start of clearHighscores function
document.getElementById("clear").onclick = clearHighscores;

function clearHighscores() {
  window.localStorage.removeItem("highscores");
  window.location.reload();
}
// end of clearHighscores function
