import express from 'express';
import cors from 'cors';
import jsonServer from 'json-server';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Setup Environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const distPath = path.resolve(__dirname, 'dist');

// 2. Gemini AI Configuration (Free Tier)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

if (model) {
    console.log("✅ Gemini AI (Free Tier) initialized.");
} else {
    console.warn("⚠️  GEMINI_API_KEY not found. AI will run in Safe Mode.");
}

// 3. Health Check
app.get('/health', async (req, res) => {
    let aiStatus = "Not Initialized";
    if (model) {
        try {
            await model.generateContent("hi");
            aiStatus = "OK";
        } catch (e) {
            aiStatus = "FAILED: " + e.message;
        }
    }
    res.json({
        status: "UP",
        ai: aiStatus,
        db: fs.existsSync('db.json'),
        dist: fs.existsSync(distPath)
    });
});

// 4. Chat Endpoint
app.post('/api/chat', async (req, res) => {
    console.log(`[POST /api/chat] Incoming: "${req.body.message}"`);
    try {
        const { message } = req.body;
        const dbData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
        const availableCars = dbData.rides.filter(r => r.isAvailable);

        // Safe Mode Fallback (if AI is offline or fails)
        const runSafeMode = (msg) => {
            console.log("🛠️  Running AI Safe Mode...");
            const lowerMsg = msg.toLowerCase();
            let replyText = "I'm currently running in semi-offline mode. Here are some great cars available right now:";
            
            if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
               replyText = "Hello! While my full AI is offline, I can still show you our best available cars.";
            } else if (lowerMsg.includes('under') || lowerMsg.includes('cheap') || lowerMsg.includes('price')) {
               replyText = "Here are some of our most affordable and great cars available right now:";
            } else if (lowerMsg.includes('long trip') || lowerMsg.includes('suv') || lowerMsg.includes('family')) {
               replyText = "For long trips or families, here are some spacious and reliable options:";
            }

            return {
                message: replyText,
                selected_car_ids: availableCars.slice(0, 3).map(c => c._id),
                is_car_related: true
            };
        };

        let aiResponse;

        if (model) {
            try {
                const carContext = JSON.stringify(availableCars.map(c => ({ id: c._id, name: c.carName, brand: c.brand, price: c.pricePerDay, location: c.location })));
                const prompt = `
                You are the IdleWheels assistant. Your name is IdleWheels AI. 
                Be highly conversational, helpful, and dynamic in your responses. DO NOT repeat the same response to different questions. Give a nuanced answer. 
                Available cars data: ${carContext}.
                User asked: "${message}".
                Analyze the user's request:
                1. If they ask a general question or greeting, give a friendly, unique response. 
                2. If they ask about cars or renting, recommend 1 to 3 matching cars from the data by providing their IDs. Mention why you recommend them in the message.
                Respond ONLY with valid JSON: { "message": "your dynamic response here", "selected_car_ids": ["id1", "id2"], "is_car_related": true }
                `;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                console.log("🤖 Gemini Raw Response:", responseText);

                // Clean markdown if AI includes it
                const cleanJson = responseText.replace(/```json|```/g, "").trim();
                aiResponse = JSON.parse(cleanJson);
            } catch (aiError) {
                console.error("❌ Gemini AI Error:", aiError.message);
                aiResponse = runSafeMode(message);
            }
        } else {
            aiResponse = runSafeMode(message);
        }

        const selectedCars = availableCars.filter(car => aiResponse.selected_car_ids.includes(car._id));

        res.json({
            message: aiResponse.message,
            cars: selectedCars,
            isRelated: aiResponse.is_car_related
        });

    } catch (error) {
        console.error("❌ Top Level Server Error:", error.message);
        res.status(500).json({ message: "Technical issue: " + error.message, cars: [] });
    }
});

// 5. Frontend & Data API
app.use(express.static(distPath));
const router = jsonServer.router('db.json');
app.use('/api', router);

// Full Catch-all for SPA
app.use((req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend not built.');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ SERVER ONLINE: http://localhost:${PORT}`);
});
