$(document).ready(function(){
	//Setup
	//creating the secret word
	function *secretWord() {
		while (true) {
			yield commonWords[Math.floor(Math.random() * 100)]
		}
	}

	//checking to see if the word has 3 or more characters
	//creating a new word and checking again if it doesn't
	function isLongEnough(word) {
		if (word.length >= 3 && word.length < 6) {
			return word
		} else {
			return isLongEnough(wordGen.next().value)
		}
	}

	//draws the underscores at start of game, also fills emptyArr with _
	function drawLines(arr) {
		arr.forEach(function() {
			emptyArr.push("_")
		})
		document.querySelector('#wordblank').innerHTML = `${emptyArr.join('')}`
		document.querySelector('#turnsleft').innerHTML = `Turns Left: ${tries}`
	}

	function didTheyWin(arr) {
		if (arr.includes("_") === false) {
			alert("You win!")
		}
	}

	function didTheyLose(num) {
		if (num === 0) {
			alert("You lose!")
		}
	}

	//creates and assigns all these variables for the above
	var wordGen = secretWord()
	var toGuess = isLongEnough(wordGen.next().value)
	var wordArr = toGuess.split("")
	var emptyArr = []
	var tries = 9
	var deadLetters = [] //guessed incorrect letters
	drawLines(wordArr)
	console.log(wordArr)

	$('button').on('click', function(e) {
		e.preventDefault()
		let ans = $('#guess').val()
		let place = -1
		let wrong = false
		tries --
		wordArr.forEach(function(letter) {
			place++
			if (ans.toString() === letter) {
				emptyArr[place] = ans
				document.querySelector('#wordblank').innerHTML = `${emptyArr.join('')}`
				document.querySelector('#guess').value = ''
				document.querySelector('#guess').focus()
				didTheyWin(emptyArr)
			} else {
				if (wrong === false) {
					deadLetters.push(ans)
					document.querySelector('#wrongletters').innerHTML = `Dead Letters: ${deadLetters}`
					document.querySelector('#turnsleft').innerHTML = `Turns Left: ${tries}`
					wrong = true
					document.querySelector('#guess').value = ''
					document.querySelector('#guess').focus()
					didTheyLose(tries)
				} else {
					return undefined
				}
			}
		})
	})
})