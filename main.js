$(document).ready(function(){
	//sound object for when they get an answer wrong
	function wrongSound(src) {
		this.sound = document.createElement('audio')
		this.sound.src = src
		this.sound.setAttribute('preload', 'auto')
		this.sound.setAttribute('controls', 'none')
		this.sound.style.display = 'none'
		document.body.appendChild(this.sound)
		this.play = function() {
			this.sound.play()
		}
		this.stop = function() {
			this.sound.pause()
		}
	}

	//alert at the start of the game
	function startGame() {
		alert("You're on the Goatman's Bridge near Argyle, Texas. Like so many, you've been caught in the Goatman's cruel game: guess his secret word in nine tries, or face his wrath!")
		$('#guess').focus()
		wrongNoise = new wrongSound('Goat-noise.mp3')
	}

	//creating the secret word
	function *secretWord() {
		while (true) {
			yield commonWords[Math.floor(Math.random() * commonWords.length)]
		}
	}

	//checking to see if the word has 3 or more characters
	//creating a new word and checking again if it doesn't
	function isLongEnough(word) {
		if (word.length >= 3 && word.length < 6) {
			return word
		} else {
			//wordGen is declared in global
			return isLongEnough(wordGen.next().value)
		}
	}

	//draws the underscores at start of game, also fills playerArr with _
	function drawLines(arr) {
		arr.forEach(function() {
			playerArr.push("_")
		})
		document.querySelector('#wordblank').innerHTML = `${playerArr.join('')}`
		document.querySelector('#turnsleft').innerHTML = `Turns Left: ${tries}`
	}

	//did they win?
	function didTheyWin(arr) {
		if (arr.includes("_") === false) {
			alert("You win! You've taunted the Goatman... and survived!")
			$('#goatman').css('opacity', 0.1)
			won = true
		}
	}

	//did they lose?
	function didTheyLose(num) {
		if (num === 0) {
			alert(`You lose! It was "${toGuess}!" The Goatman taunts you viciously in return!`)
			$('#goatman').css('height', '600px')
			$('#goatman').css('width', '600px')
		}
		//it was sometimes causing the player to lose and forever have 1 try remaining displayed
		document.querySelector('#turnsleft').innerHTML = `Turns Left: ${tries}`
	}

	//moves the Goatman 20 pixels to the left after a guess
	function goatmanMoves() {
		opac += 0.1
		distance -= 20
		$('#goatman').css('opacity', opac)
		$('#goatman').css('left', `${distance}px`)
	}

	//did they already guess a letter? if no, run the game logic, if so, get an alert that they guessed it already
	function alreadyGuessed(arr, ans) {
		//decrement tries here
		tries --
		if (arr.includes(ans)) {
			alert("You already guessed that one!")
			//it is possible to run out of tries by guessing the same letter, deliberately
			didTheyLose(tries)
			$('#guess').focus()
		} else {
			gameEval(ans)
		}
	}

	function addToDead(ans) {
		deadLetters.push(ans)
		document.querySelector('#wrongletters').innerHTML = `Dead Letters: ${deadLetters}`
	}

	//runs the entire game logic
	function gameEval(ans) {
		//setting up a second index value to use and whether a wrong answer has already been logged
		let place = -1
		let logged = false
		//looks through the word array, comparing letters
		wordArr.forEach(function(letter) {
			//place starts at -1 so that this ++ increments it to 0
			place++
			//if wordArr includes ans, set that the letter is logged to be true
			//causes turns left and goatmanMoves to not trigger
			if(wordArr.includes(ans)) {
				logged = true
			}
			if (ans.toString() === letter) {
				//if it finds a match, puts the letter into player array, then displays the new player html
				playerArr[place] = ans
				document.querySelector('#wordblank').innerHTML = `${playerArr.join('')}`
				//clears the value of the #guess input and returns focus to it
				document.querySelector('#guess').value = ''
				$('#guess').focus()
				tries ++
				addToDead(ans)
				didTheyWin(playerArr)
			} else {
				if (logged === false) {
					//if this is the first time this wrong answer is recorded, push the letter into 
					//deadLetters, and update #wrongletters
					addToDead(ans)
					logged = true
					//this wrong answer will only be logged once
					//then clear the value of #guess and return focus to it
					document.querySelector('#guess').value = ''
					$('#guess').focus()
					wrongNoise.play()
					didTheyLose(tries)
					goatmanMoves()
				} else {
					//if the wrong answer was already recorded, do nothing
					return undefined
				}
			}
			//update tries marker
			document.querySelector('#turnsleft').innerHTML = `Turns Left: ${tries}`
		})
	}

	//creates and assigns all these variables for the above
	startGame()
	var wordGen = secretWord()
	var toGuess = isLongEnough(wordGen.next().value)
	var wordArr = toGuess.split("")
	var playerArr = []
	var tries = 9 //initial number of tries
	var opac = 0.1 //initial opacity for the Goatman
	var distance = 600 //initial distance for the Goatman
	var won = false //updated when they win
	var deadLetters = [] //guessed incorrect letters
	drawLines(wordArr)
	console.log(wordArr)

	//starts and runs the game on button click
	$('button').on('click', function(e) {
		//if they have any tries left and have not yet won, run the game
		if (tries > 0 && won === false) {
			//prevents the button from submitting answer to url
			e.preventDefault()
			let ans = $('#guess').val()
			alreadyGuessed(deadLetters, ans)
		} else {
			//otherwise, refresh the page entirely
			e.preventDefault()
		}
	})
})