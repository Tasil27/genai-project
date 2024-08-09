import { getStream } from "./utils.js";

export class Agent {
    constructor(personality) {
        this.personality = personality;
        this.observation = ["Es ist ein schöner Tag heute"];
        this.action = ["Ich habe gerade eine leckere Zimtschnecke gefuttert"];
        this.locations = [];
        this.planOfDay = "";
    }

    async simulateObservation(currentTime) {
        const messages = [
            { role: "system", content: this.personality },
            {
                role: "user",
                content: `Stelle dir vor, du bist diese Person: ${this.personality}. Es ist ${currentTime} jetzt. Deine letzten Beobachtungen sind ${this.observation.join(", ")}. Deine letzten Handlungen sind ${this.action.join(", ")}. Basierend darauf, was gerade passiert, was du gerade gemacht hast und deine letzte Beobachtungen, beschreibe deine Beobachtungen zu diesem Zeitpunkt? Sei kurz und beschränke dich auf maximal 3 Sätze.`
            }
        ];

        const observation = await getStream(messages);
        this.observation.push(observation);
    }

    async simulateAction(currentTime) {
        const messages = [
            { role: "system", content: this.personality },
            {
                role: "user",
                content: `Stelle dir vor, du bist diese Person: ${this.personality}. Es ist ${currentTime} jetzt. Deine letzten Beobachtungen sind ${this.observation.join(", ")}. Deine letzten Handlungen sind ${this.action.join(", ")}. Basierend darauf, was gerade passiert, was du gerade gemacht hast und deine letzte Beobachtungen, was machst du als nächstes? Sei kurz und beschränke dich auf maximal 3 Sätze.`
            }
        ];

        const action = await getStream(messages);
        this.action.push(action);
    }

    async processResponseStream(responseStream) {
        let finalResponse = ""; // Initialisierung der finalResponse-Variable

        for await (const part of responseStream) {
            const delta = part.choices[0].delta;
            if (delta && delta.content) {
                for (const char of delta.content) {
                    await new Promise(resolve => setTimeout(resolve, 50)); // Verzögerung
                    process.stdout.write(char); // Ausgabe des Zeichens
                    finalResponse += char; // Aufbau der finalen Antwort
                }
            }
        }

        console.log("\nFinale Antwort:", finalResponse); // Ausgabe der finalen Antwort
    }
}
