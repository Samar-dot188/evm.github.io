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
                "HTTP-Referer": "https://ecoverse.netlify.app", // Optional but good practice
            },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: [{ 
                    role: "user", 
                    content: `You are an environmental judge. City: ${objects}. Return ONLY JSON: {"rating": 1-10, "feedback": "string", "tip": "string"}` 
                }]
            })
        });

        console.log(response)
        const data = await response.json();
        console.log("OpenRouter Success!"); 

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

    } catch (err) {
        console.error("CRASH ERROR:", err.message);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
