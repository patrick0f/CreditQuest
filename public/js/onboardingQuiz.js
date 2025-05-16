async function callChatGPT(prompt) {
  try {
    const res = await fetch("/api/v1/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    
    const json = await res.json();
    if (!json.choices || !json.choices[0]) {
      console.error("❌ Invalid ChatGPT response:", JSON.stringify(json, null, 2));
      alert("ChatGPT gave an unexpected response. Check your server logs.");
      return;
    }

  const resp = json.choices[0].message.content;
    console.log(resp);
    localStorage.setItem("response", resp);
    return resp;
  } catch (err) {
    console.error("ChatGPT fetch error:", err.message || err);
    alert("Error: " + (err.message || err));
  }
}

async function unlockAchievement(username, achievementName) {
  try {
    const response = await fetch('/api/v1/auth/achievement', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username, achievementName })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to unlock achievement');
    }
    
    return data;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
}

function updateProgressBar() {
  const totalQuestions = 5;
  const answered = new Set();

  // loop through all selected answers
  document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
    answered.add(input.name); // each question has a unique name (q1, q2, etc)
  });

  const percent = (answered.size / totalQuestions) * 100;
  document.getElementById("progress-bar").style.width = `${percent}%`;
}

// after HTML loads
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('quiz-form');      
    
    const allRadios = document.querySelectorAll('input[type="radio"]');

    allRadios.forEach(radio => {
      radio.addEventListener('change', updateProgressBar);
    });
      
    // when form is submitted
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const answers = new FormData(form);
        let score = 0;

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
        } else if (score >= 2) {
            level = 'intermediate';
        } else {
            level = 'beginner';
        }

        // stores starting diff. level
        localStorage.setItem('creditLevel', level);        

        const prompt = `A user took a credit knowledge quiz and scored ${score}/5.
        Here are the questions:
        <p>1. What’s considered a good credit score?</p>
      500
       750
      300
      <p>2. What has the biggest impact on your credit score?</p>
     Number of credit cards
      Credit mix
     Payment history
      <p>3. How often should you check your credit report?</p>
     At least once a year
    Every 5 years
     Only before applying for a loan
      <p>4. What’s a good rule of thumb for credit utilization?</p>
      Keep it under 30%
    Use the full limit
    Keep it over 70%<p>5. Which of these won’t affect your credit score?</p>
     Late payments
      Maxed out cards
    Soft credit inquiries
    Here are their answers: ${answers.entries}
    Give them a short, friendly 2-sentence summary with encouragement and one tip for improvement.`;
    
    unlockAchievement(localStorage.getItem('user'), 'Foot in the Door');

    const summaryDiv = document.getElementById("summary-text");
    document.getElementById("mascot-summary").style.display = "flex"; 

    const response = await callChatGPT(prompt);

    const continueBtn = document.getElementById("continue-button");

    if (response) {
      summaryDiv.textContent = response;
      summaryDiv.style.display = "block";
      continueBtn.style.display = "inline-block";
    }

  continueBtn.addEventListener("click", () => {
    window.location.href = "selectGame.html"; // Adjust path if needed
  });

    await callChatGPT(prompt);
    /*
    await User.findOneAndUpdate(
      { username: localStorage.getItem('user'), "achievements.name": "Foot in the Door" },
      { 
        $set: { 
          "achievements.$.unlocked": true,
          "achievements.$.unlockedAt": new Date()
        } 
      }
    );
    */
    });
});
