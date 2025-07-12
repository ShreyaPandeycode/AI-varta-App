// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // use node-fetch@2 if needed

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/gemini', async (req, res) => {
  const { message, file } = req.body;

  const parts = [{ text: message }];
  if (file?.data) {
    parts.push({ inline_data: file });
  }

  try {
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    );

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "API call failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
