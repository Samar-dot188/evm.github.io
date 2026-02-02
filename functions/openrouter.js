exports.handler = async (event) => {
    try {
        const { objects } = JSON.parse(event.body || "{}");
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return { statusCode: 200, body: JSON.stringify({ error: "Key Missing" }) };
        }

        console.log("Calling OpenRouter...");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ecoverse.netlify.app",
            },
            body: JSON.stringify({
                model: "arcee-ai/trinity-large-preview:free",
                messages: [
                    { role: "system", content: "You are an environmental judge. Respond ONLY with JSON." },
                    { role: "user", content: `Evaluate this city: ${objects}. Format: {"rating": 5, "feedback": "...", "tip": "..."}` }
                ]
            })
        });

        const data = await response.json();
        console.log("Full API Response:", data);

        // ✅ Extract the AI's message content
        const aiMessage = data.choices[0].message.content;
        console.log("AI Message:", aiMessage);

        // ✅ Parse the JSON from the AI's response
        let result;
        try {
            // Remove markdown code blocks if present
            const cleanJson = aiMessage.replace(/```json\n?|\n?```/g, '').trim();
            result = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            // Fallback response
            result = {
                rating: 5,
                feedback: "Unable to parse AI response",
                tip: "Try again"
            };
        }

        console.log("Parsed Result:", result);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)  // ✅ Return the parsed object
        };

    } catch (err) {
        console.error("CRASH ERROR:", err.message);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
