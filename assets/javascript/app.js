$(document).ready(function(){

    function Question(id, myQuestion, answers) {
        this.id = id
        this.myQuestion = myQuestion
        this.answers = answers
    }

    function Game(qCount, numCorrect, numWrong, numUnanswered){
        this.qCount = qCount//counter for current question
        this.numCorrect = numCorrect//number of correct guesses
        this.numWrong = numWrong// number of incorrect guesses
        this.numUnanswered = numUnanswered
    }

//hide the timer
    $("#timersection").hide()


var questionBank = [];

questionBank.push(new Question(1,"The mojito is a traditional rum cocktail from which country?",["Cuba","Mexico","Africa","Spain"]),
                  new Question(2,"What is the French culinary term for a dish that has been covered with breadcrumbs or grated cheese and browned?",["Au gratin","Sprinkles","Chapelure","Fromage brun"]),
                  new Question(3,"Known for its characteristic strong smell and taste, Stilton is a type of cheese produced in which country?",["England","Romania","Belgium","Croatia"]),
                  new Question(4,"Key and Kaffir are two types of what fruit?",["Lime","Apple","Banana","Kiwi"]),
                  new Question(5,"Which American fast-food restaurant franchise has an item on its menu called the Blizzard?",["Dairy Queen","McDonalds","Burger King","Dennys"]),
                  new Question(6,"A deficiency of what vitamin may lead to dry eyes and night blindness?",["Vitamin A","Vitamin C","Iron","Vitamin D"]),
                  new Question(7,"Most brands of of the liquor soju are made in which country?",["South Korea","Japan","Taiwan","China"]),
                  new Question(8,"Which South American country is the worlds largest producer of Coffee?",["Brazil","Colombia","Peru","Venezuela"]),
                  new Question(9,"Who was the host of the American travel and food show No Reservations?",["Anthony Bourdain","Guy Fieri","Gordon Ramsey","Andrew Zimmerman"]),
                  new Question(10,"Tom yum is a type of hot and sour soup that originated in which country?",["Thailand","Vietnam","Cambodia","Malaysia"])
)


var game1 = new Game(0,0,0,0);

// create a new countdown
var myCounter = new Countdown({  
    seconds:10,  
    onUpdateStatus: function(sec){console.log(sec);}, 
    onCounterEnd: function(){ 
        $("#timersection").hide()
        $("#timerremainvalue").html("0")
        game1.numUnanswered+=1
        var correctAnswer = questionBank[game1.qCount].answers[0]
        $("#answers-view").html("<h2>TIME IS UP!!!</h2>")
        $("#answers-view").append("<h2>The answer was: "+ correctAnswer +"</h2>")
        console.log("unanswered count", game1.numUnanswered)
        console.log("timeout qCount: ", game1.qCount)
        //go to next question
            game1.qCount+=1
            setTimeout(function(){ 
                if(game1.qCount < questionBank.length){
                    myCounter.start()
                    renderButtons(game1.qCount)
                }
                else{
                    gameOver()
                }

            }, 3000);
    } // final action
});

//countdown timer
function Countdown(options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    else{
        $("#timerremainvalue").html(seconds)
        seconds--;
        console.log(seconds)  
    }
 
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    console.log("countdown.start was called-seconds:",seconds)
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}

function renderButtons(qNum) {
    $("#gameover").empty()
    $("#timersection").show()
    myCounter.start()
    $("#answers-view").empty()
    $("#theBigQ").html("<h3>"+questionBank[qNum].myQuestion+"</h3>")

    for (var i = 0; i < questionBank[qNum].answers.length; i++) {
      var a = $("<button>")
      a.addClass("trivia")
      a.attr("data-name", i)
      a.text(questionBank[qNum].answers[i])
      var random_boolean = Math.random() >= 0.5;
      console.log(random_boolean)
      if(random_boolean===true){//lets randomize the button order
        $("#answers-view").append(a)
      }
      else{
        $("#answers-view").prepend(a)
      }
    
    }
    
  }

    $(".startbtn").on("click", function(event) {
        event.preventDefault();
        $("#timersection").show()
        var qMax = questionBank.length
        renderButtons(game1.qCount)
        $(".startbtn").hide()
      });

function gameOver(){

    var a = $("<button>")
    a.addClass("reset")
    a.attr("data-name", "reset")
    a.text("RESET")

    var tallyCorrect = "<h3>Correct Answers:&nbsp;" + game1.numCorrect + "</h3>"
    var tallyWrong = "<h3>Wrong Answers:&nbsp;" + game1.numWrong + "</h3>"
    var tallyUnanswered = "<h3>Unanswered:&nbsp;" + game1.numUnanswered + "</h3>"

    $("#resetholder").html(a)
    $("#gameover").html("<h3>All done, here is how you did!</h3>")
    $("#gameover").append(tallyCorrect)
    $("#gameover").append(tallyWrong)
    $("#gameover").append(tallyUnanswered)
    $("#answers-view").html("")
    $("#theBigQ").html("")
    $("#timersection").hide()

}

function resetGame(){
    game1 = new Game(0,0,0,0)
    $("#resetholder").html("")
    $("#gameover").html("")
    $(".startbtn").show()
}

function playTheGame() {
    myCounter.stop()
    var selectedAnswer = $(this).attr("data-name");
    var correctAnswer = questionBank[game1.qCount].answers[0]
    $("#timersection").hide()
    if(selectedAnswer === "0"){
        $("#answers-view").html("<h2 style='color:green;'>CORRECT!</h2>")
        game1.numCorrect+=1
    }
    else{
        $("#answers-view").html("<h2 style='color:red;'>WRONG!</h2>")
        $("#answers-view").append("<h2>The answer was: "+ correctAnswer +"</h2>")
        game1.numWrong+=1
    }
    
    game1.qCount+=1//increment to next question
    setTimeout(function(){ 
        if(game1.qCount < questionBank.length){
            renderButtons(game1.qCount)
        }
        else{
            gameOver()
        }
    }, 3000)//wait 3 seconds then next question
    console.log("selectedAnswer:",selectedAnswer)

  }

      // Adding click event listeners to all elements with a class of "trivia"
      $(document).on("click", ".trivia", playTheGame);
      // Adding click event listeners to reset the game on button press
      $(document).on("click", ".reset", resetGame);

})