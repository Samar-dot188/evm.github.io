const fetch = require('node-fetch');

exports.handler = async (event) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Check if variable is null
    if (!apiKey) {
        return {
            statusCode: 200,
            body: JSON.stringify({ isVarNull: true })
        };
    }

    const { objects } = JSON.parse(event.body);
    const prompt = `You are an environmental judge. City contains: ${objects}. Return ONLY valid JSON: {"rating": number, "feedback": string, "tip": string}`;

    try {
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        
        // Return the AI JSON directly to the frontend
        return {
            statusCode: 200,
            body: aiText // Assuming AI returns the JSON string requested
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
