var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });
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
var previousDirection = null;
$(document).ready( function() {
	createSnake();
	updateFood();
	timer = setInterval(function() {
		moveSnake(currentDirection);
	}, 200);
	$("body").on("swipeleft", function(e) {
		e.preventDefault();
		e.stopPropagation();
		currentDirection = directions.left; 
	});	
	$("body").on("swiperight", function(e) {
		e.preventDefault();
		e.stopPropagation();
		currentDirection = directions.right; 
	});
	$("body").on("swipeup", function(e) {
		e.preventDefault();
		e.stopPropagation();
		currentDirection = directions.up; 
	});
	$("body").on("swipedown", function(e) {
		e.preventDefault();
		e.stopPropagation();
		currentDirection = directions.down; 
	});	

	//
	$(document).keyup(function (event) {
		switch(event.which) {
			case 37: currentDirection = directions.left; break; //left 
			case 38: currentDirection = directions.up; break; //up
			case 39: currentDirection = directions.right; break; //right
			case 40: currentDirection = directions.down; break; //down
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
		newSnakePart.addClass("snake");
		$("#field").append(newSnakePart);
	}
	updateSnake();
}
function updateSnake() {
	var elements = $("#field").children('.snake');
	for (var i = 0; i < elements.length; i++) {
		$(elements[i]).css({"top": snake[i].y*10, "left": snake[i].x*10});
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

	newSnakePart.addClass("snake");
	$("#field").append(newSnakePart);
	updateSnake();
}
function moveSnake(direction) {
	if (direction + previousDirection == 0) {
		currentDirection = previousDirection; //TODO: refactor variable/parameter
		return;
	}
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
	previousDirection = direction;
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
	$("#field").children('.snake').remove();
	clearInterval(timer);
	alert("CRASH!!!");
	currentDirection = directions.right;

	createSnake();
	updateFood();
	timer = setInterval(function() {
		moveSnake(currentDirection);
	}, 200);
	points = 0;
	$("#points").text(0);
}
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
