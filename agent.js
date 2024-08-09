import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

export class Agent {
    constructor(personality) {
        this.personality = personality;
        this.observation = ["Es ist ein schöner Tag heute"];
        this.action = ["Ich habe gerade eine leckere Zimtschnecke gefuttert"];
        this.locations = [];
        this.planOfDay = "";
    }

    async simulateObservation(currentTime) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: this.personality },
                { role: "user", content: ` Stelle dir vor , du bist diese Person: ${this.personality},Es ist ${currentTime} jetzt. Deine letzten Beobachtungen sind ${this.observation}. Deine letzten Handlungen sind ${this.action}. Basierend darauf, was gerade passiert, was du gerade gemacht hast und  deine letzte Beobachtungen, beschreibe deine Beobachtungen zu diesem Zeitpunkt? Sei kurz und beschränke dich auf maximal 3 Sätze.` }
            ],
            model: "gpt-3.5-turbo",
          });
        
          console.log(completion.choices[0]);
    }

}