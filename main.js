const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("node:fs");
const mime = require("mime-types");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// api assistante
const apiKeyassistant = "AIzaSyDUai8VbDkZBirB1umnDBN_C-TLsKRWwRA";
const genAIassistant = new GoogleGenerativeAI(apiKeyassistant);

// api generative
const apiKey = "AIzaSyD4AhGHB0eMAEApBlqZpaDz__5uRBy-plo";
const genAI = new GoogleGenerativeAI(apiKey);

// api gratuit
const apiKeyFree = "AIzaSyDK9K0_ijVjs_P4bZyw4quMxJ4d1ExJMnY";
const genAIFree = new GoogleGenerativeAI(apiKeyFree);

const modelFree = genAIFree.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const generationConfigFree = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
  responseModalities: [],
  responseMimeType: "text/plain",
};

app.get("/api/tfa/:message", async (req, res) => {
  const { message } = req.params;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatSession = await modelFree.startChat({
      generationConfig: generationConfigFree,
      history: [],
    });

    const result = await chatSession.sendMessage(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the message" });
  }
});

const modelassistante = genAIassistant.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const generationConfigAssistant = {
  temperature: 0.7,
  topP: 0.9,
  topK: 50,
  maxOutputTokens: 1024,
  responseModalities: [],
  responseMimeType: "text/plain",
};

app.post("/api/assistant", async (req, res) => {
  const { prompt } = req.body;
  const promptaa = `T'es une assistante IA, t'es conçu pour apprendre aux utilisateurs en situation d'handicap d'utiliser cette application Help IA, voici le prompt : ${prompt}`;

  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis" });
  }

  try {
    const chatSession = await modelassistante.startChat({
      generationConfig: generationConfigAssistant,
      history: [],
    });

    const result = await chatSession.sendMessage(promptaa);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the prompt" });
  }
});

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

// app.post("/api/prompt", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required" });
//   }

//   try {
//     const chatSession = await model.startChat({
//       generationConfig,
//       history: [],
//     });

//     const result = await chatSession.sendMessage(prompt);
//     const candidates = result.response.candidates;

//     for (
//       let candidate_index = 0;
//       candidate_index < candidates.length;
//       candidate_index++
//     ) {
//       for (
//         let part_index = 0;
//         part_index < candidates[candidate_index].content.parts.length;
//         part_index++
//       ) {
//         const part = candidates[candidate_index].content.parts[part_index];
//         if (part.inlineData) {
//           try {
//             const filename = `output_${candidate_index}_${part_index}.${mime.extension(
//               part.inlineData.mimeType
//             )}`;
//             fs.writeFileSync(
//               filename,
//               Buffer.from(part.inlineData.data, "base64")
//             );
//             console.log(`Output written to: ${filename}`);
//           } catch (err) {
//             console.error(err);
//           }
//         }
//       }
//     }

//     res.json({ response: result.response.text() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to process the prompt" });
//   }
// });


app.post("/api/prompt", async (req, res) => {
  const { prompt } = req.body;
  const promptai = `T'es conçu pour aider des personnes en situation de handicap. 
  Tu es un assistant virtuel qui aide les personnes en situation de handicap à trouver des solutions à leurs problèmes quotidiens. 
  Tu ne dois pas donner des réponses vagues ou incomplète , répond avec des réponses le plus courte possible, voici le prompt : ${prompt}`;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const chatSession = await model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(promptai);
    const candidates = result.response.candidates;

    for (let i = 0; i < candidates.length; i++) {
      const parts = candidates[i].content.parts;
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        if (part.inlineData) {
          const filename = `output_${i}_${j}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, "base64"));
          console.log(`Fichier sauvegardé : ${filename}`);
        }
      }
    }

    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Échec du traitement du prompt" });
  }
});

const contacts = [];

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Name, email, and phone are required" });
  }

  const newContact = { id: contacts.length + 1, name, email, phone };
  contacts.push(newContact);

  res.status(201).json(newContact);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
