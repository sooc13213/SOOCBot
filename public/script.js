const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let isTyping = false;
let typingInterval = null;



function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "user-message";
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(text) {
  removeTyping();
  const div = document.createElement("div");
  div.className = "chatbot-message";
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}



function showTyping() {
  if (isTyping) return;

  const div = document.createElement("div");
  div.className = "chatbot-message typing-indicator";
  div.innerText = "Typing";
  chatBody.appendChild(div);

  isTyping = true;
  let dots = 0;

  typingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    div.innerText = "Typing" + ".".repeat(dots);
  }, 400);
}

function removeTyping() {
  if (!isTyping) return;

  clearInterval(typingInterval);
  const el = document.querySelector(".typing-indicator");
  if (el) el.remove();
  isTyping = false;
}



async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  userInput.value = "";

  try {
    showTyping();

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: String(text) 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API error");
    }

    addBotMessage(data.message);
  } catch (err) {
    console.error(err);
    addBotMessage("Üzgünüm, şu anda yanıt veremiyorum.");
  }
}



sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
// SpeechRecognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let recognizing = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; // Türkçe konuşma için
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Tanınan metin:', transcript);
        document.getElementById('chat-input').value = transcript;
        
        // Burada mevcut chat gönderme fonksiyonunu tetikle
        sendMessage(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
        recognizing = false;
        document.getElementById('mic-btn').textContent = "🎤 Başlat";
    };
} else {
    alert("Ses tanıma bu tarayıcıda desteklenmiyor.");
}

document.getElementById('mic-btn').addEventListener('click', () => {
    if (!recognizing) {
        recognition.start();
        recognizing = true;
        document.getElementById('mic-btn').textContent = "🛑 Durdur";
    } else {
        recognition.stop();
    }
});

function sendMessage(message) {
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Bot cevabı:", data.reply);
        // UI’ı güncelle
    })
    .catch(err => console.error(err));
}


addBotMessage("Merhaba 👋 ben sooc-bot size nasıl yardımcı olabilirim?");



