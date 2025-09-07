require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});


//send request to openai api to get the response for your query
exports.getOpenAIAPIResponse = async (message) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-4o",
          max_tokens: 700,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        });

       return completion.choices[0].message;
      } catch (error) {
          return error.message;
      }
}