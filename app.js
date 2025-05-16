require('dotenv').config()
require("express-async-errors")

// security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const {rateLimit} = require("express-rate-limit")
const express = require("express")
const app = express();

const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/authentication")
const authRouter = require('./routes/auth')
const scores = require("./routes/scores")

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const fetch = require("node-fetch");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, 
})
// app.use(limiter)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'"
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors())
app.use(xss())

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/scores', authenticateUser, scores)


app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("❌ OpenAI error response:", data);
    }

    res.json(data);
  } catch (error) {
    console.error("OpenAI fetch error:", error);
    res.status(500).json({ error: "OpenAI API failed" });
  }
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
    try {
        await connectDB(process.env.uri)
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
    catch (err) {
        console.error(err)
    }
}

start()