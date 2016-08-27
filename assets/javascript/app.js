
//for the timer
var STARTINGTIMERNUMBER =15;  //In seconds
var PAUSETIME = 3;	//In seconds
var ANSWERLISTLENGTH = 4; //Number of answers possible, create object.length function if # answers are not consistant for each question
var timer;
var pauseTimer;
var buttonTimer;

//for trivia logic
var questionOrder;
var currentQuestion;
var currentQuestNum;
var correctAnswers;
var canClick;

//Trivia info
var Trivia_questions = {
					0: {
							Q: "Which villain possessed the infinity gauntlet?",
							A: "Thanos",
							A_LIST:{
								0: "Galactus",
								1: "Dr.Doom",
								2: "Green Goblin",
								3: "Thanos"
							}
						},
					1: {
							Q: "What is Black Widow's real name?",
							A: "Natalia Romanova",
							A_LIST:{
								0: "Natalia Ravenova",
								1: "Jean Grey",
								2: "Wanda Maximoff",
								3: "Natalia Romanova"
							}
						},
					2: {
							Q: "In Civil War, who did Captain America fight?",
							A: "Iron Man",
							A_LIST:{
								0: "Hawkeye",
								1: "Wolverine",
								2: "Silver Surfer",
								3: "Iron Man"
							}
						},
					3: {
							Q: "Who is the villain who killed Gwen Stacy, Spider-man's first Love?",
							A: "Green Goblin",
							A_LIST:{
								0: "Vulture",
								1: "Hobgoblin",
								2: "Doctor Octopus",
								3: "Green Goblin"
							}
						},
					4: {
							Q: "Who was the first Herald of Galactus to be encountered by the inhabitants of the planet Earth?",
							A: "Silver Surfer",
							A_LIST:{
								0: "Fire-lord",
								1: "Gabriel the Air-Walker",
								2: "Terrax the Tamer",
								3: "Silver Surfer"
							}
						},
					5: {
							Q: "Which Character was exposed to a massive dose of gamma radiation?",
							A: "The Hulk",
							A_LIST:{
								0: "The Thing",
								1: "Power-Man",
								2: "The Hulk",
								3: "Luke Cage"
							}
						},
					6: {
							Q: " One of Iron Man's greatest and oldest foes is the Mandarin. From where did he get his power?",
							A: "Rings",
							A_LIST:{
								0: "Rings",
								1: "Crown",
								2: "Necklace",
								3: "Amulet"
							}
						},
					7: {
							Q: "How did the Fantastic Four obtain their powers?",
							A: "Exposure to Cosmic Rays",
							A_LIST:{
								0: "Exposure to Gamma Radiation",
								1: "Exposure to Cosmic Rays",
								2: "Exposure to Nuclear Radiation",
								3: "Exposure to Gamma Rays"
							}
						},
					8: {
							Q: " What team included Thor, the Hulk, Giant-man, the Wasp and Iron Man as the founding members?",
							A: "The Avengers",
							A_LIST:{
								0: "The Defenders",
								1: "The Warriors",
								2: "The Invincibles",
								3: "The Avengers"
							}
						},
					9: {
							Q: "Who is known as the 'merc with the mouth'?",
							A: "Deadpool",
							A_LIST:{
								0: "Deadpool",
								1: "Wolverine",
								2: "Human Torch",
								3: "Spider-man"
							}
						},
					

				};

/*
 * Start Game
 */
$(document).ready(function(){
	
	//this causes the modal to pop up and have to click 
	$("#myModal").modal('show');
	startGame();
	
	$(".answerButton").click(function(){
			if(canClick==true){
				checkAnswer($(this).html(), $(this).attr('value'));
			}
		});
});

function startGame(){

	var listLength = Object.keys(Trivia_questions).length;
	currentQuestion =0;
	correctAnswers = 0;
	canClick=true;
	questionOrder = getShuffledArray(listLength);
	changeQuestion();
	$("#currentScore").html("");
	$("#scorePercent").html("");
}

/*
 * Timer Functions
 */
function startTimer(){

	questionTimerNumber=STARTINGTIMERNUMBER;
	$("#timer").html(questionTimerNumber);
	timer = setInterval(updateTimer, 1000);
	clearTimeout(pauseTimer);

}

function updateTimer(){

	questionTimerNumber-=1;
	$("#timer").html(questionTimerNumber);
	if(questionTimerNumber ==5){
		$("#timer").css({"color":"#E91E23"});

	}

	if(questionTimerNumber ==0){
		clearInterval(timer);
		checkAnswer("",-1);
		$("#timerText").html("Time's Up!");
	}

}

function questionPause(){

	pauseTimer = setTimeout(changeQuestion, 1000*PAUSETIME);  
	
}

function getShuffledArray(arrayLength){
	
	var tempArray = new Array();
	for(var i = 0; i<arrayLength;++i){
		tempArray.push(i);
	}

	//randomize the questions
	for(var i=0;i<arrayLength;++i){
		var randNum = Math.floor(Math.random()*arrayLength);
		var tempNum = tempArray[i];
		tempArray[i] = tempArray[randNum];
		tempArray[randNum] = tempNum;
	}

	return tempArray;

}

function changeQuestion(){

	$("#timerText").html("");
	startTimer();

	//Validates to make sure not to exceed number of questions
	if((currentQuestion) < questionOrder.length){

		canClick=true;

		//Relates random number question array to trivia list
		currentQuestNum = questionOrder[currentQuestion];

		//Display random question
		$("#question").html(Trivia_questions[currentQuestNum]["Q"]);

		//Display number  of questions fraction
		$("#questionNumText").html("Question: "+(currentQuestion+1)+"/"+questionOrder.length);

		//Randomize answer order and display
		var answerArray = getShuffledArray(ANSWERLISTLENGTH);
		for(var i = 0; i <answerArray.length;++i){
			$("#answer"+i).html(Trivia_questions[currentQuestNum]["A_LIST"][answerArray[i]]);
			$("#answer"+i).attr("class", "buttonNormal answerButton");
			$("#answer"+i).attr("value", i);

		//Reset Timer Color
		$("#timer").css({"color":"#ffffff"});
		}
	}
	else{
		clearTimeout(pauseTimer);
		clearInterval(timer);
		endModal();
	}

}

function checkAnswer(answer, valueNum){

	clearInterval(timer);
	canClick=false;

	//Check to see if answer matches correct answer
	if(answer == Trivia_questions[currentQuestNum]["A"]){
		correctAnswers+=1;
		$("#timerText").html("Correct!");
		correctButtonColor(true, valueNum);
	}
	else{
		correctButtonColor(false, valueNum);
		$("#timerText").html("Incorrect!");
	}

	//Display score
	currentQuestion+=1;
	$("#currentScore").html(correctAnswers+"/"+currentQuestion);
	$("#scorePercent").html(getPercentScore()+"%");

	questionPause();

}

function correctButtonColor(correct, answer){
	var correctNum;

	//Find which random button contains the correct answer
	for(var i =0;i<ANSWERLISTLENGTH;++i){
		if(Trivia_questions[currentQuestNum]["A"] == $("#answer"+i).html()){
			correctNum = i;
		}

		//disable all button clicks
		$("#answer"+i).removeClass("buttonNormal")
		$("#answer"+i).addClass("disabled buttonNormalAfterClick");
	}

	//Highlight correct and incorrect buttons
	if(!correct){
		$("#answer"+answer).attr("class", "buttonWrong disabled answerButton");
	}
	$("#answer"+correctNum).attr("class", "buttonCorrect disabled answerButton");
}

function endModal(){
	//Show Modal
	$("#myModal").modal('show');
	
	$("#modalImage").empty();	
	$("#modalText").attr("class", "endGameText text-center");
	$("#modalText").html("Game Over!<br />"+"Your Score: "+correctAnswers+"/"+currentQuestion+" = "+getPercentScore()+"%");
	$("#modalButtonText").html("Click to play again!");


}

function getPercentScore(){
	return Math.round(correctAnswers/currentQuestion*100);

}


