const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suits = ['C', 'H', 'S', 'D']
let discard = deck = []
let playerHasAce = dealerHasAce = playerVal = dealerVal = 0
let IPS = waiting = true //Infinite Protection System
class Player {
    constructor(hand = []){
        this.hand = hand
    }
    getHand(){
        let arr = []
        this.hand.forEach(card => {
            arr.push(card.printCard())
        });
        return arr
    }
    discardHand(){
        let arr = []
        this.hand.forEach(card => {
            arr.push(card)
        });
        return arr
    }
    dealCard(){
        stayButton.disabled = true
        hitButton.disabled = true
        if (deck.length == 0){
            deck = discard
            deck = shuffleDeck()
        }
        this.hand.push(deck[0])
        if (deck[0].getValue() == 'A'){
            playerHasAce += 1
        }
        displayCard(deck[0].printCard())
        deck.splice(0,1)
        this.getValue()
        if (playerHand.getValue() <= 21){window.setTimeout(timers, 1000)}
    }
    getValue(){
        let value = 0
        this.hand.forEach(card => {
            value += cardConversion(card.getValue())
        });
        if (value > 21){
            value -= (10*checkAce(value, playerHasAce))
            if (value > 21) {
                playerVal = value
                if (IPS == true){
                    IPS = false
                    dealerHand.play()
                }
            }
        }
        playerVal = value
        displayPlayerValue.innerHTML = playerVal
        return value
    }
}
class Dealer {
    constructor(hand = []){
        this.hand = hand
    }
    getHand(){
        let arr = []
        this.hand.forEach(card => {
            arr.push(card.printCard())
        });
        return arr
    }
    discardHand(){
        let arr = []
        this.hand.forEach(card => {
            arr.push(card)
        });
        return arr
    }
    dealCard(){
        if (deck.length == 0){
            deck = discard
            deck = shuffleDeck()
        }
        this.hand.push(deck[0])
        if (deck[0].getValue() == 'A'){
                dealerHasAce += 1
        }
        dealerDisplayCard(deck[0].printCard())
        deck.splice(0,1)
        this.getValue()
    }
    getValue(){
        let value = 0
        this.hand.forEach(card => {
            value += cardConversion(card.getValue())
        });
        if (value > 21){
            value -= (10*checkAce(value, dealerHasAce))
        }
        dealerVal = value
        displayDealerValue.innerHTML = dealerVal
        return value
    }
    play(){
        waiting = true
        stayButton.disabled = true
        hitButton.disabled = true
        while ((dealerHand.getValue()) < 17){
            dealerHand.dealCard()
        }
        checkWinner()
    }
}
class Card {
    constructor(Value, Suit){
        this.Value = Value
        this.Suit = Suit
    }
    getValue(){return this.Value}
    getSuit(){return this.Suit}
    printCard(){return `[${this.getValue()}${this.getSuit()}]`}
}
function createDeck(){
    suits.forEach(suit => {
        values.forEach(val => {
            deck.push(new Card(val, suit))
        });
    });
    return deck
}
function shuffleDeck(){
    let shuffled = []
    let ranCard = 0
    while (deck.length > 0){
        ranCard = Math.floor(Math.random() * deck.length)
        shuffled.push(deck[ranCard])
        deck.splice(ranCard, 1)
    }
    return shuffled
}
function cardConversion(value){
    switch(value){
        case 'A':
            return 11
        case 'J':
        case 'Q':
        case 'K':
            return 10
        default:
            return parseInt(value, 10)
    }
}
function checkAce(value, hasAce){
    for (i = 1; i <= hasAce; i++){
        if ((value - (10*i)) <= 21){
            return i
        }
    }
    return hasAce
}
function startRound(){
    stayButton.disabled = false
    hitButton.disabled = false
    playerHand.discardHand().forEach(card => {
        discard.push(card)
    });
    dealerHand.discardHand().forEach(card => {
        discard.push(card)
    });
    playerHand.hand = []
    dealerHand.hand = []
    playerHasAce = dealerHasAce = 0
    playerVal = dealerVal = 0
    IPS = true
    clearTable()
    playerHand.dealCard()
    playerHand.dealCard()
    dealerHand.dealCard()
    dealerHand.dealCard()
}
function checkWinner(){
    winText.style.visibility = "visible"
    if (playerVal > 21){
        winText.innerHTML = "You busted. You Lose."
        colorText("L")
    } else if (dealerVal > 21){
        winText.innerHTML = "Dealer busted! You Win!"
        colorText("W")
    } else if(playerVal > dealerVal) {
        winText.innerHTML = "You beat the Dealer! You Win!"
        colorText("W")
    } else if(playerVal < dealerVal) {
        winText.innerHTML = "The Dealer beat you. You Lose."
        colorText("L")
    } else {
        winText.innerHTML = "Dealer push. You Lose."
        colorText("L")
    }
}
function displayCard(card){
    let img = document.createElement('img')
    img.src = `images/deck_images/${card}.png`
    img.style.width = "10%"
    img.style.height = "20%"
    img.style.position = "absolute"
    img.style.left = `${(2*playerHand.getHand().length) + 45}%`
    img.style.bottom = "0%"
    displayTimer(img)
    document.getElementById('FlexBox').appendChild(img)
}
function dealerDisplayCard(card){
    let img = document.createElement('img')
    img.src = `images/deck_images/${card}.png`
    img.style.width = "10%"
    img.style.height = "20%"
    img.style.position = "absolute"
    img.style.left = `${(2*dealerHand.getHand().length) + 45}%`
    img.style.top= "0%"
    img.style.transform = "rotate(180deg)"
    dealerDisplayTimer(img)
    document.getElementById('FlexBox').appendChild(img)
}
function clearTable(){
    let images = document.getElementsByTagName('img');
    let len = images.length
    for (let i = 1; i < len; i++) {
        images[1].parentNode.removeChild(images[1]);
    }
}
function colorText(WoL){
    let count = 0
    if (WoL == "W") { 
        const display = setInterval(function (t) {
            count += 1
            if (count % 25 == 0){
                if (count%7 == 0){
                    winText.style.color = "red"
                } else if (count%7 == 1){
                    winText.style.color = "orange"
                } else if (count%7 == 2){
                    winText.style.color = "yellow"
                } else if (count%7 == 3){
                    winText.style.color = "green"
                } else if (count%7 == 4){
                    winText.style.color = "blue"
                } else if (count%7 == 5){
                    winText.style.color = "indigo"
                } else {
                    winText.style.color = "violet"
                }
            }
            if (count >= 1000){
                clearInterval(display)
                winText.style.visibility = "hidden"
            }
        }, 1) 
    } else {
        const display = setInterval(function (t) {
            count += 0.51
            winText.style.color = `rgb(0, 0, ${count})`
            if (count >= 255){
                clearInterval(display)
                winText.style.visibility = "hidden"
            }
    }, 1)
    }
}
function displayTimer(move){
    let count = 0.0
    const display = setInterval(function (t) {
        count += 0.2
        move.style.bottom = `${count}%`
        if (count >= 10){
            clearInterval(display)
        }
    }, 1) 
}
function dealerDisplayTimer(move){
    let count = 0.0
    const display = setInterval(function (t) {
        count += 0.2
        move.style.top = `${count}%`
        if (count >= 10){
            clearInterval(display)
        }
    }, 1) 
}
function timers(){
    stayButton.disabled = false
    hitButton.disabled = false
}
/***********************Set up is above***************************
//The deck, player object, dealer object and functions are defined
*****************************************************************/
const hitButton = document.getElementById("Hit")
const stayButton = document.getElementById("Stay")
const resetButton = document.getElementById("Reset")
const displayPlayerValue = document.getElementById("playerValue")
const displayDealerValue = document.getElementById("dealerValue")
const winText = document.getElementById("results")
deck = createDeck()
deck = shuffleDeck()
const playerHand = new Player()
const dealerHand = new Dealer()
hitButton.addEventListener("click", function (e) {
    playerHand.dealCard()
})
stayButton.addEventListener("click", function (e) {
    dealerHand.play()
})
resetButton.addEventListener("click", function (e) {
    startRound()
})
/*******************Objects are created above*********************
**********The deck is populated and both hands are created********
*******************DOM Elements are also set up*******************
*****************************************************************/

startRound()

/**********************Plans for the future***********************
 *****************************************************************
 ****************************Step One*****************************
 *****************************************************************
[X] Create the HTML board
    [X] Create the Hit, Stay, and Reset Buttons
[X] Add CSS to fancy up text on the GameBoard
    [X] Should anything need to be styled in the future, add here
[X] Program how aces work
    [X] Anytime a player is dealt an ace, a counter should go up
    [X] If the player Busts, if the counter > 0, subtract 10
 *****************************************************************
 ****************************Step Two*****************************
 *****************************************************************
[X] Create an accurate Dealer A.I.
[X] Create lose cases
    [X] This should include for the Player
    [X] And the Dealer
[X] Attach scripts to objects
    [X] Hit button should run playerHand.dealCard()
    [X] Stay should run dealerHand.Play()
    [X] Reset should reset the board state to the beginning
[X] Make card images appear on board
 *****************************************************************
 **************************Bonus Steps****************************
 *****************************************************************
[?] Create a chip counter
    [?] Allow the player to bet between rounds
[X] Add text over all objects to show Wins and Losses
[X] Attach Card objects to jpgs
    [X] Create a folder that holds an image for all cards
    [X] Rename each card image to [AS] [QH] etc
    [?] Upload all images to imgur to have a place to pull from
*****************************************************************/