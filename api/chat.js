import OpenAI from "openai";

const STATIC_REPLIES = [
  {
    triggers: ["seni kim geliştirdi", "seni kim yaptı", "seni kim yazdı"],
    reply: "Ben SOOC projesiyim."
  },
  {
    triggers: ["adın ne", "kimsin"],
    reply: "Ben SOOCBot’um."
  },
  {
    triggers: ["chatgpt misin"],
    reply: "Hayır, ben SOOC projesine ait özel bir chatbotum."
  },
  {
    triggers: ["versiyon", "sürüm"],
    reply: "SOOCBot v1.0"
  },
  {
    triggers: ["yardım", "help"],
    reply: "Sorularını yazabilirsin. Kod, teknik ve genel konularda yardımcı olurum."
  }
];

function getStaticReply(message) {
  const text = message.toLowerCase();

  for (const item of STATIC_REPLIES) {
    for (const trigger of item.triggers) {
      if (text.includes(trigger)) {
        return item.reply;
      }
    }
  }

  return null;
}



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

    const staticReply = getStaticReply(message);
      if (staticReply) {
      return res.status(200).json({ message: staticReply });
}

    
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
