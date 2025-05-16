<<<<<<< Updated upstream
async function getUserAchievements(username) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/achievements/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
        }
      });
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const levelDisplay = document.getElementById('level-display');
    const creditLevel = localStorage.getItem('creditLevel') || 'beginner';
    let achievementsContainer = document.getElementById("achievements");

    getUserAchievements(localStorage.getItem("user")).then(achievements => {
        console.log(achievements);
    for (let i = 0; i < 3; i++) {
        if (achievements[i].unlocked) {
            achievementsContainer.innerHTML += `<img src='img/badge${i+1}.png'></img>`;
        }
    }
    })

    
=======
const user = await User.findOne({username});
document.addEventListener('DOMContentLoaded', () => {
    const levelDisplay = document.getElementById('level-display');
    const creditLevel = localStorage.getItem('creditLevel') || 'beginner';
    let achievements = document.getElementById("achievements");

    let userachievements = user.achievements;

    for (let i = 0; i < 3; i++) {
        if (userachievements[i].unlocked) {
            achievements.innerHTML += `<img src='img/badge${i+1}'></img>`;
        }
    }
>>>>>>> Stashed changes

    // display the assigned level
    levelDisplay.textContent = `You've been placed at the ${creditLevel.toUpperCase()} level. Choose a game to begin!`;

    // handle game button clicks
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const gamePage = button.getAttribute('data-game');
            window.location.href = `${gamePage}?level=${creditLevel}`; // UPDATE!! based on how the games handle the different diff. levels
        });
    });
});
