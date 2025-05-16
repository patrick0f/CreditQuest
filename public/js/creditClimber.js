window.onload = function () {
  // get DOM elements
  const canvas = document.getElementById('creditClimberCanvas');
  const ctx = canvas.getContext('2d');
  const btnGood = document.getElementById('btnGood');
  const btnBad = document.getElementById('btnBad');
  const questionText = document.getElementById('question');
  const scoreText = document.getElementById('score');
  const playerImage = document.getElementById('playerImage');
  const timerText = document.getElementById('timer');
  let streak = 0;
  const meterFill = document.getElementById('meterFill');
  const streakCount = document.getElementById('streakCount');


  //canvas size to fit window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Questions- NEED TO UPDATE!!!
  const questions = [
    { prompt: "Pay your bill on time?", good: true },
    { prompt: "Max out your credit card?", good: false },
    { prompt: "Check your credit report regularly?", good: true },
    { prompt: "Apply for many new cards at once?", good: false },
    { prompt: "Keep old accounts open?", good: true }
  ];

  let currentQuestion = 0;
  let score = 0;

  let platforms = [{ x: 100, y: canvas.height - 100, width: 200, height: 15 }];
  let playerX = 180;
  let playerY = platforms[0].y - 40;
  let velocityX = 0;
  let velocityY = 0;
  const gravity = 1.5;
  let jumping = false;
  let onLand = null;
  let breakingPlatforms = [];
  let timeLeft = 15;
  let timerInterval = null;

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

      if (velocityY < 0) {
        for (let i = 0; i < platforms.length; i++) {
          platforms[i].y -= 3;
        }
      }

      // landing detection
      if (velocityY > 0 && playerY >= platforms[platforms.length - 1].y - 40) {
        playerY = platforms[platforms.length - 1].y - 40;
        velocityY = 0;
        jumping = false;
        playerX = 180;
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
    platforms.push({ x: 100, y: newY, width: 200, height: 15 });
  }

  function animatePlatformBreak(platform) {
    let frames = 10;
    breakingPlatforms.push({ ...platform, frames });
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
      jump(() => {
        score++;
        scoreText.textContent = 'Score: ' + score;
        currentQuestion++;

        if (currentQuestion >= questions.length) {
          setTimeout(() => {
            alert(`Congrats! You finished all questions with a score of ${score}!`);
            resetGame();
          }, 100);
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
          alert(`Game Over! Your final score: ${score}`);
          resetGame();
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


function resetGame() {
  currentQuestion = 0;
  score = 0;
  streak = 0;

  scoreText.textContent = 'Score: 0';
  questionText.textContent = questions[currentQuestion].prompt;

  platforms = [{ x: 100, y: canvas.height - 100, width: 200, height: 15 }];
  playerY = platforms[0].y - 40;
  playerX = 180;

  updateMeter();   
  updateStreak();  
  resetTimer();
}


  function handleTimeout() {
    alert("Time's up!");
    answer(false);
  }

  // initialize game after image loads
  if (playerImage.complete) {
    questionText.textContent = questions[currentQuestion].prompt;
    scoreText.textContent = 'Score: 0';
    resetTimer();
    draw();
    update();
  } else {
    playerImage.onload = function () {
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
