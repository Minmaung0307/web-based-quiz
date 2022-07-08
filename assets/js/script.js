// ခေါ်သုံးချင်တဲ့ ​html ထဲက element တွေကို variable ကြေညာခြင်း
// Variables to access html elements
var scores = document.querySelector("#scores");
var timer = document.querySelector("#timer");
var container = document.querySelector("#container");
var title = document.querySelector("#title");
var content = document.querySelector("#content");
var start = document.querySelector("#start");
var answer = document.querySelector("#answer");
var line = document.querySelector("hr");

// မေးခွန်းပုံစံတည်ဆောက်ခြင်း
// Structure of questions
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

//မေးခွန်းများစုစည်းထားခြင်း
var questionList = [];

//တည်ဆောက်ပြီး မေးခွန်းများကို မေးခွန်းစာရင်းပြုစုခြင်း
//All Questions formatted and put into questionList array
const options1 = ["1. strings", "2. booleans", "3. alerts", "4. numbers"];
const question1 = new Question("Commonly used data types DO Not Include:", options1, "3. alerts");
questionList.push(question1);

const options2 = ["1. quotes", "2. curly brackets", "3. parenthesis", "4. square brackets"];
const question2 = new Question("The condition in an if / else statement is enclosed with ________.", options2, "3. parenthesis");
questionList.push(question2);

const options3 = ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of the above"];
const question3 = new Question("Arrays in JavaScript can be used to store _______.", options3, "4. all of the above");
questionList.push(question3);

const options4 = ["1. commas", "2. curly brackets", "3. quotes", "4. parenthesis"];
const question4 = new Question("String values must be enclosed within ______ when being assigned to variables.", options4, "3. quotes");
questionList.push(question4);

const options5 = ["1. JavaScript", "2. terminal/bash", "3. for loops", "4. console.log"];
const question5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is:", options5, "4. console.log");
questionList.push(question5);

//မေးခွန်းများနှင့်ပတ်သက်၍ မေးခြင်း ဖြေခြင်း အမှတ်ပေးခြင်းစသည်များ ကြေညာခြင်း 
//Variables for question loop functions
var optionList = [];
var currentQues = 0;
var score = 0;
var timeLeft = 76;
var isQuizOngoing = false;
var leaderboard = [];
var initials = "";
var isClearingAnswer = false;
var clearingAnswerCode = 0;
var isCorrect = false;

//စတင်ဖြေဆိုမူ အမှတ်စာရင်းကြည့်မူများကို အဆင်သင့်ပြင်ထားခြင်း 
//Init function that makes view scores and start quiz clickable
function init() {
    start.addEventListener("click", questionLoop);
    scores.addEventListener("click", showScores);
}

//မေးခွန်းလွှာများကို မမြင်အောင်သိမ်းထားခြင်းနှင့် ရွေးချယ်မေးခွန်းများစတင်ခြင်း 
//Makes elements before the quiz started invisible and creates option buttons
function questionLoop () {
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    var numOfOptions = questionList[0].options.length;
    for(var i = 0; i < numOfOptions; i++) {
        var option = document.createElement("button");
        // container.appendChild(option);
        container.insertBefore(option, container.children[3 + i]);
        optionList.push(option);
        option.setAttribute("id", `button${i + 1}`);
    }
    nextQuestion();
}

//အချိန်သတ်မှတ်ပေးခြင်းနှင့် အချိန်ပြည့်လျှင် အဖြေလွှာသိမ်းခြင်း 
//Counts down the timer and ends the quiz if time is zero
function runTimer () {
    var clock = setInterval(function() {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft}`;
        if(timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== "All Done.") {
                endOfQuiz();
            }
        }
    }, 1000)
}


//နောက်မေးခွန်းကိုဆက်ဖြေမှာလား သို့ မဖြေတော့ဘူးလားကို ရွေးချယ်ခြင်း
//Checks if you are the last question && Either goes to next question or end of quiz
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}

//မေးခွန်းများစစ်ဆေးခြင်း၊ မှန်မမှန်စစ်ဆေးခြင်း၊ ကျန်ရှိမေးခွန်းနှင့်အချိန်တိုက်ကြည့်ခြင်း၊ 
//အချိန်-၁၀-စက္ကန့်တောင်မကျန်လျှင် သုညသို့ပြောင်းထားရန်
// Checks if you are on the first question 
// if not it checks the answer from the previous question is correct
// if answer is incorrect time left is reduced and flashes red
// Unless time left is less than ten then timer is set to zero
function writeAnswer(event) {
    if(event !== undefined) {
        if(event.currentTarget.textContent === questionList[currentQues - 1].answer) {
            isCorrect = true;
            line.style.display = "block";
            answer.textContent = "Correct!";
            answer.setAttribute("style", "color: grey");
            score += 10;
        } else {
            isCorrect = false;
            line.style.display = "block";
            answer.textContent = "Incorrect!";
            answer.setAttribute("style", "color: grey");
            if(timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            timer.setAttribute("style", "color: red");
            setTimeout(function () {
                timer.setAttribute("style", "color: black");
            },1000);
        }
        clearAnswer();
    }
}

//အဖြေက သုံးစက္ကန့်သာကြာမြင့်ခြင်း၊ သတ်မှတ်ချိန်စစ်ဆေးခြင်း၊ ကျန်ရှိချိန်ကိုထုတ်ပြခြင်း
// Clears the the content in the footer after three seconds
// Checks if a timeout has already been set
// If it has it clears the previous timeout and calls itself
function clearAnswer() {
    if(isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function() {
            line.style.display = "none";
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
}

//နောက်မေးခွန်းခေါင်းစဥ်ပြောင်းခြင်းနှင့် ရွေးချယ်မူများပြောင်းခြင်း
// Changes the title to the next question && Changes the options for each button
function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for(var i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];        
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

//အားလုံးဖြေဆိုပြီးနောက် ရွေးချယ်မူများ၊ အမှတ်များဖျောက်ထားခြင်း၊
//လက်ရှိမေးခွန်းကိုသတ်မှတ်ခြင်းနှင့် ရမှတ်များပေါင်းခြင်း၊ အမည်ထည့်ရန်ပြင်ဆင်ခြင်း
// Changes title to All Done, clears options and displays score
// Sets current question and score to zero and creates input fields
function endOfQuiz() {
    title.textContent = "All Done.";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Your final score is ${score}.`;
    inputFields();
}

//မေးခွန်းရွေးချယ်မူများအားလုံး ဖယ်ရှားခြင်း
//Removes option buttons and empties array they were in
function clearOptions() {
    for(var i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

//အမည်စာရင်းသွင်းရန်တည်ဆောက်ခြင်းနှင့် အဖြေလွှာအပ်နှံမူ ပြင်ဆင်ခြင်း
// Creates the form for entering initials && Listens for click on submit 
function inputFields() {
    var initialsForm = document.createElement("form");
    // container.appendChild(initialsForm);
    container.insertBefore(initialsForm, container.children[3]);
    initialsForm.setAttribute("id", "form");

    var label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    
    var input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");

    var submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size: 150%");
    
    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);
}

//မေးခွန်းလွှာများ ထပ်မံဝေခြင်းများမဖြစ်စေခြင်း
// Prevents entry field from reloading page
function stopReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}

//နှစ်ခါအပ်နှံခြင်းများကိုရှောင်ရှားခြင်း၊ နာမည်တိုရေးသွင်းမူရှိမရှိစစ်ဆေးခြင်း
//မေးခွန်းဖြေဆိုခြင်းကိုရုတ်သိမ်းခြင်း၊ နာမည်ဖြည့်သွင်းမူကိုအဆုံးသတ်ခြင်း၊ အမှတ်စာရင်းသိမ်းဆည်းခြင်း
// Prevents submit from reloading page
// Checks if initials are in a valid format
// Lets program now quiz is over and removes the form
// Saves the score
function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    var id = document.getElementById("initials");
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

//မေးခွန်းနှင့်အမှတ် သိမ်းထားခြင်းရှိမရှိစစ်ဆေးခြင်း၊ ပြင်ဆင်ဖြည့်စွက်ရှိမရှိစစ်ဆေးခြင်း
//စုစုပေါင်းရမှတ်ကို စာရင်းပြုသိမ်းထားခြင်း
// Chacks if there are any scores saved locally
// If there are any populates them in an array
// Adds the score to the array and updates local storage
function saveScore(id) {
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.push(`${score} ${id.value}`);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();    
}

//နာမည်တိုပေးရန် စည်းမျဥ်းသတ်မှတ်ခြင်း၊ မကိုက်ညီပါက သတ်မှတ်စည်းကမ်းကိုထုတ်ပြခြင်း
//အဆုံးသတ်အပ်နှံခြင်းကို ပြင်ဆင်ခြင်း
// If an incorrect input is given a message is displayed
// Sets the submit button to listen for click
function invalidInput() {
    answer.textContent = "Initials must be entered and three characters or less";
    answer.setAttribute("style", "color: black");
    clearAnswer();
    var submit = document.getElementById("submit");
    submit.addEventListener("click", addScore);
}

//ဖြေဆိုနေစဥ် ရမှတ်စစ်ဆေးခြင်းများ မပြုလုပ်စေခြင်း၊ စာမေးပွဲကိုသာ အာရုံစိုက်စေခြင်း
//ခေါင်းစဥ်သစ်မှတ်သားခြင်း၊ ရမှတ်များရေးခြင်း၊ အဆုံးသတ်အတွက်ပြင်ဆင်ခြင်း
// Checks if quiz is ongoing to prevent being able to check scores during quiz
// Displays a message is quiz is ongoing.
// Changes title, writes scores and creates buttons for navigation
function showScores() {
    if(!isQuizOngoing) {
        title.textContent = "High Scores";
        // Hides start quiz button if view high scores is clicked at beginning
        start.setAttribute("style", "display: none");
        writeScores();
        createEndButtons();
    } else if(title.textContent === "All Done.") {
        answer.textContent = "Please enter your initials first";
        answer.setAttribute("style", "color: black");
        clearAnswer();
    } else {
        answer.textContent = "Cannot view scores until the quiz is over";
        answer.setAttribute("style", "color: black");
        clearAnswer();
    }
}

//စာမေးပွဲဆိုင်ရာများအားလုံးသန့်ရှင်းရေးလုပ်ခြင်း၊ အမှတ်များသိမ်းဆည်းမူများစစ်ဆေးခြင်း၊ ကျန်ရှိပါကသိမ်းဆည်းခြင်း
//ရမှတ်အားလုံးကို စာမျက်နှာပေါ်ဆုံးထောင့်တစ်ခုမှာထင်ရှားစွာပြသခြင်း၊ အဖြေလွှာများအားလုံးစနစ်တကျထပ်၍သိမ်းခြင်း
// Empties content box and formats for list
// Chacks if any scores are stored
// If there are they are put into an array
// The array is sorted to display the top score
// the contents of the array are printed through a loop
function writeScores() {
    content.textContent = "";
    content.setAttribute("style", "white-space: pre-wrap; font-size: 150%; background-color: lightgrey; width: 550px");
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.sort();
    leaderboard.reverse();
    var limit = 11;
    if(limit > leaderboard.length) {
        limit = leaderboard.length;
    }
    for(var i = 0; i < limit; i++) {
        content.textContent += leaderboard[i] + '\n';
    }
}

//အပ်နှံခြင်းများအတွက်ပြင်ဆင်ထားခြင်းရှိမရှိစစ်ဆေးခြင်းနှင့် အရန်သင့်ပြင်ဆင်ထားခြင်း
// Checks to see if the buttons have been created already
// Creates the buttons and sets listeners for a click
function createEndButtons() {
    if(!document.getElementById("restart")) {
        var restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Go Back";
        restartVar.setAttribute("id", "restart");
        
        var clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear High Scores";
        clearScoresVar.setAttribute("id", "clearScores");
        
        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}

//အပ်နှံခြင်းဆိုင်ရာများဖယ်ရှားခြင်း၊ ခေါင်းစဥ်ခွဲခြားခြင်းနှင့် စာမေးပွဲကိုအဆင်သင့်ပြင်ဆင်ခြင်း
//စာမေးပွဲစတင်ခြင်းနှင့်အတူ သက်ဆိုင်ရာလုပ်ငန်းများအစပြုခြင်း
// Removes the current buttons on the screen
// Sets the title and content to original
// Makes start button visible, resets variables and runs init function
function restart() {
    title.setAttribute("style", "align-self: center");
    content.setAttribute("style", "align-self: center; font-size: 110%");
    document.getElementById("restart").remove();
    document.getElementById("clearScores").remove();
    title.textContent = "Coding Quiz Challenge";
    content.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your time by reducing it by ten seconds.";
    start.setAttribute("style", "display: visible");
    currentQues = 0;
    score = 0;
    timeLeft = 76;
    init();
}

//ယာယီအမှတ်စာရင်းများဖျက်ဆီးခြင်းနှင့် ဖျက်ဆီးခြင်းများကို စနစ်တကျသတ်မှတ်ပေးခြင်း
// Clears local storage and array holding scores
// Erases content area
function clearScores() {
    localStorage.clear();
    content.textContent = "";
    leaderboard = [];
}

init();