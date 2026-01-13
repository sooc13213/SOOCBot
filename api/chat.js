import OpenAI from "openai";

const STATIC_REPLIES = [
  {
    triggers: ["seni kim geliştirdi", "seni kim yaptı", "seni kim yazdı"],
    reply: "Ben SOOC projesiyim. Alperen Doğan tarafından geliştirildim. "
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
  },
  {
    triggers: ["Senden Sorumlu Öğretmen", "Bilişim Öğretmeni", "bilişim ögretmeni"],
    reply: "Benden sorumlu öğretmen 100 yılın bilişimcisi RIDOMANGO."
  },
  {
    triggers: ["Seçil Hoca Kimdir", "seçil hoca kimdir"],
    reply: "Seçil Arıcıoğlu kendisi ortadoğu ve balkanların en mükemmel öğretmenidir."
  },
  {
    triggers: ["deniz hoca kimdir", "Deniz hoca kimdir", "Deniz Hoca Kimdir"],
    reply: "Kendisi çok kral bir hocadır o7."
  },
  {
    triggers: ["Pakize Hoca Kimdir", "pakize hoca kimdir", "pakize aka kimdir"],
    reply: "Kendisi evrenin en iyi almacıcısıdır, almanca sevmeyenide ne bileyim artık."
  },
  {
    triggers: ["Rıdvan Hoca kimdir", "rıdvan hoca kimdir", "Rıdvan hoca kimdir"],
    reply: "Kendisi çok kral bir hocadır o7."
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
