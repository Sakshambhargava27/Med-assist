const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

require('dotenv').config();
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

// ✅ Predefined YouTube Video Database
const youtubeVideos = {
    "fever": [
        { "language": "English", "link": "https://youtu.be/B3RHn9aPv2c?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/Um67DBL3ZRA?feature=shared" }
    ],
    "cough": [
        { "language": "English", "link": "https://youtu.be/YhB5Lx-JFec?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/OELbFuQEUf0?feature=shared" }
    ],
    "cold": [
        { "language": "English", "link": "https://youtu.be/z2jbR1TpykA?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/ovC-qXzscUc?feature=shared" }
    ],
    "headache": [
        { "language": "English", "link": "https://youtu.be/ZXc0-qOD-hk?si=6mNODcjYk-coOeX6" },
        { "language": "Hindi", "link": "https://youtu.be/_Vm9f6FLzv8?feature=shared" }
    ],
    "stomach pain": [
        { "language": "English", "link": "https://youtu.be/2RxEHcGpwnA?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/2Da8Jr75Jp8?feature=shared" }
    ],
    "diarrhea": [
        { "language": "English", "link": "https://youtu.be/EGtihfAhd_c?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/13Lh-rSq3-k?feature=shared" }
    ],
    "vomiting": [
        { "language": "English", "link": "https://youtube.com/shorts/JARrACxwKEU?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/6uv-x4NKeLk?feature=shared" }
    ],
    "sore throat": [
        { "language": "English", "link": "https://youtu.be/pvfDLIsrkjo?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/8puGGnAB4K8?si=97WdVeF4bMN6LTGw" }
    ],
    "body pain": [
        { "language": "English", "link": "https://youtu.be/TggGA8WfFXQ?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/8BSom6E7cxM?feature=shared" }
    ],
    "skin rashes": [
        { "language": "English", "link": "https://youtu.be/q2Ssqyw7UfM?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/P79z5qYHkNE?feature=shared" }
    ],
    "high blood pressure": [
        { "language": "English", "link": "https://youtu.be/Qm5kB5X70oA?si=PXk5H0w152iy4L5L" },
        { "language": "Hindi", "link": "https://youtu.be/Ca6IaWiaAcE?si=4ak0mHrICHHr0Uuj" }
    ],
    "low blood pressure": [
        { "language": "English", "link": "https://youtu.be/u7CIyGx9Ff4?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/u7CIyGx9Ff4?feature=shared" }
    ],
    "diabetes": [
        { "language": "English", "link": "https://youtu.be/bIhy-Rb2xp4?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/AEpDipO-4bQ?feature=shared" }
    ],
    "asthma": [
        { "language": "English", "link": "https://youtu.be/KM72Bo59Isg?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/69Del7XQDd0?feature=shared" }
    ],
    "arthritis": [
        { "language": "English", "link": "https://youtu.be/EB5zxdAQGzU?feature=shared" },
        { "language": "Hindi", "link": "https://www.youtube.com/watch?v=HINDI_ARTHRITIS" }
    ],
    "constipation": [
        { "language": "English", "link": "https://youtu.be/pIDmePznLBo?si=cuo8KmlwZ6u7DyCV" },
        { "language": "Hindi", "link": "https://www.youtube.com/watch?v=HINDI_CONSTIPATION" }
    ],
    "migraine": [
        { "language": "English", "link": "https://youtu.be/UqEQmrBlewM?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/vPLbgqqmrRg?feature=shared" }
    ],
    "obesity": [
        { "language": "English", "link": "https://youtu.be/S1kdYd4JGbg?si=fN6I7oTc8wziU7da" },
        { "language": "Hindi", "link": "https://youtu.be/JRmtbl0kIQU?feature=shared" }
    ],
    "allergy": [
        { "language": "English", "link": "https://youtu.be/llZFx8n-WCQ?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/1PO1IbW9ojY?feature=shared" }
    ],
    "anemia": [
        { "language": "English", "link": "https://youtu.be/z0Z1QMouVgE?si=gtVyUoa05FZXno3l" },
        { "language": "Hindi", "link": "https://youtu.be/I8dY_z_A4X4?si=oueq79vBpyrJslpS" }
    ],
    "dehydration": [
        { "language": "English", "link": "https://youtu.be/KahsIEbFROI?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/-Zgpvr7qc30?feature=shared" }
    ],
    "food poisoning": [
        { "language": "English", "link": "https://youtu.be/Unjsy3i1LLw?si=7wccRp37siO6K2Nk" },
        { "language": "Hindi", "link": "https://youtu.be/PKg7wlVWjXk?si=CFxYiegoL7e43x0r" }
    ],
    "kidney stones": [
        { "language": "English", "link": "https://youtu.be/kLxBks6s4M8?si=9BL6o5KjHPOZBzc5" },
        { "language": "Hindi", "link": "https://youtu.be/EhPsvmJLP2c?si=_elB3ifiXXNu3gfP" }
    ],
    "urinary infection": [
        { "language": "English", "link": "https://youtu.be/iObqI9y6Elg?si=MooNDv_x-Fj2zkyB" },
        { "language": "Hindi", "link": "https://youtu.be/biqOisbJ014?si=IFuvOdo-2igPdy4A" }
    ],
    "pneumonia": [
        { "language": "English", "link": "https://youtu.be/IAQp2Zuqevc?si=nSIX9juDLL1a0bIe" },
        { "language": "Hindi", "link": "https://youtu.be/voiHZlMWwAE?feature=shared" }
    ],
    "insomnia": [
        { "language": "English", "link": "https://youtu.be/gIwU5INBV_0?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/4qOXKq6I5E0?feature=shared" }
    ],
    "thyroid disorder": [
        { "language": "English", "link": "https://youtu.be/SVSBo065hmw?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/pYbhUaEN8kM?feature=shared" }
    ],
    "liver disease": [
        { "language": "English", "link": "https://youtu.be/RudR2_VVoaw?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/Gfo28v2uNKs?feature=shared" }
    ],
    "depression": [
        { "language": "English", "link": "https://youtu.be/d7NPnvKFs2Y?si=X-W2gH3nNhiVtt7S" },
        { "language": "Hindi", "link": "https://youtu.be/Y8qJ_0J2qKo?si=bCwODCW8_IYqhfO3" }
    ],
    "skin rashes": [
        { "language": "English", "link": "https://youtu.be/q2Ssqyw7UfM?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/P79z5qYHkNE?feature=shared" }
    ],
    "high blood pressure": [
        { "language": "English", "link": "https://youtu.be/Qm5kB5X70oA?si=PXk5H0w152iy4L5L" },
        { "language": "Hindi", "link": "https://youtu.be/Ca6IaWiaAcE?si=4ak0mHrICHHr0Uuj" }
    ],
    "low blood pressure": [
        { "language": "English", "link": "https://youtu.be/u7CIyGx9Ff4?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/u7CIyGx9Ff4?feature=shared" }
    ],
    "migraine": [
        { "language": "English", "link": "https://youtu.be/UqEQmrBlewM?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/vPLbgqqmrRg?feature=shared" }
    ],
    "obesity": [
        { "language": "English", "link": "https://youtu.be/S1kdYd4JGbg?si=fN6I7oTc8wziU7da" },
        { "language": "Hindi", "link": "https://youtu.be/JRmtbl0kIQU?feature=shared" }
    ],
    "allergy": [
        { "language": "English", "link": "https://youtu.be/llZFx8n-WCQ?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/1PO1IbW9ojY?feature=shared" }
    ],
    "anemia": [
        { "language": "English", "link": "https://youtu.be/z0Z1QMouVgE?si=gtVyUoa05FZXno3l" },
        { "language": "Hindi", "link": "https://youtu.be/I8dY_z_A4X4?si=oueq79vBpyrJslpS" }
    ],
    "dehydration": [
        { "language": "English", "link": "https://youtu.be/KahsIEbFROI?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/-Zgpvr7qc30?feature=shared" }
    ],
    "food poisoning": [
        { "language": "English", "link": "https://youtu.be/Unjsy3i1LLw?si=7wccRp37siO6K2Nk" },
        { "language": "Hindi", "link": "https://youtu.be/PKg7wlVWjXk?si=CFxYiegoL7e43x0r" }
    ],
    "kidney stones": [
        { "language": "English", "link": "https://youtu.be/kLxBks6s4M8?si=9BL6o5KjHPOZBzc5" },
        { "language": "Hindi", "link": "https://youtu.be/EhPsvmJLP2c?si=_elB3ifiXXNu3gfP" }
    ],
    "urinary infection": [
        { "language": "English", "link": "https://youtu.be/iObqI9y6Elg?si=MooNDv_x-Fj2zkyB" },
        { "language": "Hindi", "link": "https://youtu.be/biqOisbJ014?si=IFuvOdo-2igPdy4A" }
    ],
    "pneumonia": [
        { "language": "English", "link": "https://youtu.be/IAQp2Zuqevc?si=nSIX9juDLL1a0bIe" },
        { "language": "Hindi", "link": "https://youtu.be/voiHZlMWwAE?feature=shared" }
    ],
    "insomnia": [
        { "language": "English", "link": "https://youtu.be/gIwU5INBV_0?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/4qOXKq6I5E0?feature=shared" }
    ],
    "thyroid disorder": [
        { "language": "English", "link": "https://youtu.be/SVSBo065hmw?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/pYbhUaEN8kM?feature=shared" }
    ],
    "liver disease": [
        { "language": "English", "link": "https://youtu.be/RudR2_VVoaw?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/Gfo28v2uNKs?feature=shared" }
    ],
    "cyst": [
        { "language": "Hindi", "link": "https://youtu.be/UAGEq3aPZkY?feature=shared" },
        { "language": "English", "link": "https://youtu.be/1I_VX8AXL3E?feature=shared" }
    ],
    "Dementia": [
        { "language": "English", "link": "https://youtu.be/fmaEql66gB0?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/-f2iyw7YZtc?feature=shared" }
    ],
    "downs syndrome": [
        { "language": "English", "link": "https://youtu.be/EKtO9DlEgjA?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/QGIPAdjIRsI?feature=shared" }
    ],

    "dizziness": [
        { "language": "English", "link": "https://youtu.be/13LMHNTzOPg?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/75AnXIo8eG0?feature=shared" }
    ],
    "early miscarriage": [
        { "language": "English", "link": "https://youtu.be/hCiuNgDc3oc?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/hbHT1kMKIR8?feature=shared" }
    ],
    "elbow fracture": [
        { "language": "English", "link": "https://youtu.be/UggJoxd4_Ss?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/GcBiOHWjMx4?feature=shared" }
    ],
    "epilesy": [
        { "language": "English", "link": "https://youtu.be/RxgZJA625QQ?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/bTLuMX_xjzk?feature=shared" }
    ],
    "erectile dysfunction": [
        { "language": "English", "link": "https://youtu.be/3QuesoSnEcQ?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/HkcmuRNpEGc?feature=shared" }
    ],
    "endometriosis": [
        { "language": "English", "link": "https://youtu.be/NdevkvyUC3A?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/1bPY73MyJRY?feature=shared" }
    ],
    "eyecancer": [
        { "language": "English", "link": "https://youtu.be/GjRyfbsCgb4?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/yxhi1yC3aT0?feature=shared" }
    ],
    "eating disorder": [
        { "language": "English", "link": "https://youtu.be/3Bax8ijH038?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/5NDuPFu4nlU?feature=shared" }
    ],
    "influenza": [
        { "language": "English", "link": "https://youtu.be/N88Dzu5k8Pc?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/GmIdBrlllYA?feature=shared" }
    ],
    "HIV": [
        { "language": "English", "link": "https://youtu.be/d7NPnvKFs2Y?si=X-W2gH3nNhiVtt7S" },
        { "language": "Hindi", "link": "https://youtu.be/Y8qJ_0J2qKo?si=bCwODCW8_IYqhfO3" }
    ],
    "hepatitis": [
        { "language": "English", "link": "https://youtu.be/R4OG0wHkPcM?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/l-wMisFSuek?feature=shared" }
    ],
    "joint pain": [
        { "language": "English", "link": "https://youtube.com/shorts/CGtwjaAjZzc?feature=shared" },
        { "language": "Hindi", "link": "https://youtube.com/shorts/q5E-MNLplWs?feature=shared" }
    ],
    "gallstones": [
        { "language": "English", "link": "https://youtu.be/0oVToMh110U?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/z4xdr_0YoQk?feature=shared" }
    ],  
    "coronavirus(COVID19)": [
        { "language": "English", "link": "https://youtu.be/0oVToMh110U?feature=shared" },
        {"language": "Hindi", "link": "https://youtu.be/GTHdp0ZAg3I?feature=shared "}
    ],
    "cervical cancer": [
        { "language": "English", "link": "https://youtu.be/QlkFWb0qc4U?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/6qM47yW951s?feature=shared" }
    ],
    "brain tumour": [
        { "language": "English", "link": "https://youtu.be/2OfLiWLjaEY?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/aGWA4LwURmk?feature=shared" }
    ],
    "breast cancer": [
        { "language": "English", "link": "https://youtu.be/KyeiZJrWrys?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/s_g2NWUJY_Y?feature=shared" }
    ],
    "bone cancer": [
        { "language": "English", "link": "https://youtu.be/YidmOOem3WA?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/rTq-N6MceEE?feature=shared" }
    ],
    "alzheimer": [
        { "language": "English", "link": "https://youtu.be/wfLP8fFrOp0?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/57yGjKRC0WQ?feature=shared" }
    ],
    "heart attack": [
        { "language": "English", "link": "https://youtu.be/jP0qT6GpBVY?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/dJ_sYGwLvAs?feature=shared" }
    ],
    "dengue": [
        { "language": "English", "link": "https://youtu.be/Oy1eQQZQZvs?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/eYP920Uiiqw?feature=shared" }
    ],
    "typhoid": [
        { "language": "English", "link": "https://youtu.be/dae6VhLjT70?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/36N1zur-Ln8?feature=shared" }
    ],
    "yellow fever": [
        { "language": "English", "link": "https://youtu.be/cNIm3LC-A7s?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/dm-e90fRrFM?feature=shared" }
    ],
    "diarrhea": [
        { "language": "English", "link": "https://youtu.be/EGtihfAhd_c?feature=shared" },
        { "language": "Hindi", "link": "https://youtu.be/z4LssaD-z54?feature=shared" }
    ]
};

// ✅ Treatment API Endpoint
app.post("/api/treatment", async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required." });
    }

    try {
        const prompt = `Provide a treatment plan for: ${symptoms}. Format response:
        {
            "condition": "Condition name",
            "treatment": "Detailed treatment"
        }`;

        console.log("🔵 Sending request to Gemini API...");
        const result = await model.generateContent(prompt);

        if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error("❌ ERROR: No text in response from Gemini API");
            return res.status(500).json({ error: "Invalid response from Gemini API" });
        }

        let responseText = result.response.candidates[0].content.parts[0].text.trim();
        console.log("✅ Extracted response text:", responseText);

        // ✅ Remove code block markers if present
        responseText = responseText.replace(/```json|```/g, "").trim();

        let treatmentData;
        try {
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}');
            
            if (jsonStart !== -1 && jsonEnd !== -1) {
                treatmentData = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
            } else {
                throw new Error("Invalid JSON format received from Gemini API");
            }
        } catch (parseError) {
            console.error("❌ ERROR: Gemini API returned non-JSON data:", responseText);
            return res.status(500).json({ error: "Failed to parse response from Gemini API" });
        }

        // ✅ Add YouTube videos from our predefined database
        const videos = youtubeVideos[symptoms.toLowerCase()] || [];

        res.json({
            condition: treatmentData.condition || symptoms,
            treatment: treatmentData.treatment || "Consult a doctor",
            videos
        });
    } catch (error) {
        console.error("❌ ERROR: Fetching treatment data failed:", error);
        res.status(500).json({ error: "Failed to fetch treatment data", details: error.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
