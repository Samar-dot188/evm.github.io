import fetch from "node-fetch"; // required in Netlify functions

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body); // expect { prompt: "..." }
    const response = await fetch("https://openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: body.prompt }]
      })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenRouter request failed" })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch OpenRouter", details: err.message })
    };
  }
}
