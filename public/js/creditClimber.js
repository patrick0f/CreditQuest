window.onload = function () {
  // get DOM elements
  const canvas = document.getElementById("creditClimberCanvas");
  const btnGood = document.getElementById('btnGood');
  const btnBad = document.getElementById('btnBad');
  const questionText = document.getElementById('question');
  const scoreText = document.getElementById('score');
  const playerImage = document.getElementById('playerImage');
  const timerText = document.getElementById('timer');
  let streak = 0;
  const ctx = canvas.getContext("2d");
  // Make sure canvas is resized first
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  const meterFill = document.getElementById('meterFill');
  const streakCount = document.getElementById('streakCount');
  const startGameBtn = document.getElementById('startGameBtn');
  startGameBtn.addEventListener('click', () => {
  startGame(); // call the main function
  levelSelect.style.display = 'none';
  startGameBtn.style.display = 'none';
});

  window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("starCanvas");

    if (!canvas) {
      console.error("Canvas with id 'starCanvas' not found.");
      return;
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas(); // Call once initially
    window.addEventListener('resize', resizeCanvas); // Call again when resized
  });


  // Level 0: Beginner
  const level0 = [
    { prompt: "Pay your bill on time?", good: true },
    { prompt: "Max out your credit card?", good: false },
    { prompt: "Check your credit report regularly?", good: true },
    { prompt: "Apply for many new cards at once?", good: false },
    { prompt: "Keep old accounts open?", good: true }
  ];

  // Level 1: Intermediate
  const level1 = [
    {
      prompt: "Is it harmful to only pay the minimum balance on your credit card every month?",
      good: false
    },
    {
      prompt: "Can using under 30% of your total credit limit help boost your credit score?",
      good: true
    },
    {
      prompt: "Is it okay to ignore your credit card statements if you’ve set up autopay?",
      good: false
    },
    {
      prompt: "Does setting up automatic payments help avoid late fees and improve credit?",
      good: true
    },
    {
      prompt: "Is applying for a new credit card just to get a bonus offer considered risky behavior?",
      good: false
    },
  ];


  // Level 2: Advanced
  const level2 = [
    {
      prompt: "You notice a late payment on your credit report that you’re sure you paid on time. Do you dispute the error?",
      good: true
    },
    {
      prompt: "To simplify your finances, you decide to close your oldest credit card with a long history. Is this a good idea?",
      good: false
    },
    {
      prompt: "You have a mix of installment loans and credit cards that you manage responsibly. Is this beneficial for your credit score?",
      good: true
    },
    {
      prompt: "You forget to pay your credit card bill and it’s now over 30 days late. Is this a minor issue?",
      good: false
    },
    {
      prompt: "You are new to credit and open a secured credit card, using it carefully. Is this a smart way to build credit?",
      good: true
    },
  ];

  const questionBanks = {
    beginner: level0,
    intermediate: level1,
    pro: level2
  };

  const levels = ['beginner', 'intermediate', 'pro'];
  let currentLevelIndex = 0;
  let currentLevel = levels[currentLevelIndex];
  let questions = questionBanks[currentLevel];





  let currentQuestion = 0;
  let score = 0;

  const platformWidth = 500;
  platforms = [{
    x: (canvas.width - platformWidth) / 2,
    y: canvas.height - 100,
    width: platformWidth,
    height: 15
  }];

  let playerX = platforms[0].x + (platforms[0].width / 2) - (40 / 2);
  let playerY = platforms[0].y - 40;
  let velocityX = 0;
  let velocityY = 0;
  const gravity = 1.5;
  let jumping = false;
  let onLand = null;
  let breakingPlatforms = [];
  let timeLeft = 15;
  let timerInterval = null;
  let falling = false;


  function setButtonsEnabled(enabled) {
    btnGood.disabled = !enabled;
    btnBad.disabled = !enabled;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of platforms) {
      ctx.fillStyle = '#6ce26c';
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    //  breaking platforms
    for (let i = 0; i < breakingPlatforms.length; i++) {
      const bp = breakingPlatforms[i];
      if (bp.frames > 0) {
        ctx.fillStyle = bp.frames % 2 === 0 ? 'red' : 'black';
        ctx.fillRect(bp.x - 2, bp.y - 2, bp.width + 4, bp.height + 4);
        bp.frames--;
      } else {
        breakingPlatforms.splice(i, 1);
        i--;
      }
    }

    // player
    if (playerImage.complete) {
      ctx.drawImage(playerImage, playerX, playerY, 40, 40);
    }
  }

  function jump(callback) {
    if (!jumping) {
      velocityY = -18;
      velocityX = 0;
      jumping = true;
      setButtonsEnabled(false);
      stopTimer();
      onLand = callback;
    }
  }

  function update() {
    if (jumping) {
      velocityY += gravity;
      playerY += velocityY;

      if (jumping && !falling && velocityY < 0) {
        for (let i = 0; i < platforms.length; i++) {
          platforms[i].y -= 3;
        }
    }

    // landing detection
    if (velocityY > 0 && playerY >= platforms[platforms.length - 1].y - 40) {
      playerY = platforms[platforms.length - 1].y - 40;
      velocityY = 0;
      jumping = false;
      playerX = platforms[0].x + (platforms[0].width - 40) / 2;
      setButtonsEnabled(true);
      resetTimer();

      if (onLand) {
        onLand();
        onLand = null;
      }
    }
  }

  draw();
  requestAnimationFrame(update);
}


  function addPlatform() {
    const last = platforms[platforms.length - 1];
    const newY = last.y - 40;
    const shiftAmount = (Math.random() - 0.5) * 100; // Random shift between -50 and +50 pixels
    let newX = last.x + shiftAmount;

    // Make sure the platform stays within canvas boundaries:
    newX = Math.max(0, Math.min(newX, canvas.width - platformWidth));

    platforms.push({ x: newX, y: newY, width: platformWidth, height: 15 });
  }


  function animatePlatformBreak(platform) {
    let frames = 10;
    breakingPlatforms.push({ ...platform, frames });
    velocityY = 0;
   }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerText.textContent = "Time left: " + timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = "Time left: " + timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function answer(choice) {
    if (jumping) return;

    stopTimer();

    const correct = questions[currentQuestion].good === choice;

    if (correct) {
      streak++;
      updateMeter();
      updateStreak();
      addPlatform();
      const levels = ['beginner', 'intermediate', 'pro'];
      jump(() => {
        score++;
        scoreText.textContent = 'Score: ' + score;
        currentQuestion++;

      if (currentQuestion >= questions.length) {
        currentLevelIndex++;

        if (currentLevelIndex < levels.length) {
          currentLevel = levels[currentLevelIndex];
          questions = questionBanks[currentLevel];
          currentQuestion = 0;

          score = 0;
          streak = 0;
          meterFill.style.height = '0%';
          streakCount.textContent = '0';
          scoreText.textContent = 'Score: 0';
          
          // Reset platforms and player position too
          platforms = [{
            x: (canvas.width - 200) / 2,
            y: canvas.height - 100,
            width: 200,
            height: 15
          }];
          playerY = platforms[0].y - 40;
          const playerWidth = 40; // or whatever your player width is
          playerX = platforms[0].x + (platforms[0].width / 2) - (playerWidth / 2);
          showPopup(`🎉 Level up! Welcome to Level ${currentLevelIndex + 1}`, () => {
            questionText.textContent = questions[currentQuestion].prompt;
            resetTimer();
          });
        } else {
          showPopup(`🏁 Game complete! Final score: ${score}`, showGameOver);
        }
        return;
      }

        questionText.textContent = questions[currentQuestion].prompt;
      });
    } else {
      streak = 0;
      updateMeter();
      updateStreak();
      const brokenPlatform = platforms.pop();
      if (brokenPlatform) animatePlatformBreak(brokenPlatform);
      currentQuestion++;

      if (currentQuestion >= questions.length) {
        currentQuestion = questions.length - 1;
      }

      if (platforms.length === 0) {
        setTimeout(() => {
          showGameOver();
        }, 100);
      } else {
        playerY = platforms[platforms.length - 1].y - 40;
        questionText.textContent = questions[currentQuestion].prompt;
        resetTimer();
      }
    }
  }

    function updateMeter() {
      const percent = Math.min((score / questions.length) * 100, 100);
      meterFill.style.height = percent + "%";
    }

  function updateStreak() {
    streakCount.textContent = streak;
  }

  function startLevel(levelName) {
    currentLevelIndex = levels.indexOf(levelName);
    currentLevel = levels[currentLevelIndex];
    questions = questionBanks[currentLevel];
    score = 0;
    streak = 0;
    currentQuestion = 0;
    meterFill.style.height = '0%';
    streakCount.textContent = '0';
    scoreText.textContent = 'Score: 0';
    timerText.textContent = 'Time left: 15';
    document.getElementById('overlay').style.display = 'none';
    gameOverOverlay.style.display = 'none';

    currentLevel = levelName;
    questions = questionBanks[levelName];
    questions = shuffleArray(questions);

    document.querySelector('.ui-container').style.display = 'block';

    questionText.textContent = questions[currentQuestion].prompt;
    resetTimer();
  }



function resetGame() {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  falling = false;
  jumping = false;
  velocityY = 0;

  scoreText.textContent = 'Score: 0';
  questionText.textContent = questions[currentQuestion].prompt;

  platforms = [{
    x: (canvas.width - 200) / 2,
    y: canvas.height - 100,
    width: 200,
    height: 15
  }];


  playerY = platforms[0].y - 40;
  playerX = platforms[0].x + (platforms[0].width - 40) / 2;

  meterFill.style.height = '0%';
  updateMeter();
  updateStreak();
  resetTimer();
}


function handleTimeout() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('show');
  overlay.style.display = 'flex'; // make it visible

  btnGood.disabled = true;
  btnBad.disabled = true;

  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.style.display = 'none';
    answer(false);
    btnGood.disabled = false;
    btnBad.disabled = false;
  }, 2000);
}

  const goBackBtn = document.getElementById('goBackBtn');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const levelSelect = document.getElementById('levelSelect');


  function startGame() {
  // 1. Hide the Start Game button
  document.getElementById('startGameBtn').style.display = 'none';

  // 2. Reset game state
  score = 0;
  streak = 0;
  currentQuestionIndex = 0;
  updateScoreDisplay();  // custom function you define
  updateStreakDisplay(); // custom function

  // 3. Start the timer
  startTimer(); // assumes you have a timer function

  // 4. Load the first question
  showNextQuestion(); // your question-handling function

  // 5. Reset or show any UI you need
  document.getElementById('statusContainer').style.display = 'flex';

}

function startTimer() {
  timeLeft = 30;
  document.getElementById('timer').textContent = `Time: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(); // define this separately
    }
  }, 1000);
}


  goBackBtn.addEventListener('click', () => {
  window.location.href = 'selectGame.html';
});

  const restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', () => {
  hideGameOver();
  });



  function showGameOver() {
    gameOverOverlay.style.display = 'flex';
    btnGood.disabled = true;
    btnBad.disabled = true;
    stopTimer();
  }

  function hideGameOver() {
    gameOverOverlay.style.display = 'none';
    btnGood.disabled = false;
    btnBad.disabled = false;
    resetGame();
    resetTimer();
  }


  // initialize game after image loads
  if (playerImage.complete) {
    console.log("Player image already loaded");
    questionText.textContent = questions[currentQuestion].prompt;
    scoreText.textContent = 'Score: 0';
    resetTimer();
    draw();
    update();
  } else {
    playerImage.onload = function () {
      console.log("Player image loaded just now");
      questionText.textContent = questions[currentQuestion].prompt;
      scoreText.textContent = 'Score: 0';
      resetTimer();
      draw();
      update();
    };
  }


  btnGood.addEventListener('click', () => answer(true));
  btnBad.addEventListener('click', () => answer(false));
};

function showPopup(message, callback) {
  const popup = document.getElementById('customPopup');
  const messageEl = document.getElementById('popupMessage');
  const closeBtn = document.getElementById('popupCloseBtn');

  messageEl.textContent = message;
  popup.style.display = 'flex';

  closeBtn.onclick = () => {
    popup.style.display = 'none';
    if (callback) callback();
  };
}
