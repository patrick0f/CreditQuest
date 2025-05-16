// Game logic for Match & Learn

// level of user
const levels = ['beginner', 'intermediate', 'advanced'];
let currentLevel = localStorage.getItem('creditLevel') || 'beginner';

// elements
const startButton = document.getElementById('start-game-button');
const directionsButton = document.getElementById('directions-button');
const directionsSection = document.getElementById('directions');
const gameContainer = document.getElementById('game-container');
const levelDisplay = document.getElementById('level-display');

// toggle directions visibility
directionsButton.addEventListener('click', () => {
  const isVisible = directionsSection.style.display === 'block';
  directionsSection.style.display = isVisible ? 'none' : 'block';
});

// start game on button click
startButton.addEventListener('click', () => {
  directionsSection.style.display = 'none'; // hide directions
  gameContainer.style.display = 'grid'; // show game

  startGame(currentLevel); // launch the game logic with user's difficulty
});

function startGame(level) {

    const termPairs = getCardPairs(level);
    const cards = [];

    termPairs.forEach(([term, definition], idx) => {
        cards.push({ id: idx + '-term', value: term, pairId: idx });
        cards.push({ id: idx + '-def', value: definition, pairId: idx });
    });

    const shuffled = shuffle(cards);
    renderBoard(shuffled);

    levelDisplay.textContent = `You're playing on the ${currentLevel.toUpperCase()} level.`;
}

function getCardPairs(level) {
    const terms = {
      beginner: [
        ["Credit Score", "A number that shows how likely you are to repay loans"],
        ["Loan", "Money you borrow and repay over time"],
        ["Interest", "The cost of borrowing money"]
      ],
      intermediate: [
        ["Utilization", "How much of your credit you're using"],
        ["Grace Period", "Time you can pay without interest"],
        ["Secured Card", "Credit card backed by a cash deposit"]
      ],
      advanced: [
        ["Hard Inquiry", "A credit check that can lower your score"],
        ["Installment Credit", "Fixed payments like car loans"],
        ["Debt Snowball", "Paying smallest debts first to build momentum"]
      ]
    };
  
    return terms[level] || terms["beginner"];
  }

  function renderBoard(cards) {
    gameContainer.innerHTML = "";
    cards.forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.dataset.id = card.id;
      cardEl.dataset.pairId = card.pairId;
      cardEl.innerText = "❓";
      cardEl.addEventListener("click", handleCardClick);
      gameContainer.appendChild(cardEl);
      cardEl.dataset.content = card.value;
    });
  }

let flipped = [];
let lockBoard = false;

function handleCardClick(e) {
  const card = e.target;
  if (lockBoard || flipped.includes(card)) return;

  card.innerText = card.dataset.content;
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    const [card1, card2] = flipped;

    if (
      card1.dataset.pairId === card2.dataset.pairId &&
      card1.dataset.id !== card2.dataset.id
    ) {
      card1.style.backgroundColor = "#cfc";
      card2.style.backgroundColor = "#cfc";
      flipped = [];
      lockBoard = false;
      checkWin();
    } else {
      setTimeout(() => {
        card1.innerText = "❓";
        card2.innerText = "❓";
        flipped = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

function checkWin() {
    const remaining = [...document.querySelectorAll('.card')].filter(c => c.innerText === "❓");
    if (remaining.length === 0) {
      setTimeout(() => {
        const currentIndex = levels.indexOf(currentLevel);
  
        if (currentIndex === levels.length - 1) {
            // Show confetti
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          
            // Show custom modal
            document.getElementById('final-modal').style.display = 'flex';
          } else {
          alert("🎉 Great job! You matched all the cards.");
          nextLevelButton.style.display = 'inline-block';
        }
      }, 300);
    }
  }
  
  
  
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const nextLevelButton = document.getElementById('next-level-button');

nextLevelButton.addEventListener('click', () => {
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex < levels.length - 1) {
    currentLevel = levels[currentIndex + 1];

    levelDisplay.textContent = `You're playing on the ${currentLevel.toUpperCase()} level.`;
    nextLevelButton.style.display = 'none';
    startGame(currentLevel);
  }
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('final-modal').style.display = 'none';
  });
  
document.getElementById('replay-all').addEventListener('click', () => {
    currentLevel = 'beginner';
    document.getElementById('final-modal').style.display = 'none';
    nextLevelButton.style.display = 'none';
  
    startGame(currentLevel);
});

document.getElementById('return-button').addEventListener('click', () => {
    window.location.href = '../public/selectGame.html';
});
  


