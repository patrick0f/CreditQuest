
document.addEventListener('DOMContentLoaded', () => {
    const levelDisplay = document.getElementById('level-display');
    const creditLevel = localStorage.getItem('creditLevel') || 'beginner';

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
