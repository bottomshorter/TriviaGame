$(document).ready(function () {

  // Trivia Object
  var gameobject = {
    // Holding Questions/Answer/Choices/Variables/Functions
    question1: {
      question: "In The Fellowship of the Ring, what is the name of the ferry the hobbits use to escape the Black Riders?",
      correct: "Buckleberry Ferry",
      choice2: "Huckleberry Ferry",
      choice3: "Blackberry Ferry",
      choice4: "Strawberry Ferry",
    },
    question2: {
      question: "Where was the entire trilogy of the Lord of the Rings filmed?",
      correct: "New Zealand",
      choice2: "Sweden",
      choice3: "Australia",
      choice4: "Norway",
    },
    question3: {
      question: "Which of the following is NOT one of Gandalfs many nicknames?",
      correct: "Strider",
      choice2: "Gandalf the White",
      choice3: "Gandalf the Grey",
      choice4: "Gandalf Stormcrow",
    },
    question4: {
      question: "In the commentary, it was noted that he passed gas in the scene where the four hobbits ran from Farmer Maggots field and fell.",
      correct: "Frodo",
      choice2: "Sam",
      choice3: "Pippin",
      choice4: "Merry",
    },
    question5: {
      question: "Legolas...",
      correct: "Greenleaf",
      choice2: "the Elf",
      choice3: "Greenweed",
      choice4: "...he has a name?",
    },

    //Set values to default
    QuestionNumber: 1,
    QuestionsCorrect: 0,
    QuestionsWrong: 0,
    QuestionTime: 10,
    currentTime: 10,
    intervalHolder: null,
    buttonTimeOut: null,
    postTimeOut: null,
    timerRunning: false,
    answered: false,

    //Define Functions used to make game run
    //Function to shuffle buttons, and to push questions on to appropriate ids
    LoadQuestions: function (question) {

      // Since the answer is fixed in the object, needs to shuffle button so answer is not static in one place
      // Pulled this code online as a randomizer for the buttons. 
      $("#choices-div").each(function () {
        var buttons = $(this).find('button');
        for (var i = 0; i < buttons.length; i++) {
          $(buttons[i]).remove();
        }

        var i = buttons.length;
        if (i == 0) {
          return false;
        }
        while (--i) {
          var j = Math.floor(Math.random() * (i + 1));
          var tempi = buttons[i];
          var tempj = buttons[j];
          buttons[i] = tempj;
          buttons[j] = tempi;
        }
        for (var i = 0; i < buttons.length; i++) {
          $(buttons[i]).appendTo(this);
        }
      });
      //End of pulled code

      // Grabs questions, answer, choices and places it in the text of the acoording ids
      $("#question").empty().text(question.question);
      $("#correct").empty().text(question.correct);
      $("#choice2").empty().text(question.choice2);
      $("#choice3").empty().text(question.choice3);
      $("#choice4").text(question.choice4);
      //State of being answered set to false
      this.answered = false;
    },


    //Function to move to next question
    nextQuestion: function (number) {
      //Remove classes from btn, required or the questions wont clear out for next question
      $(".btn").removeClass("btn-success btn-danger btn-warning");
      //empty out #message-area
      $("#message-area").empty();
      //Loop to move check if there is more questions, stops at 5
      if (this.QuestionNumber <= 5) {
        //Set currentQuestion to current question user is on
        var currentQuestion = gameobject["question" + number];
        //Call LoadQuestions to clear the questions info out and load it with the next one
        this.LoadQuestions(currentQuestion);
        this.timer();
        //Set timeout to 1 second * Question Time (should be 10 seconds)
        this.buttonTimeOut = setTimeout(this.incorrect, (1000 * gameobject.QuestionTime));
        // Or just end the game
      } else {
        this.endGame();
      }
    },


    //Function for if the user picks the correct answer
    correct: function () {
      //Clears the timer set
      clearInterval(gameobject.intervalHolder);
      //Add +1 to # of Questions correct
      gameobject.QuestionsCorrect++;
      //Add +1 to the Question # (for referencing which question)
      gameobject.QuestionNumber++;
      //Append the #message-area html, add <p> Tag, indicating user got the correct answer
      $("#message-area").html('<p>You are correct!</p>')
      var Next = function () {
        gameobject.nextQuestion(gameobject.QuestionNumber);
      }
      // 3 Second pause after user gets correct answer
      this.postTimeOut = setTimeout(Next, 1000 * 3);
    },


    //Same function but for when the user picks the incorrect answer
    incorrect: function () {
      clearInterval(gameobject.intervalHolder);
      $("#correct").addClass("btn-success");
      gameobject.QuestionNumber++;
      gameobject.QuestionsWrong++;
      $("#message-area").html('<p>You are incorrect!</p>')
      var Next = function () {
        gameobject.nextQuestion(gameobject.QuestionNumber);
      }
      //3 Second pause after user gets an incorrect answer
      this.postTimeOut = setTimeout(Next, 1000 * 3);
    },

    //Function to initalize/start the game
    initalizeGame: function () {
      //Reset variables to start game
      this.QuestionNumber = 1;
      this.QuestionsCorrect = 0;
      this.QuestionsWrong = 0;
      this.answered = false;
      //Shows question div, answers div, and timer div
      $("#question, #choices-div, #timer-area").show();
      //Empties out the message area and the 
      $("#control-buttons, #message-area").empty();
      // Load the first question
      this.LoadQuestions(gameobject.question1);
      // Start the timer
      this.timer();
      //Give 10 seconds til time out
      this.buttonTimeOut = setTimeout(this.incorrect, 1000 * (gameobject.QuestionTime));

    },


    //Function to hide the sections with ids , #question, #choices-div, and #timer-area
    openScreen: function () {
      $("#question, #choices-div, #timer-area").hide();
      //Append HTML of control buttons to add a START GAME button
      $("#control-buttons").html('<button id="start-game" class="btn btn-large btn-primary">START GAME</button>')
    },

    //Timer function
    timer: function () {
      gameobject.currentTime = 10;
      $("#timer").text(gameobject.currentTime);
      gameobject.intervalHolder = setInterval(gameobject.count, 1000);
    },

    //Count Timer function
    count: function () {
      //Subtracts 1 second per tick
      gameobject.currentTime--;
      //Changes the current time to the updated version
      $("#timer").text(gameobject.currentTime);
    },

    //Function to end the game
    endGame: function () {
      //Hide areas with relevant ids
      $("#question, #choices-div, #timer-area").hide();
      //Create a RESTART GAME button
      $("#control-buttons").html('<button id="start-game" class="btn btn-large btn-primary">RESTART GAME</button>')
      //Create message displaying stats in area with id = #message-area
      $("#message-area").html('<h4>Game Stats</h4> <p> Correct: ' + this.QuestionsCorrect + '</p> <p>Incorrect: ' + this.QuestionsWrong + '</p>')
    }
  }



  // call openScreen, places STARTGAME Button in control buttons area
  gameobject.openScreen();

  // Attaching on event listener, on click run button to check if answered
  $("#choices-div").on("click", ".btn", function () {
    var $this = this;
    var clickedId = $($this).attr("id");

    if (!gameobject.answered) {
      //If the state of answered is true, then call clearTimeout
      gameobject.answered += true;
      clearTimeout(gameobject.buttonTimeOut);
      //If button clicked is correct, change the btn class to success (green) and call correct function
      if (clickedId === "correct") {
        $($this).addClass("btn-success");
        gameobject.correct();
      }
      //If button clicked is incorrect, then change btn class to danger (red) and call incorrect function
      if (clickedId != "correct") {
        $($this).addClass("btn-danger");
        gameobject.incorrect();
      }
    }
  });

  // Start game on click of button
  $("#control-buttons").on("click", "#start-game", function () {
    gameobject.initalizeGame();
  });
});