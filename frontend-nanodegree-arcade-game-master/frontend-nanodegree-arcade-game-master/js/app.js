// The Frogger matrix is 6 rows x 5 colums
// The canvas is col: 101 by row 83

//Enemy bugs move across the 3 rows only
//Global Variables
var side = {left:0, right: 505, top:0, bottom:415};			  -0
var move = {hor:101, vert:83};
var games = 0;
var plays = 3;
var score = 0;
var high = 0;
var audio = new Audio;
var endgame;

function renderOnce() {
	audio.src = 'sounds/WHATIF.wav';
	audio.play();
}

//Enemy Class
var Enemy = function (x,y) {
	this.sprite = 'images/enemy-bug.png';
	this.x = x;
	this.y = y;
	this.speed = RandomizeEnemySpeed();
}

// Some Enemies will move at different speeds
function RandomizeEnemySpeed() {
	 return (Math.floor(Math.random() * 100) + 15);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time distance between ticks
Enemy.prototype.update = function (dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if (this.x < side.right){
		this.x += dt * this.speed + 2;
	} else {
		this.x = 0;
		this.speed = RandomizeEnemySpeed();
	}

	 /* Check for collision. if the enemy hit the player
	 * deduct a life and reset player's position
	 */
	if (Math.abs(this.x - player.x) < 30 && Math.abs(this.y - player.y) < 30) {
		player.x = 215;
		player.y = 435;
		player.plays--;
		audio.src = 'sounds/Bong.mp3';
		audio.play();
	}
};

 // Resets Enemy's x position to a random value.
Enemy.prototype.resetPosition = function () {
	this.x = generateRandomNumber(this.id * 75, this.id * 5);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//max plays =3 and score starts at zero, increments by 50
// Player Class
var Player = function (x, y) {
	this.score = 0;
	this.plays = 3;
	this.high = 0;
	this.games = 0;
	this.x = x;
	this.y = y;
	this.sprite = 'images/char-horn.png';
};


// Updates Player's position - try to move player into a new box
Player.prototype.update = function () {
	if (this.x > 442) {
		this.x = 5;
		this.y = this.y + 5;
	}
	if (this.x < 0) {
		this.x = 440;
	}
	//Add 50 points to the score if the player has reached the water!!!!
	if (this.y < 0) {
		this.score += 50;
	}
	if (this.y > 435 || this.y < 0) {
		this.y = 435;
	}
};

// Renders player on the canvas
// the initial score of 0
// and your plays (froggers)

Player.prototype.render = function (){


	if (this.plays < 1) {
		 //reset for new game
		audio.src = 'sounds/Frogger.mp3'; //restart with 3 lives
		audio.play();
		this.plays = 3;
		this.games++;
		if (this.score > this.high)
		{
			this.high = this.score;
		}

		this.score = 0;
		this.x = 205;
		this.y = 435;

		// pause after each game
		endtime = Date.now()+3000;
		while (Date.now() < endtime);

	}
	// Display the stuff at the top
	// Froggers, Score, Games, High Score
	ctx.fillStyle = "white";
	ctx.fillRect(170,15,1000,35);
	ctx.clearRect(170,15,1000,35);
	//ctx.fillRect(170,15,1000,35);

	ctx.font = "20px Verdana";
	ctx.fillStyle = '#1E00FF';
	ctx.fillText("Score:", 175, 15);
	ctx.fillText(this.score, 175,40);

	ctx.fillText("Games: ", 265,15);
	ctx.fillText(this.games, 265,40);

	ctx.fillText("High Score: ", 370,15);
	ctx.fillText(this.high, 370,40);

	var imageObj = new Image();
	imageObj.src = 'images/frogger.png';
	ctx.clearRect(0, 0, 170, 50);

	//put the x frogger plays on the top where x is number of plays left
	for (i = 0; i < this.plays; i++) {
		ctx.drawImage(imageObj, (i) * 45, 0, 50, 50);
	}
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*move the player on each key press.
 Up	key	will move the player upward	on y-axis
 Down key will move	the	player downwards
 Right key will	move the player	to the right on	x-axis
 Left key will move	the	player to the left on x-axis
 */
Player.prototype.handleInput = function (key) {
	if (key === 'left') {
		this.x -= 100;
	} else if (key === 'right'){
		this.x += 100;
	} else if (key === 'down') {
		this.y += 75;
	} else if (key === 'up') {
		this.y -= 75;
	}
};

//Instantiate enemies and player objects.
// Now instantiate your	objects.
// Place all enemy objects in an array called allEnemies
	var allEnemies = [];
	for (var i = 0; i<3; i++){
		allEnemies.push(new Enemy(0,((3-i)* move.vert-23)));
	}
	player = new Player(205, 435);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
	document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
		player.handleInput(allowedKeys[e.keyCode]);
	});