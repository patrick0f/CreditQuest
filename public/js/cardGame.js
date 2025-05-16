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
      cardEl.className = `card ${currentLevel}`;
      cardEl.dataset.id = card.id;
      cardEl.dataset.pairId = card.pairId;
      cardEl.innerHTML = `
      <div class="card-inner">
      <div class="card-front">
        <div class="card-brand">Capital One</div>
        <div class="card-icon">1234 5678 1234 5678</div>
        <div class="exp-date">00/00</div>
        <div class="name">Richard F.</div>
      </div>
      <div class="card-back">${card.value}</div>
      </div>`;
      const frontEl = cardEl.querySelector('.card-front');
      const backEl = cardEl.querySelector('.card-back');
      frontEl.classList.add(currentLevel);
      backEl.classList.add(currentLevel);
      cardEl.dataset.content = card.value;
      cardEl.addEventListener("click", handleCardClick);
      gameContainer.appendChild(cardEl);
    });
  }

let flipped = [];
let lockBoard = false;

function handleCardClick(e) {
  const card = e.currentTarget; // use currentTarget to always get the full card div
  if (card.classList.contains("matched") || card.classList.contains("flipped") || lockBoard) return;

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    const [card1, card2] = flipped;

    if (
      card1.dataset.pairId === card2.dataset.pairId &&
      card1.dataset.id !== card2.dataset.id
    ) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      flipped = [];
      lockBoard = false;
      checkWin();
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flipped = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

function checkWin() {
  const totalCards = document.querySelectorAll('.card').length;
  const matchedCards = document.querySelectorAll('.card.matched').length;

  if (matchedCards === totalCards) {
    setTimeout(() => {
      const currentIndex = levels.indexOf(currentLevel);

      if (currentIndex === levels.length - 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        document.getElementById('final-modal').style.display = 'flex';
      } else {
        const winMessage = document.getElementById('win-message');
        winMessage.innerText = "🎉 Great job! You matched all the cards.";
        document.getElementById('win-container').style.display = 'block';
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

    document.getElementById('win-container').style.display = 'none';

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
    window.location.href = 'selectGame.html';
});
  