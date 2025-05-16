const msgerForm = document.querySelector("#msger-inputarea");
const msgerInput = document.querySelector("#msger-input");
const msgerChat = document.querySelector("#msger-chat");
let date = document.querySelector("#msg-info-time");
date.textContent = formatDate(new Date());
let question = 0;

let prompts = [`Generate a character creation scenario for a financial life simulation game. For this game, you will be fed a JSON stringified input, always look at the most recent prompt and user choice as the actual question, the rest is context. To begin, ask the player to choose their starting situation from these 4 options:
    1-Recent high school graduate with no credit history
    2-College student with student loans and a part-time job
    3-Young professional with some credit card debt
    4-Career-changer with a mixed credit history
    For each choice, briefly describe the initial financial situation, credit score range, and immediate challenges. Your response should be formatted as if you were talking to the player in the game.
    `,
    `The player has made their first financial decision of being a [CHOICE1]. Now they face a housing choice that will significantly impact their credit. Based on their previous choice and current financial situation, present 4 numbered housing options with different credit implications:
    1-[Option with lowest upfront cost but potential credit risks]
    2-[Option with moderate cost and credit-building potential]
    3-[Option requiring good credit but offering stability]
    4-[Option with highest financial commitment but best long-term benefits]
    For each option, very briefly explain the credit requirements, potential impact on their score, and financial trade-offs. End by asking which option they choose. Your response should be formatted as if you were talking to the player in the game.`
    ,
    `Six months have passed since the player's housing decision of [CHOICE2]. Now they face an unexpected challenge. Generate some sort of random, spontaneous financial challenge and based on their previous choices offer them the options of:
    1-[Conservative approach that protects credit but limits options]
    2-[Balanced approach with moderate credit impact]
    3-[Risky approach with potential high reward but credit danger]
    4-[Creative solution requiring financial knowledge]
    Briefly explain how each response would affect their credit score, debt levels, and future opportunities. Your response should be formatted as if you were talking to the player in the game.`
    ,
    `In their unexpected challenge, the user has decided to choose [CHOICE3]. Now, two years have passed in the simulation. Summarize the player's journey so far based on their choice of [CHOICE1], [CHOICE2], and [CHOICE3], including their credit score trajectory and key decisions. Now present them with a major life crossroads that will determine their financial future. Offer 4 numbered paths:
    1-[Security-focused path with emphasis on credit stability]
    2-[Growth-oriented path requiring good credit utilization]
    3-[Opportunity-focused path with calculated credit risks]
    4-[Freedom-focused path with unique credit implications]
    For each path, very briefly outline the potential 5-year outcomes for their credit health, financial wellbeing, and life opportunities. Your response should be formatted as if you were talking to the player in the game.`
    ,
    `The user has decided to choose [CHOICE4]. End the game by providing a personalized financial future based on their complete journey. Your response should be formatted as if you were talking to the player in the game.`
    ];

let choices = {};

const BOT_IMG = "img/msgheadshot.png";
const PERSON_IMG = "img/user.jpg";
const BOT_NAME = "BOT";
const PERSON_NAME = "You";

msgerForm.addEventListener("submit", e => {
  e.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText || question == 5) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  if (question > 0) {
    choices[`CHOICE${question}`] = msgText;
  }
  botResponse();
});

function appendMessage(name, img, side, text) {
// Create the message container
let msgDiv = document.createElement('div');
msgDiv.className = `msg ${side}-msg`;

// Create the HTML structure
msgDiv.innerHTML = `
  <div class="msg-img" style="background-image: url(${img})"></div>
  <div class="msg-bubble">
    <div class="msg-info">
      <div class="msg-info-name">${name}</div>
      <div class="msg-info-time">${formatDate(new Date())}</div>
    </div>
    <div class="msg-text"></div>
  </div>
`;

// Set the formatted text content safely
msgDiv.querySelector('.msg-text').innerHTML = text;

// Append to the message list (assuming you have a container with id="msger-chat" or similar)
msgerChat.appendChild(msgDiv);
  msgerChat.scrollTop += 500;
}

async function callChatGPT(prompt) {
    try {
      const res = await fetch("/api/v1/api/creditLife", {
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
      return resp;
    } catch (err) {
      console.error("ChatGPT fetch error:", err.message || err);
      alert("Error: " + (err.message || err));
    }
}


async function botResponse() {
let msgText = prompts[question];

for (let i = 1; i <= 4; i++) {
    if (choices[`CHOICE${i}`]) {
      const regex = new RegExp(`\\[CHOICE${i}\\]`, "g");
      msgText = msgText.replace(regex, choices[`CHOICE${i}`]);
    }
  }

choices[`prompt${question}`] = msgText;
const response = await callChatGPT(msgText);

await appendMessage(BOT_NAME, BOT_IMG, "left", response);
if (question == 5) {
    appendMessage(BOT_NAME, BOT_IMG, "left", "Thank you for playing! Click <a href='index.html'>here</a> to return to the dashboard!");
}
question++;
console.log(choices);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}