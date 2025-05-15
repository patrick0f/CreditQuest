
// after HTML loads
document.addEventListener('DOMContentLoaded', () => {

    // change these names to match with HTML, if needed!
    const form = document.getElementById('quiz-form'); 
    const result = document.getElementById('result'); // where result is displayed
    const continueButton = document.getElementById('continue-button'); // button that goes to next page that shows diff games

    // hide result + continue button until user submits quiz
    result.style.display = 'none';
    continueButton.style.display = 'none';

    // when form is submitted
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const answers = new FormData(form);
        let score = 0;

        // UPDATEE!!!
        const correctAnswers = {
            q1: 'b', 
            q2: 'c', 
            q3: 'a', 
            q4: 'a', 
            q5: 'c'  
        };

        // gets user's quiz score
        for (let [key, value] of answers.entries()) {
            if (correctAnswers[key] === value) {
                score++;
            }
        }

        let level = '';
        if (score >= 4) {
            level = 'advanced';
            result.textContent = "You're a credit pro!";
        } else if (score >= 2) {
            level = 'intermediate';
            result.textContent = "Nice! You'll start at an intermediate level for each game.";
        } else {
            level = 'beginner';
            result.textContent = "You're just starting out — no worries!";
        }

        // stores starting diff. level
        localStorage.setItem('creditLevel', level);

        // show result + continue button
        result.style.display = 'block';
        continueButton.style.display = 'inline-block';

    });

    continueButton.addEventListener('click', () => {
        window.location.href = 'selectGame.html';
    });
});
