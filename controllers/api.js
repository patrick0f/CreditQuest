const {StatusCodes}= require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors/index");
const axios = require('axios');

const chat = async(req, res) => {
    try {
        const { prompt } = req.body;
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`
          }
        });
        
        return res.json(response.data);
      } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
      }
}

module.exports = {
    chat
}