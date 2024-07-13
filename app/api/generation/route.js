// /app/api/generation/route.js
import { ClientOptions, OpenAI } from "openai";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // If you have a custom base URL
  timeout: 60000, // Optional: set a timeout
  fetch: typeof fetch !== "undefined" ? fetch : undefined, // Use global fetch if available
};

const openai = new OpenAI(configuration);

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    const { template, message } = req.body;

    try {
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `Generate an email based on the following template (${template}) and message: ${message}`,
        max_tokens: 300,
      });

      const generatedMessage = response.choices[0].text.trim();

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
};
