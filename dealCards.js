/*Implement a deck of poker-style playing cards (Fifty-two playing cards in four suits: hearts, spades, clubs, diamonds, with face values of Ace, 2-10, Jack, Queen and King).
The deck implements two methods: shuffle (randomize the cards in the deck), and deal_one_card (return one card from the deck). 
Specifically, a call to shuffle followed by 52 calls to deal_one_card should result in the caller being provided all 52 cards of the deck in random order. 
If the caller then makes a 53rd call to deal_one_card, no card is dealt.
This is central to the operation of our business, so we want the code to have accompanying tests (programs that exercise the code), 
and not to have a bunch of functionality that we don’t specifically require.
Feel free to use any resources at your disposal to come up with a solution, and be prepared to defend the decisions you’ve made.*/

		var suits = {};
		suits['0'] = 'spades';
		suits['1'] = 'clubs';
		suits['2'] = 'hearts';
		suits['3'] = 'diamonds';
		
		var nan = {};
		nan['0'] = 'ace';
		nan['1'] = 'jack';
		nan['2'] = 'queen';
		nan['3'] = 'king';		
		
		//non-numerical cards, these are cards that have earned names through their notoriety
		//for instance, we have nan[0], who is an anonymous genius known only by "ace"
		//and we could add nan[14], who is the joker, and a bit of a wild card without her caffeine and manners

		//build the deck array
		var deck = [];
		
		//add the non-numerical cards for each suit
		
		for(var g = 0; g < 4; g++){
		
			for(var d = 0; d < 4; d++){
			
				var thisval = suits[g] + '_' + nan[d];
				
				//for example, deck[0] = 'spades_ace'
				
				deck.push(thisval); 
				
			}
			
		}
		
		//add all the numerical cards for each suit
		
		for (var j = 2; j < 11; j++){
		
			deck.push(suits[0] + '_' + j, suits[1] + '_' + j, suits[2] + '_' + j, suits[3] + '_' + j);
			
		}		
		
		//produces an array like this: ('spades_ace','clubs_ace', ... {jack, queen, king, 2-9} ... 'spades_10','clubs_10','hearts_10','diamonds_10')
		//we could do everything numerically but we want to keep our output readable so it's easy to follow
		//also life may not be just a series of numbers - the numbers game can be the beginning of sentience, rather than the end.
		
		var shuffledDeck = deck;
		
	//***** shuffle the original deck
	
	function shuffle(){
	
		console.log('Starting shuffle');
		for (var s = 0; s < deck.length; s++){
			console.log('   ' + deck[s]);
			document.getElementById("originalDeck").innerHTML += '<li> Card ' + (s+1) + ' is ' + deck[s] + '</li>';
		}
				
		for (var i = 51; i > 0; i--) {
		
			var startingHigh = Math.floor(Math.random() * (i + 1));  
			
			//Math.random() * (i+1) gives a number from 0 to (i+1)
			//(i+1) will be 52 in the beginning of the program and will drop to 2 for the final iteration
			//the variable i will never get to 0
			//or Manhattan at this rate, look at this traffic
			//JavaScript is adding a flow control structure that gets to hero, in no time flat
			//Elon Musk is working on the equivalent space shuttle
																	 
			//Math.floor just rounds the decimal we got from (Math.random() * (i+1)) so we get an integer
			//if we wanted to be extra specific we could randomly select floor or ceil
			//because floor will always round down so there's a slight bias toward choosing numbers other than
			//the highest number option
																	 
			var interim = shuffledDeck[i]; 
			//interim is the current decreasing loop index of deck
			
			shuffledDeck[i] = shuffledDeck[startingHigh]; 
			
			//set the current decreasing loop index of deck to be equal to the random index value between 2 and (i+1) that we calculated,
			//of the deck array
			//so we are swapping these two values, so deck[i] value becomes deck[random value generated] value, 
			//and deck[random value generated] value becomes deck[i] value
										  
			shuffledDeck[startingHigh] = interim; 
			
			//don't set deck[startingHigh] equal to deck[i] because that would just mean deck[i] and deck[startingHigh] are the same
			//we want them to be different so need an interim variable to hold the previous value of deck[i]
			
		}		
		console.log('Ending shuffle');
		for (var p = 0; p < shuffledDeck.length; p++){
			console.log('   ' + shuffledDeck[p]);
			document.getElementById("shuffledDeck").innerHTML += '<li> Card ' + (p+1) + ' is ' + shuffledDeck[p] + '</li>';
		}		
	}
	
	//***** remove one card from the shuffledDeck based on a random index, and return the removed card
	
	function deal_one_card(){
			
		//deal_one_card removes a random element from shuffledDeck and adds it to newShuffledDealtDeck

		var deckSize = 0;
		deckSize = shuffledDeck.length;
		var randomIndex = Math.floor(Math.random() * ( deckSize - 0 ) + 0); 
		
		/*multiply Math.random (again just a number between 0 and 1, including the lower endpoint 0) by
		the maximum number you'll accept as output
		and the minimum number you'll accept as output, which is 0 since the deck array may have a value 
		at the 0 index.*/
		
		if(shuffledDeck[randomIndex] != undefined){ //this check prevents us from dealing any cards past the 52nd call to deal_one_card
			var thisDealtCard = shuffledDeck[randomIndex];
			shuffledDeck.splice(randomIndex, 1);
			return thisDealtCard; 
			//thisDealtCard should be the name of a card, like "spades_10" or "Kevin Spacey's next calculated move"
		}
		//var dealError = 'Failed to remove card from deck';
		//document.getElementById("errorMessage").innerHTML += '<li>' + dealError + '</li>';
		return "null";
	}

	
	//***** Run the program
	
	
	shuffle();
	
	var newShuffledDealtDeck = []; 
	
	//this array is for if you want to capture the output of the shuffling then 52 dealt cards one at a time into a new deck.
	
	//now we have three deck arrays - 
		//the original deck,
		//a shuffled deck, which we'll be removing values from as we go, just like a card thief
		//and an output deck to hold the output of our actions on the original deck (one shuffle action) and the shuffledDeck (52 deal_one_card actions)
	
	//so the logical (not actual) flow is -
		//build deck of all 52 cards
		//shuffledDeck = shuffle() using the original deck
		//newShuffledDealtDeck = (deal_one_card(shuffledDeck)) * 52
	
	for(var k = 0; k < 52; k++){

		//we want deal_one_card to be called 52 times regardless
		var dealtCard = deal_one_card(); 
		newShuffledDealtDeck.push(dealtCard);
		/*
		console.log(indexToUnset + " is the array index to unset");
		console.log('current version of shuffled deck');
		for (var y = 0; y < shuffledDeck.length; y++){
			console.log('   ' + shuffledDeck[y]);
		}
		*/	
		console.log('The card being dealt is ' + dealtCard + ' for iteration number ' + k + ' of deal_one_card');

	}
	
	console.log('Final version of shuffled and dealt output deck:');
	
	for (y = 0; y < newShuffledDealtDeck.length; y++){
		console.log('   '+newShuffledDealtDeck[y]);
		document.getElementById("outputDeck").innerHTML += '<li> Card ' + (y+1) + ' is ' + newShuffledDealtDeck[y] + '</li>';
	}
	
	/* if you'd like to watch the shuffledDeck as it has elements removed by deal_one_card, you can remove the "*" and "/" from lines 150 and 156 */
	
	//let's try dealing another card now that all 52 from the shuffledDeck have already been dealt (shuffledDeck now has 0 elements so this will return an error)
	
	var fiftythirdcard = deal_one_card();
	var fiftythirdmessage = 'The fifty-third card is '+ fiftythirdcard;
	console.log(fiftythirdmessage);
	document.getElementById("fiftythird").innerHTML += '<li>' + fiftythirdmessage + '</li>';
		
	console.log('Output deck of dealt cards after dealing 53rd card (should be the same as the final version above):');

	for (y = 0; y < newShuffledDealtDeck.length; y++){
	
		console.log('   '+newShuffledDealtDeck[y]);
		
	}
	
	//***** Testing
	
	//now we want to make sure that our output deck contains all the same cards as the original deck
	
	for(var g = 0; g < 4; g++){		
		for(var d = 0; d < 4; d++){			
			var thisval = suits[g] + '_' + nan[d];				
			deck.push(thisval); 				
		}			
	}
	for (var j = 2; j < 11; j++){
		deck.push(suits[0] + '_' + j, suits[1] + '_' + j, suits[2] + '_' + j, suits[3] + '_' + j);
	}	
		
	isEqual = true;
	
	console.log('original deck length is ' + deck.length);
	console.log('output deck length is ' + newShuffledDealtDeck.length);

	if(deck.length !== newShuffledDealtDeck.length){
	
		var notEqualCounts = 'Output deck is not equal to the original deck based on card counts';
		console.log(notEqualCounts);
		document.getElementById("errorMessage").innerHTML += '<li>' + notEqualCounts + '</li>';
		isEqual = false;
		
	}
	
	var sortedDeck = deck.sort();
	var sortedShuffledDealtDeck = newShuffledDealtDeck.sort();
	
	console.log(sortedDeck);
	console.log(sortedShuffledDealtDeck);
	
	for (var r = deck.length; r--; ){
	
		    if( newShuffledDealtDeck[r] != deck[r]){
			
				var notEqual = 'Output deck is not equal to the original deck based on content';
				console.log(notEqual);
				document.getElementById("errorMessage").innerHTML += '<li>' + notEqual + '</li>';
				isEqual = false;
				
			}
			
	}
	if(isEqual === true){
	
	    var desiredMessage = 'Output deck is equal to the original deck based on content and card counts';
		console.log(desiredMessage);
		document.getElementById("errorMessage").innerHTML += '<li>' + desiredMessage + '</li>';
		
	}
