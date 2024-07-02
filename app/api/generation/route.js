// /app/api/generation/route.js
import { Configuration, OpenAI } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { template, message } = req.body;

    try {
      const response = await openai.createChatCompletion({
        model: "text-davinci-003",
        messages: [
          {
            role: "system",
            content: `Generate an email based on the following template (${template}) and message: ${message}`,
          },
        ],
        max_tokens: 150,
      });

      const generatedMessage = response.data.choices[0].message.content.trim();

      res.status(200).json({ generatedMessage });
    } catch (error) {
      console.error("Error generating message with ChatGPT:", error);
      res.status(500).json({
        error: "Error generating message with ChatGPT",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
