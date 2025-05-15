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
const rss = require("./routes/rss")

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

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
          "'self'", 
          "https://rss.nytimes.com", 
          "https://atlas-security-production.up.railway.app",
          "https://atlas-security.up.railway.app"
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
app.use('/api/v1/proxy-rss', rss)

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