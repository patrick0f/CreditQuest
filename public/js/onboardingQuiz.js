
// after HTML loads
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('quiz-form'); 

    async function callChatGPT(prompt) {
        try {
           const res = await fetch("http://localhost:8080/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 500
            })
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

        const prompt = `A user took a credit knowledge quiz and scored ${score}/5. Give them a short, friendly 2-sentence summary with encouragement and one tip for improvement.`;

    await callChatGPT(prompt);

    // go to results page
    window.location.assign("results.html");

    });
});
