const express = require('express');
const venom = require('venom-bot');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Render-এ ২৪ ঘণ্টা সজাগ রাখার জন্য Web Server
const app = express();
app.get('/', (req, res) => res.send('Venom Bot is Running Perfectly!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server started.'));

// আপনার Gemini API Key
const genAI = new GoogleGenerativeAI('AQ.Ab8RN6KU0thbFnB3oCan8ftONL0ixeZb_4B9XINzJSLtD3j_kg');

venom
  .create({
    session: 'gemini-bot', 
    multidevice: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log('Error: ', erro);
  });

function start(client) {
  console.log('Venom Bot একদম রেডি! মেসেজের জন্য অপেক্ষা করছে...');
  
  client.onMessage(async (message) => {
    // স্ট্যাটাস এবং গ্রুপের মেসেজ ইগনোর করার জন্য
    if (message.isGroupMsg === false && message.from !== 'status@broadcast') {
        console.log(`নতুন মেসেজ এসেছে: ${message.body}`);
        
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(message.body);
            const response = await result.response;
            const text = response.text();
            
            await client.sendText(message.from, text);
        } catch (error) {
            console.error('Gemini Error:', error);
        }
    }
  });
  }
      
