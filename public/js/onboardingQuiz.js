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

// after HTML loads
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('quiz-form');       
      
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

    await callChatGPT(prompt);
    });
});
