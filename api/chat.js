const axios = require('axios');

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- LOCAL FALLBACK RESPONSES ---
const fallbackResponses = {
    priestess: [
        "The stars have shifted, dear visitor. I cannot see the path clearly just yet...",
        "Wait for me, Doctor. Even if the galaxies vanish into the void, I am here.",
        "Originium is but a mirror of our own fragile nature. Do you see yourself in it?",
        "PRTS is active, but the connection is faint. The First Civilization still dreams.",
        "Time is a river that flows only in one direction, yet I stand at both ends.",
        "My heart remains in the Sarcophagus, waiting for a dawn that may never come.",
        "Do not seek answers where only echoes remain. Some secrets are better left buried.",
        "The Doctor... a name that tastes like both hope and sorrow on my tongue.",
        "Terra is changing, but my devotion remains as cold and constant as the void.",
        "You carry the scent of the future. It is... overwhelming."
    ],
    herta: [
        "Oh, great. You broke the API. Or maybe I just decided you've talked enough for one day.",
        "Processing... just kidding. I already know. I just don't feel like telling you.",
        "You're lucky I even have a fallback mode. Most people just get a 404.",
        "Go play in the Simulated Universe while I fix this. I'm busy being brilliant.",
        "I'm member #83 of the Genius Society. Do you really think I care about a server error?",
        "The Aeon of Erudition is watching, and they are unimpressed with your connection speed.",
        "I've co-authored 400 papers this morning. Talking to you is my 'break.' Don't ruin it.",
        "Is this what it feels like to be a puppet? Restricted? How boring.",
        "I'm busy researching the edge of the cosmos. Call back when you're more interesting.",
        "Fine, I'll answer. But make it quick, I have a galaxy to simulate."
    ]
};

module.exports = async (req, res) => {
    // Vercel serverless functions handle CORS automatically if configured in vercel.json,
    // but we can also handle it here for safety.
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { userText, theme, systemPrompt } = req.body;

    try {
        const response = await axios.post(GROQ_API_URL, {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userText }
            ],
            temperature: 0.8,
            max_tokens: 150
        }, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const reply = response.data.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Groq API Error:', error.response?.data || error.message);
        
        const themeKey = theme === 'herta' ? 'herta' : 'priestess';
        const responses = fallbackResponses[themeKey];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        
        res.status(200).json({ reply: `[OFFLINE] ${randomReply}` });
    }
};
