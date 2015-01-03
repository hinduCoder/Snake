var food = null;
var snake = [];
var width = 500;
var height = 500;

var points = 0;
var timer = null;
var directions = {
	left: -1,
	right: 1,
	down: -2,
	up: 2
}
var currentDirection = directions.right;
$(document).ready( function() {
	createSnake();
	updateFood();
	timer = setInterval(function() {
		moveSnake(currentDirection);
	}, 400);
	$(document).keyup(function (event) {
		switch(event.which) {
			case 37: moveSnake(directions.left); break; //left 
			case 38: moveSnake(directions.up); break; //up
			case 39: moveSnake(directions.right); break; //right
			case 40: moveSnake(directions.down); break; //down
		}
	});
	
});

function updateFood() {
	var top = getRandomInt(0, height/10 - 1);
	var left = getRandomInt(0, width/10 - 1);
	food = {x: left, y: top};
	$(".food").css({"top": top * 10, "left": left * 10, "display": "block"});
}
function createSnake() {
	snake = [];
	snake.push({x: getRandomInt(0, width/10-1), y: getRandomInt(0, height/10-1)});
	snake.push({x: snake[0].x-1, y: snake[0].y});
	snake.push({x: snake[1].x-1, y: snake[1].y});
	for (var i = 0; i < snake.length; i++) {
		var newSnakePart = $("<div></div>");
		var className = 'n'+i;
		newSnakePart.addClass(className);
		newSnakePart.addClass("snake");
		$("#field").append(newSnakePart);
	}
	updateSnake();
}
function updateSnake() {
	for (var i = 0; i < snake.length; i++) {
		$(".n"+i).css({"top": snake[i].y*10, "left": snake[i].x*10});
	}
}
function addSnakePart() {
	var preLast = snake[snake.length-2];
	var last = snake[snake.length-1];
	var newPart = null;
	if (preLast.x == last.x) {
		newPart = {x: last.x, y: last.y + (last.y-preLast.y)};
	}
	else {
		newPart = {x: last.x + (last.x-preLast.x), y: last.y};
	}
	snake.push(newPart);
	var newSnakePart = $("<div></div>");
	var className = 'n'+(snake.length-1);
	newSnakePart.addClass(className);
	newSnakePart.addClass("snake");
	$("#field").append(newSnakePart);
	updateSnake();
}
function moveSnake(direction) {
	if (direction + currentDirection == 0) return;
	var prev = null;
	var currentAction = null;
	for (var i = 0; i < snake.length; i++) {
		var current = snake[i];
		switch (direction) {
			case directions.left: currentAction = function() { current.x--; }; break;
			case directions.right: currentAction = function() { current.x++; }; break;
			case directions.down: currentAction = function() { current.y++; }; break;
			case directions.up: currentAction = function() { current.y--; }; break;
		}
		
		if (prev != null) {
			if (prev.x == current.x && current.y < prev.y) {
				currentAction = function() { current.y++; }
			}
			if (prev.x == current.x && current.y > prev.y) {
				currentAction = function() { current.y--; }
			}
			if (prev.y == current.y && current.x < prev.x) {
				currentAction = function() { current.x++; }
			}
			if (prev.y == current.y && current.x > prev.x) {
				currentAction = function() { current.x--; }
			}
		}
		
		prev = {x: current.x, y: current.y};
		currentAction();
		
	}
	currentDirection = direction;
	checkSnake();
	updateSnake();
}
function checkSnake() {
	var head = snake[0]; 
	if (head.x == food.x && head.y == food.y)
	{
		addSnakePart();
		updateFood();
		$("#points").text(++points);	
	}
	if (head.x >= width/10 || head.x < 0 || head.y < 0 || head.y >= height/10) {
		crash();
	}
	for (var i = 1; i < snake.length; i++) {
		if (head.x == snake[i].x && head.y == snake[i].y)
			crash();
	}
}
function crash() {
	for (var i = 0; i < snake.length; i++) {
		$(".n"+i).remove();
	};
	clearInterval(timer);
	alert("CRASH!!!");
	currentDirection = directions.right;

	createSnake();
	updateFood();
	timer = setInterval(function() {
		moveSnake(currentDirection);
	}, 400);
	points = 0;
	$("#points").text(0);
}
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
