//sounds

const hitSound = new Audio('./blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('./blackjack_assets/sounds/cash.mp3');
const loseSound = new Audio('./blackjack_assets/sounds/aww.mp3');


//blackjacjgame object containind data about game and players
let Blackjackgame = {
    'you': {'scoreSpan':'#your-blackjack-result', div:"#your-box", 'score':0},
    'dealer': {'scoreSpan':'#dealer-blackjack-result', 'div':"#dealer-box", 'score':0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap': {'2': 2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10, 'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
}
const YOU = Blackjackgame['you']
const DEALER = Blackjackgame['dealer']


//button event listeners
document.querySelector('#blackjack-hit-btn').addEventListener('click', blackJackHit)
document.querySelector('#blackjack-deal-btn').addEventListener('click', blackJackDeal)
document.querySelector('#blackjack-stand-btn').addEventListener('click', blackJackStand)



//funtion to generate random card for any player

function randomCard(){
    let randomNum = Math.floor(Math.random() * 13)
    return Blackjackgame.cards[randomNum]
}


//shows the card, updates and displays the score when the HIT buttons is pressed

function blackJackHit(){
        Blackjackgame.turnsOver = false
    if(Blackjackgame.isStand === false){
        let card = randomCard()
        showCard(card, YOU)
        updateScore(card, YOU)
        showScore(YOU)
    }
}


//shows the card by creating an image with source set to chosen card, and displaying it on appropriate player side

function showCard(card, activePlayer){
    if(activePlayer.score <= 21){
        let cardImage = document.createElement('img')
        cardImage.src = `./blackjack_assets/images/${card}.png`;
        cardImage.style.height = `100px`
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}


//updates the scores of the active player

function updateScore(card, activePlayer){
    if(card === 'A'){
        if(activePlayer.score + Blackjackgame.cardsMap[card][1] <= 21){
            activePlayer['score'] += Blackjackgame.cardsMap[card][1];
        }
        else{
            activePlayer['score'] += Blackjackgame.cardsMap[card][0];
        }
    }
    else {
        activePlayer['score'] += Blackjackgame.cardsMap[card];  
    }
}


//displays current score of active player if alive

function showScore(activePlayer){
    if(activePlayer.score > 21){
        document.querySelector(activePlayer.scoreSpan).textContent = "BUST!"
        document.querySelector(activePlayer.scoreSpan).style.color = "red"
    }
    else{
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score
    }
}



//deal function to start a new round. removes cards and then resets scores and message

function blackJackDeal(){

    if(Blackjackgame.turnsOver === true){
        Blackjackgame.isStand = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img')
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img')
        for(let i=0; i<yourImages.length; i++){
            yourImages[i].remove()
        }
        
        for(let i=0; i<dealerImages.length; i++){
            dealerImages[i].remove()
        }
    
        YOU.score = 0;
        DEALER.score = 0;
    
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = "black"
        document.querySelector('#dealer-blackjack-result').style.color = "black"
        document.querySelector('#blackjack-result').textContent = "Let's Play"
        document.querySelector('#blackjack-result').style.color = "black"

        Blackjackgame.turnsOver = true;
    }

}


//sleep function to create a one second delay. to be used in stand function

function sleep(ms){
    return new Promise (resolve => setTimeout(resolve, ms));
}
  


async function blackJackStand(){
    Blackjackgame.isStand = true;
   
    function dealerHit(){
        let card = randomCard()
        showCard(card, DEALER)
        updateScore(card, DEALER)
        showScore(DEALER)
    }
    
    while(Blackjackgame.isStand === true && DEALER.score < 17){
        dealerHit()
        await sleep(1000)
    }
    while(YOU.score <= 21 && YOU.score > DEALER.score){
        dealerHit()
        await sleep(1000)
    }

        Blackjackgame.turnsOver = true;
        let winner = computeWinner();
        showResults(winner)
}



function computeWinner(){
    let winner;
    if(YOU.score <= 21){
        if(YOU.score> DEALER.score || DEALER.score > 21){
            winner = YOU;
            Blackjackgame.wins++;
        }
    
        else if(YOU.score < DEALER.score){
            winner = DEALER;
            Blackjackgame.losses++;
        }
        else if(YOU.score === DEALER.score){
            Blackjackgame.draws++;
        }
    }

    else if(YOU.score > 21 && DEALER.score <= 21){
        winner = DEALER;
        Blackjackgame.losses++;
    }

    else if(YOU.score > 21 && DEALER.score > 21){
        Blackjackgame.draws++
    }

    return winner;
}


//gets result from compute winner function and displays the winner message

function showResults(winner){
     winner = computeWinner()
    if(Blackjackgame.turnsOver === true){
        let message, messageColor;
        if(winner === YOU){
            document.querySelector('#wins').textContent = Blackjackgame.wins;
            message = 'You won!'
            messageColor = "green"
            winSound.play()
        }
        else if(winner === DEALER){
            document.querySelector('#losses').textContent = Blackjackgame.losses;
            message = 'You lost!'
            messageColor = "red"
            loseSound.play()
        }
        else{
            document.querySelector('#draws').textContent = Blackjackgame.draws;
            message = 'You drew!'
            messageColor = "black"
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}