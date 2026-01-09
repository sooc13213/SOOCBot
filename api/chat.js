import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


let conversation = [];
const MAX_MESSAGES = 10;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        message: "Geçersiz mesaj",
      });
    }


    conversation.push({
      role: "user",
      content: message,
    });


    if (conversation.length > MAX_MESSAGES) {
      conversation = conversation.slice(-MAX_MESSAGES);
    }


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen önceki mesajları hatırlayan yardımcı bir asistansın.",
        },
        ...conversation,
      ],
    });

    const reply = completion.choices[0].message.content;


    conversation.push({
      role: "assistant",
      content: reply,
    });

    if (conversation.length > MAX_MESSAGES) {
      conversation = conversation.slice(-MAX_MESSAGES);
    }


    res.status(200).json({
      message: reply,
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      message: "Üzgünüm, şu anda yanıt veremiyorum.",
    });
  }
}
